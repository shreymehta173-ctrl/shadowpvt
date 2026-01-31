import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ScoreDimensions } from '@/data/assessmentQuestions';
import { CareerPath } from '@/data/careerGroups';

// Career result with match score (output from scoring engine)
export interface CareerMatchResult {
  career: CareerPath;
  score: number;
  confidence: number;
  reasons: string[];
}

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

export interface AssessmentContext {
  completedClass: 'after_10th' | 'after_12th_science' | 'after_12th_commerce';
  stream?: string; // For 12th Science: PCM, PCB, PCMB
  scores: ScoreDimensions;
  careerMatches: CareerMatchResult[];
  topCareer: CareerMatchResult | null;
}

export function useCareerGuidance() {
  const { profile } = useAuth();
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [assessmentContext, setAssessmentContext] = useState<AssessmentContext | null>(null);

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
      toast.error('Failed to load career recommendations');
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
      toast.error('Failed to load career details');
      return null;
    }
  }, [profile?.id]);

  const sendChatMessage = useCallback(async (
    message: string, 
    language: string = 'English',
    context?: AssessmentContext
  ) => {
    if (!profile?.id) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatLoading(true);

    // Use provided context or stored context
    const activeContext = context || assessmentContext;

    try {
      // Build chat history for context
      const chatHistory = chatMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const { data, error } = await supabase.functions.invoke('career-guidance-agent', {
        body: {
          action: 'chat',
          student_id: profile.id,
          message,
          language,
          chat_history: chatHistory,
          assessment_context: activeContext ? {
            completed_class: activeContext.completedClass,
            stream: activeContext.stream,
            scores: activeContext.scores,
            career_matches: activeContext.careerMatches.slice(0, 5).map(c => ({
              name: c.career.name,
              matchScore: c.score,
              description: c.career.description,
              educationPath: c.career.educationPath,
              entranceExams: c.career.entranceExams,
              salaryRange: c.career.salaryRange,
              growthOutlook: c.career.growthOutlook,
              reasons: c.reasons,
            })),
            top_career: activeContext.topCareer ? {
              name: activeContext.topCareer.career.name,
              matchScore: activeContext.topCareer.score,
              description: activeContext.topCareer.career.description,
              educationPath: activeContext.topCareer.career.educationPath,
              reasons: activeContext.topCareer.reasons,
            } : null,
          } : null,
        },
      });

      if (error) {
        // Handle specific error codes
        if (error.message?.includes('429')) {
          toast.error('Rate limit exceeded. Please try again in a moment.');
        } else if (error.message?.includes('402')) {
          toast.error('AI credits exhausted. Please add credits to continue.');
        }
        throw error;
      }

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
  }, [profile?.id, chatMessages, assessmentContext]);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  const updateAssessmentContext = useCallback((context: AssessmentContext) => {
    setAssessmentContext(context);
  }, []);

  return {
    recommendations,
    loading,
    chatMessages,
    chatLoading,
    assessmentContext,
    fetchRecommendations,
    getCareerDetail,
    sendChatMessage,
    setChatMessages,
    clearChat,
    updateAssessmentContext,
  };
}
