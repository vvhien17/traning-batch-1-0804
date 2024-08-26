import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { buildError } from '../common/utils/Utility';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { User } from '../user/entities/user.entity';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { getCustomErrorMessage } from '../common/utils/custom-message-validator';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async findAll(userId: number) {
    const result = await this.activityRepository.find({
      where: { userId: userId },
    });
    return {
      data: result,
      isSuccess: true,
      message: SuccessMessage.GET_DATA_SUCCESS,
    };
  }

  async findOne(id: number, userId: number) {
    const result = await this.activityRepository.findOne({
      where: { id: id, userId: userId },
      relations: {
        category: false,
        user: false,
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

  async update(updateActivityDto: UpdateActivityDto): Promise<BaseResponse> {
    const activityDto = plainToInstance(UpdateActivityDto, updateActivityDto);
    const errors = await validate(activityDto);
    if (errors.length) {
      return buildError(getCustomErrorMessage(errors[0]));
    }
    const checkActivity = await this.activityRepository.findOne({
      where: { id: updateActivityDto.id },
    });

    if (checkActivity) {
      if (updateActivityDto.startedAt || updateActivityDto.endedAt) {
        if (updateActivityDto.startedAt && updateActivityDto.endedAt) {
          if (updateActivityDto.endedAt <= updateActivityDto.startedAt) {
            return buildError(
              `StartedAt ${ErrorMessage.MUST_GREATER_THAN} EndedAt`,
            );
          }
        } else if (updateActivityDto.endedAt) {
          if (updateActivityDto.endedAt >= checkActivity.startedAt) {
            return buildError(
              `StartedAt ${ErrorMessage.MUST_GREATER_THAN} EndedAt`,
            );
          }
        } else if (updateActivityDto.startedAt) {
          if (updateActivityDto.startedAt <= checkActivity.endedAt) {
            return buildError(
              `StartedAt ${ErrorMessage.MUST_GREATER_THAN} EndedAt`,
            );
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
    });
    Object.assign(activity, updateActivityDto);
    const result = await this.activityRepository.save(activity);
    return {
      data: result,
      isSuccess: true,
      message: SuccessMessage.UPDATE_DATA_SUCCESS,
    };
  }
  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
