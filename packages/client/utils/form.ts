import validator from 'validator';

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

  password: (message: string) => (_, value, callback) => {
    value = value ?? '';

    // Password contains between 6 and 12 characters, and contains at least one number.
    if (!validator.matches(value, /^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{6,12}$/))
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
