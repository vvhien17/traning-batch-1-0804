import { Test, TestingModule } from '@nestjs/testing';
import { GoalService } from './goal.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { User } from '../user/entities/user.entity';
import { GoalOnActivity } from '../goal-on-activity/entities/goal-on-activity.entity';

describe('GoalService', () => {
  let service: GoalService;
  let goalRepository: Repository<Goal>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalService,
        {
          provide: getRepositoryToken(Goal),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GoalService>(GoalService);
    goalRepository = module.get<Repository<Goal>>(getRepositoryToken(Goal));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a goal with valid input and return BaseResponse', async () => {
    const mockGoal: Goal = {
      id: 1,
      name: 'Valid Goal',
      startedTime: new Date('2024-08-01T00:00:00Z'),
      endedTime: new Date('2024-08-31T23:59:59Z'),
      status: 'active',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: new User(), // Mock or create as needed
      goalOnActivities: [new GoalOnActivity()], // Mock or create as needed
    };

    jest.spyOn(goalRepository, 'save').mockResolvedValue(mockGoal);
    jest.spyOn(goalRepository, 'create').mockReturnValue(mockGoal);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(new User()); // Mock user exists

    const result: BaseResponse = await service.create({
      name: 'Valid Goal',
      startedTime: new Date('2024-08-01T00:00:00Z'),
      endedTime: new Date('2024-08-31T23:59:59Z'),
      status: 'active',
      userId: 1,
    });

    expect(result).toBeDefined();
    expect(result.isSuccess).toBe(true);
    expect(result.message).toBe('Goal created successfully');
    expect(result.data).toEqual(mockGoal);
  });

  it('should return an error if required fields are empty', async () => {
    const result: BaseResponse = await service.create({
      name: '', // Empty name
      startedTime: null, // Invalid startedTime
      endedTime: null, // Invalid endedTime
      status: '', // Empty status
      userId: null, // Invalid userId
    });

    expect(result).toBeDefined();
    expect(result.isSuccess).toBe(false);
    expect(result.message).toContain('Validation failed');
  });

  it('should return an error if user is not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // Simulate user not found

    const result: BaseResponse = await service.create({
      name: 'Goal with Nonexistent User',
      startedTime: new Date(),
      endedTime: new Date(),
      status: 'active',
      userId: 9999, // User ID that does not exist
    });

    expect(result).toBeDefined();
    expect(result.isSuccess).toBe(false);
    expect(result.message).toBe('User not found');
  });
});
