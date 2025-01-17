import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as CryptoJS from 'crypto-js';
import { Model } from 'mongoose';
import { Database } from 'src/enums/database.enum';
import { CreateNotePayload, UpdateNotePayload } from './notes.dto';
import { Note } from 'src/shared/models/note.model';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Database.note) private readonly noteModel: Model<Note>,
  ) {}

  private readonly encryptionKey = process.env.ENCRYPTION_KEY;

  private encryptText(text: string): string {
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
  }

  private decryptText(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async create(createNoteDto: CreateNotePayload): Promise<Note> {
    const encryptedContent = this.encryptText(createNoteDto.content);
    const newNote = new this.noteModel({
      ...createNoteDto,
      content: encryptedContent,
    });
    return newNote.save();
  }

  async findByUser(userId: string): Promise<Note[]> {
    const notes = await this.noteModel.find({ userId }).exec();
    return notes.map((note) => ({
      ...note.toObject(),
      content: this.decryptText(note.content),
    })) as Note[];
  }

  async findById(noteId: string): Promise<Note> {
    const note = await this.noteModel.findById(noteId).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return {
      ...note.toObject(),
      content: this.decryptText(note.content),
    } as Note;
  }

  async update(
    noteId: string,
    updateNoteDto: UpdateNotePayload,
  ): Promise<Note> {
    const note = await this.noteModel.findById(noteId).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (updateNoteDto.content) {
      updateNoteDto.content = this.encryptText(updateNoteDto.content);
    }

    await note.updateOne(updateNoteDto);
    return this.findById(noteId);
  }

  async delete(noteId: string): Promise<void> {
    const result = await this.noteModel.findByIdAndDelete(noteId).exec();
    if (!result) {
      throw new NotFoundException('Note not found');
    }
  }
}
