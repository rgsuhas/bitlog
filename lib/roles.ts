import { type User } from '@supabase/supabase-js';
import { createAdminSupabase } from './supabase/admin'; // Using admin client to query user roles

export type Role = 'reader' | 'author' | 'admin';

export interface UserProfile {
  id: string;
  role: Role;
  user: User;
}

export async function getUserProfile(user: User): Promise<UserProfile | null> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    // For now, let's be permissive if the profile doesn't exist
    // In a real app, you might want to enforce profile creation
    return {
      id: user.id,
      role: 'reader', // Default role
      user,
    };
  }

  return {
    id: user.id,
    role: data.role as Role,
    user,
  };
}

export function canEdit(profile: UserProfile | null): boolean {
  if (!profile) return false;
  return profile.role === 'author' || profile.role === 'admin';
}
