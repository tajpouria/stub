import { Document } from 'mongoose';

export interface User extends Document {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly pictureUrl: string;
  password?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
