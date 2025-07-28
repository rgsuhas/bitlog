// scripts/checkConnection.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '../lib/supabase/types.js'; // adjust path as needed

const supabase = createClient<Database>(
  "https://hjsqwdhkepdjvwbvmkpa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqc3F3ZGhrZXBkanZ3YnZta3BhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MzIxMywiZXhwIjoyMDY5MjE5MjEzfQ.gAYbwnL5T6KvMiauVPB0e5mXuZD_QiDkFit-ZBGGmPg"
);

async function checkConnection() {
  const { data, error } = await supabase.from('posts').select('*').limit(1);

  if (error) {
    console.error('❌ Failed to connect:', error);
  } else {
    console.log('✅ Connected to Supabase. Sample data:', data);
  }
}

checkConnection();
