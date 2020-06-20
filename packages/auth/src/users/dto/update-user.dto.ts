import Joi from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';

export class IUpdateUserDto {
  @ApiProperty()
  pictureURL?: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  repeatPassword: string;
}

export const updateUserDto = Joi.object<IUpdateUserDto>({
  email: Joi.string().email(),
  username: Joi.string()
    .min(3)
    .max(30),
  pictureURL: Joi.string()
    .min(3)
    .max(1000),
  password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{6,12}$/), // Password contains between 6 and 12 characters, and contains at least one number.
  repeatPassword: Joi.ref('password'),
});
