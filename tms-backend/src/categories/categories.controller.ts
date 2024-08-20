import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get(':userId')
  findCategoriesByUserId(@Param('userId') id: string) {
    return this.categoriesService.findCategoriesByUserId(+id);
  }
}
