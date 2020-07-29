import validator from 'validator';
import { regexPattern } from '~/constants/app';

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

    if (!validator.matches(value, new RegExp(regexPattern.username)))
      return callback(message);
    callback();
  },

  password: (message: string) => (_, value, callback) => {
    value = value ?? '';

    if (!validator.matches(value, new RegExp(regexPattern.password)))
      return callback(message);
    callback();
  },

  matchTogether: (message: string, target: any) => (_, value, callback) => {
    value = value ?? '';
    target = target ?? '';

    if (value !== target) return callback(message);
    callback();
  },

  ticketTitle: (message: string) => (_, value, callback) => {
    value = value ?? '';

    if (!validator.matches(value, new RegExp(regexPattern.ticketTitle)))
      return callback(message);
    callback();
  },

  ticketDescription: (message: string) => (_, value, callback) => {
    value = value ?? '';

    if (!validator.matches(value, new RegExp(regexPattern.ticketDescription)))
      return callback(message);
    callback();
  },
};
