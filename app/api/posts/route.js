import { getRedisClient } from '@/lib/redis';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
const CACHE_KEY = 'posts';
const CACHE_TTL = 60;

export async function GET() {
  try {
    const redis = await getRedisClient();
    const cached = await redis.get(CACHE_KEY);

    if (cached) {
      console.log('Serving from cache');
      return Response.json(JSON.parse(cached));
    }

    const res = await fetch(POSTS_URL);
    const data = await res.json();

    await redis.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(data));
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
