import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Database } from 'src/enums/database.enum';
import { User } from 'src/shared/models/user.model';
import {
  ChangePasswordPayload,
  PanicButtonPayload,
  UpdateUserPayload,
} from './user.dto';
import {
  ChangePasswordPayloadSchema,
  UpdateUserPayloadSchema,
} from './user.schema';
import { safeParse } from 'valibot';
import * as bcrypt from 'bcrypt';
import { Note } from 'src/shared/models/note.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Database.user) private readonly userModel: Model<User>,
    @InjectModel(Database.note) private readonly noteModel: Model<Note>,
  ) {}

  async getUserInfo(userId: string) {
    if (!userId) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
  async activatePanicMode(panicButtonPayload: PanicButtonPayload) {
    const user = await this.userModel.findOne({
      email: panicButtonPayload.email,
      recoveryPhrase: panicButtonPayload.recoveryPhrase,
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    await this.noteModel.deleteMany({ userId: user._id });
    user.panicMode = true;
    await user.save();
  }

  async deactivatePanicMode(panicButtonPayload: PanicButtonPayload) {
    const user = await this.userModel.findOne({
      email: panicButtonPayload.email,
      recoveryPhrase: panicButtonPayload.recoveryPhrase,
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    user.panicMode = false;
    await user.save();
  }
  async updateUser(userId: string, updateUserPayload: UpdateUserPayload) {
    if (!userId) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const result = safeParse(UpdateUserPayloadSchema, updateUserPayload);

    if (!result.success) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.userModel.findOne({
      _id: userId,
    });

    if (!existingUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    if (updateUserPayload.email) {
      existingUser.email = updateUserPayload.email;
    }

    if (updateUserPayload.firstName) {
      existingUser.firstName = updateUserPayload.firstName;
    }

    if (updateUserPayload.lastName) {
      existingUser.lastName = updateUserPayload.lastName;
    }

    if (!existingUser.isModified) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    return await existingUser.save();
  }

  async changePassword(
    userId: string,
    changePasswordPayload: ChangePasswordPayload,
  ) {
    if (!userId) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const result = safeParse(
      ChangePasswordPayloadSchema,
      changePasswordPayload,
    );

    if (!result.success) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.userModel.findOne({
      _id: userId,
    });

    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordPayload.currentPassword,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const hashedNewPassword = await bcrypt.hash(
      changePasswordPayload.newPassword,
      10,
    );

    existingUser.password = hashedNewPassword;

    return await existingUser.save();
  }

  async deleteAccount(userId: string) {
    if (!userId) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.userModel.findOneAndDelete({
      _id: userId,
    });

    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
  async getPanicModeStatus(userId: string): Promise<boolean> {
    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user.panicMode;
  }
}
