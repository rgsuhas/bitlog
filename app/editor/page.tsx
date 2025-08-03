'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  EyeOff, 
  FileText, 
  Tag, 
  Calendar,
  ArrowLeft,
  Send
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function EditorPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    featured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, you'd save this to your database
      console.log('Saving post:', formData);
      
      toast({
        title: "Post saved",
        description: `Post "${formData.title}" has been saved as ${formData.status}.`,
      });

      // Reset form after successful save
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        status: 'draft',
        featured: false
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-100 text-green-800">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Post Editor</h1>
          <p className="text-muted-foreground">Please sign in to create posts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
                <p className="text-muted-foreground">Write and publish your content</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(formData.status)}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
              >
                {isPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {isPreview ? 'Hide Preview' : 'Preview'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {isPreview ? 'Preview' : 'Editor'}
                </CardTitle>
                <CardDescription>
                  {isPreview ? 'Preview your post' : 'Write your post content'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPreview ? (
                  <div className="prose max-w-none">
                    <h1>{formData.title || 'Untitled Post'}</h1>
                    {formData.excerpt && (
                      <p className="text-lg text-muted-foreground italic">{formData.excerpt}</p>
                    )}
                    <div className="whitespace-pre-wrap">{formData.content}</div>
                    {formData.tags && (
                      <div className="flex gap-2 mt-4">
                        {formData.tags.split(',').map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter your post title..."
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        placeholder="Brief description of your post..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        placeholder="Write your post content here..."
                        rows={15}
                        className="font-mono"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                        placeholder="tag1, tag2, tag3"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separate tags with commas
                      </p>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
                <CardDescription>
                  Configure how your post will be published
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="featured">Featured Post</Label>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !formData.title}
                    onClick={handleSubmit}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Post'}
                  </Button>
                </div>

                {formData.status === 'draft' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={isLoading || !formData.title}
                    onClick={() => {
                      handleInputChange('status', 'published');
                      handleSubmit(new Event('submit') as any);
                    }}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Publish Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Post Info */}
            <Card>
              <CardHeader>
                <CardTitle>Post Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Created: {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formData.tags ? formData.tags.split(',').length : 0} tags
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formData.content.length} characters
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Writing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Write engaging titles that grab attention</p>
                <p>• Use clear, concise language</p>
                <p>• Break up text with headings and lists</p>
                <p>• Add relevant tags for better discoverability</p>
                <p>• Preview your post before publishing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
