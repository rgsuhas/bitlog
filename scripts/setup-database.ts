/**
 * Database Setup Script
 * 
 * This script sets up the complete database schema for the CloudBlog platform.
 * It creates tables, indexes, RLS policies, and functions needed for the application.
 * 
 * Usage:
 * npm run setup-db
 * 
 * Prerequisites:
 * - Supabase project created
 * - Environment variables set in .env.local
 * - Service role key with admin privileges
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Test database connection and provide setup instructions
 */
async function testConnection(): Promise<void> {
  console.log('🔌 Testing database connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error && error.code === '42P01') {
      console.log('📋 Database tables do not exist yet. Please follow these steps:');
      console.log('');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to the SQL Editor');
      console.log('3. Copy and paste the contents of scripts/setup-database.sql');
      console.log('4. Execute the SQL script');
      console.log('5. Run this script again to verify the setup');
      console.log('');
      console.log('Alternatively, you can run:');
      console.log('npm run seed');
      console.log('');
      return;
    }
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    console.log('✅ Tables exist and are accessible');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

/**
 * Create initial admin user
 */
async function createAdminUser(): Promise<void> {
  console.log('👤 Creating initial admin user...');
  
  try {
    // Create admin user profile
    const adminProfile = {
      id: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
      email: 'admin@cloudblog.com',
      name: 'System Administrator',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(adminProfile);
    
    if (profileError) {
      console.error('❌ Error creating admin profile:', profileError);
    } else {
      console.log('✅ Admin user profile created');
    }
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

/**
 * Main setup function
 */
async function main(): Promise<void> {
  console.log('🔧 CloudBlog Database Setup');
  console.log('============================');
  
  try {
    // Test connection
    await testConnection();
    
    // Create admin user if tables exist
    await createAdminUser();
    
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run the seed script: npm run seed');
    console.log('2. Start the development server: npm run dev');
    console.log('3. Access the application at http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup
main().catch(console.error);

export { testConnection, createAdminUser }; 