import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztccsmsmjkzhtyfklkyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Y2NzbXNtamt6aHR5Zmtsa3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTI1MTIsImV4cCI6MjEwMDgyODUxMn0.5zrrKRtoMWOXV2e6ZGyqLkpU5G9_uelvK3aNDVGWpKg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInternshipsTable() {
  console.log('Testing query on Supabase internships table...');
  const { data, error } = await supabase.from('internships').select('*');
  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('SUCCESS! DATA IN INTERNSHIPS TABLE:', data);
  }
}

testInternshipsTable();
