import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { AuthGuard } from '../middleware/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('goal')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  create(@Request() req, @Body() createGoalDto: CreateGoalDto) {
    const userId = req.user.id;
    return this.goalService.create(createGoalDto, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalService.findOne(+id);
  }
  @Get()
  findAllByUserId(@Request() req) {
    const userId = req.user.id;
    return this.goalService.findAllByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalService.update(+id, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalService.remove(+id);
  }
}
