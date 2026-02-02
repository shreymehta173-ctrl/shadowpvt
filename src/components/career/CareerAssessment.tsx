import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle,
  Brain,
  Users,
  Zap,
  Clock,
  Shield
} from 'lucide-react';
import prepmateLogo from '@/assets/prepmate-logo.png';
import {
  CompletedClass,
  Stream12th,
  TraitDimensions,
  AssessmentQuestion,
  getQuestionsForClass,
} from '@/data/assessmentQuestions';

export interface AssessmentAnswers {
  completedClass: CompletedClass | null;
  stream12th: Stream12th;
  responses: Record<string, string>;
}

interface CareerAssessmentProps {
  onComplete: (
    answers: AssessmentAnswers, 
    scores: TraitDimensions,
    completedClass: 'after_10th' | 'after_12th_science' | 'after_12th_commerce',
    stream?: string
  ) => void;
}

const initialScores: TraitDimensions = {
  analytical_reasoning: 0,
  system_thinking: 0,
  people_involvement: 0,
  persuasion_influence: 0,
  creative_expression: 0,
  visual_thinking: 0,
  precision_orientation: 0,
  risk_appetite: 0,
  learning_depth_tolerance: 0,
  ambiguity_tolerance: 0,
  execution_drive: 0,
  planning_drive: 0,
};

export function CareerAssessment({ onComplete }: CareerAssessmentProps) {
  const { language, t } = useLanguage();
  const [step, setStep] = useState<'class-select' | 'stream-select' | 'assessment'>('class-select');
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    completedClass: null,
    stream12th: null,
    responses: {},
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);

  // Load questions when class is selected
  useEffect(() => {
    if (answers.completedClass) {
      const loadedQuestions = getQuestionsForClass(answers.completedClass);
      setQuestions(loadedQuestions);
    }
  }, [answers.completedClass]);

  const handleClassSelect = (selectedClass: CompletedClass) => {
    setAnswers(prev => ({ ...prev, completedClass: selectedClass }));
    if (selectedClass === '12th_science') {
      setStep('stream-select');
    } else {
      setStep('assessment');
    }
  };

  const handleStreamSelect = (stream: Stream12th) => {
    setAnswers(prev => ({ ...prev, stream12th: stream }));
    setStep('assessment');
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      responses: { ...prev.responses, [questionId]: value },
    }));
  };

  const calculateScores = useCallback((): TraitDimensions => {
    const scores = { ...initialScores };
    
    questions.forEach(question => {
      const response = answers.responses[question.id];
      if (!response) return;
      
      const selectedOption = question.options.find(opt => opt.value === response);
      if (selectedOption?.scores) {
        Object.entries(selectedOption.scores).forEach(([key, value]) => {
          scores[key as keyof TraitDimensions] += value || 0;
        });
      }
    });

    return scores;
  }, [questions, answers.responses]);

  const handleComplete = () => {
    const scores = calculateScores();
    const mappedClass: 'after_10th' | 'after_12th_science' | 'after_12th_commerce' = 
      answers.completedClass === '10th' ? 'after_10th' :
      answers.completedClass === '12th_science' ? 'after_12th_science' : 'after_12th_commerce';
    onComplete(answers, scores, mappedClass, answers.stream12th || undefined);
  };

  const progress = questions.length > 0 
    ? ((currentQuestionIndex + 1) / questions.length) * 100 
    : 0;

  const canProceed = answers.responses[questions[currentQuestionIndex]?.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Class Selection Screen
  if (step === 'class-select') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="max-w-3xl w-full border-border/50 shadow-xl bg-card">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <img 
                src={prepmateLogo} 
                alt="PrepMate Logo" 
                className="h-24 w-auto"
              />
            </div>
            <div className="flex justify-center mb-4">
              <LanguageToggle />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
              {t('Career Discovery Assessment', 'करियर खोज मूल्यांकन')}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {t('Shape Your Career Path - Discover what suits you best', 'अपने करियर का रास्ता बनाएं - जानें कि आपके लिए सबसे अच्छा क्या है')}
            </p>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {/* Disclaimer */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-warning">{t('Important Disclaimer', 'महत्वपूर्ण अस्वीकरण')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t(
                      'This is a behavioral assessment tool to help you explore suitable paths. Results should be discussed with parents, teachers, and career counselors before making important decisions.',
                      'यह एक व्यवहारिक मूल्यांकन उपकरण है जो आपको उपयुक्त रास्ते खोजने में मदद करता है। महत्वपूर्ण निर्णय लेने से पहले परिणामों पर माता-पिता, शिक्षकों और करियर परामर्शदाताओं के साथ चर्चा करनी चाहिए।'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('Which class have you completed?', 'आपने कौन सी कक्षा पूरी की है?')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('This determines your assessment path', 'यह आपके मूल्यांकन मार्ग को निर्धारित करता है')}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <button
                onClick={() => handleClassSelect('10th')}
                className="group p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{t('After 10th Standard', '10वीं के बाद')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('Explore all possible academic paths', 'सभी संभव शैक्षणिक मार्गों का पता लगाएं')}
                </p>
              </button>

              <button
                onClick={() => handleClassSelect('12th_science')}
                className="group p-6 rounded-xl border-2 border-border hover:border-info hover:bg-info/5 transition-all duration-200 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center mb-4 group-hover:bg-info/20 transition-colors">
                  <Zap className="h-6 w-6 text-info" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{t('After 12th Science', '12वीं विज्ञान के बाद')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('Technical, healthcare, research paths', 'तकनीकी, स्वास्थ्य, अनुसंधान मार्ग')}
                </p>
              </button>

              <button
                onClick={() => handleClassSelect('12th_commerce')}
                className="group p-6 rounded-xl border-2 border-border hover:border-warning hover:bg-warning/5 transition-all duration-200 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4 group-hover:bg-warning/20 transition-colors">
                  <Users className="h-6 w-6 text-warning" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{t('After 12th Commerce', '12वीं वाणिज्य के बाद')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('Business, finance, management paths', 'व्यापार, वित्त, प्रबंधन मार्ग')}
                </p>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{t('15 Questions', '15 प्रश्न')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>{t('Private & Secure', 'निजी और सुरक्षित')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Stream Selection for 12th Science
  if (step === 'stream-select') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="max-w-2xl w-full border-border/50 shadow-xl bg-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <LanguageToggle />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
              {t('Select Your Stream', 'अपनी स्ट्रीम चुनें')}
            </CardTitle>
            <p className="text-muted-foreground">
              {t('Which subjects did you study in 11th-12th?', '11वीं-12वीं में आपने कौन से विषय पढ़े?')}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              <button
                onClick={() => handleStreamSelect('PCM')}
                className="p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <h4 className="font-semibold text-foreground">{t('PCM (Physics, Chemistry, Mathematics)', 'PCM (भौतिकी, रसायन, गणित)')}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t('Technical and analytical paths', 'तकनीकी और विश्लेषणात्मक मार्ग')}</p>
              </button>
              
              <button
                onClick={() => handleStreamSelect('PCB')}
                className="p-5 rounded-xl border-2 border-border hover:border-success hover:bg-success/5 transition-all text-left"
              >
                <h4 className="font-semibold text-foreground">{t('PCB (Physics, Chemistry, Biology)', 'PCB (भौतिकी, रसायन, जीवविज्ञान)')}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t('Life sciences and healthcare paths', 'जीवन विज्ञान और स्वास्थ्य सेवा मार्ग')}</p>
              </button>
              
              <button
                onClick={() => handleStreamSelect('PCMB')}
                className="p-5 rounded-xl border-2 border-border hover:border-info hover:bg-info/5 transition-all text-left"
              >
                <h4 className="font-semibold text-foreground">{t('PCMB (All Four Subjects)', 'PCMB (सभी चार विषय)')}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t('Open to all paths', 'सभी मार्गों के लिए खुला')}</p>
              </button>
            </div>

            <Button
              variant="ghost"
              onClick={() => setStep('class-select')}
              className="mt-6"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('Back', 'वापस')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment Questions
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return <div className="p-8 text-center text-muted-foreground">{t('Loading questions...', 'प्रश्न लोड हो रहे हैं...')}</div>;
  }

  // Get question type badge
  const getQuestionTypeBadge = (type: string) => {
    switch (type) {
      case 'situational':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">{t('Scenario', 'परिदृश्य')}</Badge>;
      case 'forced_choice':
        return <Badge variant="outline" className="bg-info/10 text-info border-info/30">{t('Preference', 'प्राथमिकता')}</Badge>;
      case 'emotional':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">{t('Reflection', 'प्रतिबिंब')}</Badge>;
      case 'discomfort':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">{t('Challenge', 'चुनौती')}</Badge>;
      case 'validation':
        return <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">{t('Summary', 'सारांश')}</Badge>;
      default:
        return null;
    }
  };

  // Get translated content
  const questionText = language === 'hi' && currentQuestion.questionHi 
    ? currentQuestion.questionHi 
    : currentQuestion.question;
  const contextText = language === 'hi' && currentQuestion.contextHi 
    ? currentQuestion.contextHi 
    : currentQuestion.context;

  return (
    <div className="min-h-[80vh] p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getQuestionTypeBadge(currentQuestion.type)}
              <Badge variant="outline" className="bg-secondary">
                {answers.completedClass === '10th' && t('After 10th', '10वीं के बाद')}
                {answers.completedClass === '12th_science' && `${t('12th Science', '12वीं विज्ञान')} (${answers.stream12th})`}
                {answers.completedClass === '12th_commerce' && t('12th Commerce', '12वीं वाणिज्य')}
              </Badge>
              <LanguageToggle />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {currentQuestionIndex + 1} {t('of', 'में से')} {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-muted" />
        </div>

        {/* Question Card */}
        <Card className="border-border/50 shadow-lg bg-card">
          <CardContent className="p-6 md:p-8">
            {/* Context for situational questions */}
            {contextText && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6 border border-border/50">
                <p className="text-muted-foreground italic">
                  {contextText}
                </p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
                {questionText}
              </h2>
            </div>

            <RadioGroup
              value={answers.responses[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => {
                const optionLabel = language === 'hi' && option.labelHi 
                  ? option.labelHi 
                  : option.label;
                return (
                  <div
                    key={option.value}
                    className={`assessment-option ${
                      answers.responses[currentQuestion.id] === option.value ? 'selected' : ''
                    }`}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                    <Label
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer text-base text-foreground leading-relaxed"
                    >
                      {optionLabel}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => {
                  if (currentQuestionIndex === 0) {
                    setStep(answers.completedClass === '12th_science' ? 'stream-select' : 'class-select');
                  } else {
                    setCurrentQuestionIndex(prev => prev - 1);
                  }
                }}
                className="text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {t('Back', 'वापस')}
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={handleComplete}
                  disabled={!canProceed}
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8"
                >
                  {t('View Results', 'परिणाम देखें')}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={!canProceed}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {t('Next Question', 'अगला प्रश्न')}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Helper Info */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lightbulb className="h-4 w-4" />
          <span>{t('Answer honestly - there are no right or wrong answers', 'ईमानदारी से उत्तर दें - कोई सही या गलत उत्तर नहीं है')}</span>
        </div>
      </div>
    </div>
  );
}
