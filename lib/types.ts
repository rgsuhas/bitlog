/**
 * Type definitions for the Cloud Markdown Blog Platform
 * 
 * This file contains all TypeScript interfaces and types used throughout the application.
 * Centralizing type definitions ensures consistency, improves maintainability, and
 * provides better IDE support with autocompletion and error checking.
 */

/**
 * Represents an author of blog posts
 * Used for attribution and author information display
 */
export interface Author {
  /** Unique identifier for the author */
  id: string;
  /** Full name of the author */
  name: string;
  /** Author's email address (optional, for contact purposes) */
  email?: string;
  /** URL to author's profile image */
  avatar?: string;
  /** Fallback initials for avatar display when image is unavailable */
  initials: string;
  /** Short biography or description of the author */
  bio?: string;
  /** Author's social media or website URL */
  website?: string;
}

/**
 * Represents the publication status of a blog post
 * Controls visibility and access to posts
 */
export type PostStatus = 'draft' | 'published' | 'archived';

/**
 * Represents a complete blog post with all metadata
 * This is the core data structure for all blog content
 */
export interface Post {
  /** Unique identifier for the post */
  id: string;
  /** URL-friendly slug for routing (e.g., "my-first-post") */
  slug: string;
  /** Post title displayed in headers and meta tags */
  title: string;
  /** Brief description/excerpt for previews and SEO */
  excerpt: string;
  /** Full markdown content of the post */
  content: string;
  /** Author information */
  author: Author;
  /** Publication date in ISO string format */
  publishedAt: string;
  /** Last modification date in ISO string format */
  updatedAt: string;
  /** Current publication status */
  status: PostStatus;
  /** Estimated reading time in minutes */
  readTime: number;
  /** Array of tags for categorization and filtering */
  tags: string[];
  /** Whether this post should be featured on the homepage */
  featured: boolean;
  /** Optional cover image URL for the post */
  coverImage?: string;
  /** SEO meta description (falls back to excerpt if not provided) */
  metaDescription?: string;
  /** View count for analytics (optional) */
  viewCount?: number;
}

/**
 * Represents the structure for creating a new post
 * Omits auto-generated fields like id, dates, and view count
 */
export type CreatePostData = Omit<Post, 'id' | 'publishedAt' | 'updatedAt' | 'viewCount'>;

/**
 * Represents the structure for updating an existing post
 * All fields are optional except id, allowing partial updates
 */
export type UpdatePostData = Partial<Omit<Post, 'id'>> & { id: string };

/**
 * API response wrapper for consistent error handling
 * Used by all API endpoints to provide uniform response structure
 */
export interface ApiResponse<T = any> {
  /** Whether the request was successful */
  success: boolean;
  /** Response data (present on success) */
  data?: T;
  /** Error message (present on failure) */
  error?: string;
  /** Additional error details for debugging */
  details?: any;
}

/**
 * Pagination parameters for list endpoints
 * Enables efficient loading of large datasets
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Optional search query */
  search?: string;
  /** Optional tag filter */
  tag?: string;
  /** Optional status filter */
  status?: PostStatus;
}

/**
 * Paginated response structure
 * Provides metadata for pagination UI components
 */
export interface PaginatedResponse<T> {
  /** Array of items for current page */
  items: T[];
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items across all pages */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there are more pages after current */
  hasNext: boolean;
  /** Whether there are pages before current */
  hasPrev: boolean;
}


// types/index.ts
export interface PageParams {
  params: { slug: string };
}
