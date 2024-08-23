import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(), // Add findOne to mock repository
});

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const user = new User();
      user.id = 1;
      user.email = createUserDto.email;
      user.username = createUserDto.username;
      user.password = createUserDto.password;
      user.createdAt = new Date();
      user.updatedAt = new Date();

      const expectedResponse: BaseResponse = {
        data: user,
        isSuccess: true,
        message: SuccessMessage.CREATE_DATA_SUCCESS,
      };

      repository.findOne = jest.fn().mockResolvedValue(null); // Simulate no existing user
      repository.create = jest.fn().mockReturnValue(user);
      repository.save = jest.fn().mockResolvedValue(user);

      expect(await service.create(createUserDto)).toEqual(expectedResponse);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(user);
    });

    it('should throw an error if invalid email', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@.com',
        username: 'testuser',
        password: 'password123',
      };

      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.EMAIL_INVALID,
      );
      const result = await service.create(createUserDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should return error if email is empty', async () => {
      const createUserDto: CreateUserDto = {
        email: '',
        username: 'testuser',
        password: 'password123',
      };

      // const expectedResponse: BaseResponse = buildError(
      //   ErrorMessage.EMAIL_IS_REQUIRED,
      // );

      const expectedResponse: BaseResponse = buildError(
        `email ${ErrorMessage.IS_REQUIRED}`,
      );
      const result: BaseResponse = await service.create(createUserDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should return error if username is empty', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: '',
        password: 'password123',
      };

      const expectedResponse: BaseResponse = buildError(
        `username ${ErrorMessage.IS_REQUIRED}`,
      );
      const result: BaseResponse = await service.create(createUserDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should return error if password is empty', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: '',
      };

      const expectedResponse: BaseResponse = buildError(
        `password ${ErrorMessage.IS_REQUIRED}`,
      );
      const result: BaseResponse = await service.create(createUserDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should return error if user with the same email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      // Simulate that a user with the same email already exists
      const existingUser = new User();
      existingUser.email = createUserDto.email;
      repository.findOne = jest.fn().mockResolvedValue(existingUser);

      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.EMAIL_ALREADY_EXISTS,
      );

      expect(await service.create(createUserDto)).toEqual(expectedResponse);
    });
  });

  // api get user
  describe('getUser', () => {
    it('should return user by id', async () => {
      const userId = 1;
      const user = new User();
      user.id = userId;
      repository.findOne = jest.fn().mockResolvedValue(user);

      const expectedResponse: BaseResponse = {
        data: user,
        isSuccess: true,
        message: 'User found successfully',
      };

      expect(await service.findOne(userId)).toEqual(expectedResponse);
    });

    it('should return error if user not found', async () => {
      const userId = 1;
      repository.findOne = jest.fn().mockResolvedValue(null);

      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.USER_NOT_FOUND,
      );

      expect(await service.findOne(userId)).toEqual(expectedResponse);
    });
  });
});
