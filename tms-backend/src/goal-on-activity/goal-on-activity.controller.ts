import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GoalOnActivityService } from './goal-on-activity.service';
import { CreateGoalOnActivityDto } from './dto/create-goal-on-activity.dto';
import { UpdateGoalOnActivityDto } from './dto/update-goal-on-activity.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../middleware/auth.guard';
import { DeleteGoalOnActivityDto } from './dto/delete-goal-on-activity.dto';

@Controller('goal-on-activity')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class GoalOnActivityController {
  constructor(private readonly goalOnActivityService: GoalOnActivityService) {}

  @Post()
  create(
    @Request() req,
    @Body() createGoalOnActivityDto: CreateGoalOnActivityDto,
  ) {
    const userId = +req.user.id;
    return this.goalOnActivityService.create(userId, createGoalOnActivityDto);
  }

  @Get(':goalId')
  findAll(@Request() req, @Param('goalId') goalId: string) {
    const userId = +req.user.id;
    return this.goalOnActivityService.findAll(userId, +goalId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalOnActivityService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGoalOnActivityDto: UpdateGoalOnActivityDto,
  ) {
    return this.goalOnActivityService.update(+id, updateGoalOnActivityDto);
  }

  @Delete()
  delete(@Request() req, @Body() deleteActivity: DeleteGoalOnActivityDto) {
    const userId = req.user.id;
    return this.goalOnActivityService.delete(userId, deleteActivity);
  }
}
