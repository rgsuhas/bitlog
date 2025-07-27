import { SupabaseClient, User } from '@supabase/supabase-js';
import { Database } from './types';

export const dbUtils = {
  async getCurrentUser(supabase: SupabaseClient<Database>): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting current user:', error);
        return null;
      }
      return user;
    } catch (error) {
      console.error('Unexpected error getting current user:', error);
      return null;
    }
  },

  async getUserProfile(supabase: SupabaseClient<Database>, userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      return null;
    }
  },

  async upsertUserProfile(
    supabase: SupabaseClient<Database>,
    profile: Database['public']['Tables']['profiles']['Insert']
  ) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile)
        .select()
        .single();
      if (error) {
        console.error('Error upserting user profile:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error upserting user profile:', error);
      return null;
    }
  },

  async trackEvent(
    supabase: SupabaseClient<Database>,
    event: Database['public']['Tables']['analytics']['Insert']
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('analytics').insert(event);
      if (error) {
        console.error('Error tracking analytics event:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Unexpected error tracking analytics event:', error);
      return false;
    }
  }
};
