import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';

import { UserSchema } from './schemas/user.schema';
import { Users, DataBase } from 'src/constants';

export const usersProvider: Provider[] = [
  {
    provide: Users.Model,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: [DataBase.Connection],
  },
];
