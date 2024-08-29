import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { Repository } from 'typeorm';
import { Activity } from '../activity/entities/activity.entity';
import { Category } from '../category/entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { buildError } from '../common/utils/Utility';
import { ActivityStatus } from '../common/constants/activity-status';

describe('DashboardService', () => {
  let service: DashboardService;
  let activityRepository: Repository<Activity>;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Activity),
          useClass: Repository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    activityRepository = module.get<Repository<Activity>>(
      getRepositoryToken(Activity),
    );
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategoryTimePercentages', () => {
    it('should calculate category time percentages for a specific user', async () => {
      const userId = 1;
      const activities = [
        {
          id: 1,
          startedAt: new Date('2024-08-01T10:00:00Z'),
          endedAt: new Date('2024-08-01T12:00:00Z'),
          category: { id: 1, name: 'Work' },
          userId: 1,
          realSpendTime: 2,
        },
        {
          id: 2,
          startedAt: new Date('2024-08-01T13:00:00Z'),
          endedAt: new Date('2024-08-01T14:00:00Z'),
          category: { id: 1, name: 'Work' },
          userId: 1,
          realSpendTime: 1,
        },
        {
          id: 3,
          startedAt: new Date('2024-08-01T14:00:00Z'),
          endedAt: new Date('2024-08-01T15:00:00Z'),
          category: { id: 2, name: 'Exercise' },
          userId: 1,
          realSpendTime: 1,
        },
      ];

      jest
        .spyOn(activityRepository, 'find')
        .mockResolvedValue(activities as Activity[]);

      const result = await service.getCategoryTimePercentages(userId);
      expect(result.isSuccess).toEqual(true);
      expect(result.message).toEqual(SuccessMessage.GET_DATA_SUCCESS);
      expect(result.data).toEqual([
        { categoryId: 1, name: 'Work', percentage: 75 },
        { categoryId: 2, name: 'Exercise', percentage: 25 },
      ]);
    });

    it('should return an error if all the activities is lack of categoryId', async () => {
      const userId = 1;
      const activities = [];
      jest
        .spyOn(activityRepository, 'find')
        .mockResolvedValue(activities as Activity[]);
      const result = await service.getCategoryTimePercentages(userId);
      expect(result).toEqual(buildError(ErrorMessage.ACTIVITY_NOT_FOUND));
    });

    describe('getSummaryTime', () => {
      it('should return the total time spent on completed activities for today', async () => {
        const userId = 1;
        const now = new Date();
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        const endOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          0,
          0,
          0,
          -1,
        );

        const activities = [
          {
            userId,
            status: ActivityStatus.COMPLETED,
            startedAt: startOfDay,
            endedAt: new Date(startOfDay.getTime() + 60 * 60 * 1000), // 1 hour
            realSpendTime: 1,
          },
        ];

        jest
          .spyOn(activityRepository, 'find')
          .mockResolvedValue(activities as Activity[]);

        const result = await service.getSummaryTime(userId, 'day');

        expect(result).toEqual({
          data: {
            totalHours: 0,
            totalMinutes: 1,
          },
          isSuccess: true,
          message: SuccessMessage.GET_DATA_SUCCESS,
        });
      });

      it('should return the total time spent on completed activities for this week', async () => {
        const userId = 1;
        const now = new Date();
        const startOfWeek = now.getDate() - now.getDay(); // Assuming Sunday as the start of the week
        const startOfPeriod = new Date(
          now.getFullYear(),
          now.getMonth(),
          startOfWeek,
        );
        const endOfPeriod = new Date(
          now.getFullYear(),
          now.getMonth(),
          startOfWeek + 7,
          0,
          0,
          0,
          -1,
        );

        const activities = [
          {
            userId,
            status: ActivityStatus.COMPLETED,
            startedAt: startOfPeriod,
            endedAt: new Date(startOfPeriod.getTime() + 60 * 60 * 1000), // 1 hour
            realSpendTime: 1,
          },
        ];

        jest
          .spyOn(activityRepository, 'find')
          .mockResolvedValue(activities as Activity[]);

        const result = await service.getSummaryTime(userId, 'week');

        expect(result).toEqual({
          data: {
            totalHours: 0,
            totalMinutes: 1,
          },
          isSuccess: true,
          message: SuccessMessage.GET_DATA_SUCCESS,
        });
      });

      it('should return an error for an invalid option', async () => {
        const userId = 1;

        const result = await service.getSummaryTime(userId, 'INVALID_OPTION');

        expect(result).toEqual(buildError('Invalid option'));
      });

      // it('should return an error if userId is missing', async () => {
      //   const userId = undefined;
      //   const option = 'day';
      //   const result = await service.getSummaryTime(userId, option);
      //   expect(result).toEqual(buildError(ErrorMessage.USER_NOT_FOUND));
      // });

      it('should return an error if the user does not have any completed activities', async () => {
        const userId = 1;
        const now = new Date();
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        const endOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          0,
          0,
          0,
          -1,
        );
        const activities = [];
        jest
          .spyOn(activityRepository, 'find')
          .mockResolvedValue(activities as Activity[]);
        const result = await service.getSummaryTime(userId, 'day');
        expect(result).toEqual(buildError(ErrorMessage.ACTIVITY_NOT_FOUND));
      });
    });
  });
});
