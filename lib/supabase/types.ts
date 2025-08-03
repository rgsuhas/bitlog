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
          role: 'admin' | 'editor' | 'author' | 'reader';
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
          role?: 'admin' | 'editor' | 'author' | 'reader';
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
          role?: 'admin' | 'editor' | 'author' | 'reader';
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
export type DatabasePost = Database['public']['Tables']['posts']['Row'];
export type DatabaseProfile = Database['public']['Tables']['profiles']['Row'];
export type DatabaseComment = Database['public']['Tables']['comments']['Row'];
export type DatabaseAnalytics = Database['public']['Tables']['analytics']['Row'];
