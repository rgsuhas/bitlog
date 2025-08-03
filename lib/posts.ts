/**
 * Post Data Access Layer
 * 
 * This module handles all data operations related to blog posts.
 * Uses Supabase database with proper error handling and type safety.
 * 
 * All functions include proper error handling and return consistent
 * data structures for reliable integration with UI components.
 */

import { Post, Author, PostStatus, PaginatedResponse, PaginationParams } from './types';
import { createServerSupabase } from './supabase/server';
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
 * Retrieves all published blog posts
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
    const supabase = createServerSupabase();
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
 * Retrieves a single blog post by its slug
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
    const supabase = createServerSupabase();
    const dbPost = await dbUtils.getPostBySlug(supabase, slug);
    
    if (!dbPost) {
      return null;
    }
    
    // Fetch author profile
    const author = await dbUtils.getUserProfile(supabase, dbPost.author_id);
    if (!author) {
      console.error(`Author not found for post: ${slug}`);
      return null;
    }
    
    return mapDatabasePostToPost(dbPost, author);
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    throw new Error(`Failed to fetch post: ${slug}`);
  }
}

/**
 * Retrieves paginated list of posts with optional filtering
 * 
 * @param params - Pagination and filtering parameters
 * @returns Promise resolving to paginated response
 * 
 * @example
 * ```typescript
 * const result = await getPaginatedPosts({
 *   page: 1,
 *   limit: 10,
 *   tag: 'React'
 * });
 * ```
 */
export async function getPaginatedPosts(params: PaginationParams): Promise<PaginatedResponse<Post>> {
  try {
    const supabase = createServerSupabase();
    const result = await dbUtils.getPaginatedPosts(supabase, {
      page: params.page,
      limit: params.limit,
      search: params.search,
      tag: params.tag,
      status: params.status
    });
    
         // Fetch author profiles for all posts
     const authorIds = Array.from(new Set(result.posts.map(post => post.author_id)));
    const authorProfiles = new Map<string, DatabaseProfile>();
    
    for (const authorId of authorIds) {
      const profile = await dbUtils.getUserProfile(supabase, authorId);
      if (profile) {
        authorProfiles.set(authorId, profile);
      }
    }
    
    // Map database posts to application posts
    const posts: Post[] = [];
    for (const dbPost of result.posts) {
      const author = authorProfiles.get(dbPost.author_id);
      if (author) {
        posts.push(mapDatabasePostToPost(dbPost, author));
      }
    }
    
    const totalPages = Math.ceil(result.total / params.limit);
    
    return {
      items: posts,
      page: params.page,
      limit: params.limit,
      total: result.total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1
    };
  } catch (error) {
    console.error('Error fetching paginated posts:', error);
    throw new Error('Failed to fetch paginated posts');
  }
}

/**
 * Retrieves all unique tags from published posts
 * Useful for creating tag filters and navigation
 * 
 * @returns Promise resolving to array of unique tags
 * 
 * @example
 * ```typescript
 * const tags = await getAllTags();
 * // ['React', 'TypeScript', 'Next.js', ...]
 * ```
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const supabase = createServerSupabase();
    const posts = await dbUtils.getAllPosts(supabase);
    
    const allTags = posts.flatMap(post => post.tags || []);
    const uniqueTags = Array.from(new Set(allTags));
    
    // Sort tags alphabetically
    return uniqueTags.sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }
}

/**
 * Retrieves posts by a specific author
 * 
 * @param authorId - Unique identifier for the author
 * @returns Promise resolving to array of posts by the author
 * 
 * @example
 * ```typescript
 * const authorPosts = await getPostsByAuthor('1');
 * ```
 */
export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  try {
    const supabase = createServerSupabase();
    
    // Get all posts and filter by author
    const allPosts = await dbUtils.getAllPosts(supabase);
    const authorPosts = allPosts.filter(post => post.author_id === authorId);
    
    // Fetch author profile
    const author = await dbUtils.getUserProfile(supabase, authorId);
    if (!author) {
      console.error(`Author not found: ${authorId}`);
      return [];
    }
    
    // Map database posts to application posts
    return authorPosts.map(dbPost => mapDatabasePostToPost(dbPost, author));
  } catch (error) {
    console.error(`Error fetching posts by author "${authorId}":`, error);
    throw new Error(`Failed to fetch posts by author: ${authorId}`);
  }
}

/**
 * Creates a new blog post
 * 
 * @param postData - Post data to create
 * @returns Promise resolving to the created post
 */
export async function createPost(postData: {
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  tags?: string[];
  status?: PostStatus;
  featured?: boolean;
  coverImage?: string;
  metaDescription?: string;
}): Promise<Post> {
  try {
    const supabase = createServerSupabase();
    
    const dbPost = await dbUtils.createPost(supabase, {
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt || '',
      author_id: postData.authorId,
      tags: postData.tags || [],
      status: postData.status || 'draft',
      featured: postData.featured || false,
      cover_image: postData.coverImage,
      meta_description: postData.metaDescription,
      read_time: Math.ceil(postData.content.split(' ').length / 200), // Rough estimate
      slug: postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      published_at: postData.status === 'published' ? new Date().toISOString() : null
    });
    
    if (!dbPost) {
      throw new Error('Failed to create post');
    }
    
    // Fetch author profile
    const author = await dbUtils.getUserProfile(supabase, postData.authorId);
    if (!author) {
      throw new Error('Author not found');
    }
    
    return mapDatabasePostToPost(dbPost, author);
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}

/**
 * Updates an existing blog post
 * 
 * @param postId - ID of the post to update
 * @param updates - Post data to update
 * @returns Promise resolving to the updated post
 */
export async function updatePost(postId: string, updates: Partial<{
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: PostStatus;
  featured: boolean;
  coverImage: string;
  metaDescription: string;
}>): Promise<Post> {
  try {
    const supabase = createServerSupabase();
    
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
    if (updates.metaDescription !== undefined) updateData.meta_description = updates.metaDescription;
    
    // Update read time if content changed
    if (updates.content !== undefined) {
      updateData.read_time = Math.ceil(updates.content.split(' ').length / 200);
    }
    
    // Update published_at if status changed to published
    if (updates.status === 'published') {
      updateData.published_at = new Date().toISOString();
    }
    
    const dbPost = await dbUtils.updatePost(supabase, postId, updateData);
    
    if (!dbPost) {
      throw new Error('Failed to update post');
    }
    
    // Fetch author profile
    const author = await dbUtils.getUserProfile(supabase, dbPost.author_id);
    if (!author) {
      throw new Error('Author not found');
    }
    
    return mapDatabasePostToPost(dbPost, author);
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }
}

/**
 * Deletes a blog post
 * 
 * @param postId - ID of the post to delete
 * @returns Promise resolving to success status
 */
export async function deletePost(postId: string): Promise<boolean> {
  try {
    const supabase = createServerSupabase();
    return await dbUtils.deletePost(supabase, postId);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
}