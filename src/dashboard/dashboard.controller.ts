import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../middleware/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Query } from 'typeorm/driver/Query';
import { BaseResponse } from '../common/base-response/base-response.dto';
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  findAll(@Request() req) {
    const userId = req.user.id;
    return this.dashboardService.getCategoryTimePercentages(userId);
  }
  @Get('summary-time/:option')
  async getSummaryTime(
    @Request() req,
    @Param('option') option: string,
  ): Promise<BaseResponse> {
    const userId = req.user.id;
    return this.dashboardService.getSummaryTime(userId, option.toLowerCase());
  }
}
