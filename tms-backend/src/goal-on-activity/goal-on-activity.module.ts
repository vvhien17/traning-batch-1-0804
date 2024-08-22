import { Module } from '@nestjs/common';
import { GoalOnActivityService } from './goal-on-activity.service';
import { GoalOnActivityController } from './goal-on-activity.controller';

@Module({
  controllers: [GoalOnActivityController],
  providers: [GoalOnActivityService],
})
export class GoalOnActivityModule {}
