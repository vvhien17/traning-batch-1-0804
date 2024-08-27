import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@/middleware/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  findAll(@Request() req) {
    const userId = req.user.id;
    console.log(userId);
    return this.dashboardService.getCategoryTimePercentages(userId);
  }
}
