import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { config as envConfig } from 'dotenv';
import { ErrorMessage } from '../common/utils/message-const';

envConfig();
describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = () => ({
    findOne: jest.fn(),
  });

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const user = {
    id: 1,
    email: 'tyler@gmail.com',
    username: 'tyler@gmail.com',
    password: 'abc123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository() },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token if credentials are valid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0eWxlckBnbWFpbC5jb20iLCJpYXQiOjE3MjM1NDI2NzcsImV4cCI6MTcyMzU0ODY3N30.5QjgKedoYQLvPMuq0L2PLhx2SB1JhCLu3Y74ZIaEWlw',
        );

      const result = await service.login(user.email, user.password);

      expect(result).toEqual({
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0eWxlckBnbWFpbC5jb20iLCJpYXQiOjE3MjM1NDI2NzcsImV4cCI6MTcyMzU0ODY3N30.5QjgKedoYQLvPMuq0L2PLhx2SB1JhCLu3Y74ZIaEWlw',
        user: user,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: user.id, email: user.email, username: user.username },
        { secret: process.env.SECRET_KEY },
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.login(user.email, 'wrongpassword')).rejects.toThrow(
        new UnauthorizedException(ErrorMessage.USERNAME_PASSWORD_INCORRECT),
      );
    });
  });
});
