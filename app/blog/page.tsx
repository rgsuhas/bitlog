import { PostCard } from '@/components/PostCard'
import { TopNav } from '@/components/TopNav'
import { getAllPosts } from '@/data/posts'

export default function BlogPage() {
  const allPosts = getAllPosts()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Posts</h1>
        <p className="text-muted-foreground">
          Browse through all our articles and insights
        </p>
      </div>
      
      <TopNav activeCategory="all" />
      
      {/* Posts */}
      <div className="space-y-6">
        {allPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
