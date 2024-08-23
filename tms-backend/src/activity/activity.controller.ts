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

@Controller('activity')
@UseGuards(AuthGuard)
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

  @Put(':id')
  update(@Body() updateActivityDto: UpdateActivityDto) {
    return this.activityService.update(updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.remove(+id);
  }
}
