import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { User } from '../user/entities/user.entity';
import { GoalController } from './goal.controller';
import { GoalOnActivity } from '@/goal-on-activity/entities/goal-on-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, User, GoalOnActivity])],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
