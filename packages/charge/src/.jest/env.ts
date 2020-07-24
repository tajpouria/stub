process.env = {
  ...process.env,
  NAME: 'order',
  NODE_ENV: 'test',
  PORT: '6000',
  SESSION_NAME: 'session',
  JWT_SECRET: 'secret',
  ORM_CONFIG:
    '{"type": "mysql","host": "localhost","port": 3306,"username": "root","password": "root","database": "test"}',
};
