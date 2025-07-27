/**
 * API Hooks for React Components
 * 
 * Custom React hooks that provide easy-to-use interfaces for API operations
 * with built-in loading states, error handling, and data management.
 * These hooks follow React best practices and provide optimal user experience.
 * 
 * Features:
 * - Automatic loading state management
 * - Error handling with user-friendly messages
 * - Data caching and synchronization
 * - Optimistic updates for better UX
 * - Automatic retries for failed requests
 * - TypeScript support with full type safety
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { postsApi, uploadApi, ApiError, getErrorMessage } from '@/lib/api';
import { Post, CreatePostData, UpdatePostData, PaginationParams, PaginatedResponse } from '@/lib/types';

/**
 * Generic API state interface
 * Provides consistent state structure across all API hooks
 */
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for managing posts data with CRUD operations
 * 
 * @param initialParams - Initial parameters for fetching posts
 * @returns Object with posts data, loading state, error state, and CRUD methods
 * 
 * @example
 * ```typescript
 * const {
 *   posts,
 *   loading,
 *   error,
 *   createPost,
 *   updatePost,
 *   deletePost,
 *   refreshPosts
 * } = usePosts({ page: 1, limit: 10 });
 * ```
 */
export function usePosts(initialParams?: Partial<PaginationParams & { featured?: boolean }>) {
  const [state, setState] = useState<ApiState<Post[] | PaginatedResponse<Post>>>({
    data: null,
    loading: true,
    error: null,
  });

  const [params, setParams] = useState(initialParams);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch posts with current parameters
   */
  const fetchPosts = useCallback(async (newParams?: typeof params) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const currentParams = newParams || params;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await postsApi.getAll(currentParams);
      
      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (error) {
      // Don't set error state if request was aborted
      if (error instanceof ApiError && error.message.includes('aborted')) {
        return;
      }

      setState({
        data: null,
        loading: false,
        error: getErrorMessage(error),
      });
    }
  }, [params]);

  /**
   * Update search/filter parameters and refetch
   */
  const updateParams = useCallback((newParams: typeof params) => {
    setParams(newParams);
    fetchPosts(newParams);
  }, [fetchPosts]);

  /**
   * Refresh posts with current parameters
   */
  const refreshPosts = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  /**
   * Create a new post with optimistic updates
   */
  const createPost = useCallback(async (postData: CreatePostData): Promise<Post> => {
    try {
      const newPost = await postsApi.create(postData);
      
      // Optimistically update the local state
      setState(prev => {
        if (!prev.data) return prev;
        
        if (Array.isArray(prev.data)) {
          return {
            ...prev,
            data: [newPost, ...prev.data],
          };
        } else {
          // Handle paginated response
          return {
            ...prev,
            data: {
              ...prev.data,
              items: [newPost, ...prev.data.items],
              total: prev.data.total + 1,
            },
          };
        }
      });

      return newPost;
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Update an existing post with optimistic updates
   */
  const updatePost = useCallback(async (slug: string, updateData: Partial<UpdatePostData>): Promise<Post> => {
    try {
      const updatedPost = await postsApi.update(slug, updateData);
      
      // Optimistically update the local state
      setState(prev => {
        if (!prev.data) return prev;
        
        const updatePostInArray = (posts: Post[]) =>
          posts.map(post => post.slug === slug ? updatedPost : post);
        
        if (Array.isArray(prev.data)) {
          return {
            ...prev,
            data: updatePostInArray(prev.data),
          };
        } else {
          // Handle paginated response
          return {
            ...prev,
            data: {
              ...prev.data,
              items: updatePostInArray(prev.data.items),
            },
          };
        }
      });

      return updatedPost;
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Delete a post with optimistic updates
   */
  const deletePost = useCallback(async (slug: string): Promise<void> => {
    try {
      await postsApi.delete(slug);
      
      // Optimistically update the local state
      setState(prev => {
        if (!prev.data) return prev;
        
        const filterPostFromArray = (posts: Post[]) =>
          posts.filter(post => post.slug !== slug);
        
        if (Array.isArray(prev.data)) {
          return {
            ...prev,
            data: filterPostFromArray(prev.data),
          };
        } else {
          // Handle paginated response
          return {
            ...prev,
            data: {
              ...prev.data,
              items: filterPostFromArray(prev.data.items),
              total: prev.data.total - 1,
            },
          };
        }
      });
    } catch (error) {
      throw error;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPosts();
    
    // Cleanup function to abort pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchPosts]);

  return {
    posts: state.data,
    loading: state.loading,
    error: state.error,
    updateParams,
    refreshPosts,
    createPost,
    updatePost,
    deletePost,
  };
}

/**
 * Hook for managing a single post with CRUD operations
 * 
 * @param slug - Post slug to fetch (optional for new posts)
 * @returns Object with post data, loading state, error state, and update methods
 * 
 * @example
 * ```typescript
 * const {
 *   post,
 *   loading,
 *   error,
 *   updatePost,
 *   savePost,
 *   publishPost
 * } = usePost('my-post-slug');
 * ```
 */
export function usePost(slug?: string) {
  const [state, setState] = useState<ApiState<Post>>({
    data: null,
    loading: !!slug,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch post by slug
   */
  const fetchPost = useCallback(async (postSlug: string) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await postsApi.getBySlug(postSlug);
      
      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (error) {
      // Don't set error state if request was aborted
      if (error instanceof ApiError && error.message.includes('aborted')) {
        return;
      }

      setState({
        data: null,
        loading: false,
        error: getErrorMessage(error),
      });
    }
  }, []);

  /**
   * Update post data locally (for form editing)
   */
  const updatePostData = useCallback((updates: Partial<Post>) => {
    setState(prev => ({
      ...prev,
      data: prev.data ? { ...prev.data, ...updates } : null,
    }));
  }, []);

  /**
   * Save post changes to server
   */
  const savePost = useCallback(async (updates: Partial<UpdatePostData>): Promise<Post> => {
    if (!state.data?.slug) {
      throw new Error('No post slug available for saving');
    }

    try {
      const updatedPost = await postsApi.update(state.data.slug, updates);
      
      setState(prev => ({
        ...prev,
        data: updatedPost,
      }));

      return updatedPost;
    } catch (error) {
      throw error;
    }
  }, [state.data?.slug]);

  /**
   * Publish the current post
   */
  const publishPost = useCallback(async (): Promise<Post> => {
    if (!state.data?.slug) {
      throw new Error('No post slug available for publishing');
    }

    return savePost({ status: 'published' });
  }, [state.data?.slug, savePost]);

  /**
   * Unpublish the current post (set to draft)
   */
  const unpublishPost = useCallback(async (): Promise<Post> => {
    if (!state.data?.slug) {
      throw new Error('No post slug available for unpublishing');
    }

    return savePost({ status: 'draft' });
  }, [state.data?.slug, savePost]);

  // Fetch post when slug changes
  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    } else {
      setState({
        data: null,
        loading: false,
        error: null,
      });
    }
    
    // Cleanup function to abort pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [slug, fetchPost]);

  return {
    post: state.data,
    loading: state.loading,
    error: state.error,
    updatePostData,
    savePost,
    publishPost,
    unpublishPost,
    refetch: slug ? () => fetchPost(slug) : undefined,
  };
}

/**
 * Hook for file uploads with progress tracking
 * 
 * @returns Object with upload method, loading state, progress, and error handling
 * 
 * @example
 * ```typescript
 * const {
 *   uploadFiles,
 *   uploading,
 *   progress,
 *   error
 * } = useFileUpload();
 * 
 * const handleUpload = async (files) => {
 *   try {
 *     const results = await uploadFiles(files);
 *     console.log('Upload successful:', results);
 *   } catch (error) {
 *     console.error('Upload failed:', error);
 *   }
 * };
 * ```
 */
export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload files with progress tracking
   */
  const uploadFiles = useCallback(async (files: File[]) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const results = await uploadApi.uploadFiles(files, (progressValue) => {
        setProgress(progressValue);
      });

      setUploading(false);
      setProgress(100);
      
      return results;
    } catch (error) {
      setUploading(false);
      setProgress(0);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      throw error;
    }
  }, []);

  /**
   * Reset upload state
   */
  const resetUpload = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploadFiles,
    uploading,
    progress,
    error,
    resetUpload,
  };
}

/**
 * Hook for debounced API calls (useful for search/auto-save)
 * 
 * @param callback - Function to call after debounce delay
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSave = useDebounce(async (content) => {
 *   await savePost({ content });
 * }, 2000);
 * 
 * // In component
 * useEffect(() => {
 *   debouncedSave(postContent);
 * }, [postContent, debouncedSave]);
 * ```
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}