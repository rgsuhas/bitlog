import Link from 'next/link'
import { PostCard } from '@/components/PostCard'
import { TopNav } from '@/components/TopNav'
import { getFeaturedPosts } from '@/data/posts'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'

export default function HomePage() {
  const featuredPosts = getFeaturedPosts()

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Minimal & Functional</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Welcome to Our{' '}
            <span className="text-primary">Blog</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover insights, tutorials, and stories from the world of technology and beyond. 
            Dive into practical knowledge that helps you grow.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              <span>Explore Posts</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center space-x-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
            >
              <span>Learn More</span>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>3 Featured Posts</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Multiple Categories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Updated Regularly</span>
            </div>
          </div>
        </div>
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