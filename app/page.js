import redisClient from '../lib/redis';

async function getPosts() {
  const cached = await redisClient.get('posts');

  if (cached) {
    console.log('✅ Pulled from Redis cache!');
    return JSON.parse(cached);
  }

  console.log('⏳ Fetching fresh data from API... this might take a sec!');
  const res = await fetch('https://dummyjson.com/posts');
  const data = await res.json();

  await redisClient.setEx('posts', 3600, JSON.stringify(data.posts));

  return data.posts;
}

export default async function Home() {
  const posts = await getPosts();

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
