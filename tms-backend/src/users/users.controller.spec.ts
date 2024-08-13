import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockUsersService = () => ({
  create: jest.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService(),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return a user created', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        userName: 'testuser',
        passWord: 'password123',
      };

      const user = new User();
      user.id = 1;
      user.email = createUserDto.email;
      user.userName = createUserDto.userName;
      user.passWord = createUserDto.passWord;
      user.createdAt = new Date();
      user.updatedAt = new Date();

      service.create = jest.fn().mockResolvedValue(user);

      expect(await controller.create(createUserDto)).toEqual(user);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if email is empty', async () => {
      const createUserDto: CreateUserDto = {
        email: '',
        userName: 'testuser',
        passWord: 'password123',
      };

      service.create = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Email is required'));

      await expect(controller.create(createUserDto)).rejects.toThrow(
        new BadRequestException('Email is required'),
      );
    });
  });
});
