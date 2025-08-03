-- Database Schema Setup for CloudBlog Platform
-- This script creates all necessary tables, indexes, and RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  role TEXT DEFAULT 'reader' CHECK (role IN ('admin', 'editor', 'author', 'reader')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  published_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  read_time INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  cover_image TEXT,
  meta_description TEXT,
  view_count INTEGER DEFAULT 0
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'like', 'share', 'comment')),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_post_id ON analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view their own posts" ON posts
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all posts" ON posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Comments policies
CREATE POLICY "Anyone can view non-deleted comments" ON comments
  FOR SELECT USING (is_deleted = false);

CREATE POLICY "Users can insert their own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all comments" ON comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Analytics policies
CREATE POLICY "Users can insert analytics events" ON analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view analytics" ON analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create functions for common operations

-- Function to get post with author information
CREATE OR REPLACE FUNCTION get_post_with_author(post_slug TEXT)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  content TEXT,
  excerpt TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  status TEXT,
  read_time INTEGER,
  tags TEXT[],
  featured BOOLEAN,
  cover_image TEXT,
  meta_description TEXT,
  view_count INTEGER,
  author_id UUID,
  author_name TEXT,
  author_email TEXT,
  author_avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.slug,
    p.title,
    p.content,
    p.excerpt,
    p.published_at,
    p.updated_at,
    p.created_at,
    p.status,
    p.read_time,
    p.tags,
    p.featured,
    p.cover_image,
    p.meta_description,
    p.view_count,
    pr.id as author_id,
    pr.name as author_name,
    pr.email as author_email,
    pr.avatar_url as author_avatar_url
  FROM posts p
  JOIN profiles pr ON p.author_id = pr.id
  WHERE p.slug = post_slug AND p.status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get posts with pagination
CREATE OR REPLACE FUNCTION get_paginated_posts(
  page_num INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 10,
  search_term TEXT DEFAULT NULL,
  status_filter TEXT DEFAULT 'published',
  featured_filter BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  excerpt TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  read_time INTEGER,
  tags TEXT[],
  featured BOOLEAN,
  cover_image TEXT,
  author_name TEXT,
  total_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH filtered_posts AS (
    SELECT 
      p.id,
      p.slug,
      p.title,
      p.excerpt,
      p.published_at,
      p.read_time,
      p.tags,
      p.featured,
      p.cover_image,
      pr.name as author_name,
      COUNT(*) OVER() as total_count
    FROM posts p
    JOIN profiles pr ON p.author_id = pr.id
    WHERE 
      p.status = status_filter
      AND (search_term IS NULL OR 
           p.title ILIKE '%' || search_term || '%' OR 
           p.excerpt ILIKE '%' || search_term || '%')
      AND (featured_filter IS NULL OR p.featured = featured_filter)
  )
  SELECT 
    fp.id,
    fp.slug,
    fp.title,
    fp.excerpt,
    fp.published_at,
    fp.read_time,
    fp.tags,
    fp.featured,
    fp.cover_image,
    fp.author_name,
    fp.total_count
  FROM filtered_posts fp
  ORDER BY fp.published_at DESC
  LIMIT page_size
  OFFSET (page_num - 1) * page_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 