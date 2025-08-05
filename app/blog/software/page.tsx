import { PostCard } from '@/components/PostCard'
import { TopNav } from '@/components/TopNav'
import { getPostsByTag } from '@/data/posts'

export default function SoftwareCategoryPage() {
  const softwarePosts = getPostsByTag('Software')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Software Posts</h1>
        <p className="text-muted-foreground">
          Browse through all our software articles and insights
        </p>
      </div>
      
      <TopNav activeCategory="software" />
      
      {/* Posts */}
      <div className="space-y-6">
        {softwarePosts.length > 0 ? (
          softwarePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No software posts found.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 