import { Module } from '@nestjs/common';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, User])],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
