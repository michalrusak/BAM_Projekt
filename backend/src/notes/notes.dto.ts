import { ApiProperty } from '@nestjs/swagger';

export class CreateNotePayload {
  @ApiProperty({
    description: 'Title of the note',
    example: 'My Secure Note',
  })
  title: string;

  @ApiProperty({
    description: 'Content of the note (plaintext, will be encrypted)',
    example: 'This is a very sensitive piece of information.',
  })
  content: string;

  @ApiProperty({
    description: 'ID of the user who owns the note',
    example: '64c10c8b2e9f1e34567890ab',
  })
  userId: string;
}

export class UpdateNotePayload {
  @ApiProperty({
    description: 'Title of the note (optional)',
    example: 'Updated Secure Note',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description:
      'Content of the note (plaintext, will be encrypted) (optional)',
    example: 'This is the updated content.',
    required: false,
  })
  content?: string;
}
