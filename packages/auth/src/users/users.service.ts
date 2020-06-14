import { Injectable, Inject } from '@nestjs/common';
import { Logger } from '@tajpouria/stub-common/dist/logger';
import { Model, MongooseFilterQuery } from 'mongoose';

import { Users } from 'src/constants';
import { User } from 'src/users/interfaces/user.interface';
import { SignUpUserDto } from 'src/users/dto/signUp-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(Users.Model) private readonly UserModel: Model<User>) {}

  get logger() {
    return Logger(`${process.cwd()}/logs/users`);
  }

  async create(signUpUserDto: SignUpUserDto) {
    const userTemp = new this.UserModel(signUpUserDto);
    return await userTemp.save();
  }

  async findOne(
    conditions?: MongooseFilterQuery<User>,
    projection = null,
  ): Promise<User | null> {
    const result = this.UserModel.findOne(conditions, projection);
    return result;
  }
}
