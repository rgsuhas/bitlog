import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { serverAuth } from '@/lib/auth-server';
import { publishPost, getPublishingQueue, cancelScheduledPost } from '@/lib/publishing';

/**
 * GET /api/publishing
 * Get publishing queue status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const user = await serverAuth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const queue = await getPublishingQueue();

    return NextResponse.json({
      success: true,
      data: queue
    });

  } catch (error) {
    console.error('Error fetching publishing queue:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch publishing queue' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/publishing
 * Publish a post or schedule it for publishing
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
    const { 
      postId, 
      scheduleFor, 
      notifySubscribers = false, 
      shareOnSocial = false,
      socialPlatforms = [],
      seoOptimize = true,
      generateSitemap = true
    } = body;

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Publish the post
    const result = await publishPost(postId, {
      scheduleFor: scheduleFor ? new Date(scheduleFor) : undefined,
      notifySubscribers,
      shareOnSocial,
      socialPlatforms,
      seoOptimize,
      generateSitemap
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.errors?.join(', ') || 'Failed to publish post' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error publishing post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/publishing
 * Cancel a scheduled post
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const user = await serverAuth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queueId = searchParams.get('queueId');

    if (!queueId) {
      return NextResponse.json(
        { success: false, error: 'Queue ID is required' },
        { status: 400 }
      );
    }

    const success = await cancelScheduledPost(queueId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to cancel scheduled post' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Scheduled post cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling scheduled post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel scheduled post' },
      { status: 500 }
    );
  }
} 