import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { EndPoints } from 'src/enums/endPoints.enum';
import { UserService } from './user.service';
import {
  ChangePasswordPayload,
  PanicButtonPayload,
  UpdateUserPayload,
} from './user.dto';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller(EndPoints.user)
@ApiTags(EndPoints.user)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get user information' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Token not provided' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserInfo(@Req() req) {
    const userId = req.user;
    return await this.userService.getUserInfo(userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user information' })
  @ApiBody({
    type: UpdateUserPayload,
    description: 'Payload to update user information',
  })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 401, description: 'Token not provided' })
  async updateUser(
    @Req() req,
    @Body() payload: UpdateUserPayload,
    @Res() res: Response,
  ): Promise<any> {
    const userId = req.user;
    await this.userService.updateUser(userId, payload);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'User updated successfully' });
  }

  @Post()
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({
    type: ChangePasswordPayload,
    description: 'Payload to change user password',
  })
  @ApiResponse({
    status: 200,
    description: 'User changed password successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 401, description: 'Token not provided' })
  async changePassword(
    @Req() req,
    @Body() payload: ChangePasswordPayload,
    @Res() res: Response,
  ) {
    const userId = req.user;
    await this.userService.changePassword(userId, payload);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'User changed password successfully' });
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({
    status: 200,
    description: 'User account deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Token not provided' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteAccount(@Req() req, @Res() res: Response) {
    const userId = req.user;
    await this.userService.deleteAccount(userId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'User account deleted successfully' });
  }
  @Post('panic-mode')
  @ApiOperation({ summary: 'Activate panic mode' })
  async activatePanicMode(
    @Body() panicButtonPayload: PanicButtonPayload,
    @Res() res: Response,
  ) {
    await this.userService.activatePanicMode(panicButtonPayload);
    return res.status(HttpStatus.OK).json({ message: 'Panic mode activated' });
  }

  @Post('panic-mode/reverse')
  @ApiOperation({ summary: 'Deactivate panic mode' })
  async deactivatePanicMode(
    @Body() panicButtonPayload: PanicButtonPayload,
    @Res() res: Response,
  ) {
    await this.userService.deactivatePanicMode(panicButtonPayload);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Panic mode deactivated' });
  }
  @Get('panic-status/:userId')
  @ApiOperation({ summary: 'Get user panic mode status' })
  @ApiResponse({
    status: 200,
    description: 'Returns panic mode status',
    type: Boolean,
  })
  async getPanicModeStatus(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    const panicMode = await this.userService.getPanicModeStatus(userId);
    return res.status(HttpStatus.OK).json({ panicMode });
  }
}
