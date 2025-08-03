/**
 * Posts API Route Handler
 * 
 * Handles CRUD operations for blog posts. This API route provides endpoints
 * for creating, reading, updating, and deleting blog posts with proper
 * error handling, validation, and response formatting.
 * 
 * Endpoints:
 * - GET /api/posts - Retrieve all posts with optional filtering
 * - POST /api/posts - Create a new blog post
 * 
 * Features:
 * - Request validation and sanitization
 * - Comprehensive error handling
 * - Pagination support
 * - Search and filtering capabilities
 * - Proper HTTP status codes
 * - CORS headers for cross-origin requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { dbUtils } from '@/lib/supabase/utils';
import { serverAuth } from '@/lib/auth-server';
import { Post, CreatePostData } from '@/lib/types';

/**
 * CORS headers for cross-origin requests
 * Allows the API to be consumed by different domains if needed
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Handle OPTIONS requests for CORS preflight
 * Required for cross-origin requests from browsers
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * GET /api/posts
 * Get all posts with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | undefined;
    const tag = searchParams.get('tag') || undefined;
    const search = searchParams.get('search') || undefined;

    // Get posts with pagination
    const posts = await dbUtils.getPaginatedPosts(supabase, {
      page,
      limit,
      status,
      tag,
      search
    });

    return NextResponse.json({
      success: true,
      data: posts
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Create a new post
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const user = await serverAuth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, excerpt, tags, status = 'draft', featured = false, coverImage, metaDescription } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = generateSlug(title);
    
    // Check if slug already exists
    const existingPost = await dbUtils.getPostBySlug(supabase, slug);
    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'A post with this title already exists' },
        { status: 409 }
      );
    }

    // Calculate reading time
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    // Create post data for database
    const postData = {
      slug,
      title,
      content,
      excerpt: excerpt || content.substring(0, 160),
      author_id: user.id,
      status,
      read_time: readingTime,
      tags: tags || [],
      featured,
      cover_image: coverImage,
      meta_description: metaDescription || excerpt || content.substring(0, 160),
      published_at: status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      view_count: 0
    };

    // Create post in database
    const post = await dbUtils.createPost(supabase, postData);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Failed to create post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

/**
 * Generate a URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}