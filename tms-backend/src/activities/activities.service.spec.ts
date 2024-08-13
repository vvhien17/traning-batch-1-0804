import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './activities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';

const currentDate = new Date()
const mockActivities = [
  {
    id: 1, name: 'Activity 1', userId: 1, createdAt: currentDate, updatedAt: currentDate, startedAt: 1723532400000, endedAt: 1723539600000, description: 'test desc'
  },
  { id: 2, name: 'Activity 2', userId: 1, createdAt: currentDate, updatedAt: currentDate, startedAt: 1723532400000, endedAt: 1723539600000, description: 'test desc' },
];


describe('ActivitiesController', () => {
  let service: ActivitiesService;
  let activityRepository: Repository<Activity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivitiesService,
        {
          provide: getRepositoryToken(Activity),
          useValue: {
            find: jest.fn().mockResolvedValue(mockActivities),
          }
        },
      ],

    }).compile();
    service = module.get<ActivitiesService>(ActivitiesService);
    activityRepository = module.get<Repository<Activity>>(getRepositoryToken(Activity));
  });

  it('Activity service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user find all activity', () => {
    it('should return an array of activities for a specific user', async () => {
      const activities = await service.findAll(1);
      expect(activities).toEqual(mockActivities);
    });

    it('should return an empty array if the user has no activities', async () => {
      jest.spyOn(activityRepository, 'find').mockResolvedValue([]);
      const activities = await service.findAll(2);
      expect(activities).toEqual([]);
    });
  });
});