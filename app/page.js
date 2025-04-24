import { getRedisClient } from '../lib/redis'; 

const POSTS_URL = 'https://dummyjson.com/posts';
const CACHE_KEY = 'posts';
const CACHE_TTL = 60;

async function getPosts() {
  try {
    const redis = await getRedisClient();
    const cached = await redis.get(CACHE_KEY);

    if (cached) {
      console.log('✅ Pulled from Redis cache!');
      return JSON.parse(cached);
    }

    console.log('⏳ Fetching fresh data from API...');
    const res = await fetch(POSTS_URL);
    const data = await res.json();

    await redis.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(data.posts));
    return data.posts; 
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { error: 'Failed to fetch posts' };
  }
}

export default async function Home() {
  const posts = await getPosts();

    if (posts.error) {
        return <div>Error: {posts.error}</div>;
    }

  return (
    <div className="daddydiv">
      <h1>📚 Blog Posts</h1>
      <div className="card">
        <ol className="listofblogposts">
          {posts.map((post) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
