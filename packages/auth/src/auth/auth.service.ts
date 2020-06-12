import { Injectable } from '@nestjs/common';
import { Cipher } from '@tajpouria/stub-common/dist/crypto';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(email: string, password: string) {
    const existingUser = await this.userService.findOne({ email }, 'password');

    if (
      !existingUser ||
      !(await Cipher.compare(existingUser.password, password, {}))
    )
      return null;

    return existingUser;
  }
}
