import { createClient } from 'redis';

const client = createClient({
  url: 'redis://default:YSKhYdoXFsJtobjV3xiMq3dmz9Fh0e6V@redis-14740.c264.ap-south-1-1.ec2.redns.redis-cloud.com:14740',
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

try {
  console.log('Attempting to connect to Redis...');
  await client.connect();
  console.log('Redis client connected successfully!');
} catch (error) {
  console.error('Failed to connect to Redis:', error);
}

export default client;
