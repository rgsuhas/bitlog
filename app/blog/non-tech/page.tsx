import { PostCard } from '@/components/PostCard'
import { TopNav } from '@/components/TopNav'
import { getPostsByTag } from '@/data/posts'

export default function NonTechCategoryPage() {
  const nonTechPosts = getPostsByTag('Non-Tech')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Non-Tech Posts</h1>
        <p className="text-muted-foreground">
          Browse through all our non-tech articles and insights
        </p>
      </div>
      
      <TopNav activeCategory="non-tech" />
      
      {/* Posts */}
      <div className="space-y-6">
        {nonTechPosts.length > 0 ? (
          nonTechPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No non-tech posts found.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 