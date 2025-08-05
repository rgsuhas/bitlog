import Link from 'next/link'
import { PostCard } from '@/components/PostCard'
import { TopNav } from '@/components/TopNav'
import { getFeaturedPosts, getAllPosts } from '@/data/posts'
import { ArrowRight, BookOpen, Sparkles, Calendar, Clock } from 'lucide-react'

export default function HomePage() {
  const featuredPosts = getFeaturedPosts()
  const allPosts = getAllPosts()
  const heroPost = allPosts[0] // First post as hero

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
              <span>{allPosts.length} Total Posts</span>
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

      {/* Hero Featured Post */}
      {heroPost && (
        <section className="mb-16">
          <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-64 md:h-full">
                <img
                  src={`${heroPost.thumbnail}&w=600&h=400&fit=crop&crop=center`}
                  alt={heroPost.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  width={600}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-4">
                  {heroPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h2 className="text-3xl font-bold mb-4 leading-tight">
                  <Link href={`/blog/${heroPost.slug}`} className="hover:text-primary transition-colors">
                    {heroPost.title}
                  </Link>
                </h2>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {heroPost.excerpt}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(heroPost.publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{heroPost.readTime} min read</span>
                  </div>
                </div>
                
                <Link
                  href={`/blog/${heroPost.slug}`}
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <span>Read full article</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Navigation */}
      <TopNav activeCategory="all" />

      {/* Featured Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          <Link 
            href="/blog"
            className="text-primary hover:underline font-medium"
          >
            View all posts →
          </Link>
        </div>
        <div className="space-y-6">
          {featuredPosts.slice(1).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}