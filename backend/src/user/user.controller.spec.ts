import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import {
  changePasswordPayloadCorrect,
  mockUserWithId,
  updateUserCorrectPayload,
} from 'src/mock-data/mockData';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    getUserInfo: jest.fn(),
    updateUser: jest.fn(),
    changePassword: jest.fn(),
    deleteAccount: jest.fn(),
  };

  const mockRequest = { user: 'userId123' };
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserInfo', () => {
    it('should return user info successfully', async () => {
      mockUserService.getUserInfo.mockResolvedValue(mockUserWithId);

      const result = await userController.getUserInfo(mockRequest);

      expect(result).toEqual(mockUserWithId);
      expect(userService.getUserInfo).toHaveBeenCalledWith('userId123');
    });
  });

  describe('updateUser', () => {
    it('should update user and return success message', async () => {
      const responseMessage = { message: 'User updated successfully' };
      mockUserService.updateUser.mockResolvedValue(responseMessage);

      await userController.updateUser(
        mockRequest,
        updateUserCorrectPayload,
        mockResponse,
      );

      expect(userService.updateUser).toHaveBeenCalledWith(
        'userId123',
        updateUserCorrectPayload,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(responseMessage);
    });

    it('should return 400 if invalid data is provided', async () => {
      mockUserService.updateUser.mockImplementation(() => {
        throw new Error('Invalid credentials');
      });

      await expect(
        userController.updateUser(mockRequest, {}, mockResponse),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('changePassword', () => {
    it('should change user password and return success message', async () => {
      const responseMessage = { message: 'User changed password successfully' };
      mockUserService.changePassword.mockResolvedValue(responseMessage);

      await userController.changePassword(
        mockRequest,
        changePasswordPayloadCorrect,
        mockResponse,
      );

      expect(userService.changePassword).toHaveBeenCalledWith(
        'userId123',
        changePasswordPayloadCorrect,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(responseMessage);
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account and return success message', async () => {
      const responseMessage = { message: 'User account deleted successfully' };
      mockUserService.deleteAccount.mockResolvedValue(responseMessage);

      await userController.deleteAccount(mockRequest, mockResponse);

      expect(userService.deleteAccount).toHaveBeenCalledWith('userId123');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(responseMessage);
    });

    it('should throw an error if user is not found', async () => {
      mockUserService.deleteAccount.mockImplementation(() => {
        throw new Error('User not found');
      });

      await expect(
        userController.deleteAccount(mockRequest, mockResponse),
      ).rejects.toThrow('User not found');
    });
  });
});
