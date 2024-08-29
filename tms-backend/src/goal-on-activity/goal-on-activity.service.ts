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
import { Between, In, Repository } from 'typeorm';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { Goal } from '../goal/entities/goal.entity';
import { DeleteGoalOnActivityDto } from './dto/delete-goal-on-activity.dto';
import { GoalStatus } from '../common/constants/goal-status';

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
    const validActivity = await this.activityRepository.find({
      where: {
        id: In(createGoalOnActivityDto.activityIds),
        userId: userId,
        isDelete: false,
        startedAt: Between(existGoal.startedTime, existGoal.endedTime),
        endedAt: Between(existGoal.startedTime, existGoal.endedTime),
      },
    });

    if (validActivity.length !== createGoalOnActivityDto.activityIds.length) {
      return buildError(ErrorMessage.ACTIVITY_INPUT_INVALID);
    }

    const activityMaps = createGoalOnActivityDto.activityIds.map((id) => ({
      goalId: createGoalOnActivityDto.goalId,
      activityId: id,
    }));
    const goalOnActivity =
      await this.goalOnActivityRepository.create(activityMaps);
    const saveGoalOnActivity =
      await this.goalOnActivityRepository.save(goalOnActivity);
    await this.goalRepository.save({
      id: existGoal.id,
      status: GoalStatus.NOT_COMPLETED,
    });
    return {
      data: saveGoalOnActivity,
      isSuccess: true,
      message: SuccessMessage.CREATE_DATA_SUCCESS,
    };
  }

  async findAll(userId: number, goalId: number) {
    const result = await this.goalRepository.find({
      where: {
        id: goalId,
        userId,
      },
      relations: ['goalOnActivities', 'goalOnActivities.activity'],
    });

    if (!result.length) {
      return buildError(ErrorMessage.GOAL_NOT_FOUND);
    }
    let data = [];
    const goalOnActivities = result[0].goalOnActivities;
    if (goalOnActivities.length > 0) {
      data = goalOnActivities.map((goalOnActivity) => ({
        ...goalOnActivity.activity,
        goal: {
          name: result[0].name,
        },
      }));
    }

    return {
      data: data,
      isSuccess: true,
      message: SuccessMessage.GET_DATA_SUCCESS,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} goalOnActivity`;
  }

  update(id: number, updateGoalOnActivityDto: UpdateGoalOnActivityDto) {
    return `This action updates a #${id} goalOnActivity`;
  }

  async delete(userId: number, deleteActivity: DeleteGoalOnActivityDto) {
    const goalOnActivityDto = plainToInstance(
      DeleteGoalOnActivityDto,
      deleteActivity,
    );
    const errors = await validate(goalOnActivityDto);

    if (errors.length) {
      return buildError(getCustomErrorMessage(errors[0]));
    }
    const existGoal = await this.goalRepository.findOne({
      where: {
        id: goalOnActivityDto.goalId,
        userId: userId,
      },
    });

    if (!existGoal) {
      return buildError(ErrorMessage.GOAL_NOT_FOUND);
    }
    const validActivity = await this.goalOnActivityRepository.find({
      where: {
        activityId: In(goalOnActivityDto.activityIds),
        goalId: goalOnActivityDto.goalId,
      },
    });

    if (validActivity.length !== goalOnActivityDto.activityIds.length) {
      return buildError(ErrorMessage.ACTIVITY_INPUT_INVALID);
    }
    const deletedData = await this.goalOnActivityRepository.delete({
      goalId: goalOnActivityDto.goalId,
      activityId: In(goalOnActivityDto.activityIds),
    });

    return {
      data: deletedData,
      isSuccess: true,
      message: SuccessMessage.DELETE_DATA_SUCCESS,
    };
  }
}
