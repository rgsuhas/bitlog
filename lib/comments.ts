import { createServerSupabase } from '@/lib/supabase/server';
import { Comment } from './types';

export async function getAllComments(): Promise<Comment[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from('comments').select('*');

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data as Comment[];
}
