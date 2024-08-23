import { Module } from '@nestjs/common';
import { GoalOnActivityService } from './goal-on-activity.service';
import { GoalOnActivityController } from './goal-on-activity.controller';
import { GoalOnActivity } from './entities/goal-on-activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GoalOnActivity])],
  controllers: [GoalOnActivityController],
  providers: [GoalOnActivityService],
})
export class GoalOnActivityModule {}
