import { Test, TestingModule } from '@nestjs/testing';
import { GoalOnActivityService } from './goal-on-activity.service';
import { ActivityStatus } from '../common/constants/activity-status';
import { Activity } from '../activity/entities/activity.entity';
import { Goal } from '../goal/entities/goal.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { GoalOnActivity } from './entities/goal-on-activity.entity';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
import { CreateGoalOnActivityDto } from './dto/create-goal-on-activity.dto';
import { ActivityService } from '../activity/activity.service';

const currentDate = new Date();
const endedAt = new Date();
endedAt.setHours(endedAt.getHours() + 1);
const mockActivities = [
  {
    id: 1,
    name: 'Activity 1',
    userId: 1,
    status: ActivityStatus.NOT_COMPLETED,
    createdAt: currentDate,
    updatedAt: currentDate,
    startedAt: currentDate,
    endedAt: endedAt,
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
    endedAt: endedAt,
    status: ActivityStatus.NOT_COMPLETED,
    isDelete: false,
  },
] as Activity[];

const mockGoal = [
  {
    id: 1,
    name: 'Goal 1',
    userId: 1,
    status: ActivityStatus.NOT_COMPLETED,
    startedTime: currentDate,
    endedTime: endedAt,
  },
  {
    id: 2,
    name: 'Goal 2',
    userId: 1,
    status: ActivityStatus.NOT_COMPLETED,
    startedTime: currentDate,
    endedTime: endedAt,
  },
] as Goal[];

const mockGoalOnActivity = [
  {
    id: 1,
    goalId: 1,
    activityId: 1,
  },
  {
    id: 2,
    goalId: 2,
    activityId: 1,
  },
] as GoalOnActivity[];
const createGoalOnActivityDto: CreateGoalOnActivityDto = {
  goalId: 1,
  activityIds: [1, 2],
};

describe('GoalOnActivityService', () => {
  let service: GoalOnActivityService;
  let activityRepository: Repository<Activity>;
  let activityService: ActivityService;
  let goalRepository: Repository<Goal>;
  let goalOnActivityRepository: Repository<GoalOnActivity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalOnActivityService,
        {
          provide: getRepositoryToken(Activity),
          useValue: {
            find: jest.fn().mockResolvedValue(mockActivities),
            findOne: jest.fn(),
            create: jest.fn().mockResolvedValue(mockActivities[0]),
            save: jest.fn().mockResolvedValue(mockActivities[0]),
          },
        },
        {
          provide: getRepositoryToken(Goal),
          useValue: {
            find: jest.fn().mockResolvedValue(mockGoal),
            findOne: jest.fn(),
            create: jest.fn().mockResolvedValue(mockGoal[0]),
            save: jest.fn().mockResolvedValue(mockGoal[0]),
          },
        },
        {
          provide: getRepositoryToken(GoalOnActivity),
          useValue: {
            find: jest.fn().mockResolvedValue(mockGoal),
            findOne: jest.fn(),
            create: jest.fn().mockResolvedValue(mockGoal[0]),
            save: jest.fn().mockResolvedValue(mockGoal[0]),
          },
        },
        {
          provide: ActivityService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockActivities[0]),
          },
        },
      ],
    }).compile();

    service = module.get<GoalOnActivityService>(GoalOnActivityService);
    activityRepository = module.get<Repository<Activity>>(
      getRepositoryToken(Activity),
    );
    goalRepository = module.get<Repository<Goal>>(getRepositoryToken(Goal));
    goalOnActivityRepository = module.get<Repository<GoalOnActivity>>(
      getRepositoryToken(GoalOnActivity),
    );
    activityService = module.get<ActivityService>(ActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create from exist activity', () => {
    const userId = 1;
    it('Should return success with valid data', async () => {
      jest
        .spyOn(goalRepository, 'findOne')
        .mockResolvedValue(mockGoal[0] as Goal);
      jest
        .spyOn(activityRepository, 'find')
        .mockResolvedValue(mockActivities as Activity[]);
      jest
        .spyOn(goalOnActivityRepository, 'create')
        .mockReturnValue(mockGoalOnActivity[0] as GoalOnActivity);
      jest
        .spyOn(goalOnActivityRepository, 'save')
        .mockResolvedValue(mockGoalOnActivity[0] as GoalOnActivity);
      const result = await service.create(userId, createGoalOnActivityDto);
      expect(result.data).toEqual(mockGoalOnActivity[0]);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS);
    });

    it('Should return error if array input activityIds have  an invalid ( activity not exist)', async () => {
      jest.spyOn(activityRepository, 'find').mockResolvedValue([]);
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.ACTIVITY_INPUT_INVALID,
      );
      const result = await service.create(userId, createGoalOnActivityDto);
      expect(result).toEqual(expectedResponse);
    });

    it('Should return error if array input activityIds have an invalid (date range)', async () => {
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.ACTIVITY_INPUT_INVALID,
      );
      jest
        .spyOn(goalRepository, 'findOne')
        .mockResolvedValue(mockGoal[0] as Goal);
      const activityEndDate = new Date();
      activityEndDate.setHours(endedAt.getHours() + 1);
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue({
        ...mockActivities[0],
        startedAt: activityEndDate,
      } as Activity);
      const result: BaseResponse = await service.create(userId, {
        ...createGoalOnActivityDto,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should return error if goal not exist', async () => {
      jest.spyOn(goalRepository, 'findOne').mockResolvedValue(null);
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.GOAL_NOT_FOUND,
      );
      const result = await service.create(userId, createGoalOnActivityDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should return error if array input is an empty array', async () => {
      const expectedResponse: BaseResponse = buildError(
        ErrorMessage.MUST_BE_ARRAY_INT,
      );
      const result = await service.create(userId, {
        ...createGoalOnActivityDto,
        activityIds: [],
      });
      expect(result).toEqual(expectedResponse);
    });
  });
});
