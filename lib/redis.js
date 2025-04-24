import { createClient } from 'redis';

export const dynamic = 'force-dynamic';

const redisUrl = 'redis://default:YSKhYdoXFsJtobjV3xiMq3dmz9Fh0e6V@redis-14740.c264.ap-south-1-1.ec2.redns.redis-cloud.com:14740';

let client;

async function connectRedis() {
  if (!client) {
    client = createClient({ url: redisUrl });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    try {
      if (!client.isOpen) {
        await client.connect();
        console.log('Redis client connected!');
      }
    } catch (error) {
      console.error('Redis connection failed:', error);
    }
  }
  return client;
}

export const getRedisClient = async () => {
  if (!client || !client.isOpen) {
    await connectRedis();
  }
  return client;
};
