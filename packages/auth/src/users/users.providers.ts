import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';

import { UserSchema } from 'src/users/schemas/user.schema';
import { dataBaseConstants } from 'src/database/constants';
import { usersConstants } from 'src/users/constants';

export const usersProvider: Provider[] = [
  {
    provide: usersConstants.model,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: [dataBaseConstants.connection],
  },
];
