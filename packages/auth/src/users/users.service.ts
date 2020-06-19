import { Injectable, Inject } from '@nestjs/common';
import { Model, MongooseFilterQuery, UpdateQuery } from 'mongoose';

import { usersConstants } from 'src/users/constants';
import { User } from 'src/users/interfaces/user.interface';
import { ISignUpUserDto } from 'src/users/dto/signUp-user.dto';
import { isEmail } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @Inject(usersConstants.model) private readonly UserModel: Model<User>,
  ) {}

  async create(
    signUpUserDto: ISignUpUserDto | Omit<User, 'password' | 'passwordConfirm'>,
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

  async existingUser(userInfo: { email?: string; username?: string }) {
    return await this.UserModel.findOne({
      $or: [
        {
          email: userInfo.email,
        },
        {
          username: userInfo.username,
        },
      ],
    });
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string) {
    if (isEmail(usernameOrEmail)) {
      return await this.UserModel.findOne({ email: usernameOrEmail });
    }

    return await this.UserModel.findOne({ username: usernameOrEmail });
  }

  async updateOne(
    conditions: MongooseFilterQuery<User>,
    doc: UpdateQuery<User>,
  ) {
    return await this.UserModel.updateOne(conditions, doc);
  }
}
