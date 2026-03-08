-- Create Enum for Roles
CREATE TYPE user_role AS ENUM ('student', 'recruiter');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
CREATE TYPE message_type AS ENUM ('text', 'system');
CREATE TYPE letter_type AS ENUM ('joining', 'completion');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT,
  phone TEXT,
  
  -- Student specific fields
  college TEXT,
  domain TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  skills TEXT[],
  
  -- Recruiter specific fields
  company_name TEXT,
  company_website TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS TABLE
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recruiter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  role TEXT NOT NULL,
  domain TEXT NOT NULL,
  objective TEXT NOT NULL,
  expectations TEXT NOT NULL,
  positions INTEGER DEFAULT 1,
  tenure INTEGER NOT NULL, -- in months
  remuneration INTEGER DEFAULT 0,
  
  attachment_url TEXT,
  attachment_name TEXT,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- APPLICATIONS TABLE (Students applying to projects)
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  cover_letter TEXT,
  portfolio_url TEXT,
  availability TEXT,
  
  status application_status DEFAULT 'pending',
  
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, student_id) -- A student can only apply once per project
);

-- MESSAGE THREADS TABLE
CREATE TABLE message_threads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recruiter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  status application_status DEFAULT 'pending',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES TABLE
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  content TEXT NOT NULL,
  type message_type DEFAULT 'text',
  
  attached_file_url TEXT,
  attached_file_name TEXT,
  letter_type letter_type, -- if the attachment is a letter
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (ROW LEVEL SECURITY) POLICIES

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read, but only the owner can update
CREATE POLICY "Public profiles are viewable by everyone." 
  ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: Anyone can read active/completed projects, but only recruiter can update
CREATE POLICY "Projects are viewable by everyone." 
  ON projects FOR SELECT USING (true);
CREATE POLICY "Recruiters can insert projects." 
  ON projects FOR INSERT WITH CHECK (auth.uid() = recruiter_id);
CREATE POLICY "Recruiters can update own projects." 
  ON projects FOR UPDATE USING (auth.uid() = recruiter_id);

-- Applications: Students can see their own, Recruiters can see apps for their projects
CREATE POLICY "Students can view their applications" 
  ON applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Recruiters can view applications to their projects" 
  ON applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = applications.project_id AND projects.recruiter_id = auth.uid())
  );
CREATE POLICY "Students can insert applications" 
  ON applications FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Recruiters can update application statuses" 
  ON applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = applications.project_id AND projects.recruiter_id = auth.uid())
  );

-- Threads: Visible to the involved student and recruiter
CREATE POLICY "Users can view their threads" 
  ON message_threads FOR SELECT USING (auth.uid() = student_id OR auth.uid() = recruiter_id);
CREATE POLICY "Recruiters can create threads" 
  ON message_threads FOR INSERT WITH CHECK (auth.uid() = recruiter_id);
CREATE POLICY "Recruiters can update thread status" 
  ON message_threads FOR UPDATE USING (auth.uid() = recruiter_id);

-- Messages: Visible and insertable by involved users in the thread
CREATE POLICY "Users can view messages in their threads" 
  ON messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM message_threads WHERE message_threads.id = messages.thread_id AND (message_threads.student_id = auth.uid() OR message_threads.recruiter_id = auth.uid()))
  );
CREATE POLICY "Users can insert messages in their threads" 
  ON messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND 
    EXISTS (SELECT 1 FROM message_threads WHERE message_threads.id = messages.thread_id AND (message_threads.student_id = auth.uid() OR message_threads.recruiter_id = auth.uid()))
  );
