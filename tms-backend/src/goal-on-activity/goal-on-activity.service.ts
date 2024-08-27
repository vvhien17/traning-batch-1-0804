import { Injectable } from '@nestjs/common';
import { CreateGoalOnActivityDto } from './dto/create-goal-on-activity.dto';
import { UpdateGoalOnActivityDto } from './dto/update-goal-on-activity.dto';
import { plainToInstance } from 'class-transformer';
import { buildError } from '../common/utils/Utility';
import { getCustomErrorMessage } from '../common/utils/custom-message-validator';
import { validate } from 'class-validator';
import { GoalOnActivity } from './entities/goal-on-activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../activity/entities/activity.entity';
import { Repository } from 'typeorm';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { Goal } from '../goal/entities/goal.entity';

@Injectable()
export class GoalOnActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(GoalOnActivity)
    private readonly goalOnActivityRepository: Repository<GoalOnActivity>,
  ) {}
  async create(
    userId: number,
    createGoalOnActivityDto: CreateGoalOnActivityDto,
  ) {
    const goalOnActivityDto = plainToInstance(
      CreateGoalOnActivityDto,
      createGoalOnActivityDto,
    );
    const errors = await validate(goalOnActivityDto);

    if (errors.length) {
      return buildError(getCustomErrorMessage(errors[0]));
    }
    const existGoal = await this.goalRepository.findOne({
      where: {
        id: createGoalOnActivityDto.goalId,
        userId: userId,
      },
    });

    if (!existGoal) {
      return buildError(ErrorMessage.GOAL_NOT_FOUND);
    }
    const activityDto = { ...goalOnActivityDto };
    delete activityDto.goalId;

    const activity = this.activityRepository.create({
      userId: userId,
      ...activityDto,
    });
    const saveActivity = await this.activityRepository.save(activity);

    if (!saveActivity) {
      return {
        data: null,
        isSuccess: false,
        message: ErrorMessage.BAD_REQUEST,
      };
    }
    const goalOnActivity = this.goalOnActivityRepository.create({
      goalId: createGoalOnActivityDto.goalId,
      activityId: saveActivity.id,
    });

    return {
      data: goalOnActivity,
      isSuccess: true,
      message: SuccessMessage.CREATE_DATA_SUCCESS,
    };
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
