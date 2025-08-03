/**
 * Client-Side Post Data Access Layer
 * 
 * This module handles all data operations related to blog posts for client components.
 * Uses Supabase client with proper error handling and type safety.
 * 
 * All functions include proper error handling and return consistent
 * data structures for reliable integration with UI components.
 */

import { Post, Author, PostStatus, PaginatedResponse, PaginationParams } from './types';
import { createClientSupabase } from './supabase/client';
import { dbUtils } from './supabase/utils';
import type { DatabasePost, DatabaseProfile } from './supabase/types';

/**
 * Convert database post to application post format
 */
function mapDatabasePostToPost(dbPost: DatabasePost, author: DatabaseProfile): Post {
  return {
    id: dbPost.id,
    slug: dbPost.slug,
    title: dbPost.title,
    excerpt: dbPost.excerpt || '',
    content: dbPost.content,
    author: {
      id: author.id,
      name: author.name,
      email: author.email,
      avatar: author.avatar_url || '',
      initials: author.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      bio: author.bio || '',
      website: author.website || ''
    },
    publishedAt: dbPost.published_at || dbPost.created_at || new Date().toISOString(),
    updatedAt: dbPost.updated_at,
    status: dbPost.status as PostStatus,
    readTime: dbPost.read_time,
    tags: dbPost.tags || [],
    featured: dbPost.featured,
    coverImage: dbPost.cover_image || undefined,
    metaDescription: dbPost.meta_description || '',
    viewCount: dbPost.view_count
  };
}

/**
 * Retrieves all published blog posts (client-side)
 * 
 * @param featured - Optional filter to only return featured posts
 * @returns Promise resolving to array of published posts
 * 
 * @example
 * ```typescript
 * const allPosts = await getAllPosts();
 * const featuredPosts = await getAllPosts(true);
 * ```
 */
export async function getAllPosts(featured?: boolean): Promise<Post[]> {
  try {
    const supabase = createClientSupabase();
    const dbPosts = await dbUtils.getAllPosts(supabase, featured);
    
    // Fetch author profiles for all posts
    const authorIds = Array.from(new Set(dbPosts.map(post => post.author_id)));
    const authorProfiles = new Map<string, DatabaseProfile>();
    
    for (const authorId of authorIds) {
      const profile = await dbUtils.getUserProfile(supabase, authorId);
      if (profile) {
        authorProfiles.set(authorId, profile);
      }
    }
    
    // Map database posts to application posts
    const posts: Post[] = [];
    for (const dbPost of dbPosts) {
      const author = authorProfiles.get(dbPost.author_id);
      if (author) {
        posts.push(mapDatabasePostToPost(dbPost, author));
      }
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

/**
 * Retrieves a single blog post by its slug (client-side)
 * 
 * @param slug - URL-friendly identifier for the post
 * @returns Promise resolving to the post or null if not found
 * 
 * @example
 * ```typescript
 * const post = await getPostBySlug('building-modern-web-apps');
 * if (post) {
 *   console.log(post.title);
 * }
 * ```
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = createClientSupabase();
    const dbPost = await dbUtils.getPostBySlug(supabase, slug);
    
    if (!dbPost) {
      return null;
    }
    
    const author = await dbUtils.getUserProfile(supabase, dbPost.author_id);
    if (!author) {
      console.error('Author not found for post:', slug);
      return null;
    }
    
    return mapDatabasePostToPost(dbPost, author);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw new Error('Failed to fetch post');
  }
}

/**
 * Retrieves paginated blog posts (client-side)
 * 
 * @param params - Pagination and filtering parameters
 * @returns Promise resolving to paginated posts response
 * 
 * @example
 * ```typescript
 * const result = await getPaginatedPosts({
 *   page: 1,
 *   limit: 10,
 *   search: 'react',
 *   tag: 'tutorial'
 * });
 * ```
 */
export async function getPaginatedPosts(params: PaginationParams): Promise<PaginatedResponse<Post>> {
  try {
    const supabase = createClientSupabase();
    const { posts: dbPosts, total } = await dbUtils.getPaginatedPosts(supabase, {
      page: params.page,
      limit: params.limit,
      search: params.search,
      tag: params.tag,
      status: params.status
    });
    
    // Fetch author profiles for all posts
    const authorIds = Array.from(new Set(dbPosts.map(post => post.author_id)));
    const authorProfiles = new Map<string, DatabaseProfile>();
    
    for (const authorId of authorIds) {
      const profile = await dbUtils.getUserProfile(supabase, authorId);
      if (profile) {
        authorProfiles.set(authorId, profile);
      }
    }
    
    // Map database posts to application posts
    const posts: Post[] = [];
    for (const dbPost of dbPosts) {
      const author = authorProfiles.get(dbPost.author_id);
      if (author) {
        posts.push(mapDatabasePostToPost(dbPost, author));
      }
    }
    
    return {
      items: posts,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit),
      hasNext: params.page < Math.ceil(total / params.limit),
      hasPrev: params.page > 1
    };
  } catch (error) {
    console.error('Error fetching paginated posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

/**
 * Retrieves all unique tags from published posts (client-side)
 * 
 * @returns Promise resolving to array of unique tags
 * 
 * @example
 * ```typescript
 * const tags = await getAllTags();
 * console.log('Available tags:', tags);
 * ```
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const supabase = createClientSupabase();
    const posts = await dbUtils.getAllPosts(supabase);
    
    const allTags = posts.flatMap(post => post.tags || []);
    const uniqueTags = Array.from(new Set(allTags));
    
    return uniqueTags.sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }
}

/**
 * Retrieves all posts by a specific author (client-side)
 * 
 * @param authorId - ID of the author
 * @returns Promise resolving to array of posts by the author
 * 
 * @example
 * ```typescript
 * const authorPosts = await getPostsByAuthor('user-123');
 * console.log('Posts by author:', authorPosts.length);
 * ```
 */
export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  try {
    const supabase = createClientSupabase();
    const posts = await dbUtils.getAllPosts(supabase);
    const authorPosts = posts.filter(post => post.author_id === authorId);
    
    // Fetch author profile
    const author = await dbUtils.getUserProfile(supabase, authorId);
    if (!author) {
      console.error('Author not found:', authorId);
      return [];
    }
    
    // Map database posts to application posts
    return authorPosts.map(dbPost => mapDatabasePostToPost(dbPost, author));
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    throw new Error('Failed to fetch posts by author');
  }
} 