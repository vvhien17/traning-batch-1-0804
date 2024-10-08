import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        JwtService, // Include JwtService if it's used directly or indirectly
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a JWT token when credentials are valid', async () => {
      const mockToken = 'mocked_token';
      const signInDto: LoginDto = { email: 'testuser', password: 'password' };
      const user = {
        id: 1,
        email: 'tyler@gmail.com',
        username: 'tyler@gmail.com',
      };

      jest.spyOn(authService, 'login').mockResolvedValue({
        data: { access_token: mockToken, user: user },
        isSuccess: true,
        message: 'Login successfully',
      });

      const result = await controller.signIn(signInDto);

      expect(result).toEqual({
        data: { access_token: mockToken, user: user },
        isSuccess: true,
        message: 'Login successfully',
      });
      expect(authService.login).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
    });

    it('should handle login failures', async () => {
      const signInDto: LoginDto = {
        email: 'testuser',
        password: 'wrongpassword',
      };
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(
          new UnauthorizedException('UserName or password incorrect'),
        );

      await expect(controller.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile if authenticated', async () => {
      const mockRequest = {
        user: { id: 1, username: 'testuser' },
      };

      // Directly call the method since it's using a guard that would be tested in integration
      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockRequest.user);
    });
  });
});
