import { PostCard } from '@/components/PostCard'
import { TopNav } from '@/components/TopNav'
import { getPostsByTag } from '@/data/posts'

export default function GeneralCategoryPage() {
  const generalPosts = getPostsByTag('General')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">General Posts</h1>
        <p className="text-muted-foreground">
          Browse through all our general articles and insights
        </p>
      </div>
      
      <TopNav activeCategory="general" />
      
      {/* Posts */}
      <div className="space-y-6">
        {generalPosts.length > 0 ? (
          generalPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No general posts found.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 