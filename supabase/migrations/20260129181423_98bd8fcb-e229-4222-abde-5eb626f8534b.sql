-- SkillForge AI Learning Gap Analyzer Database Schema

-- Enum types for skill levels and gap severity
CREATE TYPE public.skill_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.gap_severity AS ENUM ('critical', 'moderate', 'minor', 'none');
CREATE TYPE public.learning_speed AS ENUM ('slow', 'average', 'fast');

-- Student Profiles Table
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  grade TEXT,
  preferred_language TEXT DEFAULT 'English',
  daily_study_time INTEGER DEFAULT 30, -- minutes
  learning_speed learning_speed DEFAULT 'average',
  interests TEXT[] DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Topics Table (Math, Science, Programming, etc.)
CREATE TABLE public.topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Concepts Table (Sub-topics within topics)
CREATE TABLE public.concepts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  prerequisites UUID[] DEFAULT '{}', -- Other concept IDs that should be learned first
  difficulty INTEGER DEFAULT 1, -- 1-10 scale
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skills Table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  concept_ids UUID[] DEFAULT '{}', -- Related concepts
  career_relevance INTEGER DEFAULT 5, -- 1-10 scale
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Question Bank Table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice', -- multiple_choice, true_false, short_answer
  options JSONB, -- For multiple choice: [{text: "", isCorrect: boolean}]
  correct_answer TEXT,
  difficulty INTEGER DEFAULT 1, -- 1-10 scale
  time_limit INTEGER DEFAULT 60, -- seconds
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Diagnostic Sessions Table
CREATE TABLE public.diagnostic_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE NOT NULL,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  average_time_per_question DECIMAL,
  status TEXT DEFAULT 'in_progress' -- in_progress, completed, abandoned
);

-- Diagnostic Responses Table
CREATE TABLE public.diagnostic_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.diagnostic_sessions(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL NOT NULL,
  student_answer TEXT,
  is_correct BOOLEAN NOT NULL,
  time_taken INTEGER NOT NULL, -- seconds
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Learning Gaps Table (AI Agent Output)
CREATE TABLE public.learning_gaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.diagnostic_sessions(id) ON DELETE SET NULL,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  severity gap_severity NOT NULL DEFAULT 'moderate',
  confidence_score DECIMAL DEFAULT 0, -- 0-100
  details JSONB, -- Additional AI analysis
  identified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Skill Progress Table
CREATE TABLE public.skill_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  current_level skill_level DEFAULT 'beginner',
  confidence_score DECIMAL DEFAULT 0, -- 0-100
  previous_score DECIMAL,
  improvement_rate DECIMAL DEFAULT 0, -- Percentage improvement
  last_assessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, skill_id)
);

-- Skill Improvement Plans (AI Agent Output)
CREATE TABLE public.improvement_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE NOT NULL,
  gap_id UUID REFERENCES public.learning_gaps(id) ON DELETE SET NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 1, -- 1 = highest priority
  practice_type TEXT, -- exercises, videos, readings, projects
  recommended_resources JSONB, -- Links, materials
  estimated_duration INTEGER, -- minutes
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Progress History (Time-series for tracking)
CREATE TABLE public.progress_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  score DECIMAL NOT NULL,
  session_id UUID REFERENCES public.diagnostic_sessions(id) ON DELETE SET NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_profiles
CREATE POLICY "Users can view their own profile" ON public.student_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for reference tables (public read)
CREATE POLICY "Topics are viewable by all authenticated users" ON public.topics
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Concepts are viewable by all authenticated users" ON public.concepts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Skills are viewable by all authenticated users" ON public.skills
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Questions are viewable by all authenticated users" ON public.questions
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for student data
CREATE POLICY "Users can view their own sessions" ON public.diagnostic_sessions
  FOR SELECT USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own sessions" ON public.diagnostic_sessions
  FOR INSERT WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own sessions" ON public.diagnostic_sessions
  FOR UPDATE USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own responses" ON public.diagnostic_responses
  FOR SELECT USING (session_id IN (
    SELECT ds.id FROM public.diagnostic_sessions ds 
    JOIN public.student_profiles sp ON ds.student_id = sp.id 
    WHERE sp.user_id = auth.uid()
  ));
CREATE POLICY "Users can create their own responses" ON public.diagnostic_responses
  FOR INSERT WITH CHECK (session_id IN (
    SELECT ds.id FROM public.diagnostic_sessions ds 
    JOIN public.student_profiles sp ON ds.student_id = sp.id 
    WHERE sp.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own gaps" ON public.learning_gaps
  FOR SELECT USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own gaps" ON public.learning_gaps
  FOR INSERT WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own gaps" ON public.learning_gaps
  FOR UPDATE USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own skill progress" ON public.skill_progress
  FOR SELECT USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own skill progress" ON public.skill_progress
  FOR INSERT WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own skill progress" ON public.skill_progress
  FOR UPDATE USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own improvement plans" ON public.improvement_plans
  FOR SELECT USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own improvement plans" ON public.improvement_plans
  FOR INSERT WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own improvement plans" ON public.improvement_plans
  FOR UPDATE USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own progress history" ON public.progress_history
  FOR SELECT USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create their own progress history" ON public.progress_history
  FOR INSERT WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skill_progress_updated_at
  BEFORE UPDATE ON public.skill_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial topics
INSERT INTO public.topics (name, description, icon, color) VALUES
  ('Mathematics', 'Core mathematical concepts and problem-solving', 'calculator', '#4F6BF5'),
  ('Programming', 'Computer science and software development', 'code', '#10B981'),
  ('Science', 'Physics, Chemistry, and Biology fundamentals', 'flask', '#F59E0B'),
  ('Language Arts', 'Reading comprehension and writing skills', 'book', '#EC4899'),
  ('Data Science', 'Statistics, data analysis, and machine learning', 'bar-chart', '#8B5CF6');

-- Seed concepts for Mathematics
INSERT INTO public.concepts (topic_id, name, description, difficulty) VALUES
  ((SELECT id FROM public.topics WHERE name = 'Mathematics'), 'Algebra Basics', 'Variables, expressions, and equations', 3),
  ((SELECT id FROM public.topics WHERE name = 'Mathematics'), 'Linear Equations', 'Solving and graphing linear equations', 4),
  ((SELECT id FROM public.topics WHERE name = 'Mathematics'), 'Quadratic Functions', 'Parabolas and quadratic equations', 5),
  ((SELECT id FROM public.topics WHERE name = 'Mathematics'), 'Calculus Fundamentals', 'Limits, derivatives, and integrals', 7),
  ((SELECT id FROM public.topics WHERE name = 'Mathematics'), 'Statistics Basics', 'Mean, median, mode, and distributions', 4);

-- Seed concepts for Programming
INSERT INTO public.concepts (topic_id, name, description, difficulty) VALUES
  ((SELECT id FROM public.topics WHERE name = 'Programming'), 'Variables & Data Types', 'Understanding data storage', 2),
  ((SELECT id FROM public.topics WHERE name = 'Programming'), 'Control Flow', 'Conditionals and loops', 3),
  ((SELECT id FROM public.topics WHERE name = 'Programming'), 'Functions', 'Reusable code blocks', 4),
  ((SELECT id FROM public.topics WHERE name = 'Programming'), 'Object-Oriented Programming', 'Classes and objects', 6),
  ((SELECT id FROM public.topics WHERE name = 'Programming'), 'Data Structures', 'Arrays, lists, trees, graphs', 7);

-- Seed skills
INSERT INTO public.skills (name, description, career_relevance) VALUES
  ('Problem Solving', 'Breaking down complex problems into manageable parts', 9),
  ('Analytical Thinking', 'Evaluating information and drawing conclusions', 9),
  ('Mathematical Reasoning', 'Applying mathematical concepts to real problems', 8),
  ('Code Writing', 'Writing clean, efficient code', 9),
  ('Debugging', 'Finding and fixing errors in code', 8),
  ('Data Analysis', 'Interpreting and visualizing data', 9),
  ('Critical Thinking', 'Evaluating arguments and evidence', 8),
  ('Pattern Recognition', 'Identifying patterns and trends', 7);

-- Seed sample questions for Mathematics - Algebra
INSERT INTO public.questions (topic_id, concept_id, skill_id, question_text, question_type, options, correct_answer, difficulty, time_limit, explanation) VALUES
  (
    (SELECT id FROM public.topics WHERE name = 'Mathematics'),
    (SELECT id FROM public.concepts WHERE name = 'Algebra Basics'),
    (SELECT id FROM public.skills WHERE name = 'Mathematical Reasoning'),
    'Solve for x: 2x + 5 = 15',
    'multiple_choice',
    '[{"text": "x = 5", "isCorrect": true}, {"text": "x = 10", "isCorrect": false}, {"text": "x = 7.5", "isCorrect": false}, {"text": "x = 3", "isCorrect": false}]',
    'x = 5',
    3,
    60,
    'Subtract 5 from both sides: 2x = 10. Then divide by 2: x = 5'
  ),
  (
    (SELECT id FROM public.topics WHERE name = 'Mathematics'),
    (SELECT id FROM public.concepts WHERE name = 'Algebra Basics'),
    (SELECT id FROM public.skills WHERE name = 'Problem Solving'),
    'If y = 3x - 2, what is y when x = 4?',
    'multiple_choice',
    '[{"text": "10", "isCorrect": true}, {"text": "14", "isCorrect": false}, {"text": "8", "isCorrect": false}, {"text": "12", "isCorrect": false}]',
    '10',
    2,
    45,
    'Substitute x = 4: y = 3(4) - 2 = 12 - 2 = 10'
  ),
  (
    (SELECT id FROM public.topics WHERE name = 'Mathematics'),
    (SELECT id FROM public.concepts WHERE name = 'Linear Equations'),
    (SELECT id FROM public.skills WHERE name = 'Analytical Thinking'),
    'What is the slope of the line y = 4x - 7?',
    'multiple_choice',
    '[{"text": "4", "isCorrect": true}, {"text": "-7", "isCorrect": false}, {"text": "7", "isCorrect": false}, {"text": "-4", "isCorrect": false}]',
    '4',
    3,
    45,
    'In the form y = mx + b, m is the slope. Here m = 4'
  );

-- Seed sample questions for Programming
INSERT INTO public.questions (topic_id, concept_id, skill_id, question_text, question_type, options, correct_answer, difficulty, time_limit, explanation) VALUES
  (
    (SELECT id FROM public.topics WHERE name = 'Programming'),
    (SELECT id FROM public.concepts WHERE name = 'Variables & Data Types'),
    (SELECT id FROM public.skills WHERE name = 'Code Writing'),
    'Which of the following is a valid variable name in most programming languages?',
    'multiple_choice',
    '[{"text": "myVariable", "isCorrect": true}, {"text": "123abc", "isCorrect": false}, {"text": "my-variable", "isCorrect": false}, {"text": "class", "isCorrect": false}]',
    'myVariable',
    2,
    45,
    'Variable names cannot start with numbers, contain hyphens, or be reserved keywords.'
  ),
  (
    (SELECT id FROM public.topics WHERE name = 'Programming'),
    (SELECT id FROM public.concepts WHERE name = 'Control Flow'),
    (SELECT id FROM public.skills WHERE name = 'Problem Solving'),
    'How many times will this loop execute: for(i = 0; i < 5; i++)?',
    'multiple_choice',
    '[{"text": "5 times", "isCorrect": true}, {"text": "4 times", "isCorrect": false}, {"text": "6 times", "isCorrect": false}, {"text": "Infinite", "isCorrect": false}]',
    '5 times',
    3,
    60,
    'The loop starts at 0 and runs while i < 5, so it executes for i = 0, 1, 2, 3, 4 (5 times)'
  ),
  (
    (SELECT id FROM public.topics WHERE name = 'Programming'),
    (SELECT id FROM public.concepts WHERE name = 'Functions'),
    (SELECT id FROM public.skills WHERE name = 'Debugging'),
    'What will function add(a, b) { return a + b; } return when called as add(3, "4")?',
    'multiple_choice',
    '[{"text": "\"34\"", "isCorrect": true}, {"text": "7", "isCorrect": false}, {"text": "Error", "isCorrect": false}, {"text": "undefined", "isCorrect": false}]',
    '"34"',
    5,
    90,
    'In JavaScript, when adding a number and string, the number is converted to a string and concatenated.'
  );