import { Test, TestingModule } from '@nestjs/testing';
import { GoalOnActivityService } from './goal-on-activity.service';
import { ActivityStatus } from '../common/constants/activity-status';
import { Activity } from '../activity/entities/activity.entity';
import { Goal } from '../goal/entities/goal.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { create } from 'domain';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { GoalOnActivity } from './entities/goal-on-activity.entity';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
import { CreateGoalOnActivityDto } from './dto/create-goal-on-activity.dto';

const currentDate = new Date();
const endedAt = new Date();
endedAt.setDate(endedAt.getDate() + 1);
const mockActivities = [
  {
    id: 1,
    name: 'Activity 1',
    userId: 1,
    categoryId: 1,
    status: ActivityStatus.NOT_COMPLETED,
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
    endedTime: currentDate,
  },
  {
    id: 2,
    name: 'Goal 2',
    userId: 1,
    status: ActivityStatus.NOT_COMPLETED,
    startedTime: currentDate,
    endedTime: currentDate,
  }
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
    activityId: 2,
  }
] as GoalOnActivity[];
const createGoalOnActivityDto: CreateGoalOnActivityDto = {
  goalId: 1,
  name: 'Activity 1',
  startedAt: currentDate,
  endedAt: endedAt,
  categoryId: 1,
  description: 'test desc',
};

describe('GoalOnActivityService', () => {
  let service: GoalOnActivityService;
  let activityRepository: Repository<Activity>;
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
          }
        },
        {
          provide: getRepositoryToken(GoalOnActivity),
          useValue: {
            find: jest.fn().mockResolvedValue(mockGoal),
            findOne: jest.fn(),
            create: jest.fn().mockResolvedValue(mockGoal[0]),
            save: jest.fn().mockResolvedValue(mockGoal[0]),
          }
        }
      ],
    }).compile();

    service = module.get<GoalOnActivityService>(GoalOnActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create activity for goal", () => {
    it("Should return success with valid data ( data activity valid & goal exist)", async () => {
      jest.spyOn(goalRepository, "findOne").mockResolvedValue(mockGoal[0] as Goal);
      jest.spyOn(activityRepository, "create").mockReturnValue(mockActivities[0] as Activity);
      jest.spyOn(activityRepository, "save").mockResolvedValue(mockActivities[0] as Activity);
      jest.spyOn(goalOnActivityRepository, "create").mockReturnValue(mockGoalOnActivity[0] as GoalOnActivity);
      jest.spyOn(goalOnActivityRepository, "save").mockResolvedValue(mockGoalOnActivity[0] as GoalOnActivity);
      const result = await service.create(createGoalOnActivityDto);
      expect(result.data).toEqual(mockGoalOnActivity[0] as GoalOnActivity);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS);
    })

    it("Should return error when user's goal is not exist", async () => {
      jest.spyOn(goalRepository, "findOne").mockResolvedValue(null);
      const result = await service.create(createGoalOnActivityDto);
      expect(result.data).toEqual(null);
      expect(result.isSuccess).toBe(false);
      expect(result.message).toEqual(ErrorMessage.GOAL_NOT_FOUND);
    })

    it("Should return error when activity input invalid - missing name", async () => {
      const expectedResponse: BaseResponse = buildError(
        `Name ${ErrorMessage.IS_REQUIRED}`,
      );
      const result: BaseResponse = await service.create({
        ...createGoalOnActivityDto,
        name: null,
      });
      expect(result).toEqual(expectedResponse);
    })

    it("Should return error when activity input invalid - missing startedAt", async () => {
      const expectedResponse: BaseResponse = buildError(
        `startedAt ${ErrorMessage.IS_REQUIRED}`,
      );
      const result: BaseResponse = await service.create({
        ...createGoalOnActivityDto,
        startedAt: null,
      });
      expect(result).toEqual(expectedResponse);
    })

    it("Should return error when activity input invalid - missing endedAt", async () => {
      const expectedResponse: BaseResponse = buildError(
        `endedAt ${ErrorMessage.IS_REQUIRED}`,
      );
      const result: BaseResponse = await service.create({
        ...createGoalOnActivityDto,
        endedAt: null,
      });
      expect(result).toEqual(expectedResponse);
    })

    it("Should return error when missing goal input ", async () => {
      const expectedResponse: BaseResponse = buildError(
        `GoalId ${ErrorMessage.IS_REQUIRED}`,
      );
      const result: BaseResponse = await service.create({
        ...createGoalOnActivityDto,
        goalId: null,
      });
      expect(result).toEqual(expectedResponse);
    })
  })
});
