//@ts-nocheck
import { connection } from 'mongoose';

import { redis } from './utils';

beforeEach(async () => {
  const collections = await connection.db?.collections();

  if (collections)
    for (const collection of collections) {
      await collection.deleteMany({});
    }
});

afterAll(async () => {
  await connection.close();
  await redis.disconnect();
});
