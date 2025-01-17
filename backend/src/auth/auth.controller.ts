import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { EndPoints } from 'src/enums/endPoints.enum';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Cookies } from 'src/enums/cookies.enum';
import { LoginPayload, RegisterPayload } from './auth.dto';
import { MessageResponse } from 'src/shared/models/response.model';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller(EndPoints.auth)
@ApiTags(EndPoints.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(EndPoints.register)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterPayload })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: MessageResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() payload: RegisterPayload): Promise<MessageResponse> {
    await this.authService.register(payload);
    return { message: 'User registered successfully' };
  }

  @Post(EndPoints.login)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginPayload })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: MessageResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(@Body() payload: LoginPayload, @Res() res: Response) {
    const { token, user } = await this.authService.login(payload);
    res.cookie(Cookies.token, token, {
      httpOnly: true,
      maxAge: Number(process.env.EXPIRE_TIME),
    });
    return res.status(HttpStatus.OK).json({ user });
  }

  @Get(EndPoints.logout)
  @ApiOperation({ summary: 'Logout a user and clear the cookie' })
  @ApiResponse({
    status: 200,
    description: 'User logout successfully',
    type: MessageResponse,
  })
  @ApiResponse({ status: 401, description: 'Token not provided' })
  async deleteCookie(@Req() req, @Res() res: Response) {
    if (!req.cookies.token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Token not provided' });
    }

    res.clearCookie(Cookies.token);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'User logout successfully' });
  }

  @Get(EndPoints.autoLogin)
  @ApiOperation({
    summary:
      'Automatically login a user if the token is still valid and not expired',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
  })
  @ApiResponse({ status: 401, description: 'Token not provided' })
  async autoLogin(@Req() req, @Res() res: Response) {
    const userId = req.user;
    const user = await this.authService.autoLogin(userId);
    return res.status(HttpStatus.OK).json({ user });
  }
}
