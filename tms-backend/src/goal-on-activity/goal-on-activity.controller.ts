import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GoalOnActivityService } from './goal-on-activity.service';
import { CreateGoalOnActivityDto } from './dto/create-goal-on-activity.dto';
import { UpdateGoalOnActivityDto } from './dto/update-goal-on-activity.dto';

@Controller('goal-on-activity')
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
