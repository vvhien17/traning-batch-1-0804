import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, userName, passWord } = createUserDto;

    // Validate required fields
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    if (!userName) {
      throw new BadRequestException('Username is required');
    }
    if (!passWord) {
      throw new BadRequestException('Password is required');
    }

    // Create a new user instance
    const user = this.usersRepository.create(createUserDto);

    // Save the user to the database
    return this.usersRepository.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
