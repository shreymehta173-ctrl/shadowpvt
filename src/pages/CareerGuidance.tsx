import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import { CareerAssessment, AssessmentAnswers } from '@/components/career/CareerAssessment';
import { CareerResultsDashboard } from '@/components/career/CareerResultsDashboard';
import { CareerChatbot } from '@/components/career/CareerChatbot';
import { FullscreenChatDialog } from '@/components/career/FullscreenChatDialog';
import { useCareerGuidance, ChatMessage } from '@/hooks/useCareerGuidance';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ScoreDimensions } from '@/data/assessmentQuestions';

type ViewState = 'assessment' | 'results' | 'chat';

export default function CareerGuidance() {
  const { profile } = useAuth();
  const [view, setView] = useState<ViewState>('assessment');
  const [assessmentData, setAssessmentData] = useState<{
    answers: AssessmentAnswers;
    scores: ScoreDimensions;
  } | null>(null);
  const [isFullscreenChat, setIsFullscreenChat] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  
  const {
    chatMessages,
    chatLoading,
    sendChatMessage,
    setChatMessages,
    clearChat,
  } = useCareerGuidance();

  // Check if user has already completed assessment (stored in localStorage)
  useEffect(() => {
    if (profile?.id) {
      const storedData = localStorage.getItem(`career_assessment_v2_${profile.id}`);
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setAssessmentData(parsed);
          setView('results');
        } catch (e) {
          console.error('Failed to parse stored assessment data:', e);
        }
      }
    }
  }, [profile?.id]);

  const handleAssessmentComplete = useCallback((answers: AssessmentAnswers, scores: ScoreDimensions) => {
    const data = { answers, scores };
    setAssessmentData(data);
    setView('results');
    
    // Store in localStorage
    if (profile?.id) {
      localStorage.setItem(`career_assessment_v2_${profile.id}`, JSON.stringify(data));
    }
  }, [profile?.id]);

  const handleRetake = useCallback(() => {
    setAssessmentData(null);
    setView('assessment');
    clearChat();
    
    // Clear from localStorage
    if (profile?.id) {
      localStorage.removeItem(`career_assessment_v2_${profile.id}`);
    }
  }, [profile?.id, clearChat]);

  const handleChatWithMentor = useCallback(() => {
    setView('chat');
    
    // Initialize chat with context about their results
    if (assessmentData && chatMessages.length === 0) {
      const introMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: language === 'English' 
          ? `Hi ${profile?.display_name || 'there'}! 👋 I'm your AI Career Mentor from PrepMate.\n\nI've reviewed your assessment results and I'm here to help you explore your career options. Feel free to ask me anything about:\n\n• Your recommended career paths\n• Required education and entrance exams\n• Job market trends and salary expectations\n• How to prepare for your chosen career\n\nWhat would you like to know?`
          : `नमस्ते ${profile?.display_name || ''}! 👋 मैं PrepMate से आपका AI करियर मेंटर हूं।\n\nमैंने आपके मूल्यांकन परिणामों की समीक्षा की है और मैं आपके करियर विकल्पों का पता लगाने में मदद करने के लिए यहां हूं। मुझसे कुछ भी पूछें!`,
        timestamp: new Date(),
      };
      setChatMessages([introMessage]);
    }
  }, [assessmentData, chatMessages.length, profile?.display_name, language, setChatMessages]);

  const handleBackToResults = useCallback(() => {
    setView('results');
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50">
        {view === 'assessment' && (
          <CareerAssessment onComplete={handleAssessmentComplete} />
        )}

        {view === 'results' && assessmentData && (
          <CareerResultsDashboard
            answers={assessmentData.answers}
            scores={assessmentData.scores}
            onRetake={handleRetake}
            onChatWithMentor={handleChatWithMentor}
          />
        )}

        {view === 'chat' && (
          <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={handleBackToResults}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Results
              </Button>
            </div>
            <div className="h-[600px]">
              <CareerChatbot
                messages={chatMessages}
                loading={chatLoading}
                onSendMessage={(msg, lang) => sendChatMessage(msg, lang || language)}
                onClearChat={clearChat}
              />
            </div>
          </div>
        )}

        {/* Fullscreen Chat Dialog */}
        <FullscreenChatDialog
          open={isFullscreenChat}
          onOpenChange={setIsFullscreenChat}
          messages={chatMessages}
          loading={chatLoading}
          onSendMessage={(msg, lang) => sendChatMessage(msg, lang || language)}
          onClearChat={clearChat}
        />
      </div>
    </AppLayout>
  );
}
