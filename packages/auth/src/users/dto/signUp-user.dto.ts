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

export const signUpUserDto = Joi.object<ISignUpUserDto>({
  email: Joi.string()
    .email()
    .required(),
  username: Joi.string()
    .pattern(/.{3,30}$/) // Username contains between 3-30 characters,
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{6,12}$/) // Password contains between 6-12 characters, and contains at least one number.
    .required(),
  repeatPassword: Joi.ref('password'),
});
