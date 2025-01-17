import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/shared/models/user.model';
import { UpdateUserPayload, ChangePasswordPayload } from './user.dto';
import {
  changePasswordPayloadCorrect,
  changePasswordPayloadInavlid,
  mockUserWithId,
  mockUser,
  userIdCorrect,
  updateUserInvalidPayload,
  changePasswordEmptyPayload,
} from 'src/mock-data/mockData';

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<User>;

  const mockUserModel = {
    findOne: jest.fn(),
    findOneAndDelete: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const expectInvalidUserError = async (fn) => {
    await expect(fn).rejects.toThrow(
      new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST),
    );
  };

  describe('getUserInfo', () => {
    it('should throw a 400 error if userId is null or missing', async () => {
      await expectInvalidUserError(() => userService.getUserInfo(null));
    });

    it('should return user info if the user exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUserWithId);

      const result = await userService.getUserInfo(userIdCorrect);

      expect(result).toEqual(mockUser);
      expect(userModel.findOne).toHaveBeenCalledWith({
        _id: mockUserWithId._id,
      });
    });

    it('should throw an error if the user does not exist', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(userService.getUserInfo(userIdCorrect)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('updateUser', () => {
    it('should throw a 400 error if userId is missing', async () => {
      await expectInvalidUserError(() =>
        userService.updateUser(null, {} as UpdateUserPayload),
      );
    });

    it('should throw an error if payload is invalid', async () => {
      await expect(
        userService.updateUser(userIdCorrect, updateUserInvalidPayload),
      ).rejects.toThrow(
        new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST),
      );
    });

    it('should update the user if the payload and user are valid', async () => {
      const mockResolvedUser = {
        _id: userIdCorrect,
        save: jest.fn(),
        isModified: true,
      };
      mockUserModel.findOne.mockResolvedValue(mockResolvedUser);

      await userService.updateUser(userIdCorrect, mockUser);

      expect(userModel.findOne).toHaveBeenCalledWith({ _id: userIdCorrect });
      expect(mockResolvedUser.save).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('should throw a 400 error if userId is missing', async () => {
      await expectInvalidUserError(() =>
        userService.changePassword(null, {} as ChangePasswordPayload),
      );
    });

    it('should throw an error if the payload is invalid', async () => {
      await expect(
        userService.changePassword(
          userIdCorrect,
          changePasswordEmptyPayload as ChangePasswordPayload,
        ),
      ).rejects.toThrow(
        new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if the current password is incorrect', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        userService.changePassword(userIdCorrect, changePasswordPayloadInavlid),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should update the password if the current password is valid', async () => {
      const mockUserWithPassword = {
        _id: userIdCorrect,
        password: 'hashed_password',
        save: jest.fn(),
      };
      mockUserModel.findOne.mockResolvedValue(mockUserWithPassword);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('new_hashed_password');

      await userService.changePassword(
        userIdCorrect,
        changePasswordPayloadCorrect,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('new_password', 10);
      expect(mockUserWithPassword.password).toEqual('new_hashed_password');
      expect(mockUserWithPassword.save).toHaveBeenCalled();
    });
  });

  describe('deleteAccount', () => {
    it('should throw a 400 error if userId is missing', async () => {
      await expectInvalidUserError(() => userService.deleteAccount(null));
    });

    it('should delete the user if they exist', async () => {
      mockUserModel.findOneAndDelete.mockResolvedValue(mockUser);

      await userService.deleteAccount(userIdCorrect);

      expect(userModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: userIdCorrect,
      });
    });

    it('should throw a 404 error if the user does not exist', async () => {
      mockUserModel.findOneAndDelete.mockResolvedValue(null);

      await expect(userService.deleteAccount('invalidId')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
