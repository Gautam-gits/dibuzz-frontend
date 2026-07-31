import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztccsmsmjkzhtyfklkyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Y2NzbXNtamt6aHR5Zmtsa3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTI1MTIsImV4cCI6MjEwMDgyODUxMn0.5zrrKRtoMWOXV2e6ZGyqLkpU5G9_uelvK3aNDVGWpKg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('Testing Supabase Course Insert...');
  const { data, error } = await supabase.from('courses').insert([{
    title: 'Test Course DB',
    category: 'Full-Stack',
    badge: 'New',
    level: 'Beginner',
    duration: '4 Weeks',
    rating: 5.0,
    reviews_count: 10,
    students_count: 50,
    original_price: 9999,
    price: 4999,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    description: 'Test description',
    highlights: ['Test Highlight'],
    syllabus: [{ week: 'Week 1', topic: 'Intro' }]
  }]).select();

  if (error) {
    console.error('SUPABASE INSERT ERROR:', error);
  } else {
    console.log('SUPABASE INSERT SUCCESS:', data);
  }
}

testInsert();
