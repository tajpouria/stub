import Joi from '@hapi/joi';

export interface ISignInUserDto {
  usernameOrEmail: string;
  password: string;
}

export const SignInUserDto = Joi.object<ISignInUserDto>({
  usernameOrEmail: Joi.string().required(),
  password: Joi.string().required(),
});
