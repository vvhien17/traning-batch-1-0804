import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GoalOnActivityService } from './goal-on-activity.service';
import { CreateGoalOnActivityDto } from './dto/create-goal-on-activity.dto';
import { UpdateGoalOnActivityDto } from './dto/update-goal-on-activity.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../middleware/auth.guard';

@Controller('goal-on-activity')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class GoalOnActivityController {
  constructor(private readonly goalOnActivityService: GoalOnActivityService) {}

  @Post()
  create(@Body() createGoalOnActivityDto: CreateGoalOnActivityDto) {
    return this.goalOnActivityService.create(createGoalOnActivityDto);
  }

  @Get()
  findAll() {
    return this.goalOnActivityService.findAll();
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalOnActivityService.remove(+id);
  }
}
