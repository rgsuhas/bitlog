import { SupabaseClient, User } from '@supabase/supabase-js';
import { Database } from './types';

export const dbUtils = {
  // User Management
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

  async getUserProfile(supabase: SupabaseClient<Database>, userId: string): Promise<Database['public']['Tables']['profiles']['Row'] | null> {
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
  ): Promise<Database['public']['Tables']['profiles']['Row'] | null> {
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

  // Posts Management
  async getAllPosts(supabase: SupabaseClient<Database>, featured?: boolean): Promise<Database['public']['Tables']['posts']['Row'][]> {
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (featured !== undefined) {
        query = query.eq('featured', featured);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching posts:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching posts:', error);
      return [];
    }
  },

  async getPostBySlug(supabase: SupabaseClient<Database>, slug: string): Promise<Database['public']['Tables']['posts']['Row'] | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      if (error) {
        console.error('Error fetching post by slug:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error fetching post by slug:', error);
      return null;
    }
  },

  async createPost(
    supabase: SupabaseClient<Database>,
    post: Database['public']['Tables']['posts']['Insert']
  ): Promise<Database['public']['Tables']['posts']['Row'] | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single();
      if (error) {
        console.error('Error creating post:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error creating post:', error);
      return null;
    }
  },

  async updatePost(
    supabase: SupabaseClient<Database>,
    id: string,
    updates: Partial<Database['public']['Tables']['posts']['Update']>
  ): Promise<Database['public']['Tables']['posts']['Row'] | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Error updating post:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error updating post:', error);
      return null;
    }
  },

  async deletePost(supabase: SupabaseClient<Database>, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error deleting post:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Unexpected error deleting post:', error);
      return false;
    }
  },

  async getPaginatedPosts(
    supabase: SupabaseClient<Database>,
    params: {
      page: number;
      limit: number;
      search?: string;
      tag?: string;
      status?: 'draft' | 'published' | 'archived';
    }
  ): Promise<{ posts: Database['public']['Tables']['posts']['Row'][]; total: number }> {
    try {
      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' });

      // Apply filters
      if (params.status) {
        query = query.eq('status', params.status);
      }
      if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,excerpt.ilike.%${params.search}%`);
      }
      if (params.tag) {
        query = query.contains('tags', [params.tag]);
      }

      // Apply pagination
      const offset = (params.page - 1) * params.limit;
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + params.limit - 1);

      const { data, error, count } = await query;
      if (error) {
        console.error('Error fetching paginated posts:', error);
        return { posts: [], total: 0 };
      }

      return { posts: data || [], total: count || 0 };
    } catch (error) {
      console.error('Unexpected error fetching paginated posts:', error);
      return { posts: [], total: 0 };
    }
  },

  // Comments Management
  async getCommentsForPost(supabase: SupabaseClient<Database>, postId: string): Promise<Database['public']['Tables']['comments']['Row'][]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching comments:', error);
      return [];
    }
  },

  async createComment(
    supabase: SupabaseClient<Database>,
    comment: Database['public']['Tables']['comments']['Insert']
  ): Promise<Database['public']['Tables']['comments']['Row'] | null> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single();
      if (error) {
        console.error('Error creating comment:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error creating comment:', error);
      return null;
    }
  },

  async updateComment(
    supabase: SupabaseClient<Database>,
    id: string,
    updates: Partial<Database['public']['Tables']['comments']['Update']>
  ): Promise<Database['public']['Tables']['comments']['Row'] | null> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Error updating comment:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error updating comment:', error);
      return null;
    }
  },

  async deleteComment(supabase: SupabaseClient<Database>, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) {
        console.error('Error deleting comment:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Unexpected error deleting comment:', error);
      return false;
    }
  },

  // Analytics Management
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
  },

  async getAnalyticsForPost(
    supabase: SupabaseClient<Database>,
    postId: string,
    eventType?: 'view' | 'like' | 'share' | 'comment'
  ): Promise<Database['public']['Tables']['analytics']['Row'][]> {
    try {
      let query = supabase
        .from('analytics')
        .select('*')
        .eq('post_id', postId);

      if (eventType) {
        query = query.eq('event_type', eventType);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching analytics:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching analytics:', error);
      return [];
    }
  },

  async incrementViewCount(supabase: SupabaseClient<Database>, postId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_view_count', { post_id: postId });
      if (error) {
        console.error('Error incrementing view count:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Unexpected error incrementing view count:', error);
      return false;
    }
  },

  // Utility Functions
  async checkUserPermission(
    supabase: SupabaseClient<Database>,
    userId: string,
    requiredRole: 'admin' | 'editor' | 'author' | 'reader'
  ): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(supabase, userId);
      if (!profile) return false;

      const roleHierarchy = {
        reader: 1,
        author: 2,
        editor: 3,
        admin: 4,
      };

      const userRoleLevel = roleHierarchy[profile.role as keyof typeof roleHierarchy] || 1;
      const requiredRoleLevel = roleHierarchy[requiredRole];

      return userRoleLevel >= requiredRoleLevel;
    } catch (error) {
      console.error('Error checking user permission:', error);
      return false;
    }
  },

  async searchPosts(
    supabase: SupabaseClient<Database>,
    searchTerm: string,
    limit: number = 10
  ): Promise<Database['public']['Tables']['posts']['Row'][]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      if (error) {
        console.error('Error searching posts:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Unexpected error searching posts:', error);
      return [];
    }
  },

  async getPostsByTag(
    supabase: SupabaseClient<Database>,
    tag: string,
    limit: number = 10
  ): Promise<Database['public']['Tables']['posts']['Row'][]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .contains('tags', [tag])
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      if (error) {
        console.error('Error fetching posts by tag:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching posts by tag:', error);
      return [];
    }
  },
};
