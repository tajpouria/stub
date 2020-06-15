import { Injectable, Inject } from '@nestjs/common';
import { Logger } from '@tajpouria/stub-common/dist/logger';
import { Model, MongooseFilterQuery } from 'mongoose';

import { usersConstants } from 'src/users/constants';
import { User } from 'src/users/interfaces/user.interface';
import { SignUpUserDto } from 'src/users/dto/signUp-user.dto';
import { isEmail } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @Inject(usersConstants.model) private readonly UserModel: Model<User>,
  ) {}

  get logger() {
    return Logger(`${process.cwd()}/logs/users`);
  }

  async create(
    signUpUserDto: Omit<SignUpUserDto, 'password' | 'passwordConfirm'>,
  ) {
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

  async findOneByUsernameOrEmail(usernameOrEmail: string) {
    if (isEmail(usernameOrEmail)) {
      return await this.UserModel.findOne({ email: usernameOrEmail });
    }

    return await this.UserModel.findOne({ username: usernameOrEmail });
  }
}
