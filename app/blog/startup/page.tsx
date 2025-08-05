import { PostCard } from '@/components/PostCard'
import { TopNav } from '@/components/TopNav'
import { getPostsByTag } from '@/data/posts'

export default function StartupCategoryPage() {
  const startupPosts = getPostsByTag('Startup')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Startup Posts</h1>
        <p className="text-muted-foreground">
          Browse through all our startup articles and insights
        </p>
      </div>
      
      <TopNav activeCategory="startup" />
      
      {/* Posts */}
      <div className="space-y-6">
        {startupPosts.length > 0 ? (
          startupPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No startup posts found.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 