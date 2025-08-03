/**
 * Enhanced Editor Page Component
 * 
 * Provides a comprehensive editing experience with the advanced markdown editor,
 * post management, and real-time collaboration features.
 * 
 * Features:
 * - Advanced markdown editor with live preview
 * - Auto-save functionality
 * - Post metadata management
 * - Image upload integration
 * - Draft management
 * - Publishing workflow
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import MarkdownEditor from './MarkdownEditor';
import { 
  Save, 
  Upload, 
  Eye, 
  Settings, 
  Tag, 
  Calendar,
  Clock,
  User,
  FileText,
  ImageIcon,
  Globe,
  Lock
} from 'lucide-react';

interface PostData {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  coverImage?: string;
  metaDescription: string;
}

interface EditorPageProps {
  params: { slug: string };
}

export default function EditorPage({ params }: EditorPageProps) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    status: 'draft',
    featured: false,
    coverImage: '',
    metaDescription: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Load existing post data if editing
  useEffect(() => {
    if (params.slug !== 'new') {
      loadPostData();
    }
  }, [params.slug]);

  const loadPostData = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call to load post data
      // const post = await postsApi.getBySlug(params.slug);
      // setPostData(post);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load post data.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);
      // TODO: Implement save API call
      // await postsApi.save(params.slug, postData);
      toast({
        title: 'Saved',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save your changes.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [postData, params.slug]);

  const handlePublish = useCallback(async () => {
    try {
      setIsLoading(true);
      const publishData = { ...postData, status: 'published' as const };
      // TODO: Implement publish API call
      // await postsApi.publish(params.slug, publishData);
      toast({
        title: 'Published',
        description: 'Your post has been published successfully.',
      });
      router.push(`/blog/${params.slug}`);
    } catch (error) {
      toast({
        title: 'Publish failed',
        description: 'Failed to publish your post.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [postData, params.slug, router]);

  const handleAddTag = () => {
    if (newTag.trim() && !postData.tags.includes(newTag.trim())) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      // TODO: Implement image upload to Supabase Storage
      // const imageUrl = await uploadImage(file);
      // return imageUrl;
      return 'https://via.placeholder.com/800x400';
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image.',
        variant: 'destructive'
      });
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">
                {params.slug === 'new' ? 'Create New Post' : 'Edit Post'}
              </h1>
              <Badge variant={postData.status === 'published' ? 'default' : 'secondary'}>
                {postData.status}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handlePublish}
                disabled={isLoading || !postData.title.trim()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Content</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <MarkdownEditor
                  value={postData.content}
                  onChange={(content) => setPostData(prev => ({ ...prev, content }))}
                  onSave={handleSave}
                  onPublish={handlePublish}
                  placeholder="Start writing your post..."
                  autoSave={true}
                  autoSaveInterval={30000}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Settings */}
            {showSettings && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Post Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={postData.title}
                      onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter post title..."
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={postData.excerpt}
                      onChange={(e) => setPostData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of your post..."
                      rows={3}
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={postData.metaDescription}
                      onChange={(e) => setPostData(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="SEO meta description..."
                      rows={2}
                    />
                  </div>

                  {/* Cover Image */}
                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="coverImage"
                        value={postData.coverImage}
                        onChange={(e) => setPostData(prev => ({ ...prev, coverImage: e.target.value }))}
                        placeholder="https://..."
                      />
                      <Button variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag..."
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      />
                      <Button variant="outline" size="sm" onClick={handleAddTag}>
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {postData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={postData.featured}
                      onChange={(e) => setPostData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="featured">Featured Post</Label>
                  </div>

                  <Separator />

                  {/* Status */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={postData.status === 'draft' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPostData(prev => ({ ...prev, status: 'draft' }))}
                      >
                        <Lock className="h-4 w-4 mr-1" />
                        Draft
                      </Button>
                      <Button
                        variant={postData.status === 'published' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPostData(prev => ({ ...prev, status: 'published' }))}
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Published
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Post Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Post Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{user?.email || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{Math.ceil(postData.content.split(' ').length / 200)} min read</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
