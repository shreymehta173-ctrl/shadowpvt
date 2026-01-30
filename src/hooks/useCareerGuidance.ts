import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CareerRecommendation {
  career_id: string;
  career_name: string;
  industry: string;
  match_score: number;
  skill_fit_score: number;
  interest_fit_score: number;
  gap_penalty_score: number;
  description: string;
  icon: string;
  color: string;
  difficulty_level: number;
  future_scope_score: number;
  growth_rate: string;
  average_salary_min: number;
  average_salary_max: number;
  required_skills: string[];
  ai_explanation?: string;
  ai_roadmap?: {
    steps: Array<{
      phase: string;
      duration: string;
      focus_areas: string[];
      milestones: string[];
    }>;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useCareerGuidance() {
  const { profile } = useAuth();
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const fetchRecommendations = useCallback(async (language: string = 'English') => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('career-guidance-agent', {
        body: {
          action: 'get_recommendations',
          student_id: profile.id,
          language,
        },
      });

      if (error) throw error;
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching career recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  const getCareerDetail = useCallback(async (careerId: string, language: string = 'English') => {
    if (!profile?.id) return null;

    try {
      const { data, error } = await supabase.functions.invoke('career-guidance-agent', {
        body: {
          action: 'get_career_detail',
          student_id: profile.id,
          career_id: careerId,
          language,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching career detail:', error);
      return null;
    }
  }, [profile?.id]);

  const sendChatMessage = useCallback(async (message: string, language: string = 'English') => {
    if (!profile?.id) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('career-guidance-agent', {
        body: {
          action: 'chat',
          student_id: profile.id,
          message,
          language,
        },
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not process your request.',
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  }, [profile?.id]);

  return {
    recommendations,
    loading,
    chatMessages,
    chatLoading,
    fetchRecommendations,
    getCareerDetail,
    sendChatMessage,
    setChatMessages,
  };
}
