import Link from 'next/link'
import { ArrowLeft, Tag } from 'lucide-react'
import { getAllPosts } from '@/data/posts'

export default function TagsPage() {
  const allPosts = getAllPosts()
  
  // Get all unique tags
  const allTags = Array.from(new Set(allPosts.flatMap(post => post.tags)))
  
  // Count posts per tag
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = allPosts.filter(post => post.tags.includes(tag)).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>
      </div>

      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">All Tags</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse posts by topic and discover content that interests you.
        </p>
      </header>

      {/* Tags Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTags.map((tag) => (
          <div key={tag} className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{tag}</h3>
                <p className="text-sm text-muted-foreground">
                  {tagCounts[tag]} {tagCounts[tag] === 1 ? 'post' : 'posts'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              {allPosts
                .filter(post => post.tags.includes(tag))
                .slice(0, 3)
                .map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1"
                  >
                    {post.title}
                  </Link>
                ))}
            </div>
            
            {tagCounts[tag] > 3 && (
              <p className="text-xs text-muted-foreground mt-3">
                +{tagCounts[tag] - 3} more posts
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {allTags.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tags yet</h3>
          <p className="text-muted-foreground">
            Posts will appear here once they have tags assigned.
          </p>
        </div>
      )}
    </div>
  )
} 