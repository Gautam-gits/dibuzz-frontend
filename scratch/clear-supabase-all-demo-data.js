import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztccsmsmjkzhtyfklkyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Y2NzbXNtamt6aHR5Zmtsa3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTI1MTIsImV4cCI6MjEwMDgyODUxMn0.5zrrKRtoMWOXV2e6ZGyqLkpU5G9_uelvK3aNDVGWpKg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearAllDemoData() {
  console.log('Clearing ALL demo data from Supabase Cloud DB...');

  try {
    const { error: cErr } = await supabase.from('courses').delete().neq('id', 0);
    console.log('Courses cleared from Supabase:', cErr ? cErr.message : 'SUCCESS');
  } catch (e) {
    console.log('Courses clear err:', e);
  }

  try {
    const { error: iErr } = await supabase.from('internships').delete().neq('id', 0);
    console.log('Internships cleared from Supabase:', iErr ? iErr.message : 'SUCCESS');
  } catch (e) {
    console.log('Internships clear err:', e);
  }

  try {
    const { error: tErr } = await supabase.from('transactions').delete().neq('id', '0');
    console.log('Transactions cleared from Supabase:', tErr ? tErr.message : 'SUCCESS');
  } catch (e) {
    console.log('Transactions clear err:', e);
  }

  try {
    const { error: certErr } = await supabase.from('certificates').delete().neq('certificate_id', '0');
    console.log('Certificates cleared from Supabase:', certErr ? certErr.message : 'SUCCESS');
  } catch (e) {
    console.log('Certificates clear err:', e);
  }

  try {
    const { error: pErr } = await supabase.from('profiles').delete().neq('role', 'admin');
    console.log('Student Profiles cleared from Supabase:', pErr ? pErr.message : 'SUCCESS');
  } catch (e) {
    console.log('Profiles clear err:', e);
  }

  console.log('CLEARED ALL DEMO DATA FROM SUPABASE CLOUD DB!');
}

clearAllDemoData();
