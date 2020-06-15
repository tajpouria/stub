import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';

import { UserSchema } from 'src/users/schemas/user.schema';
import { Users } from 'src/users/constants';
import { DataBase } from 'src/database/constants';

export const usersProvider: Provider[] = [
  {
    provide: Users.Model,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: [DataBase.Connection],
  },
];
