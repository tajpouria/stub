import Joi from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';

export class IForgotPasswordDto {
  @ApiProperty()
  usernameOrEmail: string;
}

export const forgotPasswordDto = Joi.object<IForgotPasswordDto>({
  usernameOrEmail: Joi.string().required(),
});
