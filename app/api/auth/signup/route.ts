import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createServerSupabase();
  const { email, password, name } = await request.json();
  const { error } = await supabase.auth.signUp({ 
    email, 
    password, 
    options: {
      data: {
        full_name: name,
      }
    }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
