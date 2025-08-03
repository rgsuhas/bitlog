/**
 * Home Page Component
 * 
 * The main landing page for the CloudBlog platform. Displays featured posts,
 * recent articles, and provides an engaging introduction to the platform.
 * 
 * This page demonstrates production-grade practices:
 * - Client-side data fetching with proper error handling
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

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getAllPosts } from '@/lib/posts-client';
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
  TrendingUp,
  Loader2
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
              <div className="mb-2 text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Markdown Support</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Scalable</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary">⚡</div>
              <div className="text-sm text-muted-foreground">Lightning Fast</div>
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
 * Displays a single blog post with metadata and preview.
 * Handles both featured and regular post layouts.
 */
interface PostCardProps {
  post: Post;
  featured?: boolean;
}

function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      featured && "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
    )}>
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {featured && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                Featured
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardContent className="p-6">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <CardTitle className="mb-2 line-clamp-2 text-lg font-semibold group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>

        {/* Excerpt */}
        <CardDescription className="mb-4 line-clamp-3 text-sm">
          {post.excerpt}
        </CardDescription>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime} min read
            </div>
          </div>
          
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Featured Posts Section Component
 * 
 * Displays featured blog posts in a grid layout.
 * Uses client-side data fetching with loading states.
 */
function FeaturedPostsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const allPosts = await getAllPosts(true);
        setPosts(allPosts.slice(0, 3));
      } catch (err) {
        console.error('Error loading featured posts:', err);
        setError('Failed to load featured posts');
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Featured Posts</h2>
            <p className="mt-2 text-muted-foreground">Discover our most popular articles</p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Featured Posts</h2>
            <p className="mt-2 text-muted-foreground">Discover our most popular articles</p>
          </div>
          <div className="text-center text-muted-foreground">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">Featured Posts</h2>
          <p className="mt-2 text-muted-foreground">Discover our most popular articles</p>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} featured={true} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No featured posts available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Recent Posts Section Component
 * 
 * Displays recent blog posts in a grid layout.
 * Uses client-side data fetching with loading states.
 */
function RecentPostsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts.slice(0, 6));
      } catch (err) {
        console.error('Error loading recent posts:', err);
        setError('Failed to load recent posts');
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Recent Posts</h2>
            <p className="mt-2 text-muted-foreground">Latest articles from our writers</p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Recent Posts</h2>
            <p className="mt-2 text-muted-foreground">Latest articles from our writers</p>
          </div>
          <div className="text-center text-muted-foreground">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">Recent Posts</h2>
          <p className="mt-2 text-muted-foreground">Latest articles from our writers</p>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No posts available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Newsletter Section Component
 * 
 * Placeholder for newsletter signup functionality.
 * Can be extended with actual newsletter integration.
 */
function NewsletterSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Stay Updated</h2>
          <p className="mt-4 text-muted-foreground">
            Get notified when we publish new articles and updates.
          </p>
          
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="min-w-[200px]">
              <Zap className="mr-2 h-5 w-5" />
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Home Page Component
 * 
 * Main landing page that combines all sections.
 * Uses client-side rendering for data fetching.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedPostsSection />
      <RecentPostsSection />
      <NewsletterSection />
    </main>
  );
}