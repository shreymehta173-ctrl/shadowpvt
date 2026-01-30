-- Create enum for learning pace
DO $$ BEGIN
  CREATE TYPE learning_pace_enum AS ENUM ('slow', 'medium', 'fast');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum for session status
DO $$ BEGIN
  CREATE TYPE session_status AS ENUM ('pending', 'completed', 'partial', 'skipped');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum for priority level
DO $$ BEGIN
  CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Student study preferences table
CREATE TABLE IF NOT EXISTS public.study_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  learning_pace learning_pace_enum DEFAULT 'medium',
  daily_time_limit INTEGER DEFAULT 120, -- minutes
  preferred_study_days TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  preferred_study_time TEXT DEFAULT 'evening', -- morning, afternoon, evening, night
  session_duration INTEGER DEFAULT 45, -- preferred session length in minutes
  break_duration INTEGER DEFAULT 10, -- break between sessions
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id)
);

-- Student weaknesses table
CREATE TABLE IF NOT EXISTS public.student_weaknesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty INTEGER DEFAULT 3 CHECK (difficulty >= 1 AND difficulty <= 5),
  priority priority_level DEFAULT 'medium',
  estimated_effort INTEGER DEFAULT 60, -- minutes to master
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weekly study plans table
CREATE TABLE IF NOT EXISTS public.weekly_study_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_planned_minutes INTEGER DEFAULT 0,
  total_completed_minutes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, completed, abandoned
  ai_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Study sessions table
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.weekly_study_plans(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  weakness_id UUID REFERENCES public.student_weaknesses(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  session_type TEXT DEFAULT 'study', -- study, revision, buffer
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT, -- e.g., "09:00"
  duration_minutes INTEGER NOT NULL,
  difficulty INTEGER DEFAULT 3,
  status session_status DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  feedback_notes TEXT,
  effectiveness_score INTEGER CHECK (effectiveness_score >= 1 AND effectiveness_score <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Session feedback for adaptive learning
CREATE TABLE IF NOT EXISTS public.session_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.study_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  difficulty_felt TEXT, -- easy, appropriate, hard, too_hard
  focus_level TEXT, -- high, medium, low
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.study_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_weaknesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_preferences
CREATE POLICY "Users can view their own study preferences" 
ON public.study_preferences FOR SELECT 
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own study preferences" 
ON public.study_preferences FOR INSERT 
WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own study preferences" 
ON public.study_preferences FOR UPDATE 
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- RLS Policies for student_weaknesses
CREATE POLICY "Users can view their own weaknesses" 
ON public.student_weaknesses FOR SELECT 
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own weaknesses" 
ON public.student_weaknesses FOR INSERT 
WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own weaknesses" 
ON public.student_weaknesses FOR UPDATE 
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own weaknesses" 
ON public.student_weaknesses FOR DELETE 
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- RLS Policies for weekly_study_plans
CREATE POLICY "Users can view their own study plans" 
ON public.weekly_study_plans FOR SELECT 
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own study plans" 
ON public.weekly_study_plans FOR INSERT 
WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own study plans" 
ON public.weekly_study_plans FOR UPDATE 
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- RLS Policies for study_sessions
CREATE POLICY "Users can view their own study sessions" 
ON public.study_sessions FOR SELECT 
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own study sessions" 
ON public.study_sessions FOR INSERT 
WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own study sessions" 
ON public.study_sessions FOR UPDATE 
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- RLS Policies for session_feedback
CREATE POLICY "Users can view their own session feedback" 
ON public.session_feedback FOR SELECT 
USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own session feedback" 
ON public.session_feedback FOR INSERT 
WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- Create updated_at triggers
CREATE TRIGGER update_study_preferences_updated_at
BEFORE UPDATE ON public.study_preferences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_weaknesses_updated_at
BEFORE UPDATE ON public.student_weaknesses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weekly_study_plans_updated_at
BEFORE UPDATE ON public.weekly_study_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_sessions_updated_at
BEFORE UPDATE ON public.study_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();