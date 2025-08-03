'use client';

import { useEffect, useState } from 'react';
import { getAllPosts } from '@/lib/posts-client';
import { Post } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/editor/new">New Post</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold">{post.title}</h3>
              <p className="text-sm text-gray-500">{post.status}</p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/editor/${post.slug}`}>Edit</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
