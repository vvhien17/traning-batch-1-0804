import { Injectable } from '@nestjs/common';
import { CreateGoalOnActivityDto } from './dto/create-goal-on-activity.dto';
import { UpdateGoalOnActivityDto } from './dto/update-goal-on-activity.dto';

@Injectable()
export class GoalOnActivityService {
  create(createGoalOnActivityDto: CreateGoalOnActivityDto) {
    return 'This action adds a new goalOnActivity';
  }

  findAll() {
    return `This action returns all goalOnActivity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} goalOnActivity`;
  }

  update(id: number, updateGoalOnActivityDto: UpdateGoalOnActivityDto) {
    return `This action updates a #${id} goalOnActivity`;
  }

  remove(id: number) {
    return `This action removes a #${id} goalOnActivity`;
  }
}
