import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { Repository } from 'typeorm';
import { Activity } from '../activity/entities/activity.entity';
import { Category } from '../category/entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SuccessMessage } from '../common/utils/message-const';

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
        },
        {
          provide: getRepositoryToken(Activity),
          useClass: Repository,
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

  describe('should return data following percents of each category', () => {
    it('should calculate category time percentages for a specific user', async () => {
      const userId = 1;
      const activities = [
        {
          id: 1,
          startedAt: new Date('2024-08-01T10:00:00Z'),
          endedAt: new Date('2024-08-01T12:00:00Z'),
          category: { id: 1, name: 'Work' },
          userId: 1,
        },
        {
          id: 2,
          startedAt: new Date('2024-08-01T13:00:00Z'),
          endedAt: new Date('2024-08-01T14:00:00Z'),
          category: { id: 1, name: 'Work' },
          userId: 1,
        },
        {
          id: 3,
          startedAt: new Date('2024-08-01T14:00:00Z'),
          endedAt: new Date('2024-08-01T15:00:00Z'),
          category: { id: 2, name: 'Exercise' },
          userId: 1,
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
  });
});
