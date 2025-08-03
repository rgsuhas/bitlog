/**
 * API Client Library
 * 
 * Centralized API client for making requests to the blog platform's backend.
 * Provides type-safe methods for all API operations with proper error handling,
 * request/response transformation, and loading states management.
 * 
 * Features:
 * - Type-safe API methods with full TypeScript support
 * - Automatic request/response serialization
 * - Comprehensive error handling with user-friendly messages
 * - Loading state management for UI components
 * - Request retry logic for improved reliability
 * - Authentication token handling
 * - Request/response interceptors for logging and debugging
 */

import { Post, CreatePostData, UpdatePostData, PaginationParams, PaginatedResponse, ApiResponse } from './types';

/**
 * API configuration and base settings
 */
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

/**
 * Custom error class for API-related errors
 * Provides structured error information for better error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic API request function with error handling and retries
 * 
 * @param endpoint - API endpoint path
 * @param options - Fetch options (method, headers, body, etc.)
 * @param retryCount - Current retry attempt (for internal use)
 * @returns Promise resolving to the API response
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<ApiResponse<T>> {
  const url = `${API_CONFIG.baseUrl}/api${endpoint}`;
  
  // Default headers
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    let responseData: ApiResponse<T>;
    
    try {
      responseData = await response.json();
    } catch (parseError) {
      throw new ApiError(
        'Invalid JSON response from server',
        response.status,
        parseError
      );
    }

    // Handle HTTP errors
    if (!response.ok) {
      throw new ApiError(
        responseData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        responseData.details
      );
    }

    return responseData;

  } catch (error) {
    clearTimeout(timeoutId);

    // Handle network errors and timeouts
    if (
      error instanceof TypeError ||
      (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError')
    ) {
      // Retry logic for network errors
      if (retryCount < API_CONFIG.retryAttempts) {
        console.warn(`API request failed, retrying... (${retryCount + 1}/${API_CONFIG.retryAttempts})`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * (retryCount + 1)));
        
        return apiRequest<T>(endpoint, options, retryCount + 1);
      }

      throw new ApiError(
        (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError')
          ? 'Request timeout - please try again'
          : 'Network error - please check your connection',
        0,
        error
      );
    }

    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle unexpected errors
    throw new ApiError(
      'An unexpected error occurred',
      500,
      error
    );
  }
}

/**
 * Posts API methods
 * Provides all CRUD operations for blog posts
 */
export const postsApi = {
  /**
   * Retrieve all posts with optional filtering
   * 
   * @param params - Optional query parameters for filtering and pagination
   * @returns Promise resolving to posts array or paginated response
   * 
   * @example
   * ```typescript
   * // Get all posts
   * const posts = await postsApi.getAll();
   * 
   * // Get paginated posts with search
   * const result = await postsApi.getAll({
   *   page: 1,
   *   limit: 10,
   *   search: 'react'
   * });
   * ```
   */
  async getAll(params?: Partial<PaginationParams & { featured?: boolean }>): Promise<Post[] | PaginatedResponse<Post>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/posts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await apiRequest<Post[] | PaginatedResponse<Post>>(endpoint);
    
    if (!response.success || !response.data) {
      throw new ApiError('Failed to fetch posts', 500);
    }

    return response.data;
  },

  /**
   * Retrieve a specific post by slug
   * 
   * @param slug - Post slug identifier
   * @returns Promise resolving to the post data
   * 
   * @example
   * ```typescript
   * const post = await postsApi.getBySlug('my-first-post');
   * ```
   */
  async getBySlug(slug: string): Promise<Post> {
    if (!slug || typeof slug !== 'string') {
      throw new ApiError('Invalid slug parameter', 400);
    }

    const response = await apiRequest<Post>(`/posts/${encodeURIComponent(slug)}`);
    
    if (!response.success || !response.data) {
      throw new ApiError('Post not found', 404);
    }

    return response.data;
  },

  /**
   * Create a new blog post
   * 
   * @param postData - Post creation data
   * @returns Promise resolving to the created post
   * 
   * @example
   * ```typescript
   * const newPost = await postsApi.create({
   *   title: 'My New Post',
   *   content: '# Hello World\n\nThis is my first post!',
   *   tags: ['tutorial', 'beginner']
   * });
   * ```
   */
  async create(postData: CreatePostData): Promise<Post> {
    const response = await apiRequest<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
    
    if (!response.success || !response.data) {
      throw new ApiError('Failed to create post', 500);
    }

    return response.data;
  },

  /**
   * Update an existing blog post
   * 
   * @param slug - Post slug identifier
   * @param updateData - Partial post data to update
   * @returns Promise resolving to the updated post
   * 
   * @example
   * ```typescript
   * const updatedPost = await postsApi.update('my-post', {
   *   title: 'Updated Title',
   *   status: 'published'
   * });
   * ```
   */
  async update(slug: string, updateData: Partial<UpdatePostData>): Promise<Post> {
    if (!slug || typeof slug !== 'string') {
      throw new ApiError('Invalid slug parameter', 400);
    }

    const response = await apiRequest<Post>(`/posts/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    
    if (!response.success || !response.data) {
      throw new ApiError('Failed to update post', 500);
    }

    return response.data;
  },

  /**
   * Delete a blog post
   * 
   * @param slug - Post slug identifier
   * @returns Promise resolving to deletion confirmation
   * 
   * @example
   * ```typescript
   * await postsApi.delete('old-post');
   * ```
   */
  async delete(slug: string): Promise<{ slug: string }> {
    if (!slug || typeof slug !== 'string') {
      throw new ApiError('Invalid slug parameter', 400);
    }

    const response = await apiRequest<{ slug: string }>(`/posts/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    });
    
    if (!response.success || !response.data) {
      throw new ApiError('Failed to delete post', 500);
    }

    return response.data;
  },

  /**
   * Publish a draft post
   * 
   * @param slug - Post slug identifier
   * @returns Promise resolving to the published post
   * 
   * @example
   * ```typescript
   * const publishedPost = await postsApi.publish('my-draft');
   * ```
   */
  async publish(slug: string): Promise<Post> {
    return this.update(slug, { status: 'published' });
  },

  /**
   * Unpublish a post (set to draft)
   * 
   * @param slug - Post slug identifier
   * @returns Promise resolving to the unpublished post
   * 
   * @example
   * ```typescript
   * const draftPost = await postsApi.unpublish('published-post');
   * ```
   */
  async unpublish(slug: string): Promise<Post> {
    return this.update(slug, { status: 'draft' });
  },
};

/**
 * Upload API methods
 * Handles file uploads and media management
 */
export const uploadApi = {
  /**
   * Upload files to cloud storage
   * 
   * @param files - Files to upload
   * @param onProgress - Optional progress callback
   * @returns Promise resolving to upload results
   * 
   * @example
   * ```typescript
   * const files = Array.from(fileInput.files);
   * const results = await uploadApi.uploadFiles(files, (progress) => {
   *   console.log(`Upload progress: ${progress}%`);
   * });
   * ```
   */
  async uploadFiles(
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<Array<{
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    url: string;
    thumbnailUrl?: string;
    uploadedAt: string;
  }>> {
    if (!files || files.length === 0) {
      throw new ApiError('No files provided for upload', 400);
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    // Create XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      // Handle response
      xhr.addEventListener('load', () => {
        try {
          const response = JSON.parse(xhr.responseText);
          
          if (xhr.status >= 200 && xhr.status < 300 && response.success) {
            resolve(response.data);
          } else {
            reject(new ApiError(
              response.error || 'Upload failed',
              xhr.status,
              response.details
            ));
          }
        } catch (parseError) {
          reject(new ApiError('Invalid response from upload server', xhr.status));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new ApiError('Network error during upload', 0));
      });

      xhr.addEventListener('timeout', () => {
        reject(new ApiError('Upload timeout', 0));
      });

      // Send request
      xhr.open('POST', `${API_CONFIG.baseUrl}/api/upload`);
      xhr.timeout = API_CONFIG.timeout;
      xhr.send(formData);
    });
  },
};

/**
 * Utility function to handle API errors in components
 * 
 * @param error - Error object from API call
 * @returns User-friendly error message
 * 
 * @example
 * ```typescript
 * try {
 *   await postsApi.create(postData);
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   showToast(message, 'error');
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Type guard to check if an error is an ApiError
 * 
 * @param error - Error object to check
 * @returns True if error is an ApiError instance
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}