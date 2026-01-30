import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import { CareerQuestionnaire, QuestionnaireAnswers, CareerScores } from '@/components/career/CareerQuestionnaire';
import { CareerResults } from '@/components/career/CareerResults';
import { CareerChatbot } from '@/components/career/CareerChatbot';
import { FullscreenChatDialog } from '@/components/career/FullscreenChatDialog';
import { useCareerGuidance, ChatMessage } from '@/hooks/useCareerGuidance';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type ViewState = 'questionnaire' | 'results' | 'chat';

export default function CareerGuidance() {
  const { profile } = useAuth();
  const [view, setView] = useState<ViewState>('questionnaire');
  const [questionnaireData, setQuestionnaireData] = useState<{
    answers: QuestionnaireAnswers;
    scores: CareerScores;
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

  // Check if user has already completed questionnaire (stored in localStorage)
  useEffect(() => {
    if (profile?.id) {
      const storedData = localStorage.getItem(`career_questionnaire_${profile.id}`);
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setQuestionnaireData(parsed);
          setView('results');
        } catch (e) {
          console.error('Failed to parse stored questionnaire data:', e);
        }
      }
    }
  }, [profile?.id]);

  const handleQuestionnaireComplete = useCallback((answers: QuestionnaireAnswers, scores: CareerScores) => {
    const data = { answers, scores };
    setQuestionnaireData(data);
    setView('results');
    
    // Store in localStorage
    if (profile?.id) {
      localStorage.setItem(`career_questionnaire_${profile.id}`, JSON.stringify(data));
    }
  }, [profile?.id]);

  const handleRetake = useCallback(() => {
    setQuestionnaireData(null);
    setView('questionnaire');
    clearChat();
    
    // Clear from localStorage
    if (profile?.id) {
      localStorage.removeItem(`career_questionnaire_${profile.id}`);
    }
  }, [profile?.id, clearChat]);

  const handleChatWithMentor = useCallback(() => {
    setView('chat');
    
    // Initialize chat with context about their results
    if (questionnaireData && chatMessages.length === 0) {
      const introMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: language === 'English' 
          ? `Hi ${profile?.display_name || 'there'}! 👋 I'm your AI Career Mentor. I've analyzed your assessment results and I'm here to help you explore your career options. Feel free to ask me anything about:\n\n• Your recommended careers\n• Required skills and education paths\n• Job market trends\n• How to prepare for your chosen career\n\nWhat would you like to know?`
          : `नमस्ते ${profile?.display_name || ''}! 👋 मैं आपका AI करियर मेंटर हूं। मैंने आपके मूल्यांकन परिणामों का विश्लेषण किया है और मैं आपके करियर विकल्पों का पता लगाने में आपकी मदद करने के लिए यहां हूं। मुझसे कुछ भी पूछें!`,
        timestamp: new Date(),
      };
      setChatMessages([introMessage]);
    }
  }, [questionnaireData, chatMessages.length, profile?.display_name, language, setChatMessages]);

  const handleBackToResults = useCallback(() => {
    setView('results');
  }, []);

  const handleSendMessage = useCallback((message: string) => {
    sendChatMessage(message, language);
  }, [sendChatMessage, language]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10">
          {view === 'questionnaire' && (
            <CareerQuestionnaire onComplete={handleQuestionnaireComplete} />
          )}

          {view === 'results' && questionnaireData && (
            <CareerResults
              answers={questionnaireData.answers}
              scores={questionnaireData.scores}
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
        </div>

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
