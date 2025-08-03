import { getAllPosts } from '@/lib/posts';
import BlogList from '@/components/blog/BlogList';

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
  const posts = await getAllPosts();
  return <BlogList posts={posts} />;
}
