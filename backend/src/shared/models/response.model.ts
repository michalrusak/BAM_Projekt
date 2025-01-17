import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'User registered/login/logout successfully',
  })
  message: string;
}
