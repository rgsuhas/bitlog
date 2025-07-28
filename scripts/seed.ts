// scripts/seed.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '../lib/supabase/types.js'; // Adjust if needed

// Replace these with your actual values or use dotenv
const supabaseUrl =   "https://hjsqwdhkepdjvwbvmkpa.supabase.co";
const supabaseKey =   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqc3F3ZGhrZXBkanZ3YnZta3BhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MzIxMywiZXhwIjoyMDY5MjE5MjEzfQ.gAYbwnL5T6KvMiauVPB0e5mXuZD_QiDkFit-ZBGGmPg"
; // Don't use anon key for inserts
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function seedPosts() {
  console.log('🌱 Seeding 10 posts...');

  const now = new Date().toISOString();
  const posts = Array.from({ length: 10 }, (_, i) => {
    const title = `Seeded Post ${i + 1}`;
    return {
      id: crypto.randomUUID(),
      title,
      slug: generateSlug(title),
      content: `This is the content for ${title}.`,
      cover_image: null,
      is_published: true,
      user_id: null, // Replace with real user_id if needed
      created_at: now,
      updated_at: now,
    };
  });

  const { data, error } = await supabase.from('posts').insert(posts);
  console.log('📦 Insert response:', { data, error });
}

seedPosts();
