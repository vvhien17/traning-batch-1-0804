import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

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
    username: 'tyler@gmail.com',
    password: 'abc123'
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
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0eWxlckBnbWFpbC5jb20iLCJpYXQiOjE3MjM1NDI2NzcsImV4cCI6MTcyMzU0ODY3N30.5QjgKedoYQLvPMuq0L2PLhx2SB1JhCLu3Y74ZIaEWlw');

      const result = await service.login(user.username, user.password);

      expect(result).toEqual({ access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0eWxlckBnbWFpbC5jb20iLCJpYXQiOjE3MjM1NDI2NzcsImV4cCI6MTcyMzU0ODY3N30.5QjgKedoYQLvPMuq0L2PLhx2SB1JhCLu3Y74ZIaEWlw' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ id: user.id, username: user.username });
    });

    it('should throw BadRequestException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.login('nonexistentuser', 'password'))
        .rejects
        .toThrow(new BadRequestException('User not found'));
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mocked_token');

      await expect(service.login(user.username, 'wrongpassword'))
        .rejects
        .toThrow(new UnauthorizedException('UserName or password incorrect'));
    });
  });
});
