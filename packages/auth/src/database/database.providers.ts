import { Provider } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { DataBase } from 'src/constants';

const { DB_URL } = process.env;
export const databaseProviders: Provider[] = [
  {
    provide: DataBase.Connection,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        DB_URL,
        {
          useCreateIndex: true,
          useUnifiedTopology: true,
          useNewUrlParser: true,
        },
        () => console.info(`Connected to ${DB_URL}`),
      ),
  },
];
