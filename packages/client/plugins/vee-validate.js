import { extend } from 'vee-validate';
import { email, required } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'This field is required or your custom error message',
});

extend('email', {
  ...email,
  message: 'This field is email or your custom error message',
});
