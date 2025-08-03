import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { dbUtils } from '@/lib/supabase/utils';
import { 
  generateSitemap, 
  generateRobotsTxt, 
  generateRSSFeed,
  generateMetaTags,
  generateStructuredData
} from '@/lib/seo';

/**
 * GET /api/seo/sitemap
 * Generate sitemap.xml
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { pathname } = new URL(request.url);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

    // Get all published posts
    const dbPosts = await dbUtils.getAllPosts(supabase);
    const publishedPosts = dbPosts.filter(post => post.status === 'published').map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: {
        id: post.author_id,
        name: 'Unknown Author', // Would need to fetch from profiles table
        email: '',
        initials: 'UA',
        bio: '',
        website: ''
      },
      publishedAt: post.published_at || '',
      updatedAt: post.updated_at,
      createdAt: post.created_at,
      status: post.status,
      readTime: post.read_time,
      tags: post.tags || [],
      featured: post.featured,
      coverImage: post.cover_image || undefined,
      metaDescription: post.meta_description || undefined,
      viewCount: post.view_count
    }));

    let content: string;
    let contentType: string;

    if (pathname.includes('/sitemap')) {
      // Generate sitemap
      content = generateSitemap(publishedPosts, baseUrl);
      contentType = 'application/xml';
    } else if (pathname.includes('/robots')) {
      // Generate robots.txt
      content = generateRobotsTxt(baseUrl);
      contentType = 'text/plain';
    } else if (pathname.includes('/rss')) {
      // Generate RSS feed
      content = generateRSSFeed(publishedPosts, baseUrl);
      contentType = 'application/rss+xml';
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid SEO endpoint' },
        { status: 404 }
      );
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('Error generating SEO content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate SEO content' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/seo/meta
 * Generate meta tags for a post
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const body = await request.json();
    const { postId, baseUrl } = body;

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Get post data
    const post = await dbUtils.getPostBySlug(supabase, postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const siteUrl = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

    // Transform database post to Post interface
    const transformedPost = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: {
        id: post.author_id,
        name: 'Unknown Author', // Would need to fetch from profiles table
        email: '',
        initials: 'UA',
        bio: '',
        website: ''
      },
      publishedAt: post.published_at || '',
      updatedAt: post.updated_at,
      createdAt: post.created_at,
      status: post.status,
      readTime: post.read_time,
      tags: post.tags || [],
      featured: post.featured,
      coverImage: post.cover_image || undefined,
      metaDescription: post.meta_description || undefined,
      viewCount: post.view_count
    };

    // Generate meta tags and structured data
    const metaTags = generateMetaTags(transformedPost, siteUrl);
    const structuredData = generateStructuredData(transformedPost, siteUrl);

    return NextResponse.json({
      success: true,
      data: {
        metaTags,
        structuredData
      }
    });

  } catch (error) {
    console.error('Error generating meta tags:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate meta tags' },
      { status: 500 }
    );
  }
} 