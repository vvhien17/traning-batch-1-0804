import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseResponse } from '../common/base-response/base-response.dto';
import { buildError } from '../common/utils/Utility';
import { ErrorMessage } from '../common/utils/message-const';

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
      if (!createUserDto.email) {
        return buildError(ErrorMessage.EMAIL_IS_REQUIRED);
      }
      if (!createUserDto.username) {
        return buildError(ErrorMessage.USERNAME_IS_REQUIRED);
      }
      if (!createUserDto.password) {
        return buildError(ErrorMessage.PASSWORD_IS_REQUIRED);
      }

      // Create a new user instance
      const user = this.userRepository.create(createUserDto);

      // Save the new user
      const savedUser = await this.userRepository.save(user);

      return {
        data: savedUser,
        isSuccess: true,
        message: 'User created successfully',
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
