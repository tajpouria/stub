import validator from 'validator';

const USERNAME_PATTERN = '/.{3,30}$/',
  PASSWORD_PATTERN = '^(?=.*[0-9])(?=.*[a-z]).{6,32}$',
  URL_PATTERN = '/((http|https)://?)[^s()<>]+(?:([wd]+)|([^[:punct:]s]|/?))/';

export const hasErrors = (fieldsError: Record<string, string>) =>
  Object.keys(fieldsError).some((field) => fieldsError[field]);

export const validationRules: Record<
  string,
  (
    ...args: any
  ) => (rule: string, value: any, callback: (message?: string) => any) => void
> = {
  required: (message: string) => (_, value, callback) => {
    value = value ?? '';

    if (validator.isEmpty(value)) return callback(message);
    callback();
  },

  email: (message: string) => (_, value, callback) => {
    value = value ?? '';

    if (!validator.isEmail(value)) return callback(message);
    callback();
  },

  username: (message: string) => (_, value, callback) => {
    value = value ?? '';

    if (!validator.matches(value, new RegExp(USERNAME_PATTERN!)))
      return callback(message);
    callback();
  },

  password: (message: string) => (_, value, callback) => {
    value = value ?? '';

    if (!validator.matches(value, new RegExp(PASSWORD_PATTERN!)))
      return callback(message);
    callback();
  },

  matchTogether: (message: string, target: any) => (_, value, callback) => {
    value = value ?? '';
    target = target ?? '';

    if (value !== target) return callback(message);
    callback();
  },
};
