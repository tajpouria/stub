//@ts-nocheck
import { connection } from 'mongoose';

beforeEach(async () => {
  const collections = await connection.db?.collections();

  if (collections)
    for (const collection of collections) {
      await collection.deleteMany({});
    }
});

afterAll(() => setTimeout(() => process.exit(), 1000));
