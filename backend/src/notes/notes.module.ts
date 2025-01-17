import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Database } from 'src/enums/database.enum';
import { NoteSchema } from 'src/shared/models/note.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Database.note, schema: NoteSchema }]),
  ],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
