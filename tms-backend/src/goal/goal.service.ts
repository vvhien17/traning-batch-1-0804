import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { User } from '../user/entities/user.entity'; // Assuming you need to check user existence
import { buildError } from '../common/utils/Utility';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalStatus } from '../common/constants/goal-status';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { getCustomErrorMessage } from '../common/utils/custom-message-validator';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(User) // Inject User repository if you need to check user existence
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createGoalDto: CreateGoalDto,
    userId: number,
  ): Promise<BaseResponse> {
    const { name, startedTime, endedTime } = createGoalDto;
    const categoryDto = plainToInstance(CreateGoalDto, createGoalDto);
    const errors = await validate(categoryDto);
    if (errors.length > 0) {
      return buildError(getCustomErrorMessage(errors[0]));
    }
    const startDate = new Date(startedTime);
    const currentDate = new Date();
    if (startDate < currentDate) {
      return buildError(ErrorMessage.START_DATE_INVALID);
    }
    const userExists = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userExists) {
      return buildError(ErrorMessage.USER_NOT_FOUND);
    }
    console.log(userExists);
    try {
      const newGoal = this.goalRepository.create({
        name,
        startedTime,
        endedTime,
        status: GoalStatus.NOT_COMPLETED,
        userId,
      });

      const savedGoal = await this.goalRepository.save(newGoal);

      return {
        data: savedGoal,
        isSuccess: true,
        message: SuccessMessage.CREATE_DATA_SUCCESS,
      };
    } catch (error) {
      return {
        data: null,
        isSuccess: false,
        message: 'Error creating goal: ' + error.message,
      };
    }
  }

  async findAllByUserId(userId: number): Promise<BaseResponse> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return buildError(ErrorMessage.USER_NOT_FOUND);
      }
      const goals = await this.goalRepository.find({
        where: { userId },
        relations: ['goalOnActivities', 'goalOnActivities.activity'],
      });
      if (!goals) {
        return buildError(ErrorMessage.GOAL_NOT_FOUND);
      }
      return {
        data: goals,
        isSuccess: true,
        message: SuccessMessage.GET_DATA_SUCCESS,
      };
    } catch (error) {
      return {
        data: null,
        isSuccess: false,
        message: 'Error get goals: ' + error.message,
      };
    }
  }

  async findOne(id: number) {
    // Implementation to return a specific goal
    return `This action returns a #${id} goal`;
  }

  async update(id: number, updateGoalDto: any) {
    // Implementation to update a specific goal
    return `This action updates a #${id} goal`;
  }

  async remove(id: number) {
    // Implementation to remove a specific goal
    return `This action removes a #${id} goal`;
  }
}
