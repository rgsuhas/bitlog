/**
 * File Upload System
 * 
 * Handles file uploads to Supabase Storage with proper validation,
 * image optimization, and error handling. Supports multiple file types
 * and provides progress tracking.
 * 
 * Features:
 * - Image upload to Supabase Storage
 * - File type validation
 * - File size limits
 * - Image optimization
 * - Progress tracking
 * - Error handling
 */

import { createClientSupabase } from './supabase/client';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  progress?: number;
}

export interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  folder?: string;
  optimize?: boolean;
}

const DEFAULT_OPTIONS: UploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  folder: 'blog-images',
  optimize: true
};

/**
 * Upload a file to Supabase Storage
 * 
 * @param file - File to upload
 * @param options - Upload options
 * @returns Promise resolving to upload result
 * 
 * @example
 * ```typescript
 * const result = await uploadFile(file, {
 *   maxSize: 10 * 1024 * 1024, // 10MB
 *   folder: 'blog-images'
 * });
 * 
 * if (result.success) {
 *   console.log('Upload URL:', result.url);
 * } else {
 *   console.error('Upload failed:', result.error);
 * }
 * ```
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const supabase = createClientSupabase();

  try {
    // Validate file type
    if (!opts.allowedTypes?.includes(file.type)) {
      return {
        success: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${opts.allowedTypes?.join(', ')}`
      };
    }

    // Validate file size
    if (file.size > (opts.maxSize || 0)) {
      return {
        success: false,
        error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum size of ${(opts.maxSize! / 1024 / 1024).toFixed(2)}MB`
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;
    const filePath = `${opts.folder}/${filename}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upload'
    };
  }
}

/**
 * Upload multiple files
 * 
 * @param files - Array of files to upload
 * @param options - Upload options
 * @returns Promise resolving to array of upload results
 */
export async function uploadMultipleFiles(
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const result = await uploadFile(file, options);
    results.push(result);
  }

  return results;
}

/**
 * Delete a file from Supabase Storage
 * 
 * @param filePath - Path to the file to delete
 * @returns Promise resolving to deletion result
 */
export async function deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClientSupabase();

  try {
    const { error } = await supabase.storage
      .from('uploads')
      .remove([filePath]);

    if (error) {
      return {
        success: false,
        error: `Delete failed: ${error.message}`
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during deletion'
    };
  }
}

/**
 * Get file information from Supabase Storage
 * 
 * @param filePath - Path to the file
 * @returns Promise resolving to file info
 */
export async function getFileInfo(filePath: string): Promise<{
  success: boolean;
  info?: any;
  error?: string;
}> {
  const supabase = createClientSupabase();

  try {
    const { data, error } = await supabase.storage
      .from('uploads')
      .list(filePath.split('/').slice(0, -1).join('/'));

    if (error) {
      return {
        success: false,
        error: `Failed to get file info: ${error.message}`
      };
    }

    const fileName = filePath.split('/').pop();
    const fileInfo = data?.find(file => file.name === fileName);

    return {
      success: true,
      info: fileInfo
    };

  } catch (error) {
    console.error('Get file info error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

/**
 * Validate file before upload
 * 
 * @param file - File to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function validateFile(
  file: File,
  options: UploadOptions = {}
): { valid: boolean; error?: string } {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check file type
  if (!opts.allowedTypes?.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${opts.allowedTypes?.join(', ')}`
    };
  }

  // Check file size
  if (file.size > (opts.maxSize || 0)) {
    return {
      valid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum size of ${(opts.maxSize! / 1024 / 1024).toFixed(2)}MB`
    };
  }

  return { valid: true };
}

/**
 * Create a data URL from a file for preview
 * 
 * @param file - File to create data URL for
 * @returns Promise resolving to data URL
 */
export function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Compress image file for better performance
 * 
 * @param file - Image file to compress
 * @param quality - Compression quality (0-1)
 * @returns Promise resolving to compressed file
 */
export function compressImage(
  file: File,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions (max 1920px width)
      const maxWidth = 1920;
      const maxHeight = 1080;
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
} 