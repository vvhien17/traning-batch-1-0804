import { Test, TestingModule } from '@nestjs/testing';
import { GoalOnActivityService } from './goal-on-activity.service';

describe('GoalOnActivityService', () => {
  let service: GoalOnActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalOnActivityService],
    }).compile();

    service = module.get<GoalOnActivityService>(GoalOnActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
