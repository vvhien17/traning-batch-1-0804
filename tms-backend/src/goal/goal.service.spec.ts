import { Test, TestingModule } from '@nestjs/testing';
import { GoalService } from './goal.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { User } from '../user/entities/user.entity';
import { GoalOnActivity } from '../goal-on-activity/entities/goal-on-activity.entity';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { GoalStatus } from '../common/constants/goal-status';
import { CreateGoalDto } from './dto/create-goal.dto';
import { buildError } from '../common/utils/Utility';
import { Activity } from '../activity/entities/activity.entity';

const now = new Date();
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // Adds 1 hour

describe('GoalService', () => {
  let service: GoalService;
  let goalRepository: Repository<Goal>;
  let userRepository: Repository<User>;
  let goalOnActivityRepository: Repository<GoalOnActivity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalService,
        {
          provide: getRepositoryToken(Goal),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(GoalOnActivity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GoalService>(GoalService);
    goalRepository = module.get<Repository<Goal>>(getRepositoryToken(Goal));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    goalOnActivityRepository = module.get<Repository<GoalOnActivity>>(
      getRepositoryToken(GoalOnActivity),
    );
  });

  it('should create a goal with valid input and return BaseResponse', async () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: [],
      activities: [],
      goals: [],
    };
    const mockGoal: Goal = {
      id: 1,
      name: 'Valid Goal',
      startedTime: new Date(),
      endedTime: new Date('2024-08-31T23:59:59Z'),
      status: GoalStatus.NOT_COMPLETED,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: mockUser, // Mock or create as needed
      goalOnActivities: [new GoalOnActivity()], // Mock or create as needed
    };

    jest.spyOn(goalRepository, 'save').mockResolvedValue(mockGoal);
    jest.spyOn(goalRepository, 'create').mockReturnValue(mockGoal);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser); // Mock user exists

    const dto: CreateGoalDto = {
      name: 'Valid Goal',
      startedTime: now.toISOString(),
      endedTime: oneHourLater.toISOString(),
    };

    const result: BaseResponse = await service.create(dto, 1);
    console.log(result);
    expect(result).toBeDefined();
    expect(result.isSuccess).toEqual(true);
    expect(result.message).toEqual(SuccessMessage.CREATE_DATA_SUCCESS);
    expect(result.data).toEqual(mockGoal);
  });

  it('should return an error if name is empty', async () => {
    const userId = 1;
    const mockUser: User = {
      id: userId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: [],
      activities: [],
      goals: [],
    };

    const result: BaseResponse = await service.create(
      {
        name: '', // Empty name
        startedTime: new Date().toISOString(), // Valid date
        endedTime: new Date().toISOString(), // Valid date
      },
      1,
    );
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    expect(result).toBeDefined();
    expect(result.isSuccess).toBe(false);
    expect(result.data).toEqual(null);
    expect(result.message).toContain(`Name ${ErrorMessage.IS_REQUIRED}`);
  });

  // Test Case for Invalid StartedTime
  it('should return an error if startedTime is invalid', async () => {
    const userId = 1;
    const mockUser: User = {
      id: userId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: [],
      activities: [],
      goals: [],
    };

    const result: BaseResponse = await service.create(
      {
        name: 'Test Event', // Valid name
        startedTime: null, // Invalid startedTime
        endedTime: new Date().toISOString(), // Valid endedTime
      },
      userId,
    );
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    expect(result).toBeDefined();
    expect(result.isSuccess).toBe(false);
    expect(result.data).toEqual(null);
    expect(result.message).toContain(`StartedTime ${ErrorMessage.IS_REQUIRED}`);
  });

  // Test Case for Invalid EndedTime
  it('should return an error if endedTime is invalid', async () => {
    const userId = 1;
    const mockUser: User = {
      id: userId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: [],
      activities: [],
      goals: [],
    };

    const result: BaseResponse = await service.create(
      {
        name: 'Test Event', // Valid name
        startedTime: new Date().toISOString(), // Valid startedTime
        endedTime: null, // Invalid endedTime
      },
      userId,
    );
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    expect(result).toBeDefined();
    expect(result.isSuccess).toBe(false);
    expect(result.data).toEqual(null);
    expect(result.message).toContain(`EndTime ${ErrorMessage.IS_REQUIRED}`);
  });

  // Test Case for Invalid UserId
  it('should return an error if userId is invalid', async () => {
    const result: BaseResponse = await service.create(
      {
        name: 'Test Event', // Valid name
        startedTime: '2200-08-27T04:13:17.250Z', // Valid startedTime
        endedTime: '2200-08-31T04:13:17.250Z', // Valid endedTime
      },
      null,
    );

    expect(result).toBeDefined();
    expect(result.isSuccess).toBe(false);
    expect(result.data).toEqual(null);

    expect(result.message).toEqual(`${ErrorMessage.USER_NOT_FOUND}`);
  });

  it('should return an error if user is not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // Simulate user not found

    const result: BaseResponse = await service.create(
      {
        name: 'Goal with Nonexistent User',
        startedTime: now.toISOString(), // Past date
        endedTime: oneHourLater.toISOString(),
      },
      9999,
    );

    expect(result).toBeDefined();
    expect(result.isSuccess).toBe(false);
    expect(result.data).toEqual(null);

    expect(result.message).toBe(ErrorMessage.USER_NOT_FOUND);
  });

  it('should get all goals by user successfully', async () => {
    const userId = 1;
    const mockUser: User = {
      id: userId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: [],
      activities: [],
      goals: [],
    };
    const mockGoals: Goal[] = [
      {
        id: 1,
        name: 'Goal 1',
        startedTime: new Date('2024-08-01T00:00:00Z'),
        endedTime: new Date('2024-08-31T23:59:59Z'),
        status: GoalStatus.NOT_COMPLETED,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: new User(), // Mock or create as needed
        goalOnActivities: [
          {
            id: 1,
            goalId: 1,
            activityId: 1,
            totalSpend: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
            activity: {
              id: 1,
              name: 'Activity 1',
              userId: 1,
              startedAt: new Date(),
              endedAt: new Date(),
              status: 'COMPLETED', // Status of the activity
              createdAt: new Date(),
              updatedAt: new Date(),
            } as Activity,
            goal: null,
          } as GoalOnActivity,
        ],
      },
    ];

    // Mock the getPercentsCompleteByGoal method
    jest
      .spyOn(service, 'getPercentsCompleteByGoal')
      .mockImplementation(async (goalId: number) => ({
        data: 100, // Mocked percentage completion
        isSuccess: true,
        message: SuccessMessage.GET_DATA_SUCCESS,
      }));

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(goalRepository, 'find').mockResolvedValue(mockGoals);

    const result = await service.findAllByUserId(userId);

    // Expected result with percentComplete added to mockGoals
    const expectedResult = {
      data: [
        {
          ...mockGoals[0],
          percentComplete: 100, // The mocked result from getPercentsCompleteByGoal
        },
      ],
      isSuccess: true,
      message: SuccessMessage.GET_DATA_SUCCESS,
    };

    expect(result).toBeDefined();
    expect(result.isSuccess).toEqual(true);
    expect(result.message).toEqual(SuccessMessage.GET_DATA_SUCCESS);
    expect(result.data).toEqual(expectedResult.data);
  });
  it('should return with data is null if no goals are found', async () => {
    const userId = 1;
    const mockUser: User = {
      id: userId,
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: [],
      activities: [],
      goals: [],
    };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(goalRepository, 'find').mockResolvedValue(null);
    const result = await service.findAllByUserId(userId);
    expect(result).toBeDefined();
    expect(result.isSuccess).toEqual(false);
    expect(result.message).toEqual(ErrorMessage.GOAL_NOT_FOUND);
    expect(result.data).toEqual(null);
  });

  it('should return with data is null if user not found', async () => {
    const userId = 9999; // User ID that does not exist
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // Simulate user not found
    const result = await service.findAllByUserId(userId);
    expect(result).toBeDefined();
    expect(result.isSuccess).toEqual(false);
    expect(result.message).toEqual(ErrorMessage.USER_NOT_FOUND);
    expect(result.data).toEqual(null);
  });

  describe('Goal analysis', () => {
    it('should return error if goal is not found', async () => {
      jest.spyOn(goalRepository, 'findOne').mockResolvedValue(null);

      const result = await service.getPercentsCompleteByGoal(1);
      expect(result).toBeDefined();
      expect(result.message).toEqual(ErrorMessage.GOAL_NOT_FOUND);
    });

    it('should return percent completed when activities are present', async () => {
      const mockGoal: Goal = {
        id: 1,
        name: 'Test Goal',
        startedTime: new Date('2024-08-01T00:00:00Z'),
        endedTime: new Date('2024-08-31T23:59:59Z'),
        status: 'NOT_COMPLETED',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: new User(),
        goalOnActivities: [],
      };

      const mockGoalOnActivities: GoalOnActivity[] = [
        {
          id: 1,
          goalId: 1,
          activityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          activity: {
            id: 1,
            name: 'Activity 1',
            userId: 1,
            startedAt: new Date(),
            endedAt: new Date(),
            status: 'COMPLETED',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Activity,
          goal: mockGoal,
        },
        {
          id: 2,
          goalId: 1,
          activityId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          activity: {
            id: 2,
            name: 'Activity 2',
            userId: 1,
            startedAt: new Date(),
            endedAt: new Date(),
            status: 'NOT_COMPLETED',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Activity,
          goal: mockGoal,
        },
      ];

      jest.spyOn(goalRepository, 'findOne').mockResolvedValue(mockGoal);
      jest
        .spyOn(goalOnActivityRepository, 'find')
        .mockResolvedValue(mockGoalOnActivities);

      const result = await service.getPercentsCompleteByGoal(1);
      expect(result).toBeDefined();
      expect(result.data).toBe(50);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toBe(SuccessMessage.GET_DATA_SUCCESS);
    });

    it('should return 0% if there are no activities associated with the goal', async () => {
      const mockGoal: Goal = {
        id: 1,
        name: 'Test Goal',
        startedTime: new Date('2024-08-01T00:00:00Z'),
        endedTime: new Date('2024-08-31T23:59:59Z'),
        status: 'NOT_COMPLETED',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: new User(),
        goalOnActivities: [],
      };

      jest.spyOn(goalRepository, 'findOne').mockResolvedValue(mockGoal);
      jest.spyOn(goalOnActivityRepository, 'find').mockResolvedValue([]);

      const result = await service.getPercentsCompleteByGoal(1);
      expect(result).toBeDefined();
      expect(result.data).toBe(0);
      expect(result.isSuccess).toBe(true);
      expect(result.message).toBe(SuccessMessage.GET_DATA_SUCCESS);
    });
  });
});
