import { createClient } from 'redis';

export const redis = createClient();

redis.on('error', err => console.log('Redis Client Error', err));

(async () => {
  await redis.connect();

  // await client.disconnect();
})();
