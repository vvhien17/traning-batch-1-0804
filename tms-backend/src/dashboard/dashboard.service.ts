import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Activity } from '..//activity/entities/activity.entity';
import { Repository } from 'typeorm';
import { ResponseDashboard } from './dto/response-dashboard.dto';
import { BaseResponse } from '@/common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async getCategoryTimePercentages(userId: number): Promise<BaseResponse> {
    const activities = await this.activityRepository.find({
      where: { userId },
      relations: ['category'],
    });

    const filteredActivities = activities.filter(
      (activity) => activity.category !== null,
    );

    if (filteredActivities.length === 0) {
      return buildError(ErrorMessage.ACTIVITY_NOT_FOUND);
    }

    const totalTime = filteredActivities.reduce((total, activity) => {
      const timeSpent =
        new Date(activity.endedAt).getTime() -
        new Date(activity.startedAt).getTime();
      return total + timeSpent;
    }, 0);

    // Aggregate time spent per category
    const categoryTimes = filteredActivities.reduce(
      (acc, activity) => {
        const timeSpent =
          new Date(activity.endedAt).getTime() -
          new Date(activity.startedAt).getTime();
        const categoryId = activity.category.id;
        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryId: categoryId,
            totalTime: 0,
            name: activity.category.name,
          };
        }
        acc[categoryId].totalTime += timeSpent;
        return acc;
      },
      {} as Record<
        number,
        { categoryId: number; totalTime: number; name: string }
      >,
    );

    console.log('categoryTimes', categoryTimes);

    const result: ResponseDashboard[] = Object.values(categoryTimes).map(
      (categoryTime) => ({
        categoryId: categoryTime.categoryId,
        name: categoryTime.name,
        percentage: (categoryTime.totalTime / totalTime) * 100,
      }),
    );

    return {
      data: result,
      isSuccess: true,
      message: SuccessMessage.GET_DATA_SUCCESS,
    };
  }
}
