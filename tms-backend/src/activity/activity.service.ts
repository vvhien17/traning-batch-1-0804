import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { buildError } from '../common/utils/Utility';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { User } from '../user/entities/user.entity';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { getCustomErrorMessage } from '../common/utils/custom-message-validator';
import { Category } from '../category/entities/category.entity';
import { Goal } from '../goal/entities/goal.entity';
import { ActivityStatus } from '../common/constants/activity-status';
import { GoalOnActivity } from '../goal-on-activity/entities/goal-on-activity.entity';
import { GoalStatus } from '../common/constants/goal-status';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(GoalOnActivity)
    private readonly goalOnActivityRepository: Repository<GoalOnActivity>,
  ) {}

  async create(
    userId: number,
    createActivityDto: CreateActivityDto,
  ): Promise<BaseResponse> {
    const { name, startedAt, endedAt, description, categoryId } =
      createActivityDto;
    const activityDto = plainToInstance(CreateActivityDto, createActivityDto);
    const errors = await validate(activityDto);
    if (errors.length) {
      return buildError(getCustomErrorMessage(errors[0]));
    }

    if (createActivityDto.categoryId) {
      const checkCategory = await this.categoryRepository.findOne({
        where: { id: createActivityDto.categoryId, userId: userId },
      });
      if (!checkCategory) {
        return buildError(ErrorMessage.CATEGORY_NOT_FOUND);
      }
    }

    if (startedAt >= endedAt) {
      return buildError(ErrorMessage.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return buildError(ErrorMessage.USER_NOT_FOUND);
    }
    const activity = this.activityRepository.create({
      name,
      startedAt,
      endedAt,
      description,
      userId,
      categoryId,
    });
    const saveActivity = await this.activityRepository.save(activity);
    return {
      data: saveActivity,
      isSuccess: true,
      message: SuccessMessage.CREATE_DATA_SUCCESS,
    };
  }

  async findAll(userId: number, categoryIds?: number[]) {
    const defaultFilter: any = { userId: userId, isDelete: false };
    if (categoryIds && categoryIds.length > 0) {
      defaultFilter.categoryId = In(categoryIds);
    }
    const result = await this.activityRepository.find({
      where: {
        ...defaultFilter,
      },
      relations: ['category'],
      select: {
        category: {
          name: true,
        },
      },
    });

    return {
      data: result,
      isSuccess: true,
      message: SuccessMessage.GET_DATA_SUCCESS,
    };
  }

  async findOne(id: number, userId: number) {
    const result = await this.activityRepository.findOne({
      where: { id: id, userId: userId, isDelete: false },
      relations: ['category'],
      select: {
        category: {
          name: true,
        },
      },
    });
    if (!result) {
      throw new BadRequestException(ErrorMessage.ACTIVITY_NOT_FOUND);
    }
    return {
      data: result,
      isSuccess: true,
      message: SuccessMessage.GET_DATA_SUCCESS,
    };
  }
  async findCanAddToGoal(goalId: number, userId: number) {
    const existGoal = await this.goalRepository.findOne({
      where: { id: goalId, userId },
    });
    if (!existGoal) {
      return buildError(ErrorMessage.GOAL_NOT_FOUND);
    }
    const data = await this.activityRepository.find({
      where: {
        userId,
        isDelete: false,
        startedAt: Between(existGoal.startedTime, existGoal.endedTime),
        endedAt: Between(existGoal.startedTime, existGoal.endedTime),
      },
      relations: ['goalOnActivities'],
      select: {
        goalOnActivities: {
          goalId: true,
        },
      },
    });

    const activities = data.filter((activity) => {
      return !activity.goalOnActivities.some(
        (goalOnActivity) => goalOnActivity.goalId === goalId,
      );
    });

    return {
      data: activities,
      isSuccess: true,
      message: SuccessMessage.CREATE_DATA_SUCCESS,
    };
  }

  async update(
    userId: number,
    updateActivityDto: UpdateActivityDto,
  ): Promise<BaseResponse> {
    const activityDto = plainToInstance(UpdateActivityDto, updateActivityDto);
    const errors = await validate(activityDto);
    if (errors.length) {
      return buildError(getCustomErrorMessage(errors[0]));
    }
    if (updateActivityDto.categoryId) {
      const checkCategory = await this.categoryRepository.findOne({
        where: { id: updateActivityDto.categoryId, userId: userId },
      });
      if (!checkCategory) {
        return buildError(ErrorMessage.CATEGORY_NOT_FOUND);
      }
    }
    const checkActivity = await this.activityRepository.findOne({
      where: { id: updateActivityDto.id, userId: userId },
    });

    if (checkActivity) {
      if (updateActivityDto.startedAt || updateActivityDto.endedAt) {
        if (updateActivityDto.startedAt && updateActivityDto.endedAt) {
          if (updateActivityDto.endedAt <= updateActivityDto.startedAt) {
            return buildError(`StartedAt ${ErrorMessage.MUST_BEFORE} EndedAt`);
          }
        } else if (updateActivityDto.endedAt) {
          if (updateActivityDto.endedAt >= checkActivity.startedAt) {
            return buildError(`StartedAt ${ErrorMessage.MUST_BEFORE} EndedAt`);
          }
        } else if (updateActivityDto.startedAt) {
          if (updateActivityDto.startedAt <= checkActivity.endedAt) {
            return buildError(`StartedAt ${ErrorMessage.MUST_BEFORE} EndedAt`);
          }
        }
      }
      return await this.performChanges(updateActivityDto);
    } else {
      return buildError(ErrorMessage.ACTIVITY_NOT_FOUND);
    }
  }

  private async performChanges(
    updateActivityDto: UpdateActivityDto,
  ): Promise<BaseResponse> {
    const activity = await this.activityRepository.findOne({
      where: { id: updateActivityDto.id },
      relations: ['goalOnActivities'],
      select: {
        goalOnActivities: {
          goalId: true,
        },
      },
    });
    //for each goal,  if ( all has been complete and that is the last one => will return complete)
    if (
      updateActivityDto.status &&
      updateActivityDto.status === ActivityStatus.COMPLETED
    ) {
      if (activity.goalOnActivities && activity.goalOnActivities.length > 0) {
        const goalIds = activity.goalOnActivities.map((i) => i.goalId);
        console.log(goalIds);
        for (let i = 0; i < goalIds.length; i++) {
          const goalId = goalIds[i];
          const activities = await this.goalOnActivityRepository
            .createQueryBuilder('goalOnActivity')
            .innerJoinAndSelect('goalOnActivity.activity', 'activity')
            .where('goalOnActivity.goalId = :goalId', { goalId })
            .andWhere('activity.isDelete = :isDelete', { isDelete: false })
            .select('activity.status', 'status')
            .addSelect('COUNT(activity.id)', 'count')
            .groupBy('activity.status')
            .getRawMany();
          console.log(activities, 'this is result ');
          const finalNotCompleted = activities.some(
            (activity) =>
              activity.status === 'NOT_COMPLETED' &&
              (activity.count === 1 || activity.count === '1'),
          );

          if (finalNotCompleted) {
            console.log('come to update goal');
            await this.goalRepository.save({
              id: goalId,
              status: GoalStatus.COMPLETED,
            });
          }
        }
      }
    }
    delete activity.goalOnActivities;
    Object.assign(activity, updateActivityDto);
    const result = await this.activityRepository.save(activity);

    return {
      data: result,
      isSuccess: true,
      message: SuccessMessage.UPDATE_DATA_SUCCESS,
    };
  }

  async delete(id: number, userId: number) {
    const checkActivity = await this.activityRepository.findOne({
      where: { id: id, userId: userId },
      relations: ['goalOnActivities'],
      select: {
        goalOnActivities: {
          goalId: true,
        },
      },
    });

    if (!checkActivity) {
      return buildError(ErrorMessage.ACTIVITY_NOT_FOUND);
    }
    if (
      checkActivity.goalOnActivities &&
      checkActivity.goalOnActivities.length > 0
    ) {
      const goalIds = checkActivity.goalOnActivities.map((i) => i.goalId);
      await this.goalOnActivityRepository.delete({
        goalId: In(goalIds),
        activityId: checkActivity.id,
      });
    }

    checkActivity.isDelete = true;
    await this.activityRepository.save(checkActivity);
    return {
      data: {
        id: checkActivity.id,
        isDelete: true,
      },
      isSuccess: true,
      message: SuccessMessage.DELETE_DATA_SUCCESS,
    };
  }
}
