export default {
  auth: {
    signup: '/api/auth/signup',
    signupToken(token) {
      return `api/auth/signup/${token}`;
    },
    signin: '/api/auth/signin',
    signout: '/api/auth/signout',
    user: '/api/auth/me',
  },
};
