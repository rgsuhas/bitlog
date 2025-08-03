import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  if (!provider) {
    // Redirect to login page if accessed directly
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/login`
    );
  }

  const supabase = createServerSupabase();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'google' | 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${redirectTo}`,
    },
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ 
    success: true, 
    url: data.url 
  });
}

export async function POST(request: Request) {
  const { provider, redirectTo = '/dashboard' } = await request.json();

  if (!provider) {
    return NextResponse.json(
      { error: 'Provider is required' },
      { status: 400 }
    );
  }

  const supabase = createServerSupabase();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'google' | 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${redirectTo}`,
    },
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ 
    success: true, 
    url: data.url 
  });
}
