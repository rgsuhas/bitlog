import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  console.log('[CALLBACK] OAuth callback received');
  
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('[CALLBACK] URL params:', { 
      code: code ? 'present' : 'missing', 
      error, 
      errorDescription 
    });

    if (error) {
      console.error('[CALLBACK] OAuth error received:', { error, errorDescription });
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      );
    }

    if (!code) {
      console.error('[CALLBACK] No authorization code received');
      return NextResponse.redirect(
        new URL('/login?error=No authorization code received', request.url)
      );
    }

    console.log('[CALLBACK] Processing authorization code...');
    const supabase = createServerSupabase();

    const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    console.log('[CALLBACK] Exchange code result:', { 
      success: !authError, 
      error: authError?.message,
      hasUser: !!data?.user,
      hasSession: !!data?.session
    });

    if (authError) {
      console.error('[CALLBACK] Failed to exchange code for session:', authError);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(authError.message)}`, request.url)
      );
    }

    if (!data.session) {
      console.error('[CALLBACK] No session created after code exchange');
      return NextResponse.redirect(
        new URL('/login?error=No session created', request.url)
      );
    }

    console.log('[CALLBACK] OAuth login successful, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));

  } catch (error) {
    console.error('[CALLBACK] Unexpected error in OAuth callback:', error);
    return NextResponse.redirect(
      new URL('/login?error=Unexpected error during authentication', request.url)
    );
  }
}
