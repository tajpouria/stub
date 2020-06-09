import { Injectable } from '@nestjs/common';
import { Logger } from '@tajpouria/stub-common/dist/logger';

@Injectable()
export class UsersService {
  get logger() {
    return Logger(`${process.cwd()}/logs/users`);
  }
}
