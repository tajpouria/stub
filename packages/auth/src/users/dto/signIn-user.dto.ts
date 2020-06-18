import Joi from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';

export class ISignInUserDto {
  @ApiProperty()
  usernameOrEmail: string;
  @ApiProperty()
  password: string;
}

export const SignInUserDto = Joi.object<ISignInUserDto>({
  usernameOrEmail: Joi.string().required(),
  password: Joi.string().required(),
});
