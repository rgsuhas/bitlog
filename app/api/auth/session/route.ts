import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Session check error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        hasSession: false 
      });
    }

    return NextResponse.json({
      success: true,
      hasSession: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role
      } : null,
      sessionId: session?.access_token ? 'present' : 'missing'
    });
  } catch (error) {
    console.error('Session check failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check session',
      hasSession: false 
    });
  }
} 