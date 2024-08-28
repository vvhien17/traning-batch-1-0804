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
      console.log('invalidActivityas as');
      return buildError(ErrorMessage.ACTIVITY_INPUT_INVALID);
    }

    const goalMaps = createGoalOnActivityDto.activityIds.map((id) => ({
      goalId: createGoalOnActivityDto.goalId,
      activityId: id,
    }));
    const goalOnActivity = await this.goalOnActivityRepository.create(goalMaps);
    const saveGoalOnActivity =
      await this.goalOnActivityRepository.save(goalOnActivity);

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
        category: {
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

  remove(id: number) {
    return `This action removes a #${id} goalOnActivity`;
  }
}
