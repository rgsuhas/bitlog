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
import { getAllPosts, getPaginatedPosts } from '@/lib/posts';
import { Post, CreatePostData, PaginationParams, ApiResponse } from '@/lib/types';
import { generateSlug, validateMarkdown, estimateReadingTime } from '@/lib/markdown';

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
 * 
 * Retrieves blog posts with optional pagination and filtering.
 * Supports query parameters for search, filtering, and pagination.
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 50)
 * - search: Search term for title/content
 * - tag: Filter by specific tag
 * - status: Filter by post status (draft, published, archived)
 * - featured: Filter featured posts (true/false)
 * 
 * @param request - Next.js request object
 * @returns JSON response with posts data or error
 * 
 * @example
 * GET /api/posts?page=1&limit=10&search=react&tag=tutorial
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters with defaults and validation
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const search = searchParams.get('search') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' || undefined;
    const featuredParam = searchParams.get('featured');
    const featured = featuredParam ? featuredParam === 'true' : undefined;

    // Determine if pagination is requested
    const isPaginated = searchParams.has('page') || searchParams.has('limit');

    let responseData;

    if (isPaginated) {
      // Return paginated results
      const paginationParams: PaginationParams = {
        page,
        limit,
        search,
        tag,
        status,
      };

      responseData = await getPaginatedPosts(paginationParams);
    } else {
      // Return all posts (for simple use cases)
      const posts = await getAllPosts(featured);
      
      // Apply additional filtering if needed
      let filteredPosts = posts;
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      if (tag) {
        filteredPosts = filteredPosts.filter(post =>
          post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
        );
      }
      
      if (status) {
        filteredPosts = filteredPosts.filter(post => post.status === status);
      }

      responseData = filteredPosts;
    }

    // Return successful response
    const response: ApiResponse<typeof responseData> = {
      success: true,
      data: responseData,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Error in GET /api/posts:', error);

    const errorResponse: ApiResponse = {
      success: false,
      error: 'Failed to fetch posts',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: corsHeaders,
    });
  }
}

/**
 * POST /api/posts
 * 
 * Creates a new blog post with validation and automatic metadata generation.
 * Handles slug generation, content validation, and reading time estimation.
 * 
 * Request Body:
 * - title: Post title (required)
 * - content: Markdown content (required)
 * - excerpt: Brief description (optional, auto-generated if not provided)
 * - tags: Array of tags (optional)
 * - status: Post status (default: 'draft')
 * - featured: Whether post is featured (default: false)
 * - coverImage: Cover image URL (optional)
 * - metaDescription: SEO meta description (optional)
 * 
 * @param request - Next.js request object with JSON body
 * @returns JSON response with created post data or error
 * 
 * @example
 * POST /api/posts
 * {
 *   "title": "My New Post",
 *   "content": "# Hello World\n\nThis is my first post!",
 *   "tags": ["tutorial", "beginner"]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    let body: Partial<CreatePostData>;
    
    try {
      body = await request.json();
    } catch (parseError) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Invalid JSON in request body',
      };

      return NextResponse.json(errorResponse, {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Title is required and must be a non-empty string',
      };

      return NextResponse.json(errorResponse, {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Content is required and must be a non-empty string',
      };

      return NextResponse.json(errorResponse, {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate markdown content
    const contentValidationIssues = validateMarkdown(body.content);
    if (contentValidationIssues.length > 0) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Content validation failed',
        details: contentValidationIssues,
      };

      return NextResponse.json(errorResponse, {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Generate slug from title
    const slug = generateSlug(body.title);

    // Auto-generate excerpt if not provided
    const excerpt = body.excerpt || body.content.substring(0, 200).replace(/[#*`]/g, '').trim() + '...';

    // Calculate reading time
    const readTime = estimateReadingTime(body.content);

    // Create new post object
    const newPost: CreatePostData = {
      slug,
      title: body.title.trim(),
      excerpt: excerpt.trim(),
      content: body.content.trim(),
      author: {
        // In production, this would come from authentication
        id: '1',
        name: 'Current User',
        email: 'user@example.com',
        initials: 'CU',
        bio: 'Blog author',
      },
      status: body.status || 'draft',
      readTime,
      tags: Array.isArray(body.tags) ? body.tags.filter(tag => typeof tag === 'string' && tag.trim()) : [],
      featured: Boolean(body.featured),
      coverImage: typeof body.coverImage === 'string' ? body.coverImage.trim() || undefined : undefined,
      metaDescription: typeof body.metaDescription === 'string' ? body.metaDescription.trim() || undefined : undefined,
    };

    // In production, this would save to database
    // const savedPost = await createPost(newPost);
    
    // For now, simulate database save
    const savedPost: Post = {
      ...newPost,
      id: Date.now().toString(), // Generate temporary ID
      publishedAt: newPost.status === 'published' ? new Date().toISOString() : '',
      updatedAt: new Date().toISOString(),
      viewCount: 0,
    };

    // Return successful response
    const response: ApiResponse<Post> = {
      success: true,
      data: savedPost,
    };

    return NextResponse.json(response, {
      status: 201,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Error in POST /api/posts:', error);

    const errorResponse: ApiResponse = {
      success: false,
      error: 'Failed to create post',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: corsHeaders,
    });
  }
}