import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@/middleware/auth.guard';
@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  findAll(@Request() req) {
    const userId = req.user.id;
    return this.dashboardService.getCategoryTimePercentages(userId);
  }
}
