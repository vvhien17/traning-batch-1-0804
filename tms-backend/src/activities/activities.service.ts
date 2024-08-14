import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) { }

  create(createActivityDto: CreateActivityDto) {
    return 'This action adds a new activity';
  }

  async findAll(userId: number): Promise<Activity[]> {
    return await this.activityRepository.find({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    let result = await this.activityRepository.findOne({
      where: { id: id, userId: userId }, relations: {
        category: false,
        user: false
      }
    })
    if (result) {
      return result;
    } else {
      throw new BadRequestException("Not found");
    }
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
