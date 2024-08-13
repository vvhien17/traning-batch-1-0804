import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException } from '@nestjs/common'; // Import BadRequestException

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
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

      repository.create = jest.fn().mockReturnValue(user);
      repository.save = jest.fn().mockResolvedValue(user);

      expect(await service.create(createUserDto)).toEqual(user);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(user);
    });

    it('should throw an error if email is empty', async () => {
      const createUserDto: CreateUserDto = {
        email: '',
        userName: 'testuser',
        passWord: 'password123',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        new BadRequestException('Email is required'),
      );
    });

    it('should throw an error if userName is empty', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        userName: '',
        passWord: 'password123',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        new BadRequestException('Username is required'),
      );
    });

    it('should throw an error if passWord is empty', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        userName: 'testuser',
        passWord: '',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        new BadRequestException('Password is required'),
      );
    });
  });
});
