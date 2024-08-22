import { Test, TestingModule } from '@nestjs/testing';
import { GoalOnActivityController } from './goal-on-activity.controller';
import { GoalOnActivityService } from './goal-on-activity.service';

describe('GoalOnActivityController', () => {
  let controller: GoalOnActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalOnActivityController],
      providers: [GoalOnActivityService],
    }).compile();

    controller = module.get<GoalOnActivityController>(GoalOnActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
