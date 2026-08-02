import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ztccsmsmjkzhtyfklkyl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Y2NzbXNtamt6aHR5Zmtsa3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTI1MTIsImV4cCI6MjEwMDgyODUxMn0.5zrrKRtoMWOXV2e6ZGyqLkpU5G9_uelvK3aNDVGWpKg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Complete SQL Setup Script for Supabase SQL Editor (Includes Courses, Internships, Profiles, Transactions, Certificates)
export const SUPABASE_SQL_SETUP = `-- Copy and Run this in Supabase SQL Editor to enable full Courses & Internships Read/Write/Delete permissions

-- 1. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  badge TEXT,
  level TEXT,
  duration TEXT,
  rating NUMERIC DEFAULT 4.9,
  reviews_count INT DEFAULT 100,
  students_count INT DEFAULT 1000,
  original_price NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT,
  description TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  syllabus JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INTERNSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.internships (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  type TEXT NOT NULL,
  stipend TEXT NOT NULL,
  mode TEXT NOT NULL,
  duration TEXT NOT NULL,
  openings INT DEFAULT 5,
  badge TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  last_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  phone TEXT,
  role TEXT DEFAULT 'student',
  joined_date TEXT,
  college_reg_no TEXT,
  college_name TEXT,
  course TEXT,
  branch TEXT,
  profile_image TEXT,
  enrolled_courses JSONB DEFAULT '[]'::jsonb,
  certificates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  course_title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  method TEXT NOT NULL,
  status TEXT DEFAULT 'SUCCESS',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VERIFIED CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  certificate_id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  completion_date TEXT NOT NULL,
  grade TEXT DEFAULT 'Grade A+',
  status TEXT DEFAULT 'VERIFIED OFFICIAL',
  issued_by TEXT DEFAULT 'DIBUZZ DIGITAL PRIVATE LIMITED',
  iso_cert TEXT DEFAULT 'ISO 9001:2015 Certified Division',
  mca_cin TEXT DEFAULT 'CIN: U72900DL2024PTC987654',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public Read Courses" ON public.courses;
DROP POLICY IF EXISTS "Public Insert Courses" ON public.courses;
DROP POLICY IF EXISTS "Public Update Courses" ON public.courses;
DROP POLICY IF EXISTS "Public Delete Courses" ON public.courses;

DROP POLICY IF EXISTS "Public Read Internships" ON public.internships;
DROP POLICY IF EXISTS "Public Insert Internships" ON public.internships;
DROP POLICY IF EXISTS "Public Update Internships" ON public.internships;
DROP POLICY IF EXISTS "Public Delete Internships" ON public.internships;

DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Insert Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Update Profiles" ON public.profiles;

DROP POLICY IF EXISTS "Public Read Transactions" ON public.transactions;
DROP POLICY IF EXISTS "Public Insert Transactions" ON public.transactions;

DROP POLICY IF EXISTS "Public Read Certificates" ON public.certificates;

-- Allow FULL Read/Write/Delete Access on Courses
CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public Insert Courses" ON public.courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Courses" ON public.courses FOR UPDATE USING (true);
CREATE POLICY "Public Delete Courses" ON public.courses FOR DELETE USING (true);

-- Allow FULL Read/Write/Delete Access on Internships
CREATE POLICY "Public Read Internships" ON public.internships FOR SELECT USING (true);
CREATE POLICY "Public Insert Internships" ON public.internships FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Internships" ON public.internships FOR UPDATE USING (true);
CREATE POLICY "Public Delete Internships" ON public.internships FOR DELETE USING (true);

-- Allow FULL Read/Write Access on Profiles
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Profiles" ON public.profiles FOR UPDATE USING (true);

-- Allow Read/Write on Transactions & Certificates
CREATE POLICY "Public Read Transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Public Insert Transactions" ON public.transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Certificates" ON public.certificates FOR SELECT USING (true);
`;
