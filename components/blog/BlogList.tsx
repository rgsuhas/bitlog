'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Post } from '@/lib/types';

interface BlogListProps {
  posts: Post[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [sort, setSort] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [posts]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag && selectedTag !== '') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    return filtered.sort((a, b) => {
      if (sort === 'newest') return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      if (sort === 'oldest') return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      if (sort === 'popular') return (b.viewCount || 0) - (a.viewCount || 0);
      return 0;
    });
  }, [posts, sort, searchTerm, selectedTag]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">All Blog Posts</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-auto"
          />
          <Select onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-end mb-8">
        <div className="flex gap-2">
          <Button variant={sort === 'newest' ? 'default' : 'outline'} onClick={() => setSort('newest')}>Newest</Button>
          <Button variant={sort === 'oldest' ? 'default' : 'outline'} onClick={() => setSort('oldest')}>Oldest</Button>
          <Button variant={sort === 'popular' ? 'default' : 'outline'} onClick={() => setSort('popular')}>Popular</Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedPosts.map(post => (
          <Card key={post.id} className="group transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="mb-2 flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
              <CardDescription className="line-clamp-2 text-sm">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{post.author.name}</span>
                <span>{post.readTime} min read</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
