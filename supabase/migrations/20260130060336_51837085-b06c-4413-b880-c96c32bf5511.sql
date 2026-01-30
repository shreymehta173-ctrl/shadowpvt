-- Create careers table with comprehensive career data
CREATE TABLE public.careers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  minimum_education TEXT NOT NULL DEFAULT 'High School',
  preferred_subjects TEXT[] DEFAULT '{}',
  difficulty_level INTEGER NOT NULL DEFAULT 3 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  future_scope_score INTEGER NOT NULL DEFAULT 5 CHECK (future_scope_score >= 1 AND future_scope_score <= 10),
  average_salary_min INTEGER,
  average_salary_max INTEGER,
  growth_rate TEXT DEFAULT 'moderate',
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create career_skill_mappings for precise skill-career relationships
CREATE TABLE public.career_skill_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  career_id UUID NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  importance_weight NUMERIC NOT NULL DEFAULT 0.5 CHECK (importance_weight >= 0 AND importance_weight <= 1),
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(career_id, skill_id)
);

-- Create career_recommendations to store personalized recommendations
CREATE TABLE public.career_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
  match_score NUMERIC NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  skill_fit_score NUMERIC DEFAULT 0,
  interest_fit_score NUMERIC DEFAULT 0,
  gap_penalty_score NUMERIC DEFAULT 0,
  ai_explanation TEXT,
  ai_roadmap JSONB,
  language TEXT DEFAULT 'English',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, career_id)
);

-- Create career_chat_history for chatbot conversations
CREATE TABLE public.career_chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_skill_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_chat_history ENABLE ROW LEVEL SECURITY;

-- Careers are viewable by all authenticated users
CREATE POLICY "Careers are viewable by all authenticated users"
ON public.careers FOR SELECT
USING (true);

-- Career skill mappings are viewable by all authenticated users
CREATE POLICY "Career skill mappings are viewable by all authenticated users"
ON public.career_skill_mappings FOR SELECT
USING (true);

-- Users can view their own recommendations
CREATE POLICY "Users can view their own career recommendations"
ON public.career_recommendations FOR SELECT
USING (student_id IN (
  SELECT id FROM student_profiles WHERE user_id = auth.uid()
));

-- Users can create their own recommendations (via edge function)
CREATE POLICY "Users can create their own career recommendations"
ON public.career_recommendations FOR INSERT
WITH CHECK (student_id IN (
  SELECT id FROM student_profiles WHERE user_id = auth.uid()
));

-- Users can update their own recommendations
CREATE POLICY "Users can update their own career recommendations"
ON public.career_recommendations FOR UPDATE
USING (student_id IN (
  SELECT id FROM student_profiles WHERE user_id = auth.uid()
));

-- Users can view their own chat history
CREATE POLICY "Users can view their own chat history"
ON public.career_chat_history FOR SELECT
USING (student_id IN (
  SELECT id FROM student_profiles WHERE user_id = auth.uid()
));

-- Users can create their own chat messages
CREATE POLICY "Users can create their own chat messages"
ON public.career_chat_history FOR INSERT
WITH CHECK (student_id IN (
  SELECT id FROM student_profiles WHERE user_id = auth.uid()
));