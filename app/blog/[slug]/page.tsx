/**
 * Individual Blog Post Page
 * 
 * Dynamic route component for displaying individual blog posts.
 * Handles post fetching, rendering, and error states with production-grade
 * practices including SEO optimization and accessibility features.
 * 
 * Features:
 * - Dynamic metadata generation for SEO
 * - Server-side rendering with proper error handling
 * - Responsive design with optimal reading experience
 * - Social sharing integration (placeholder)
 * - Related posts suggestions
 * - Structured data for search engines
 * - Accessibility optimizations
 */


import CommentSystem from '@/components/comments/CommentSystem';
import SocialShare from '@/components/blog/SocialShare';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { processMarkdown } from '@/lib/markdown';
import { Post } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  CalendarDays,
  Clock,
  ArrowLeft,
  Share2,
  BookmarkPlus,
  Eye,
  ThumbsUp,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon
} from 'lucide-react';

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic';

/**
 * Props interface for the blog post page
 */
interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

/**
 * Generates dynamic metadata for SEO optimization
 * 
 * @param params - Route parameters containing the post slug
 * @returns Metadata object for the post
 */
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      return {
        title: 'Post Not Found - CloudBlog',
        description: 'The requested blog post could not be found.',
      };
    }

    const publishedTime = new Date(post.publishedAt).toISOString();
    const modifiedTime = new Date(post.updatedAt).toISOString();

    return {
      title: `${post.title} - CloudBlog`,
      description: post.metaDescription || post.excerpt,
      keywords: post.tags,
      authors: [{ name: post.author.name }],
      creator: post.author.name,
      publisher: 'CloudBlog',
      openGraph: {
        type: 'article',
        locale: 'en_US',
        url: `https://cloudblog.com/blog/${post.slug}`,
        title: post.title,
        description: post.metaDescription || post.excerpt,
        siteName: 'CloudBlog',
        publishedTime,
        modifiedTime,
        authors: [post.author.name],
        tags: post.tags,
        images: post.coverImage ? [
          {
            url: post.coverImage,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.metaDescription || post.excerpt,
        creator: `@${post.author.name.toLowerCase().replace(' ', '')}`,
        images: post.coverImage ? [post.coverImage] : [],
      },
      alternates: {
        canonical: `https://cloudblog.com/blog/${post.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error - CloudBlog',
      description: 'An error occurred while loading the blog post.',
    };
  }
}

/**
 * Post Header Component
 * 
 * Displays post title, metadata, and author information
 */
interface PostHeaderProps {
  post: Post;
}

function PostHeader({ post }: PostHeaderProps) {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const updatedDate = new Date(post.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const isUpdated = post.publishedAt !== post.updatedAt;

  return (
    <header className="mb-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        {post.title}
      </h1>

      {/* Excerpt */}
      <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
        {post.excerpt}
      </p>

      {/* Author and Meta Information */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Author Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{post.author.name}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <CalendarDays className="h-4 w-4" />
                <span>{publishedDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
              {post.viewCount && (
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.viewCount.toLocaleString()} views</span>
                </div>
              )}
            </div>
            {isUpdated && (
              <p className="mt-1 text-xs text-muted-foreground">
                Updated on {updatedDate}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </header>
  );
}

/**
 * Post Content Component
 * 
 * Renders the processed markdown content with proper styling
 */
interface PostContentProps {
  post: Post;
}

async function PostContent({ post }: PostContentProps) {
  try {
    const { html } = await processMarkdown(post.content);

    return (
      <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={600}
              className="aspect-video w-full object-cover"
              priority
            />
          </div>
        )}

        {/* Processed Content */}
        <div 
          dangerouslySetInnerHTML={{ __html: html }}
          className="prose-headings:scroll-mt-20 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-muted prose-pre:p-4 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic"
        />
      </article>
    );
  } catch (error) {
    console.error('Error processing post content:', error);
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="text-destructive">
          Error loading post content. Please try again later.
        </p>
      </div>
    );
  }
}

/**
 * Social Share Component
 * 
 * Provides social media sharing options
 */
interface SocialShareProps {
  post: Post;
}

// ...SocialShare component moved to a client component in components/blog/SocialShare.tsx

/**
 * Related Posts Component
 * 
 * Shows related posts based on shared tags
 */
interface RelatedPostsProps {
  currentPost: Post;
}

async function RelatedPosts({ currentPost }: RelatedPostsProps) {
  try {
    const allPosts = await getAllPosts();
    
    // Find related posts based on shared tags
    const relatedPosts = allPosts
      .filter(post => 
        post.id !== currentPost.id && 
        post.tags.some(tag => currentPost.tags.includes(tag))
      )
      .slice(0, 3);

    if (relatedPosts.length === 0) {
      return null;
    }

    return (
      <section className="mt-16">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground">
          Related Posts
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((post) => (
            <Card key={post.id} className="group transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="mb-2 flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author.name}</span>
                  <span>{post.readTime} min read</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading related posts:', error);
    return null;
  }
}

/**
 * Blog Post Page Component
 * 
 * Main page component that renders the complete blog post experience
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Post Header */}
            <PostHeader post={post} />

            <Separator className="mb-8" />

            {/* Post Content */}
            <Suspense fallback={
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
            }>
              <PostContent post={post} />
            </Suspense>

            {/* Social Share */}
            <div className="mt-12">
              <SocialShare post={post} />
            </div>

            {/* Related Posts */}
            <Suspense fallback={
              <section className="mt-16">
                <h2 className="mb-8 text-2xl font-bold">Related Posts</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-muted rounded mb-4" />
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </section>
            }>
              <RelatedPosts currentPost={post} />
            </Suspense>

            {/* Comments Section - Suspense fallback added */}
            <Suspense fallback={<div>Loading comments...</div>}>
              {/* Add this below SocialShare or wherever you want comments */}
              <CommentSystem postId={post.id} />
            </Suspense>
          </div>
        </div>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              image: post.coverImage,
              author: {
                '@type': 'Person',
                name: post.author.name,
              },
              publisher: {
                '@type': 'Organization',
                name: 'CloudBlog',
              },
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://cloudblog.com/blog/${post.slug}`,
              },
            }),
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    throw error;
  }
}