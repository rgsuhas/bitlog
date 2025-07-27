import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

export const realtimeUtils = {
  subscribeToPostChanges(
    supabase: SupabaseClient<Database>,
    postId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`post-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `id=eq.${postId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToCommentChanges(
    supabase: SupabaseClient<Database>,
    postId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        callback
      )
      .subscribe();
  }
};
