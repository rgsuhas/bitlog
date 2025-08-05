import { PostCard } from '@/components/PostCard'
import { TopNav } from '@/components/TopNav'
import { getPostsByTag } from '@/data/posts'

export default function AICategoryPage() {
  const aiPosts = getPostsByTag('AI')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Posts</h1>
        <p className="text-muted-foreground">
          Browse through all our AI articles and insights
        </p>
      </div>
      
      <TopNav activeCategory="ai" />
      
      {/* Posts */}
      <div className="space-y-6">
        {aiPosts.length > 0 ? (
          aiPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No AI posts found.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 