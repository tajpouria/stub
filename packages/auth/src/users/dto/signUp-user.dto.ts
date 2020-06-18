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
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{6,12}$/) // Password contains between 6 and 12 characters, and contains at least one number.
    .required(),
  repeatPassword: Joi.ref('password'),
});
