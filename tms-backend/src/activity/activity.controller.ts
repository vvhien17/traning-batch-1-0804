import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { AuthGuard } from '../middleware/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('activity')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  create(@Request() req, @Body() createActivityDto: CreateActivityDto) {
    const userId = +req.user.id;
    return this.activityService.create(userId, createActivityDto);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = +req.user.id;
    return this.activityService.findOne(+id, +userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = +req.user.id;
    return this.activityService.findAll(userId);
  }

  @Put()
  update(@Request() req, @Body() updateActivityDto: UpdateActivityDto) {
    const userId = +req.user.id;
    return this.activityService.update(userId, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.remove(+id);
  }
}
