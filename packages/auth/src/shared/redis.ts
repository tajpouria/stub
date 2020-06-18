import Redis from 'ioredis';

const { NODE_ENV, REDIS_URL } = process.env;

const [redisHost, redisPort] = REDIS_URL.split(':');
export const redis = new Redis(redisPort, redisHost);

redis.on(
  'connect',
  () => NODE_ENV !== 'test' && `Connected to redis on ${REDIS_URL}`,
);
redis.on('error', error => console.error(error));
