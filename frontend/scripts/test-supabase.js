// Test Supabase connection and database schema
const { createClient } = require('@supabase/supabase-js');
const { config } = require('dotenv');

config({ path: '.env.local' });

async function testSupabase() {
  console.log('🔍 Testing Supabase Database Connection...');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('❌ Supabase credentials not found in .env.local');
    return false;
  }

  console.log('🔗 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('🔑 Key starts with:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const tables = [
    'users',
    'space_weather_events', 
    'stories',
    'user_activities',
    'story_interactions',
    'weather_alerts',
    'user_preferences',
    'educational_content',
    'achievements'
  ];

  console.log('\n📊 Testing Database Tables:');
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Connected (${data.length} records)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: Connection error - ${err.message}`);
    }
  }

  // Test auth status
  console.log('\n🔐 Testing Authentication:');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.log('ℹ️  No authenticated user (expected for anonymous connection)');
    } else {
      console.log('✅ User authenticated:', user?.email || 'Anonymous');
    }
  } catch (err) {
    console.log('ℹ️  Auth test completed');
  }

  console.log('\n🎯 Supabase Connection Test Complete!');
  return true;
}

testSupabase().catch(console.error);
