import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './activities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessage } from '../common/utils/message-const';

const currentDate = new Date()
const mockActivities = [
  {
    id: 1, name: 'Activity 1', userId: 1, createdAt: currentDate, updatedAt: currentDate, startedAt: currentDate, endedAt: currentDate, description: 'test desc'
  },
  { id: 2, name: 'Activity 2', userId: 1, createdAt: currentDate, updatedAt: currentDate, startedAt: currentDate, endedAt: currentDate, description: 'test desc' },
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
            findOne: jest.fn(),
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
      jest.spyOn(activityRepository, 'find').mockResolvedValue(mockActivities as Activity[]);
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
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(mockActivities[0] as Activity);
      const activity = await service.findOne(1, 1);
      expect(activity.data).toEqual(mockActivities[0]);
    });

    it("should return message not found if the user does not exist", async () => {
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1, 2)).rejects.toThrow(new BadRequestException(ErrorMessage.ACTIVITY_NOT_FOUND));
    });

    it('should return message not found if the activity does not exist', async () => {
      jest.spyOn(activityRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(3, 1)).rejects.toThrow(new BadRequestException(ErrorMessage.ACTIVITY_NOT_FOUND));
    })

  })
});