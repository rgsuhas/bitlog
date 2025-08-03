/**
 * Image Upload Component
 * 
 * A comprehensive image upload component with drag-and-drop support,
 * file validation, preview, and progress tracking. Integrates with
 * the upload system for seamless file handling.
 * 
 * Features:
 * - Drag and drop support
 * - File validation
 * - Image preview
 * - Progress tracking
 * - Multiple file support
 * - Error handling
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { uploadFile, validateFile, compressImage, type UploadResult } from '@/lib/upload';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Download
} from 'lucide-react';

interface ImageUploadProps {
  onUpload?: (url: string) => void;
  onError?: (error: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  allowedTypes?: string[];
  className?: string;
}

interface FileUploadItem {
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

export default function ImageUpload({
  onUpload,
  onError,
  multiple = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  className = ''
}: ImageUploadProps) {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (selectedFiles: FileList) => {
    const newFiles: FileUploadItem[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Validate file
      const validation = validateFile(file, { maxSize, allowedTypes });
      if (!validation.valid) {
        toast({
          title: 'Invalid file',
          description: validation.error,
          variant: 'destructive'
        });
        continue;
      }

      // Create preview
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      newFiles.push({
        file,
        preview,
        status: 'uploading',
        progress: 0
      });
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      await uploadFiles(newFiles);
    }
  }, [maxSize, allowedTypes]);

  const uploadFiles = async (filesToUpload: FileUploadItem[]) => {
    setIsUploading(true);

    for (let i = 0; i < filesToUpload.length; i++) {
      const fileItem = filesToUpload[i];
      const fileIndex = files.findIndex(f => f.file === fileItem.file);

      try {
        // Compress image if needed
        let fileToUpload = fileItem.file;
        if (fileToUpload.size > 1024 * 1024) { // 1MB
          fileToUpload = await compressImage(fileToUpload, 0.8);
        }

        // Upload file
        const result = await uploadFile(fileToUpload, {
          maxSize,
          allowedTypes,
          folder: 'blog-images'
        });

        if (result.success && result.url) {
          setFiles(prev => prev.map((f, index) => 
            index === fileIndex 
              ? { ...f, status: 'success', url: result.url, progress: 100 }
              : f
          ));

          onUpload?.(result.url);
          toast({
            title: 'Upload successful',
            description: `${fileItem.file.name} uploaded successfully.`
          });
        } else {
          setFiles(prev => prev.map((f, index) => 
            index === fileIndex 
              ? { ...f, status: 'error', error: result.error, progress: 0 }
              : f
          ));

          onError?.(result.error || 'Upload failed');
          toast({
            title: 'Upload failed',
            description: result.error || 'Failed to upload file.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        setFiles(prev => prev.map((f, index) => 
          index === fileIndex 
            ? { ...f, status: 'error', error: 'Upload failed', progress: 0 }
            : f
        ));

        onError?.('Upload failed');
        toast({
          title: 'Upload failed',
          description: 'An unexpected error occurred.',
          variant: 'destructive'
        });
      }
    }

    setIsUploading(false);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleFileSelect(selectedFiles);
    }
  }, [handleFileSelect]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}>
        <CardContent className="p-6">
          <div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Drop images here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: {allowedTypes.join(', ')} (max {Math.round(maxSize / 1024 / 1024)}MB)
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={openFileDialog}
              disabled={isUploading}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Select Images
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              accept={allowedTypes.join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded Files</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-4">
                  {/* Preview */}
                  <div className="relative aspect-video mb-3">
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full h-full object-cover rounded"
                    />
                    {file.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                        <div className="text-white text-sm">Uploading...</div>
                      </div>
                    )}
                    {file.status === 'success' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                    {file.status === 'error' && (
                      <div className="absolute top-2 right-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate" title={file.file.name}>
                        {file.file.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant={file.status === 'success' ? 'default' : 'secondary'}>
                        {file.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)}MB
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="h-1" />
                    )}

                    {/* Error Message */}
                    {file.status === 'error' && file.error && (
                      <p className="text-xs text-red-500">{file.error}</p>
                    )}

                    {/* Success Actions */}
                    {file.status === 'success' && file.url && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(file.url!)}
                          className="flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Copy URL
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 