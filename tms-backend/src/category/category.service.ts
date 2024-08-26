import { CreateCategoryDto } from './dto/create-category.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
import { User } from '../user/entities/user.entity';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { getCustomErrorMessage } from '../common/utils/custom-message-validator';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    userId: number,
  ): Promise<BaseResponse> {
    // Check if the user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return buildError(ErrorMessage.USER_NOT_FOUND);
    }

    const category = await this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);

    return {
      data: category,
      isSuccess: true,
      message: SuccessMessage.CREATE_DATA_SUCCESS,
    };
  }

  async findCategoryByUserId(userId: number): Promise<BaseResponse> {
    const data = await this.categoryRepository.find({ where: { userId } });
    if (data.length > 0) {
      return {
        data,
        isSuccess: true,
        message: SuccessMessage.GET_DATA_SUCCESS,
      };
    } else {
      return buildError(ErrorMessage.CATEGORY_NOT_FOUND);
    }
  }
  async updateCategory(category: UpdateCategoryDto, userId: number) {
    const { id } = category;

    const categoryDto = plainToInstance(UpdateCategoryDto, category);
    const errors = await validate(categoryDto);
    if (errors.length) {
      return buildError(getCustomErrorMessage(errors[0]));
    }
    const categoryDb = await this.categoryRepository.findOne({
      where: { id, userId: userId },
    });
    if (!categoryDb) {
      return buildError(ErrorMessage.DATA_NOT_FOUND);
    }
    Object.assign(categoryDb, category);
    const data = await this.categoryRepository.save(categoryDb);
    console.log(data);
    return {
      data: data,
      isSuccess: true,
      message: SuccessMessage.CREATE_DATA_SUCCESS,
    };
  }
}
