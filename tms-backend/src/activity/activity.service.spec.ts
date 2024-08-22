import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
const currentDate = new Date();
const endedAt = new Date();
endedAt.setDate(endedAt.getDate() - 1);
const mockActivities = [
  {
    id: 1,
    name: 'Activity 1',
    userId: 1,
    createdAt: currentDate,
    updatedAt: currentDate,
    startedAt: currentDate,
    endedAt: currentDate,
    description: 'test desc',
  },
  {
    id: 2,
    name: 'Activity 2',
    userId: 1,
    createdAt: currentDate,
    updatedAt: currentDate,
    startedAt: currentDate,
    endedAt: currentDate,
  },
];

describe('ActivitiesController', () => {
  let service: ActivityService;
  let activityRepository: Repository<Activity>;
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
            save: jest.fn().mockResolvedValue(mockActivities[0])
          },
        },
      ],
    }).compile();
    service = module.get<ActivityService>(ActivityService);
    activityRepository = module.get<Repository<Activity>>(
      getRepositoryToken(Activity),
    );
  });

  it('Activity service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user find all activity', () => {
    it('should return an array of activities for a specific user', async () => {
      jest
        .spyOn(activityRepository, 'find')
        .mockResolvedValue(mockActivities as Activity[]);
      const activities = await service.findAll(1);
      expect(activities.data).toEqual(mockActivities);
    });

    it('should return an empty array if the user has no activities', async () => {
      jest.spyOn(activityRepository, 'find').mockResolvedValue([]);
      const activities = await service.findAll(2);
      expect(activities.data).toEqual([]);
    });
  });

  describe('user find activity by activityId', () => {
    it('should return an activity for a specific user', async () => {
      jest
        .spyOn(activityRepository, 'findOne')
        .mockResolvedValue(mockActivities[0] as Activity);
      const activity = await service.findOne(1, 1);
      expect(activity.data).toEqual(mockActivities[0]);
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

  describe('user find activity by activityId', () => {
    it('should return an activity for a specific user', async () => {
      jest
        .spyOn(activityRepository, 'findOne')
        .mockResolvedValue(mockActivities[0] as Activity);
      const activity = await service.findOne(1, 1);
      expect(activity.data).toEqual(mockActivities[0]);
    });
  });

  describe("create activity", () => {
    it("create a new activity enough require without description", async () => {
      const mockActivities = {
        id: 1,
        name: 'Activity 1',
        userId: 1,
        createdAt: currentDate,
        updatedAt: currentDate,
        startedAt: currentDate,
        endedAt: endedAt,
        categoryId: 1,
      }
      jest.spyOn(activityRepository, 'save').mockResolvedValue(mockActivities as Activity);
      jest.spyOn(activityRepository, "create").mockReturnValue(mockActivities as Activity)
      const result: any = await service.create(mockActivities)
      expect(result.data).toEqual(mockActivities as Activity)
      expect(result.isSuccess).toBe(true)
      expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS)
    })

    it("create a new activity enough require with description", async () => {
      const mockActivities = {
        id: 1,
        name: 'Activity 1',
        userId: 1,
        createdAt: currentDate,
        updatedAt: currentDate,
        startedAt: currentDate,
        endedAt: endedAt,
        description: 'test desc',
        categoryId: 1,
      }
      jest.spyOn(activityRepository, 'save').mockResolvedValue(mockActivities as Activity);
      jest.spyOn(activityRepository, "create").mockReturnValue(mockActivities as Activity)
      const result: any = await service.create(mockActivities)
      expect(result.data).toEqual(mockActivities as Activity)
      expect(result.isSuccess).toBe(true)
      expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS)
    })

    it("Create a new activity missing only startedDate", async () => {
      const mockActivities = {
        id: 1,
        name: 'Activity 1',
        userId: 1,
        createdAt: currentDate,
        updatedAt: currentDate,
        endedAt: endedAt,
        description: 'test desc',
        categoryId: 1,
      }
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.BAD_REQUEST,
      );
      const result: any = await service.create(mockActivities)
      expect(result).toEqual(expectedResponse);
    })

    it("Create a new activity missing only endedDate", async () => {
      const mockActivities = {
        id: 1,
        name: 'Activity 1',
        userId: 1,
        createdAt: currentDate,
        updatedAt: currentDate,
        startAt: currentDate,
        description: 'test desc',
        categoryId: 1,
      }
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.BAD_REQUEST,
      );
      const result: any = await service.create(mockActivities)
      expect(result).toEqual(expectedResponse);
    })

    it("Create a new activity missing only name activity", async () => {
      const mockActivities = {
        id: 1,
        userId: 1,
        createdAt: currentDate,
        updatedAt: currentDate,
        startAt: currentDate,
        endedAt: endedAt,
        description: 'test desc',
        categoryId: 1,
      }
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.BAD_REQUEST,
      );
      const result: any = await service.create(mockActivities)
      expect(result).toEqual(expectedResponse);
    })

    it("Create a new activity with require data and not choosing category", async () => {
      const mockActivities = {
        id: 1,
        name: 'Activity 1',
        userId: 1,
        createdAt: currentDate,
        updatedAt: currentDate,
        startedAt: currentDate,
        endedAt: endedAt,
        description: 'test desc',
      }
      jest.spyOn(activityRepository, 'save').mockResolvedValue(mockActivities as Activity);
      jest.spyOn(activityRepository, "create").mockReturnValue(mockActivities as Activity)
      const result: any = await service.create(mockActivities)
      expect(result.data).toEqual(mockActivities as Activity)
      expect(result.isSuccess).toBe(true)
      expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS)
    })

    it("Create a new activity with require data and choosing category", async () => {
      const mockActivities = {
        id: 1,
        name: 'Activity 1',
        userId: 1,
        createdAt: currentDate,
        updatedAt: currentDate,
        startedAt: currentDate,
        endedAt: endedAt,
        description: 'test desc',
        categoryId: 1,
      }
      jest.spyOn(activityRepository, 'save').mockResolvedValue(mockActivities as Activity);
      jest.spyOn(activityRepository, "create").mockReturnValue(mockActivities as Activity)
      const result: any = await service.create(mockActivities)
      expect(result.data).toEqual(mockActivities as Activity)
      expect(result.isSuccess).toBe(true)
      expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS)
    })

    it("Create new activity with exist name enough require data", async () => {
      const mockActivities = {
        id: 1,
        name: 'Activity 1',
        userId: 1,
        createdAt: currentDate,
        updatedAt: currentDate,
        startedAt: currentDate,
        endedAt: endedAt,
        description: 'test desc',
        categoryId: 1,
      }
      jest.spyOn(activityRepository, 'save').mockResolvedValue(mockActivities as Activity);
      jest.spyOn(activityRepository, "create").mockReturnValue(mockActivities as Activity)
      const result: any = await service.create(mockActivities)
      expect(result.data).toEqual(mockActivities as Activity)
      expect(result.isSuccess).toBe(true)
      expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS)
    })


    it("Create new activity enough data but endedDate before startedDate", async () => {
      const endedAt = new Date();
      endedAt.setDate(endedAt.getDate() + 1);
      const mockActivities = {
        id: 1,
        name: 'Activity 1',
        userId: 1,
        createdAt: currentDate,
        updatedAt: currentDate,
        startedAt: currentDate,
        endedAt: endedAt,
        description: 'test desc',
        categoryId: 1,
      }
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.BAD_REQUEST,
      );
      const result: any = await service.create(mockActivities)
      expect(result).toEqual(expectedResponse);
    })

  })
});
