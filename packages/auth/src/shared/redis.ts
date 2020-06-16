import Redis from 'ioredis';

const { REDIS_URL } = process.env;

const [redisHost, redisPort] = REDIS_URL.split(':');
export const redis = new Redis(redisPort, redisHost);
