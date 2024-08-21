import { Module } from '@nestjs/common';
import { GoalOnActivityService } from './goal-on-activity.service';

@Module({
  providers: [GoalOnActivityService],
})
export class GoalOnActivityModule {}
