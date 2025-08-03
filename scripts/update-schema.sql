-- Database Schema Updates for Phase 3
-- This script adds publishing queue and analytics enhancements

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Publishing Queue Table
CREATE TABLE IF NOT EXISTS publishing_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for publishing queue
CREATE INDEX IF NOT EXISTS idx_publishing_queue_status ON publishing_queue(status);
CREATE INDEX IF NOT EXISTS idx_publishing_queue_scheduled ON publishing_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_publishing_queue_post_id ON publishing_queue(post_id);

-- Update analytics table with additional fields
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS device_type TEXT;

-- Indexes for analytics enhancements
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_referrer ON analytics(referrer);
CREATE INDEX IF NOT EXISTS idx_analytics_country ON analytics(country);

-- Add SEO-related fields to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS structured_data JSONB;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0;

-- Index for SEO score
CREATE INDEX IF NOT EXISTS idx_posts_seo_score ON posts(seo_score);

-- Collaborative editing sessions table
CREATE TABLE IF NOT EXISTS collaborative_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  participants TEXT[] DEFAULT '{}',
  active_editors TEXT[] DEFAULT '{}',
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lock_expiry TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 minutes',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for collaborative sessions
CREATE INDEX IF NOT EXISTS idx_collaborative_sessions_post_id ON collaborative_sessions(post_id);
CREATE INDEX IF NOT EXISTS idx_collaborative_sessions_expiry ON collaborative_sessions(lock_expiry);

-- Post versions table for content versioning
CREATE TABLE IF NOT EXISTS post_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT FALSE,
  changes JSONB DEFAULT '[]',
  parent_version_id UUID REFERENCES post_versions(id) ON DELETE SET NULL,
  branch_name TEXT
);

-- Indexes for post versions
CREATE INDEX IF NOT EXISTS idx_post_versions_post_id ON post_versions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_versions_number ON post_versions(version_number);
CREATE INDEX IF NOT EXISTS idx_post_versions_author ON post_versions(author_id);

-- Update trigger function for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to new tables
CREATE TRIGGER update_publishing_queue_updated_at 
  BEFORE UPDATE ON publishing_queue 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collaborative_sessions_updated_at 
  BEFORE UPDATE ON collaborative_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_versions_updated_at 
  BEFORE UPDATE ON post_versions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Publishing Queue Policies
ALTER TABLE publishing_queue ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own scheduled posts
CREATE POLICY "Users can view their own scheduled posts" ON publishing_queue
  FOR SELECT USING (
    post_id IN (
      SELECT id FROM posts WHERE author_id = auth.uid()
    )
  );

-- Allow users to create scheduled posts for their own posts
CREATE POLICY "Users can create scheduled posts for their own posts" ON publishing_queue
  FOR INSERT WITH CHECK (
    post_id IN (
      SELECT id FROM posts WHERE author_id = auth.uid()
    )
  );

-- Allow users to update their own scheduled posts
CREATE POLICY "Users can update their own scheduled posts" ON publishing_queue
  FOR UPDATE USING (
    post_id IN (
      SELECT id FROM posts WHERE author_id = auth.uid()
    )
  );

-- Allow users to delete their own scheduled posts
CREATE POLICY "Users can delete their own scheduled posts" ON publishing_queue
  FOR DELETE USING (
    post_id IN (
      SELECT id FROM posts WHERE author_id = auth.uid()
    )
  );

-- Collaborative Sessions Policies
ALTER TABLE collaborative_sessions ENABLE ROW LEVEL SECURITY;

-- Allow participants to view sessions they're part of
CREATE POLICY "Participants can view their sessions" ON collaborative_sessions
  FOR SELECT USING (
    auth.uid()::text = ANY(participants)
  );

-- Allow users to create sessions for posts they can edit
CREATE POLICY "Users can create sessions for their posts" ON collaborative_sessions
  FOR INSERT WITH CHECK (
    post_id IN (
      SELECT id FROM posts WHERE author_id = auth.uid()
    )
  );

-- Allow participants to update sessions
CREATE POLICY "Participants can update sessions" ON collaborative_sessions
  FOR UPDATE USING (
    auth.uid()::text = ANY(participants)
  );

-- Post Versions Policies
ALTER TABLE post_versions ENABLE ROW LEVEL SECURITY;

-- Allow users to view versions of their own posts
CREATE POLICY "Users can view versions of their own posts" ON post_versions
  FOR SELECT USING (
    post_id IN (
      SELECT id FROM posts WHERE author_id = auth.uid()
    )
  );

-- Allow users to create versions for their own posts
CREATE POLICY "Users can create versions for their own posts" ON post_versions
  FOR INSERT WITH CHECK (
    post_id IN (
      SELECT id FROM posts WHERE author_id = auth.uid()
    )
  );

-- Allow users to update versions of their own posts
CREATE POLICY "Users can update versions of their own posts" ON post_versions
  FOR UPDATE USING (
    post_id IN (
      SELECT id FROM posts WHERE author_id = auth.uid()
    )
  );

-- Functions for publishing workflow

-- Function to process scheduled posts
CREATE OR REPLACE FUNCTION process_scheduled_posts()
RETURNS void AS $$
BEGIN
  -- Update status to processing for posts that are due
  UPDATE publishing_queue 
  SET status = 'processing', updated_at = NOW()
  WHERE status = 'pending' 
    AND scheduled_for <= NOW()
    AND attempts < max_attempts;
    
  -- Mark failed posts that have exceeded max attempts
  UPDATE publishing_queue 
  SET status = 'failed', updated_at = NOW()
  WHERE status = 'pending' 
    AND scheduled_for <= NOW()
    AND attempts >= max_attempts;
END;
$$ LANGUAGE plpgsql;

-- Function to increment publishing attempts
CREATE OR REPLACE FUNCTION increment_publishing_attempts()
RETURNS void AS $$
BEGIN
  UPDATE publishing_queue 
  SET attempts = attempts + 1, updated_at = NOW()
  WHERE status = 'processing';
END;
$$ LANGUAGE plpgsql;

-- Function to mark publishing as completed
CREATE OR REPLACE FUNCTION mark_publishing_completed(post_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE publishing_queue 
  SET status = 'completed', updated_at = NOW()
  WHERE post_id = post_uuid AND status = 'processing';
  
  -- Update the post status to published
  UPDATE posts 
  SET status = 'published', published_at = NOW(), updated_at = NOW()
  WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to mark publishing as failed
CREATE OR REPLACE FUNCTION mark_publishing_failed(post_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE publishing_queue 
  SET status = 'failed', updated_at = NOW()
  WHERE post_id = post_uuid AND status = 'processing';
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup expired collaborative sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM collaborative_sessions 
  WHERE lock_expiry < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to process publishing queue (if using pg_cron)
-- Note: This requires pg_cron extension to be installed
-- SELECT cron.schedule('process-publishing-queue', '*/5 * * * *', 'SELECT process_scheduled_posts();');
-- SELECT cron.schedule('cleanup-expired-sessions', '*/15 * * * *', 'SELECT cleanup_expired_sessions();');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_status ON posts(author_id, status);
CREATE INDEX IF NOT EXISTS idx_posts_published_featured ON posts(published_at, featured) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_analytics_post_event ON analytics(post_id, event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Add comments for documentation
COMMENT ON TABLE publishing_queue IS 'Queue for scheduled post publishing';
COMMENT ON TABLE collaborative_sessions IS 'Active collaborative editing sessions';
COMMENT ON TABLE post_versions IS 'Version history for posts with change tracking';
COMMENT ON COLUMN analytics.session_id IS 'Session identifier for user tracking';
COMMENT ON COLUMN analytics.referrer IS 'Referrer URL for traffic analysis';
COMMENT ON COLUMN posts.seo_score IS 'Automated SEO score (0-100)';
COMMENT ON COLUMN posts.structured_data IS 'JSON-LD structured data for SEO'; 