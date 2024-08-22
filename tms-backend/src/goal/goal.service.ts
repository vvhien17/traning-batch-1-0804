import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { BaseResponse } from '@/common/base-response/base-response.dto';
import { User } from '../user/entities/user.entity'; // Assuming you need to check user existence

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(User) // Inject User repository if you need to check user existence
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createGoalDto: {
    name: string;
    startedTime: Date;
    endedTime: Date;
    status: string;
    userId: number;
  }): Promise<BaseResponse> {
    const { name, startedTime, endedTime, status, userId } = createGoalDto;

    // Validate input fields
    if (!name || !startedTime || !endedTime || !status || !userId) {
      return {
        data: null,
        isSuccess: false,
        message: 'Validation failed: All fields are required.',
      };
    }

    // Check if user exists
    const userExists = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userExists) {
      return {
        data: null,
        isSuccess: false,
        message: 'User not found',
      };
    }

    try {
      const newGoal = this.goalRepository.create({
        name,
        startedTime,
        endedTime,
        status,
        userId,
      });

      const savedGoal = await this.goalRepository.save(newGoal);

      return {
        data: savedGoal,
        isSuccess: true,
        message: 'Goal created successfully',
      };
    } catch (error) {
      return {
        data: null,
        isSuccess: false,
        message: 'Error creating goal: ' + error.message,
      };
    }
  }

  async findAll() {
    // Implementation to return all goals
    return `This action returns all goals`;
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
