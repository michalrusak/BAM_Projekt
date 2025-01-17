import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateNotePayload, UpdateNotePayload } from './notes.dto';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'The note has been successfully created.' })
  async create(@Body() createNoteDto: CreateNotePayload) {
    return this.notesService.create(createNoteDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all notes for a user' })
  @ApiResponse({ status: 200, description: 'List of notes for the user.' })
  async findByUser(@Param('userId') userId: string) {
    return this.notesService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single note by ID' })
  @ApiResponse({ status: 200, description: 'The requested note.' })
  async findById(@Param('id') id: string) {
    return this.notesService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note by ID' })
  @ApiResponse({ status: 200, description: 'The updated note.' })
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNotePayload) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a note by ID' })
  @ApiResponse({ status: 204, description: 'The note has been successfully deleted.' })
  async delete(@Param('id') id: string) {
    await this.notesService.delete(id);
  }
}
