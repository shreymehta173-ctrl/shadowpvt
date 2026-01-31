import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import { CareerAssessment, AssessmentAnswers } from '@/components/career/CareerAssessment';
import { CareerResultsDashboard } from '@/components/career/CareerResultsDashboard';
import { CareerChatbot } from '@/components/career/CareerChatbot';
import { FullscreenChatDialog } from '@/components/career/FullscreenChatDialog';
import { useCareerGuidance, ChatMessage, AssessmentContext, CareerMatchResult } from '@/hooks/useCareerGuidance';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TraitDimensions } from '@/data/assessmentQuestions';
import { getCareerPathsForClass, calculateCareerScores, getTraitProfileSummary } from '@/data/careerGroups';

type ViewState = 'assessment' | 'results' | 'chat';

interface StoredAssessmentData {
  answers: AssessmentAnswers;
  scores: TraitDimensions;
  completedClass: 'after_10th' | 'after_12th_science' | 'after_12th_commerce';
  stream?: string;
}

export default function CareerGuidance() {
  const { profile } = useAuth();
  const [view, setView] = useState<ViewState>('assessment');
  const [assessmentData, setAssessmentData] = useState<StoredAssessmentData | null>(null);
  const [isFullscreenChat, setIsFullscreenChat] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  
  const {
    chatMessages,
    chatLoading,
    sendChatMessage,
    setChatMessages,
    clearChat,
    updateAssessmentContext,
  } = useCareerGuidance();

  // Calculate career matches from stored assessment data
  const careerMatches: CareerMatchResult[] = useMemo(() => {
    if (!assessmentData) return [];
    const careers = getCareerPathsForClass(
      assessmentData.completedClass === 'after_10th' ? '10th' :
      assessmentData.completedClass === 'after_12th_science' ? '12th_science' : '12th_commerce'
    );
    return calculateCareerScores(assessmentData.scores, careers);
  }, [assessmentData]);

  // Build assessment context for AI
  const assessmentContext: AssessmentContext | null = useMemo(() => {
    if (!assessmentData || careerMatches.length === 0) return null;
    return {
      completedClass: assessmentData.completedClass,
      stream: assessmentData.stream,
      scores: assessmentData.scores,
      careerMatches,
      topCareer: careerMatches[0] || null,
    };
  }, [assessmentData, careerMatches]);

  // Update context in hook when it changes
  useEffect(() => {
    if (assessmentContext) {
      updateAssessmentContext(assessmentContext);
    }
  }, [assessmentContext, updateAssessmentContext]);

  // Check if user has already completed assessment (stored in localStorage)
  useEffect(() => {
    if (profile?.id) {
      const storedData = localStorage.getItem(`career_assessment_v3_${profile.id}`);
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

  const handleAssessmentComplete = useCallback((
    answers: AssessmentAnswers, 
    scores: TraitDimensions,
    completedClass: 'after_10th' | 'after_12th_science' | 'after_12th_commerce',
    stream?: string
  ) => {
    const data: StoredAssessmentData = { answers, scores, completedClass, stream };
    setAssessmentData(data);
    setView('results');
    
    // Store in localStorage
    if (profile?.id) {
      localStorage.setItem(`career_assessment_v3_${profile.id}`, JSON.stringify(data));
    }
  }, [profile?.id]);

  const handleRetake = useCallback(() => {
    setAssessmentData(null);
    setView('assessment');
    clearChat();
    
    // Clear from localStorage
    if (profile?.id) {
      localStorage.removeItem(`career_assessment_v3_${profile.id}`);
    }
  }, [profile?.id, clearChat]);

  const handleChatWithMentor = useCallback(() => {
    setView('chat');
    
    // Initialize chat with context about their results
    if (assessmentContext && chatMessages.length === 0) {
      const pathwayLabel = assessmentContext.completedClass === 'after_10th' 
        ? 'After 10th' 
        : assessmentContext.completedClass === 'after_12th_science'
          ? `After 12th Science (${assessmentContext.stream || 'General'})`
          : 'After 12th Commerce';
      
      const topCareerName = assessmentContext.topCareer?.career.name || 'your recommended path';
      const topCareerScore = assessmentContext.topCareer?.score || 0;
      
      // Get trait profile summary
      const traitProfile = getTraitProfileSummary(assessmentContext.scores);
      
      const introMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: language === 'English' 
          ? `Hi ${profile?.display_name || 'there'}! 👋 I'm your AI Career Mentor from PrepMate.

I've analyzed your **${pathwayLabel}** behavioral assessment. Your top match is **${topCareerName}** with a ${topCareerScore}% compatibility score.

**Your Behavioral Profile:**
• **Dominant Traits**: ${traitProfile.dominant.join(', ')}
• **Work Style**: ${traitProfile.workStyle}
• **Learning Style**: ${traitProfile.learningStyle}

I can help you with:
• Understanding what each path involves and if it suits you
• Education routes and entrance requirements
• Real-life scenarios from different career paths
• Building a personalized roadmap

What would you like to explore first?`
          : `नमस्ते ${profile?.display_name || ''}! 👋 मैं PrepMate से आपका AI करियर मेंटर हूं।

मैंने आपके **${pathwayLabel}** व्यवहारिक मूल्यांकन का विश्लेषण किया है। आपका सबसे अच्छा मैच **${topCareerName}** है (${topCareerScore}% अनुकूलता)।

**आपकी व्यवहारिक प्रोफाइल:**
• **मुख्य गुण**: ${traitProfile.dominant.join(', ')}
• **कार्य शैली**: ${traitProfile.workStyle}

मुझसे कुछ भी पूछें - करियर विकल्प, शिक्षा मार्ग, या तैयारी की रणनीति!`,
        timestamp: new Date(),
      };
      setChatMessages([introMessage]);
    }
  }, [assessmentContext, chatMessages.length, profile?.display_name, language, setChatMessages]);

  const handleBackToResults = useCallback(() => {
    setView('results');
  }, []);

  // Wrapper to pass assessment context with every message
  const handleSendMessage = useCallback((msg: string, lang?: string) => {
    sendChatMessage(msg, lang || language, assessmentContext || undefined);
  }, [sendChatMessage, language, assessmentContext]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {view === 'assessment' && (
          <CareerAssessment onComplete={handleAssessmentComplete} />
        )}

        {view === 'results' && assessmentData && (
          <CareerResultsDashboard
            answers={assessmentData.answers}
            scores={assessmentData.scores}
            completedClass={assessmentData.completedClass}
            stream={assessmentData.stream}
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
                onSendMessage={handleSendMessage}
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
          onSendMessage={handleSendMessage}
          onClearChat={clearChat}
        />
      </div>
    </AppLayout>
  );
}
