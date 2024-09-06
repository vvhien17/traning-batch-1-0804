import { Module } from '@nestjs/common';
import { GoalOnActivityService } from './goal-on-activity.service';
import { GoalOnActivityController } from './goal-on-activity.controller';
import { GoalOnActivity } from './entities/goal-on-activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../activity/entities/activity.entity';
import { Goal } from '../goal/entities/goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoalOnActivity, Activity, Goal])],
  controllers: [GoalOnActivityController],
  providers: [GoalOnActivityService],
})
export class GoalOnActivityModule {}
