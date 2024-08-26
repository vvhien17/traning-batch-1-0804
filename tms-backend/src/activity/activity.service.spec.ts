import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
import { User } from '../user/entities/user.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Category } from '../category/entities/category.entity';
import { ActivityStatus } from '../common/constant/activity-status';
const currentDate = new Date();
const endedAt = new Date();
endedAt.setDate(endedAt.getDate() + 1);
const mockActivities = [
  {
    id: 1,
    name: 'Activity 1',
    userId: 1,
    categoryId: 1,
    status: ActivityStatus.PENDING,
    createdAt: currentDate,
    updatedAt: currentDate,
    startedAt: currentDate,
    endedAt: currentDate,
    description: 'test desc',
    isDelete: false,
  },
  {
    id: 2,
    name: 'Activity 2',
    userId: 1,
    createdAt: currentDate,
    updatedAt: currentDate,
    startedAt: currentDate,
    endedAt: currentDate,
    status: ActivityStatus.PENDING,
    isDelete: false,
  },
] as Activity[];

const mockCategory = {
  id: 1,
  name: 'Category mock',
  userId: 1,
  createdAt: currentDate,
  updatedAt: currentDate,
} as Category;

const mockDataUser: User = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  password: 'password123',
  createdAt: currentDate,
  updatedAt: currentDate,
  categories: [],
  activities: [],
  goals: [],
} as User;

describe('ActivitiesController', () => {
  let service: ActivityService;
  let activityRepository: Repository<Activity>;
  let userRepository: Repository<User>;
  let categoryRepository: Repository<Category>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: getRepositoryToken(Activity),
          useValue: {
            find: jest.fn().mockResolvedValue(mockActivities),
            findOne: jest.fn(),
            create: jest.fn().mockResolvedValue(mockActivities[0]),
            save: jest.fn().mockResolvedValue(mockActivities[0]),
            performChanges: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockDataUser as User),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            create: jest.fn().mockReturnValue(mockCategory as Category),
            save: jest.fn().mockResolvedValue(mockCategory as Category),
            findOne: jest.fn().mockResolvedValue(mockCategory as Category),
          },
        },
      ],
    }).compile();
    service = module.get<ActivityService>(ActivityService);
    activityRepository = module.get<Repository<Activity>>(
      getRepositoryToken(Activity),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('Activity service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User find all activity', () => {
    it('should return an array of activities for a specific user', async () => {
      const returnActivity = [
        { ...mockActivities[0], categoryName: mockCategory.name },
        { ...mockActivities[1], categoryName: null },
      ];
      const activities = await service.findAll(1);
      expect(activities.data).toEqual(returnActivity);
    });

    it('should return an empty array if the user has no activities', async () => {
      jest.spyOn(activityRepository, 'find').mockResolvedValue([]);
      const activities = await service.findAll(2);
      expect(activities.data).toEqual([]);
    });
  });

  describe('User find activity by activityId', () => {
    it('should return an activity for a specific user', async () => {
      const returnActivity = {
        ...mockActivities[0],
        categoryName: mockCategory.name,
      };
      const activity = await service.findOne(1, 1);
      expect(activity.data).toEqual(returnActivity);
    });

    it('should return message not found if the user does not exist', async () => {
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1, 2)).rejects.toThrow(
        new BadRequestException(ErrorMessage.ACTIVITY_NOT_FOUND),
      );
    });

    it('should return message not found if the activity does not exist', async () => {
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(3, 1)).rejects.toThrow(
        new BadRequestException(ErrorMessage.ACTIVITY_NOT_FOUND),
      );
    });
  });

  describe('Create activity', () => {
    const userId = 1;
    const mockActivities = {
      id: 1,
      name: 'Activity 1',
      userId: userId,
      createdAt: currentDate,
      updatedAt: currentDate,
      startedAt: currentDate,
      endedAt: endedAt,
      categoryId: 1,
      description: 'test desc',
    };
    const activityDto: CreateActivityDto = {
      name: 'Activity 1',
      startedAt: currentDate,
      endedAt: endedAt,
      categoryId: 1,
      description: 'test desc',
    };
    it('create a new activity enough require without description', async () => {
      jest
        .spyOn(activityRepository, 'create')
        .mockReturnValue({ description: null, ...mockActivities } as Activity);
      jest.spyOn(activityRepository, 'save').mockResolvedValue({
        description: null,
        ...mockActivities,
      } as Activity);
      const result: BaseResponse = await service.create(userId, {
        ...activityDto,
        description: null,
      });
      expect(result.data).toEqual(mockActivities as Activity);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS);
    });

    it('create a new activity enough require but not exist category', async () => {
      const result: BaseResponse = await service.create(userId, {
        ...activityDto,
        description: null,
        categoryId: 2,
      });
      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(ErrorMessage.CATEGORY_NOT_FOUND);
    });

    it('create a new activity enough require with description', async () => {
      jest
        .spyOn(activityRepository, 'save')
        .mockResolvedValue(mockActivities as Activity);
      jest
        .spyOn(activityRepository, 'create')
        .mockReturnValue(mockActivities as Activity);
      const result: BaseResponse = await service.create(userId, activityDto);
      expect(result.data).toEqual(mockActivities as Activity);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS);
    });

    it('Create a new activity missing only startedDate', async () => {
      const expectedResponse: BaseResponse = buildError(
        `StartedAt ${ErrorMessage.IS_REQUIRED}`,
      );
      const result: BaseResponse = await service.create(userId, {
        ...activityDto,
        startedAt: null,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('Create a new activity missing only endedDate', async () => {
      const expectedResponse: BaseResponse = buildError(
        `EndedAt ${ErrorMessage.IS_REQUIRED}`,
      );
      const result: BaseResponse = await service.create(userId, {
        ...activityDto,
        endedAt: null,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('Create a new activity missing only name activity', async () => {
      const expectedResponse: BaseResponse = buildError(
        `Name ${ErrorMessage.IS_REQUIRED}`,
      );
      const result: BaseResponse = await service.create(userId, {
        ...activityDto,
        name: null,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('Create a new activity with require data and not choosing category', async () => {
      jest
        .spyOn(activityRepository, 'save')
        .mockResolvedValue({ categoryId: null, ...mockActivities } as Activity);
      jest
        .spyOn(activityRepository, 'create')
        .mockReturnValue({ categoryId: null, ...mockActivities } as Activity);
      const result: BaseResponse = await service.create(userId, {
        ...activityDto,
        categoryId: null,
      });
      expect(result.data).toEqual(mockActivities as Activity);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS);
    });

    it('Create a new activity with require data and choosing category', async () => {
      jest
        .spyOn(activityRepository, 'save')
        .mockResolvedValue(mockActivities as Activity);
      jest
        .spyOn(activityRepository, 'create')
        .mockReturnValue(mockActivities as Activity);
      const result: BaseResponse = await service.create(userId, activityDto);
      expect(result.data).toEqual(mockActivities as Activity);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS);
    });

    it('Create new activity enough data but endedDate before startedDate', async () => {
      const endedAt = new Date();
      endedAt.setDate(endedAt.getDate() - 1);
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.BAD_REQUEST,
      );
      const result: BaseResponse = await service.create(userId, {
        ...activityDto,
        endedAt: endedAt,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('Create a new activity missing only userId ', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.USER_NOT_FOUND,
      );
      const result: BaseResponse = await service.create(userId, activityDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('Update activity', () => {
    const userId = 1;
    const newStartedAt = new Date(
      new Date().setDate(currentDate.getDate() + 1),
    );
    const newEndedAt = new Date(new Date().setDate(currentDate.getDate() + 2));
    const updateActivityDto: UpdateActivityDto = {
      id: 1,
      name: 'Activity change',
      startedAt: newStartedAt,
      status: ActivityStatus.COMPLETED,
      endedAt: newEndedAt,
      categoryId: 2,
      description: 'Description change',
    };
    const categoryMockUpdate = {
      id: 2,
      name: 'Category mock to update',
      userId: 1,
      createdAt: currentDate,
      updatedAt: currentDate,
    } as Category;

    it('Update activity with valid data', async () => {
      jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValue(categoryMockUpdate);
      jest
        .spyOn(activityRepository, 'findOne')
        .mockResolvedValue(mockActivities[0] as Activity);

      jest
        .spyOn(activityRepository, 'save')
        .mockResolvedValue(updateActivityDto as Activity);
      const result: BaseResponse = await service.update(userId, {
        ...updateActivityDto,
      });

      expect(result.data).toEqual(updateActivityDto as Activity);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toEqual(SuccessMessage.UPDATE_DATA_SUCCESS);
    });

    it('Update only activity status', async () => {
      // change activity to canceled
      const updatedActivity = { id: 1, status: ActivityStatus.CANCELED };
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue({
        status: ActivityStatus.CANCELED,
        ...mockActivities[0],
      } as Activity);
      jest
        .spyOn(activityRepository, 'save')
        .mockResolvedValue(updatedActivity as Activity);

      const result: BaseResponse = await service.update(
        userId,
        updateActivityDto,
      );

      expect(result.data).toEqual(updatedActivity as Activity);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toEqual(SuccessMessage.UPDATE_DATA_SUCCESS);
    });

    it('Update started at but start > end', async () => {
      jest
        .spyOn(activityRepository, 'findOne')
        .mockResolvedValue(mockActivities[0] as Activity);
      const wrongStartedAt = new Date(
        currentDate.setDate(currentDate.getDate() + 10),
      );
      const result: BaseResponse = await service.update(userId, {
        ...updateActivityDto,
        startedAt: wrongStartedAt,
      });

      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(
        `StartedAt ${ErrorMessage.MUST_GREATER_THAN} EndedAt`,
      );
    });

    it('Update end but start > end', async () => {
      jest
        .spyOn(activityRepository, 'findOne')
        .mockResolvedValue(mockActivities[0] as Activity);
      const endedAt = new Date(currentDate.setDate(currentDate.getDate() - 10));
      const result: BaseResponse = await service.update(userId, {
        ...updateActivityDto,
        endedAt: endedAt,
      });

      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(
        `StartedAt ${ErrorMessage.MUST_GREATER_THAN} EndedAt`,
      );
    });

    it('Update activity that not exist', async () => {
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(null);
      const result: BaseResponse = await service.update(
        userId,
        updateActivityDto,
      );
      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(ErrorMessage.ACTIVITY_NOT_FOUND);
    });

    it('Update activity to new category that not exist', async () => {
      jest
        .spyOn(activityRepository, 'findOne')
        .mockResolvedValue(mockActivities[0] as Activity);
      const result: BaseResponse = await service.update(userId, {
        ...updateActivityDto,
        categoryId: 100,
      });
      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(ErrorMessage.CATEGORY_NOT_FOUND);
    });
  });
});
