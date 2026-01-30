import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Weakness {
  id: string;
  student_id: string;
  subject: string;
  topic: string;
  difficulty: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_effort: number;
  is_resolved: boolean;
  created_at: string;
}

export interface StudyPreferences {
  id?: string;
  student_id: string;
  learning_pace: 'slow' | 'medium' | 'fast';
  daily_time_limit: number;
  preferred_study_days: string[];
  preferred_study_time: string;
  session_duration: number;
  break_duration: number;
}

export interface StudySession {
  id: string;
  plan_id: string;
  student_id: string;
  weakness_id?: string;
  subject: string;
  topic: string;
  session_type: 'study' | 'revision' | 'buffer';
  scheduled_date: string;
  scheduled_time?: string;
  duration_minutes: number;
  difficulty: number;
  status: 'pending' | 'completed' | 'partial' | 'skipped';
  completed_at?: string;
  feedback_notes?: string;
  effectiveness_score?: number;
}

export interface WeeklyPlan {
  id: string;
  student_id: string;
  week_start_date: string;
  week_end_date: string;
  total_planned_minutes: number;
  total_completed_minutes: number;
  status: string;
  ai_notes?: string;
  created_at: string;
}

export function useStudyPlanner() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [weaknesses, setWeaknesses] = useState<Weakness[]>([]);
  const [preferences, setPreferences] = useState<StudyPreferences | null>(null);
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);

      // Fetch weaknesses
      const { data: weaknessData, error: weaknessError } = await supabase
        .from('student_weaknesses')
        .select('*')
        .eq('student_id', profile.id)
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (weaknessError) throw weaknessError;
      setWeaknesses(weaknessData as Weakness[] || []);

      // Fetch preferences
      const { data: prefData, error: prefError } = await supabase
        .from('study_preferences')
        .select('*')
        .eq('student_id', profile.id)
        .maybeSingle();

      if (prefError) throw prefError;
      if (prefData) {
        setPreferences(prefData as unknown as StudyPreferences);
      }

      // Fetch current week's plan
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + diff);
      const weekStartStr = weekStart.toISOString().split('T')[0];

      const { data: planData, error: planError } = await supabase
        .from('weekly_study_plans')
        .select('*')
        .eq('student_id', profile.id)
        .eq('week_start_date', weekStartStr)
        .maybeSingle();

      if (planError) throw planError;
      if (planData) {
        setCurrentPlan(planData as WeeklyPlan);

        // Fetch sessions for this plan
        const { data: sessionData, error: sessionError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('plan_id', planData.id)
          .order('scheduled_date', { ascending: true })
          .order('scheduled_time', { ascending: true });

        if (sessionError) throw sessionError;
        setSessions(sessionData as StudySession[] || []);
      }
    } catch (error) {
      console.error('Error fetching study planner data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load study planner data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [profile?.id, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add weakness
  const addWeakness = async (weakness: Omit<Weakness, 'id' | 'student_id' | 'is_resolved' | 'created_at'>) => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('student_weaknesses')
        .insert({
          student_id: profile.id,
          ...weakness,
        })
        .select()
        .single();

      if (error) throw error;
      setWeaknesses(prev => [data as Weakness, ...prev]);
      toast({
        title: 'Topic Added',
        description: `${weakness.topic} added to your focus areas`,
      });
      return data;
    } catch (error) {
      console.error('Error adding weakness:', error);
      toast({
        title: 'Error',
        description: 'Failed to add topic',
        variant: 'destructive',
      });
    }
  };

  // Remove weakness
  const removeWeakness = async (id: string) => {
    try {
      const { error } = await supabase
        .from('student_weaknesses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWeaknesses(prev => prev.filter(w => w.id !== id));
      toast({
        title: 'Topic Removed',
        description: 'Topic removed from your focus areas',
      });
    } catch (error) {
      console.error('Error removing weakness:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove topic',
        variant: 'destructive',
      });
    }
  };

  // Update preferences
  const updatePreferences = async (prefs: Partial<StudyPreferences>) => {
    if (!profile?.id) return;

    try {
      const prefData = {
        student_id: profile.id,
        ...prefs,
      };

      const { data, error } = await supabase
        .from('study_preferences')
        .upsert(prefData, { onConflict: 'student_id' })
        .select()
        .single();

      if (error) throw error;
      setPreferences(data as unknown as StudyPreferences);
      toast({
        title: 'Preferences Saved',
        description: 'Your study preferences have been updated',
      });
      return data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save preferences',
        variant: 'destructive',
      });
    }
  };

  // Generate new plan
  const generatePlan = async () => {
    if (!profile?.id || weaknesses.length === 0) {
      toast({
        title: 'Cannot Generate Plan',
        description: 'Please add at least one topic to focus on',
        variant: 'destructive',
      });
      return;
    }

    try {
      setGenerating(true);

      // Call the AI agent
      const response = await supabase.functions.invoke('study-planner-agent', {
        body: {
          action: 'generate',
          weaknesses,
          preferences: preferences || {
            learning_pace: 'medium',
            daily_time_limit: 120,
            preferred_study_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            session_duration: 45,
            break_duration: 10,
          },
        },
      });

      if (response.error) throw response.error;
      const { plan } = response.data;

      // Save the plan to database
      const { data: savedPlan, error: planError } = await supabase
        .from('weekly_study_plans')
        .insert({
          student_id: profile.id,
          week_start_date: plan.week_start_date,
          week_end_date: plan.week_end_date,
          total_planned_minutes: plan.total_planned_minutes,
          ai_notes: plan.ai_notes,
          status: 'active',
        })
        .select()
        .single();

      if (planError) throw planError;

      // Save sessions
      const sessionsToInsert = plan.sessions.map((s: StudySession) => ({
        plan_id: savedPlan.id,
        student_id: profile.id,
        weakness_id: s.weakness_id || null,
        subject: s.subject,
        topic: s.topic,
        session_type: s.session_type,
        scheduled_date: s.scheduled_date,
        scheduled_time: s.scheduled_time,
        duration_minutes: s.duration_minutes,
        difficulty: s.difficulty,
        status: 'pending',
      }));

      const { data: savedSessions, error: sessionsError } = await supabase
        .from('study_sessions')
        .insert(sessionsToInsert)
        .select();

      if (sessionsError) throw sessionsError;

      setCurrentPlan(savedPlan as WeeklyPlan);
      setSessions(savedSessions as StudySession[]);

      toast({
        title: 'Plan Generated! 🎉',
        description: 'Your personalized weekly study plan is ready',
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate study plan',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  // Update session status
  const updateSessionStatus = async (
    sessionId: string,
    status: 'completed' | 'partial' | 'skipped',
    feedback?: { notes?: string; effectiveness?: number }
  ) => {
    try {
      const updateData: Record<string, unknown> = {
        status,
        completed_at: new Date().toISOString(),
      };

      if (feedback?.notes) updateData.feedback_notes = feedback.notes;
      if (feedback?.effectiveness) updateData.effectiveness_score = feedback.effectiveness;

      const { error } = await supabase
        .from('study_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? { ...s, status, completed_at: updateData.completed_at as string }
            : s
        )
      );

      // Update plan completed minutes
      if (currentPlan && status === 'completed') {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          const newCompletedMinutes = (currentPlan.total_completed_minutes || 0) + session.duration_minutes;
          await supabase
            .from('weekly_study_plans')
            .update({ total_completed_minutes: newCompletedMinutes })
            .eq('id', currentPlan.id);
          
          setCurrentPlan(prev => prev ? { ...prev, total_completed_minutes: newCompletedMinutes } : null);
        }
      }

      toast({
        title: status === 'completed' ? 'Great job! 🎉' : 'Session Updated',
        description: status === 'completed' ? 'Keep up the momentum!' : 'Session status updated',
      });
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        title: 'Error',
        description: 'Failed to update session',
        variant: 'destructive',
      });
    }
  };

  return {
    weaknesses,
    preferences,
    currentPlan,
    sessions,
    loading,
    generating,
    addWeakness,
    removeWeakness,
    updatePreferences,
    generatePlan,
    updateSessionStatus,
    refetch: fetchData,
  };
}
