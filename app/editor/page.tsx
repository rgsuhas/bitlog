/**
 * Editor Landing Page Component
 * 
 * Provides an overview of the editor functionality and allows users to
 * create new posts or edit existing ones. This page serves as the entry
 * point to the editor experience with a clean, intuitive interface.
 * 
 * Features:
 * - Create new post functionality
 * - Recent drafts overview
 * - Quick access to editor features
 * - Responsive design with modern aesthetics
 */

import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllPosts } from '@/lib/posts';
import { Post } from '@/lib/types';
import { 
  PenTool, 
  Plus, 
  FileText, 
  Clock, 
  Edit3,
  Sparkles,
  BookOpen,
  Save
} from 'lucide-react';

/**
 * Recent Drafts Component
 * 
 * Displays a list of recent draft posts for quick access
 */
async function RecentDrafts() {
  try {
    // In production, this would fetch drafts from the database
    const allPosts = await getAllPosts();
    const drafts = allPosts.filter(post => post.status === 'draft').slice(0, 3);

    if (drafts.length === 0) {
      return (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No drafts yet. Start writing your first post!</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drafts.map((post) => (
          <Card key={post.id} className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">Draft</Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                <Link href={`/editor/${post.slug}`}>
                  {post.title || 'Untitled Post'}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {post.excerpt || 'No description yet...'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {post.readTime} min read
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/editor/${post.slug}`}>
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error loading drafts:', error);
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Unable to load drafts at this time.</p>
      </div>
    );
  }
}

/**
 * Editor Landing Page Component
 * 
 * Main component that renders the editor overview page
 */
export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-border/40 bg-background/60 px-3 py-1 text-sm backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Markdown Editor</span>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Create Amazing Content
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Write, edit, and publish beautiful blog posts with our powerful markdown editor. 
            Real-time preview, auto-save, and seamless publishing workflow.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="min-w-[200px]" asChild>
            <Link href="/editor/new">
              <Plus className="mr-2 h-5 w-5" />
              New Post
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="min-w-[200px]" asChild>
            <Link href="/blog">
              <BookOpen className="mr-2 h-5 w-5" />
              View Published
            </Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Rich Markdown Editor</CardTitle>
              <CardDescription>
                Full-featured markdown editor with syntax highlighting and live preview
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Save className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Auto-Save</CardTitle>
              <CardDescription>
                Never lose your work with automatic saving and draft management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>One-Click Publish</CardTitle>
              <CardDescription>
                Publish your posts instantly with SEO optimization and social sharing
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Drafts Section */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Recent Drafts
              </h2>
              <p className="text-muted-foreground">
                Continue working on your posts
              </p>
            </div>
          </div>

          <Suspense fallback={
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          }>
            <RecentDrafts />
          </Suspense>
        </div>
      </div>
    </div>
  );
}