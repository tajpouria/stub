import { Provider } from '@nestjs/common';
import { connect } from 'mongoose';

import { dataBaseConstants } from 'src/database/constants';

const { NODE_ENV, DB_URL } = process.env;
export const databaseProviders: Provider[] = [
  {
    provide: dataBaseConstants.connection,
    useFactory: () =>
      connect(
        DB_URL,
        {
          useCreateIndex: true,
          useUnifiedTopology: true,
          useNewUrlParser: true,
        },
        () =>
          NODE_ENV !== 'test' &&
          console.info(`Connected to mongo on ${DB_URL}`),
      ),
  },
];
