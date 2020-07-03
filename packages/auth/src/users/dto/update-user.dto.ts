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
const { URL_PATTERN, PASSWORD_PATTERN } = process.env;

export const updateUserDto = Joi.object<IUpdateUserDto>({
  email: Joi.string().email(),
  username: Joi.string()
    .min(3)
    .max(30),
  pictureURL: Joi.string().pattern(new RegExp(URL_PATTERN)),
  password: Joi.string().pattern(new RegExp(PASSWORD_PATTERN)), // Password contains between 6 and 12 characters, and contains at least one number.
  repeatPassword: Joi.ref('password'),
});
