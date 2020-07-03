import Joi from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';

export class ISignUpUserDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  repeatPassword: string;
}

const { USERNAME_PATTERN, PASSWORD_PATTERN } = process.env;

export const signUpUserDto = Joi.object<ISignUpUserDto>({
  email: Joi.string()
    .email()
    .required(),
  username: Joi.string()
    .pattern(new RegExp(USERNAME_PATTERN)) // Username contains between 3-30 characters,
    .required(),
  password: Joi.string()
    .pattern(new RegExp(PASSWORD_PATTERN)) // Password contains between 6-12 characters, and contains at least one number.
    .required(),
  repeatPassword: Joi.ref('password'),
});
