import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Activity } from '..//activity/entities/activity.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { ResponseDashboard } from './dto/response-dashboard.dto';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { ActivityStatus } from '../common/constants/activity-status';

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
      where: { userId, categoryId: Not(IsNull()) },
      relations: ['category'],
    });

    if (activities.length === 0) {
      return buildError(ErrorMessage.ACTIVITY_NOT_FOUND);
    }

    const totalTime = activities.reduce((total, activity) => {
      const timeSpent = activity.realSpendTime;

      return total + timeSpent;
    }, 0);

    // Aggregate time spent per category
    const categoryTimes = activities.reduce(
      (acc, activity) => {
        const timeSpent = activity.realSpendTime;
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
  async getSummaryTime(userId: number, option: string): Promise<BaseResponse> {
    const now = new Date();

    let startOfPeriod: Date;
    let endOfPeriod: Date;

    switch (option) {
      case 'day':
        // For daily summary
        startOfPeriod = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        endOfPeriod = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          0,
          0,
          0,
          -1,
        );
        break;

      case 'week':
        const startOfWeek = now.getDate() - now.getDay();
        startOfPeriod = new Date(
          now.getFullYear(),
          now.getMonth(),
          startOfWeek,
        );
        endOfPeriod = new Date(
          now.getFullYear(),
          now.getMonth(),
          startOfWeek + 7,
          0,
          0,
          0,
          -1,
        );
        break;

      default:
        return buildError('Invalid option');
    }

    const activities = await this.activityRepository.find({
      where: {
        userId,
        status: ActivityStatus.COMPLETED,
        startedAt: Between(startOfPeriod, endOfPeriod),
        endedAt: Between(startOfPeriod, endOfPeriod),
      },
    });

    if (activities.length === 0) {
      return buildError(ErrorMessage.ACTIVITY_NOT_FOUND);
    }

    const totalTimeInMinutes = activities.reduce((total, activity) => {
      return total + activity.realSpendTime * 60; // Assuming realSpendTime is in hours
    }, 0);

    const totalTimeInHours = Math.floor(totalTimeInMinutes / 60);
    const remainingMinutes = totalTimeInMinutes % 60;

    return {
      data: {
        totalHours: totalTimeInHours,
        totalMinutes: remainingMinutes,
      },
      isSuccess: true,
      message: SuccessMessage.GET_DATA_SUCCESS,
    };
  }
}
