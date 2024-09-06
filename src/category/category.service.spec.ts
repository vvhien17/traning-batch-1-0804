import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from '../user/entities/user.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<Category>;
  let userRepository: Repository<User>;

  // Mock repository
  const mockCategoryRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };
  const mockUserRepository = () => ({
    findOne: jest.fn(),
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findCategoriesByUserId', () => {
    it('should return a list of categories by userId', async () => {
      const userId = 1;
      const mockCategories = {
        data: [
          { id: 1, name: 'Category1', userId: 1 },
          { id: 2, name: 'Category2', userId: 1 },
        ],
        isSuccess: true,
        message: SuccessMessage.GET_DATA_SUCCESS,
      } as BaseResponse;

      mockCategoryRepository.find.mockResolvedValue(mockCategories.data);

      const result = await service.findCategoryByUserId(userId);
      expect(result).toEqual(mockCategories);
      expect(repository.find).toHaveBeenCalledWith({ where: { userId } });
    });

    it('should return an error response if no categories are found', async () => {
      const userId = 2;
      const mockErrorResponse = buildError(
        ErrorMessage.CATEGORY_NOT_FOUND,
      ) as BaseResponse;

      mockCategoryRepository.find.mockResolvedValue([]);

      const result = await service.findCategoryByUserId(userId);
      expect(result).toEqual(mockErrorResponse);
      expect(repository.find).toHaveBeenCalledWith({ where: { userId } });
    });
  });
  describe('create', () => {
    it('should create and return a new category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'New Category',
      };
      const userId = 1;
      const user = new User();
      user.id = 1;

      const category = new Category();
      category.id = 1;
      category.name = createCategoryDto.name;
      category.userId = userId;

      const expectedResponse: BaseResponse = {
        data: category,
        isSuccess: true,
        message: SuccessMessage.CREATE_DATA_SUCCESS,
      };

      userRepository.findOne = jest.fn().mockResolvedValue(user);
      repository.create = jest.fn().mockReturnValue(category);
      repository.save = jest.fn().mockResolvedValue(category);

      expect(await service.create(createCategoryDto, userId)).toEqual(
        expectedResponse,
      );
    });

    it('should return error if user is not found', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'New Category',
      };

      const expectedResponse: BaseResponse = {
        data: null,
        isSuccess: false,
        message: ErrorMessage.USER_NOT_FOUND,
      };

      userRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(await service.create(createCategoryDto, 9999)).toEqual(
        expectedResponse,
      );
    });

    // Add additional tests as needed
  });
  describe('update', () => {
    it('should return error if user is not found when update category', async () => {
      const userId = 999;
      const updateDto: UpdateCategoryDto = {
        id: 1,
        name: 'New Category 2',
      };
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.DATA_NOT_FOUND,
      );
      userRepository.findOne = jest.fn().mockResolvedValue(null);
      const result = await service.updateCategory(updateDto, userId);
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
    });
    it('should return error if category is not found when update category', async () => {
      const userId = 999;
      const updateDto: UpdateCategoryDto = {
        id: 1,
        name: 'New Category 2',
      };
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.DATA_NOT_FOUND,
      );
      repository.findOne = jest.fn().mockResolvedValue(null);
      const result = await service.updateCategory(updateDto, userId);
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
    });
    it('should return error if userId and categoryId not found when update category', async () => {
      const userId = 999;
      const updateDto: UpdateCategoryDto = {
        id: 1,
        name: 'New Category 2',
      };
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.DATA_NOT_FOUND,
      );

      userRepository.findOne = jest.fn().mockResolvedValue(null);
      repository.findOne = jest.fn().mockResolvedValue(null);
      const result = await service.updateCategory(updateDto, userId);
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
    });
    it('show return error if category name is empty', async () => {
      const userId = 1;
      const updateDto: UpdateCategoryDto = {
        id: 1,
        name: '',
      };
      const expectedResponse: BaseResponse = buildError(
        `Name ${ErrorMessage.IS_REQUIRED}`,
      );

      const result = await service.updateCategory(updateDto, userId);
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
    });
    it('should return success if category is updated successfully', async () => {
      const categoryId = 1;
      const userId = 1;
      const updateDto: UpdateCategoryDto = {
        id: categoryId,
        name: 'Updated Category',
      };
      const expectedResponse: BaseResponse = {
        data: {
          ...updateDto,
          userId,
        },
        isSuccess: true,
        message: SuccessMessage.CREATE_DATA_SUCCESS,
      };
      const category = new Category();
      category.id = categoryId;
      category.name = updateDto.name;
      category.userId = userId;
      repository.findOne = jest.fn().mockResolvedValue(category);
      repository.save = jest.fn().mockResolvedValue(category);
      const result = await service.updateCategory(updateDto, userId);
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
    });
  });
});
