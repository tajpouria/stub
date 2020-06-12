import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Logger } from '@tajpouria/stub-common/dist/logger';
import { Model, MongooseFilterQuery } from 'mongoose';

import { Users } from 'src/constants';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(Users.Model) private UserModel: Model<User>) {}

  get logger() {
    return Logger(`${process.cwd()}/logs/users`);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.findOne({
        email: createUserDto.email,
      });

      if (existingUser) return new BadRequestException();

      const userTemp = new this.UserModel(createUserDto);
      const createdUser = await userTemp.save();
      return createdUser;
    } catch (error) {
      this.logger.error(new Error(error));
    }
  }

  async findOne(
    conditions?: MongooseFilterQuery<User>,
    projection = null,
  ): Promise<User | null> {
    try {
      const result = this.UserModel.findOne(conditions, projection);
      return result;
    } catch (error) {
      this.logger.error(new Error(error));
    }
  }
}
