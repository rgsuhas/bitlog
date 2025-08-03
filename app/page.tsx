import Link from 'next/link'
import { PostCard } from '@/components/PostCard'
import { TopNav } from '@/components/TopNav'
import { getFeaturedPosts } from '@/data/posts'

export default function HomePage() {
  const featuredPosts = getFeaturedPosts()

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover insights, tutorials, and stories from the world of technology and beyond.
        </p>
      </section>

      {/* Top Navigation */}
      <TopNav />

      {/* Featured Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Posts</h2>
          <Link 
            href="/blog"
            className="text-primary hover:underline font-medium"
          >
            View all posts →
          </Link>
        </div>
        <div className="space-y-6">
          {featuredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}