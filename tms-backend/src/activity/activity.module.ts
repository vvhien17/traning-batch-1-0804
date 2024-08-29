import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { Goal } from '../goal/entities/goal.entity';
import { GoalOnActivity } from '@/goal-on-activity/entities/goal-on-activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, User, Category, Goal, GoalOnActivity]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
