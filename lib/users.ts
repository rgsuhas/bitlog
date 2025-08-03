import { createServerSupabase } from '@/lib/supabase/server';
import { User } from './types';

export async function getAllUsers(): Promise<User[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data as User[];
}

export async function updateUserRole(userId: string, role: string): Promise<{ success: boolean, error?: string }> {
  const supabase = createServerSupabase();
  const { error } = await supabase.from('users').update({ role }).eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
