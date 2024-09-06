import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { getCustomErrorMessage } from '../common/utils/custom-message-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<BaseResponse> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        return buildError(ErrorMessage.EMAIL_ALREADY_EXISTS);
      }

      // Validate required fields
      const validateUserDto = plainToInstance(CreateUserDto, createUserDto);
      const errors = await validate(validateUserDto);
      if (errors.length) {
        return buildError(getCustomErrorMessage(errors[0]));
      }

      // Create a new user instance
      const user = await this.userRepository.create(createUserDto);

      // Save the new user
      const savedUser = await this.userRepository.save(user);

      return {
        data: savedUser,
        isSuccess: true,
        message: SuccessMessage.CREATE_DATA_SUCCESS,
      };
    } catch (error) {
      return buildError(error.message);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return buildError(ErrorMessage.USER_NOT_FOUND);
    }

    return {
      data: user,
      isSuccess: true,
      message: 'User found successfully',
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
