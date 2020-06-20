import { Document } from 'mongoose';
import Joi from '@hapi/joi';

export interface IUser extends Document {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly pictureURL: string;
  password?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export const userValidator = Joi.object<IUser>({
  id: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  username: Joi.string()
    .min(3)
    .max(30)
    .required(),
  pictureURL: Joi.string()
    .min(3)
    .max(1000)
    .required(),
});
