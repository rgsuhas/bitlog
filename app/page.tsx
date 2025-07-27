/**
 * Home Page Component
 * 
 * The main landing page for the CloudBlog platform. Displays featured posts,
 * recent articles, and provides an engaging introduction to the platform.
 * 
 * This page demonstrates production-grade practices:
 * - Server-side data fetching with proper error handling
 * - Responsive design with mobile-first approach
 * - Semantic HTML structure for accessibility and SEO
 * - Performance optimizations with Next.js Image component
 * - Clean component architecture with separation of concerns
 * 
 * Features:
 * - Hero section with call-to-action
 * - Featured posts showcase
 * - Recent posts grid
 * - Newsletter signup placeholder
 * - Loading states and error boundaries
 */

import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getAllPosts } from '@/lib/posts';
import { Post } from '@/lib/types';
import { cn } from '@/lib/utils';
import { 
  CalendarDays, 
  Clock, 
  ArrowRight, 
  Edit3, 
  Zap,
  Users,
  Globe,
  Sparkles,
  TrendingUp
} from 'lucide-react';

/**
 * Hero Section Component
 * 
 * Engaging introduction to the platform with clear value proposition
 * and primary call-to-action buttons.
 */
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[800px] w-[800px] rounded-full bg-gradient-to-r from-primary/5 via-primary/10 to-transparent blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-border/40 bg-background/60 px-3 py-1 text-sm backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Production-ready blog platform</span>
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Write, Publish,{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Inspire
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl lg:text-2xl">
            A modern, cloud-powered markdown blog platform designed for developers and writers. 
            Create beautiful content with our intuitive editor and share your ideas with the world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="min-w-[200px]" asChild>
              <Link href="/editor/new">
                <Edit3 className="mr-2 h-5 w-5" />
                Start Writing
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="min-w-[200px]" asChild>
              <Link href="/blog">
                <Globe className="mr-2 h-5 w-5" />
                Explore Posts
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Posts Published</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-foreground">5K+</div>
              <div className="text-sm text-muted-foreground">Active Writers</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground">Monthly Readers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Post Card Component
 * 
 * Reusable card component for displaying blog post previews.
 * Includes all essential post metadata and engaging hover effects.
 */
interface PostCardProps {
  post: Post;
  featured?: boolean;
}

function PostCard({ post, featured = false }: PostCardProps) {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      featured && "md:col-span-2 lg:col-span-1"
    )}>
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {featured && (
            <div className="absolute left-4 top-4">
              <Badge className="bg-primary/90 text-primary-foreground">
                <TrendingUp className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <CardTitle className="line-clamp-2 text-xl leading-tight group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </CardTitle>

        {/* Excerpt */}
        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
          {post.excerpt}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Author and Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="text-xs">
                {post.author.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {post.author.name}
              </p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                <span>{publishedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{post.readTime} min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Featured Posts Section Component
 * 
 * Displays a curated selection of featured blog posts
 * with enhanced styling and prominence.
 */
async function FeaturedPostsSection() {
  try {
    const featuredPosts = await getAllPosts(true);

    if (featuredPosts.length === 0) {
      return null;
    }

    return (
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-border/40 bg-background/60 px-3 py-1 text-sm backdrop-blur-sm">
              <Zap className="mr-2 h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Featured Content</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Editor's Picks
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Discover our most popular and insightful articles, carefully selected by our editorial team.
            </p>
          </div>

          {/* Featured Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} featured />
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading featured posts:', error);
    return (
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Unable to load featured posts at this time.</p>
          </div>
        </div>
      </section>
    );
  }
}

/**
 * Recent Posts Section Component
 * 
 * Displays the most recent blog posts in a clean grid layout.
 */
async function RecentPostsSection() {
  try {
    const allPosts = await getAllPosts();
    const recentPosts = allPosts.slice(0, 6);

    if (recentPosts.length === 0) {
      return (
        <section className="py-16 sm:py-24 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
                No Posts Yet
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Be the first to share your thoughts and ideas!
              </p>
              <Button asChild>
                <Link href="/editor/new">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Write Your First Post
                </Link>
              </Button>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Latest Posts
              </h2>
              <p className="text-lg text-muted-foreground">
                Fresh insights and ideas from our community of writers.
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link href="/blog">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Recent Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-12 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/blog">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading recent posts:', error);
    return (
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Unable to load recent posts at this time.</p>
          </div>
        </div>
      </section>
    );
  }
}

/**
 * Newsletter Section Component
 * 
 * Encourages user engagement with newsletter signup.
 * Currently a placeholder for future implementation.
 */
function NewsletterSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-border/40 bg-background/60 px-3 py-1 text-sm backdrop-blur-sm">
            <Users className="mr-2 h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Join our community</span>
          </div>
          
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Stay in the Loop
          </h2>
          
          <p className="mb-8 text-lg text-muted-foreground">
            Get the latest posts and updates delivered directly to your inbox. 
            No spam, just quality content.
          </p>

          {/* Newsletter Form Placeholder */}
          <div className="mx-auto max-w-md">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <Button type="submit">
                Subscribe
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Home Page Component
 * 
 * Main page component that orchestrates all sections.
 * Uses Suspense for optimal loading experience.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Posts */}
      <Suspense fallback={
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="mb-4 h-8 w-48 bg-muted rounded mx-auto" />
                <div className="h-4 w-96 bg-muted rounded mx-auto" />
              </div>
            </div>
          </div>
        </section>
      }>
        <FeaturedPostsSection />
      </Suspense>

      <Separator />

      {/* Recent Posts */}
      <Suspense fallback={
        <section className="py-16 sm:py-24 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="mb-4 h-8 w-48 bg-muted rounded mx-auto" />
                <div className="h-4 w-96 bg-muted rounded mx-auto" />
              </div>
            </div>
          </div>
        </section>
      }>
        <RecentPostsSection />
      </Suspense>

      <Separator />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}