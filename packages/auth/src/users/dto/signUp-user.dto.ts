import Joi from '@hapi/joi';

export interface ISignUpUserDto {
  email: string;
  username: string;
  password: string;
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
    .pattern(new RegExp('^[a-zA-Z0-9]{7,30}$'))
    .required(),
  repeatPassword: Joi.ref('password'),
});
