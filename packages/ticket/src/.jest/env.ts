import { randomBytes } from 'crypto';

process.env = {
  ...process.env,
  NAME: 'Ticket',
  NODE_ENV: 'test',
  PORT: '5000',
  SESSION_NAME: 'session',
  JWT_SECRET: 'secret',
  ORM_CONFIG:
    '{"type": "mysql","host": "localhost","port": 3306,"username": "root","password": "root","database": "test"}',
  URL_PATTERN: '/((http|https)://?)[^s()<>]+(?:([wd]+)|([^[:punct:]s]|/?))/',
  NATS_CLUSTER_ID: 'test',
  NATS_CLIENT_ID: randomBytes(4).toString('hex'),
  NATS_URL: 'http://localhost:4222',
};
