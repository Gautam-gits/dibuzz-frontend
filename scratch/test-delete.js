import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztccsmsmjkzhtyfklkyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Y2NzbXNtamt6aHR5Zmtsa3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTI1MTIsImV4cCI6MjEwMDgyODUxMn0.5zrrKRtoMWOXV2e6ZGyqLkpU5G9_uelvK3aNDVGWpKg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDelete() {
  console.log('Testing Delete from Supabase...');
  // Delete course with id 1 (the test course we created earlier)
  const { data, error } = await supabase.from('courses').delete().eq('id', 1).select();

  if (error) {
    console.error('SUPABASE DELETE ERROR:', error);
  } else {
    console.log('SUPABASE DELETE SUCCESS:', data);
  }
}

testDelete();
