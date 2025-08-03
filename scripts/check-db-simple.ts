import { createClient } from '@supabase/supabase-js';

// Set environment variables manually
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://hjsqwdhkepdjvwbvmkpa.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqc3F3ZGhrZXBkanZ3YnZta3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDMyMTMsImV4cCI6MjA2OTIxOTIxM30.fuyLjrsl-5Tjoews3KVa6ydzjqD-OuD0CKCa72jkKao';

async function checkDatabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  console.log('🔍 Checking database schema...\n');

  try {
    // Check if posts table exists and has required columns
    console.log('📋 Checking posts table...');
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('id, slug, title, status, author_id')
      .limit(1);

    if (postsError) {
      console.error('❌ Posts table error:', postsError);
      if (postsError.code === '42703') {
        console.log('💡 This suggests the database schema needs to be set up.');
        console.log('📝 Please run the database setup script in your Supabase dashboard.');
      }
    } else {
      console.log('✅ Posts table exists and is accessible');
    }

    // Check if profiles table exists
    console.log('\n👥 Checking profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email')
      .limit(1);

    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError);
    } else {
      console.log('✅ Profiles table exists and is accessible');
    }

    console.log('\n🎯 Database check complete!');
    
    if (!postsError && !profilesError) {
      console.log('✅ All tables are properly set up');
    } else {
      console.log('⚠️  Some tables may need to be created');
      console.log('📝 Please run the database setup script in your Supabase dashboard');
    }

  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

checkDatabase().catch(console.error); 