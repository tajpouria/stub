export default {
  page: {
    index: { welcome: 'Welcome', 'stub-alt': 'stub' },

    auth: {
      signup: {
        'sign up for stub': 'Sign up for Stub',
        'stub-logo-alt': 'stub',
        email: 'Email',
        username: 'Username',
        'username-info': 'Username Has to be at least 3 characters long',
        password: 'Password',
        'password-info':
          'Password Has to be at least 6 characters long And contain at least one digit',
        'repeat password': 'Repeat password',
        'signup-btn': 'Sign up',
        'user agreement':
          'By purchasing or signing up, you agree to our user agreement and acknowledge our privacy notice.',
        'contact with friends': 'Connect with friends on Stub',
        'have a stub account': 'Have a Stub account?',
        signin: 'Sign in',
        'email-sent': 'Validation email sent:',
        'credential validation': 'Credential Validation',
        'try again': 'Try again',
        'welcome to stub': 'Welcome to Stub',
      },

      signin: {
        'sign in to stub': 'Sign in to Stub',
        'username or email': 'Username or email',
        password: 'Password',
        'user agreement':
          'By purchasing or signing in, you agree to our user agreement and acknowledge our privacy notice.',
        'signin-btn': 'Sign in',
        'contact with friends': 'Connect with friends on Stub',
        'new to stub': 'New to Stub?',
        'create account': 'Create Account',
        'invalid email or password': 'Invalid email or password',
        'welcome back': 'Welcome Back',
      },
    },

    ads: {
      index: {
        'no more data': 'No more date',
        'no results': 'no-results',
      },

      new: {
        'register free advertisement': 'Register free advertisement',
        address: 'Address',
        'adding a photo will': 'Adding a photo will triple your ad views.',
        price: 'Price',
        picture: 'Ad picture',
        title: 'Ad title',
        'in ad title': 'In ad title mention certain points.',
        description: 'Ad description',
        'in ad description':
          "In ad's description Write details and highlights completely and accurately.",
        register: 'Register ad',
      },
    },
  },

  component: {
    imgUploadInput: {
      'upload hint': 'Upload',
      'invalid format': 'Invalid file Format',
      'less than 2mb': 'File size should be less than 2 mb',
    },
    ticketCard: {
      locked: 'Currently reserved by someone else',
    },
  },

  layout: {
    default: {
      'sign in': 'Sign in',
      'my tickets': 'My tickets',
      sell: 'Sell',
      english: 'English',
      farsi: 'فارسی',
      profile: 'Profile',
      'sign out': 'Sign out',
    },
  },

  validation: {
    required: 'This field is required',
    email: 'Email is not valid',
    username: 'At least 3 and Maximum 30 characters',
    password: 'At least 6 characters, At least one digit',
    'repeat-password-not-match': 'Make sure passwords match',
    ticketTitle: 'At least 3 and Maximum 22 characters',
    ticketDescription: 'At least 3 and Maximum 255 characters',
  },
};
