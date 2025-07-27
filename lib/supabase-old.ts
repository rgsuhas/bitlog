/**
 * Supabase Client Configuration
 * 
 * This module provides a centralized Supabase client configuration for the blog platform.
 * It handles authentication, database operations, and real-time subscriptions with
 * production-grade error handling and type safety.
 * 
 * Features:
 * - Type-safe database operations
 * - Authentication state management
 * - Real-time subscriptions for collaboration
 * - Row Level Security (RLS) integration
 * - Comprehensive error handling
 */

import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Database schema types for type-safe operations
 * These interfaces match the Supabase database schema
 */
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          excerpt: string;
          author_id: string;
          published_at: string | null;
          updated_at: string;
          created_at: string;
          status: 'draft' | 'published' | 'archived';
          read_time: number;
          tags: string[];
          featured: boolean;
          cover_image: string | null;
          meta_description: string | null;
          view_count: number;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content: string;
          excerpt: string;
          author_id: string;
          published_at?: string | null;
          updated_at?: string;
          created_at?: string;
          status?: 'draft' | 'published' | 'archived';
          read_time: number;
          tags?: string[];
          featured?: boolean;
          cover_image?: string | null;
          meta_description?: string | null;
          view_count?: number;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content?: string;
          excerpt?: string;
          author_id?: string;
          published_at?: string | null;
          updated_at?: string;
          created_at?: string;
          status?: 'draft' | 'published' | 'archived';
          read_time?: number;
          tags?: string[];
          featured?: boolean;
          cover_image?: string | null;
          meta_description?: string | null;
          view_count?: number;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          content: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          content: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          content?: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
      analytics: {
        Row: {
          id: string;
          post_id: string;
          event_type: 'view' | 'like' | 'share' | 'comment';
          user_id: string | null;
          metadata: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          event_type: 'view' | 'like' | 'share' | 'comment';
          user_id?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          event_type?: 'view' | 'like' | 'share' | 'comment';
          user_id?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

/**
 * Supabase configuration from environment variables
 * These should be set in your deployment environment
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

/**
 * Client-side Supabase client for use in React components
 * Automatically handles authentication state and provides type safety
 * 
 * @returns Typed Supabase client for client-side operations
 * 
 * @example
 * ```typescript
 * const supabase = createClientSupabase();
 * const { data: posts } = await supabase
 *   .from('posts')
 *   .select('*')
 *   .eq('status', 'published');
 * ```
 */
export const createClientSupabase = () => {
  return createClientComponentClient<Database>();
};

/**
 * Server-side Supabase client for use in Server Components and API routes
 * Handles authentication context from cookies
 * 
 * @returns Typed Supabase client for server-side operations
 * 
 * @example
 * ```typescript
 * const supabase = createServerSupabase();
 * const { data: posts } = await supabase
 *   .from('posts')
 *   .select('*')
 *   .eq('author_id', userId);
 * ```
 */
export const createServerSupabase = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
};

/**
 * Administrative Supabase client with service role key
 * Use only for administrative operations that bypass RLS
 * 
 * @returns Supabase client with elevated permissions
 * 
 * @example
 * ```typescript
 * const supabase = createAdminSupabase();
 * // Use for admin operations only
 * ```
 */
export const createAdminSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('Missing Supabase service role key for admin operations');
  }
  
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

/**
 * Database utility functions for common operations
 */
export const dbUtils = {
  /**
   * Get current authenticated user
   * 
   * @param supabase - Supabase client instance
   * @returns Current user or null if not authenticated
   */
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

  /**
   * Get user profile by ID
   * 
   * @param supabase - Supabase client instance
   * @param userId - User ID to fetch profile for
   * @returns User profile or null if not found
   */
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

  /**
   * Create or update user profile
   * 
   * @param supabase - Supabase client instance
   * @param profile - Profile data to upsert
   * @returns Updated profile or null on error
   */
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

  /**
   * Track analytics event
   * 
   * @param supabase - Supabase client instance
   * @param event - Analytics event data
   * @returns Success status
   */
  async trackEvent(
    supabase: SupabaseClient<Database>,
    event: Database['public']['Tables']['analytics']['Insert']
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('analytics')
        .insert(event);
      
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

/**
 * Real-time subscription utilities for collaboration features
 */
export const realtimeUtils = {
  /**
   * Subscribe to post changes for real-time collaboration
   * 
   * @param supabase - Supabase client instance
   * @param postId - Post ID to subscribe to
   * @param callback - Callback function for changes
   * @returns Subscription object for cleanup
   */
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

  /**
   * Subscribe to comment changes for real-time updates
   * 
   * @param supabase - Supabase client instance
   * @param postId - Post ID to subscribe to comments for
   * @param callback - Callback function for changes
   * @returns Subscription object for cleanup
   */
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

/**
 * Type exports for use throughout the application
 */
export type { Database };
export type DatabasePost = Database['public']['Tables']['posts']['Row'];
export type DatabaseProfile = Database['public']['Tables']['profiles']['Row'];
export type DatabaseComment = Database['public']['Tables']['comments']['Row'];
export type DatabaseAnalytics = Database['public']['Tables']['analytics']['Row'];