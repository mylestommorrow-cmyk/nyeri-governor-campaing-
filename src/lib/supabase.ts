import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Exact SQL Schema script for the user to copy-paste into Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- County Campaign Manager (Nyeri Gubernatorial Campaign)
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Campaign Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  sub_county TEXT NOT NULL,
  ward TEXT NOT NULL,
  venue TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  lead_coordinator TEXT,
  target_turnout INT DEFAULT 0,
  actual_turnout INT,
  status TEXT DEFAULT 'Upcoming',
  description TEXT,
  security_clearance BOOLEAN DEFAULT false,
  sound_truck_booked BOOLEAN DEFAULT false,
  leaflets_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Operational Field Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sub_county TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  assignee_name TEXT NOT NULL,
  due_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Community Listening Issues Table
CREATE TABLE IF NOT EXISTS community_issues (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_county TEXT NOT NULL,
  ward TEXT NOT NULL,
  reported_by TEXT,
  status TEXT DEFAULT 'Logged',
  priority TEXT NOT NULL,
  description TEXT,
  campaign_action_pledge TEXT,
  date_reported DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Campaign Team Roster Table
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  sub_county TEXT NOT NULL,
  ward TEXT,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'Active in Field',
  volunteers_led INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create Open Access Policies for the Prototype (Allows read/insert/update/delete via anon key)
DROP POLICY IF EXISTS "Public access activities" ON activities;
CREATE POLICY "Public access activities" ON activities FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access tasks" ON tasks;
CREATE POLICY "Public access tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access community_issues" ON community_issues;
CREATE POLICY "Public access community_issues" ON community_issues FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access team_members" ON team_members;
CREATE POLICY "Public access team_members" ON team_members FOR ALL USING (true) WITH CHECK (true);
`;
