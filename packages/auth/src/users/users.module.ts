import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { usersProvider } from './users.providers';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, ...usersProvider],
  exports: [UsersService],
})
export class UsersModule {}
