import { Test, TestingModule } from '@nestjs/testing';
import { GoalOnActivityController } from './goal-on-activity.controller';

describe('GoalOnActivityController', () => {
  let controller: GoalOnActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalOnActivityController],
    }).compile();

    controller = module.get<GoalOnActivityController>(GoalOnActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
