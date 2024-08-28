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
    const activityDto = { ...goalOnActivityDto };
    delete activityDto.goalId;
    if (errors.length) {
      return buildError(getCustomErrorMessage(errors[0]));
    }
    const existGoal = await this.goalRepository.findOne({
      where: {
        id: createGoalOnActivityDto.goalId,
        userId: userId,
      },
    });
    if (new Date(activityDto.startedAt) >= new Date(activityDto.endedAt)) {
      return buildError(ErrorMessage.START_DATE_INVALID);
    }

    if (!existGoal) {
      return buildError(ErrorMessage.GOAL_NOT_FOUND);
    } else {
      if (
        new Date(activityDto.startedAt) < new Date(existGoal.startedTime) ||
        new Date(activityDto.startedAt) > new Date(existGoal.endedTime) ||
        new Date(activityDto.endedAt) < new Date(existGoal.startedTime) ||
        new Date(activityDto.endedAt) > new Date(existGoal.endedTime)
      ) {
        return buildError(ErrorMessage.ACTIVITY_NOT_IN_GOAL_TIME);
      }
    }

    const activity = this.activityRepository.create({
      userId: userId,
      ...activityDto,
    });
    const saveActivity = await this.activityRepository.save(activity);

    console.log(
      'saveActivity',
      existGoal,

      'saveActivity',
      saveActivity,
    );
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
    const saveGoalOnActivity =
      await this.goalOnActivityRepository.save(goalOnActivity);

    return {
      data: saveGoalOnActivity,
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
