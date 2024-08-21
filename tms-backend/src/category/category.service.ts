import { CreateCategoryDto } from './dto/create-category.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
import { User } from '../user/entities/user.entity';
import { ErrorMessage } from '../common/utils/message-const';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<BaseResponse> {
    // Check if the user exists
    const user = await this.userRepository.findOne({
      where: { id: createCategoryDto.userId },
    });

    if (!user) {
      return buildError(ErrorMessage.USER_NOT_FOUND);
    }

    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);

    return {
      data: category,
      isSuccess: true,
      message: 'Category created successfully',
    };
  }

  async findCategoryByUserId(userId: number): Promise<BaseResponse> {
    const data = await this.categoryRepository.find({ where: { userId } });
    if (data.length > 0) {
      return {
        data,
        isSuccess: true,
        message: 'Category found successfully',
      };
    } else {
      return buildError(ErrorMessage.CATEGORY_NOT_FOUND);
    }
  }
}
