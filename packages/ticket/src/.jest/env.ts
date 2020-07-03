process.env = {
  ...process.env,
  NAME: 'Ticket',
  HOST: 'https://stub.test',
  NODE_ENV: 'test',
  PORT: '5000',
  SESSION_NAME: 'session',
  JWT_SECRET: 'secret',
  ORM_CONFIG:
    '{"type": "mysql","host": "localhost","port": 3306,"username": "root","password": "root","database": "tickets"}',
};
