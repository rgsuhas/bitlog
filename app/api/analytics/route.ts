import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { serverAuth } from '@/lib/auth-server';
import { 
  trackEvent, 
  getAnalyticsSummary, 
  getPostAnalytics,
  getAnalyticsChartData 
} from '@/lib/analytics';

/**
 * GET /api/analytics
 * Get analytics summary and data
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

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const period = searchParams.get('period') as 'day' | 'week' | 'month' | 'year' || 'month';

    if (postId) {
      // Get analytics for specific post
      const analytics = await getPostAnalytics(postId, { period });
      
      if (!analytics) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: analytics
      });
    } else {
      // Get overall analytics summary
      const summary = await getAnalyticsSummary({ period });
      const chartData = await getAnalyticsChartData({ period });

      return NextResponse.json({
        success: true,
        data: {
          summary,
          chartData
        }
      });
    }

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics
 * Track an analytics event
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const user = await serverAuth.getUser();

    const body = await request.json();
    const { postId, eventType, metadata } = body;

    if (!postId || !eventType) {
      return NextResponse.json(
        { success: false, error: 'Post ID and event type are required' },
        { status: 400 }
      );
    }

    // Validate event type
    const validEventTypes = ['view', 'like', 'share', 'comment'];
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // Track the event
    const success = await trackEvent(
      postId,
      eventType as 'view' | 'like' | 'share' | 'comment',
      user?.id,
      metadata
    );

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to track event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
} 