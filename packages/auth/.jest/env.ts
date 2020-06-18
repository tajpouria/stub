process.env = {
  ...process.env,
  NAME: 'Auth Test',
  HOST: 'https://stub.test',
  NODE_ENV: 'test',
  PORT: '4000',
  DB_URL: 'mongodb://localhost:27017/auth',
  SESSION_NAME: 'session',
  REDIS_URL: 'localhost:6379',
  REDIS_EXPIRY_SECONDS: '10800',
  GOOGLE_CLIENT_ID: 'secret',
  GOOGLE_CLIENT_SECRET: 'secret',
  JWT_SECRET: 'secret',
  MAILER:
    '{"service": "gmail", "auth": {"user": "tajpouria.dev@gmail.com", "pass": "secret"}}',
};
