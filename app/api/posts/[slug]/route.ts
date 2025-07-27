/**
 * Individual Post API Route Handler
 * 
 * Handles operations for individual blog posts identified by slug.
 * Provides endpoints for retrieving, updating, and deleting specific posts
 * with comprehensive error handling and validation.
 * 
 * Endpoints:
 * - GET /api/posts/[slug] - Retrieve a specific post
 * - PUT /api/posts/[slug] - Update a specific post
 * - DELETE /api/posts/[slug] - Delete a specific post
 * 
 * Features:
 * - Slug-based post identification
 * - Partial updates support
 * - Content validation
 * - Automatic metadata updates
 * - Proper HTTP status codes
 * - CORS support
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/posts';
import { Post, UpdatePostData, ApiResponse } from '@/lib/types';
import { validateMarkdown, estimateReadingTime, generateSlug } from '@/lib/markdown';

/**
 * CORS headers for cross-origin requests
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Route parameters interface
 */
interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * GET /api/posts/[slug]
 * 
 * Retrieves a specific blog post by its slug identifier.
 * Returns 404 if the post is not found.
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing the slug
 * @returns JSON response with post data or error
 * 
 * @example
 * GET /api/posts/my-first-blog-post
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Invalid slug parameter',
      };

      return NextResponse.json(errorResponse, {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Fetch post by slug
    const post = await getPostBySlug(slug);

    if (!post) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Post not found',
      };

      return NextResponse.json(errorResponse, {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Return successful response
    const response: ApiResponse<Post> = {
      success: true,
      data: post,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error(`Error in GET /api/posts/${params?.slug}:`, error);

    const errorResponse: ApiResponse = {
      success: false,
      error: 'Failed to fetch post',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: corsHeaders,
    });
  }
}

/**
 * PUT /api/posts/[slug]
 * 
 * Updates a specific blog post with partial or complete data.
 * Validates content, updates metadata, and handles slug changes.
 * 
 * Request Body (all fields optional for partial updates):
 * - title: Updated post title
 * - content: Updated markdown content
 * - excerpt: Updated brief description
 * - tags: Updated array of tags
 * - status: Updated post status
 * - featured: Updated featured status
 * - coverImage: Updated cover image URL
 * - metaDescription: Updated SEO meta description
 * 
 * @param request - Next.js request object with JSON body
 * @param params - Route parameters containing the slug
 * @returns JSON response with updated post data or error
 * 
 * @example
 * PUT /api/posts/my-first-blog-post
 * {
 *   "title": "My Updated Blog Post",
 *   "status": "published"
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Invalid slug parameter',
      };

      return NextResponse.json(errorResponse, {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Check if post exists
    const existingPost = await getPostBySlug(slug);
    if (!existingPost) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Post not found',
      };

      return NextResponse.json(errorResponse, {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Parse request body
    let updateData: Partial<UpdatePostData>;
    
    try {
      updateData = await request.json();
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

    // Validate updated fields
    if (updateData.title !== undefined) {
      if (typeof updateData.title !== 'string' || updateData.title.trim().length === 0) {
        const errorResponse: ApiResponse = {
          success: false,
          error: 'Title must be a non-empty string',
        };

        return NextResponse.json(errorResponse, {
          status: 400,
          headers: corsHeaders,
        });
      }
    }

    if (updateData.content !== undefined) {
      if (typeof updateData.content !== 'string' || updateData.content.trim().length === 0) {
        const errorResponse: ApiResponse = {
          success: false,
          error: 'Content must be a non-empty string',
        };

        return NextResponse.json(errorResponse, {
          status: 400,
          headers: corsHeaders,
        });
      }

      // Validate markdown content
      const contentValidationIssues = validateMarkdown(updateData.content);
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
    }

    // Prepare updated post data
    const updatedPost: Post = {
      ...existingPost,
      ...updateData,
      id: existingPost.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    // Update slug if title changed
    if (updateData.title && updateData.title !== existingPost.title) {
      updatedPost.slug = generateSlug(updateData.title);
    }

    // Recalculate reading time if content changed
    if (updateData.content) {
      updatedPost.readTime = estimateReadingTime(updateData.content);
    }

    // Update published date if status changed to published
    if (updateData.status === 'published' && existingPost.status !== 'published') {
      updatedPost.publishedAt = new Date().toISOString();
    }

    // Clean up optional fields
    if (updateData.coverImage === '') {
      updatedPost.coverImage = undefined;
    }
    if (updateData.metaDescription === '') {
      updatedPost.metaDescription = undefined;
    }

    // In production, this would update the database
    // const savedPost = await updatePost(slug, updatedPost);

    // Return successful response
    const response: ApiResponse<Post> = {
      success: true,
      data: updatedPost,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error(`Error in PUT /api/posts/${params?.slug}:`, error);

    const errorResponse: ApiResponse = {
      success: false,
      error: 'Failed to update post',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: corsHeaders,
    });
  }
}

/**
 * DELETE /api/posts/[slug]
 * 
 * Deletes a specific blog post by its slug identifier.
 * This is a destructive operation that cannot be undone.
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing the slug
 * @returns JSON response confirming deletion or error
 * 
 * @example
 * DELETE /api/posts/my-old-blog-post
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Invalid slug parameter',
      };

      return NextResponse.json(errorResponse, {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Check if post exists
    const existingPost = await getPostBySlug(slug);
    if (!existingPost) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'Post not found',
      };

      return NextResponse.json(errorResponse, {
        status: 404,
        headers: corsHeaders,
      });
    }

    // In production, this would delete from database
    // await deletePost(slug);

    // Return successful response
    const response: ApiResponse<{ slug: string }> = {
      success: true,
      data: { slug },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error(`Error in DELETE /api/posts/${params?.slug}:`, error);

    const errorResponse: ApiResponse = {
      success: false,
      error: 'Failed to delete post',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: corsHeaders,
    });
  }
}