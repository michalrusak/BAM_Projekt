import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPayload {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: false,
  })
  email?: string;
}

export class ChangePasswordPayload {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'current_password123',
    required: true,
  })
  currentPassword: string;

  @ApiProperty({
    description: 'New password to set for the user',
    example: 'new_password456',
    required: true,
  })
  newPassword: string;
}
