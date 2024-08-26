import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '../middleware/auth.guard';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('categories')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    const userId = req.user.id;
    console.log('🚀 ~ CategoryController ~ create ~ userId:', userId);
    return this.categoryService.create(createCategoryDto, userId);
  }

  @Get()
  findCategoryByUserId(@Request() req) {
    const userId = req.user.id;
    return this.categoryService.findCategoryByUserId(userId);
  }
  @Put()
  update(@Body() updateCategoryDto: UpdateCategoryDto, @Request() req) {
    const userId = req.user.id;
    return this.categoryService.updateCategory(updateCategoryDto, userId);
  }
}
