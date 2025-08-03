import { createClientSupabase } from '../lib/supabase/client';

async function checkDatabase() {
  const supabase = createClientSupabase();
  
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

    // Check if analytics table exists
    console.log('\n📊 Checking analytics table...');
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('analytics')
      .select('id, post_id, event_type')
      .limit(1);

    if (analyticsError) {
      console.error('❌ Analytics table error:', analyticsError);
    } else {
      console.log('✅ Analytics table exists and is accessible');
    }

    // Check if comments table exists
    console.log('\n💬 Checking comments table...');
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('id, post_id, author_id')
      .limit(1);

    if (commentsError) {
      console.error('❌ Comments table error:', commentsError);
    } else {
      console.log('✅ Comments table exists and is accessible');
    }

    console.log('\n🎯 Database check complete!');
    
    if (!postsError && !profilesError && !analyticsError && !commentsError) {
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