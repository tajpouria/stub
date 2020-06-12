import { Injectable, Inject } from '@nestjs/common';
import { Logger } from '@tajpouria/stub-common/dist/logger';
import { Model } from 'mongoose';

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
    const createdUser = new this.UserModel(createUserDto)
    return createdUser.save()
  }
}
