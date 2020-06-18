import { model } from 'mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { ISignUpUserDto } from '../users/dto/signUp-user.dto';

export async function signUpUser(signUpUserDto: ISignUpUserDto) {
  try {
    const User = model('User', UserSchema);

    await new User(signUpUserDto).save();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export const redis = require('../shared/redis').redis.duplicate();
