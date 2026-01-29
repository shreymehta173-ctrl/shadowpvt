import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Brain,
  Target,
  Sparkles,
} from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: { text: string; isCorrect: boolean }[];
  correct_answer: string;
  difficulty: number;
  time_limit: number;
  explanation: string;
  concept_id: string;
  skill_id: string;
  topic_id: string;
}

interface Response {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeTaken: number;
  difficulty: number;
  conceptId: string;
  skillId: string;
  topicId: string;
}

export default function DiagnosticTest() {
  const { profile, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stage, setStage] = useState<'intro' | 'topic-select' | 'test' | 'results'>('intro');
  const [topics, setTopics] = useState<{ id: string; name: string; description: string }[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [responses, setResponses] = useState<Response[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [diagnosticSessionId, setDiagnosticSessionId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch topics on mount
  useEffect(() => {
    const fetchTopics = async () => {
      const { data } = await supabase.from('topics').select('id, name, description');
      if (data) setTopics(data);
    };
    fetchTopics();
  }, []);

  // Timer effect
  useEffect(() => {
    if (stage !== 'test' || showExplanation || questions.length === 0) return;

    const currentQuestion = questions[currentQuestionIndex];
    setTimeRemaining(currentQuestion?.time_limit || 60);
    setQuestionStartTime(Date.now());

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswer(true); // Auto-submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, stage, showExplanation, questions]);

  const startTest = async () => {
    if (!selectedTopic || !profile?.id) return;

    setLoading(true);
    try {
      // Fetch questions for selected topic
      const { data: questionsData, error } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', selectedTopic)
        .order('difficulty', { ascending: true })
        .limit(10);

      if (error) throw error;
      if (!questionsData || questionsData.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No questions available',
          description: 'Please try a different topic.',
        });
        return;
      }

      // Create diagnostic session
      const { data: sessionData, error: sessionError } = await supabase
        .from('diagnostic_sessions')
        .insert({
          student_id: profile.id,
          topic_id: selectedTopic,
          total_questions: questionsData.length,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      setDiagnosticSessionId(sessionData.id);
      setQuestions(questionsData.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      })));
      setStage('test');
    } catch (error) {
      console.error('Error starting test:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to start the test. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = useCallback((timeout = false) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    const isCorrect = currentQuestion.options?.find(
      (opt: any) => opt.text === selectedAnswer
    )?.isCorrect ?? false;

    const response: Response = {
      questionId: currentQuestion.id,
      answer: selectedAnswer || (timeout ? 'TIMEOUT' : ''),
      isCorrect,
      timeTaken,
      difficulty: currentQuestion.difficulty,
      conceptId: currentQuestion.concept_id,
      skillId: currentQuestion.skill_id,
      topicId: currentQuestion.topic_id,
    };

    setResponses((prev) => [...prev, response]);
    setShowExplanation(true);

    // Save response to database
    supabase.from('diagnostic_responses').insert({
      session_id: diagnosticSessionId,
      question_id: currentQuestion.id,
      student_answer: selectedAnswer || 'TIMEOUT',
      is_correct: isCorrect,
      time_taken: timeTaken,
    });
  }, [currentQuestionIndex, questions, selectedAnswer, questionStartTime, diagnosticSessionId]);

  const handleNextQuestion = () => {
    setSelectedAnswer('');
    setShowExplanation(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Test complete - analyze results
      analyzeResults();
    }
  };

  const analyzeResults = async () => {
    setIsSubmitting(true);
    setStage('results');

    try {
      const allResponses = [...responses];
      
      // Call the diagnostic agent
      const response = await supabase.functions.invoke('learning-diagnostic-agent', {
        body: {
          sessionId: diagnosticSessionId,
          responses: allResponses,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setAnalysisResult(response.data);

      toast({
        title: 'Analysis Complete! 🎉',
        description: 'Your learning gaps have been identified.',
      });
    } catch (error) {
      console.error('Error analyzing results:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: 'Failed to analyze results. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Intro Stage */}
        {stage === 'intro' && (
          <div className="text-center space-y-8 animate-fade-in py-12">
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Brain className="w-12 h-12 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Diagnostic Assessment</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                This adaptive test will identify your learning gaps and skill levels.
                Answer honestly — there's no penalty for wrong answers!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <Card>
                <CardContent className="pt-6">
                  <Target className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold">10 Questions</h3>
                  <p className="text-sm text-muted-foreground">Adaptive difficulty</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Clock className="h-8 w-8 text-warning mb-3" />
                  <h3 className="font-semibold">~10 Minutes</h3>
                  <p className="text-sm text-muted-foreground">Time per question</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Sparkles className="h-8 w-8 text-success mb-3" />
                  <h3 className="font-semibold">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">Personalized insights</p>
                </CardContent>
              </Card>
            </div>

            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90"
              onClick={() => setStage('topic-select')}
            >
              Choose a Topic <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Topic Selection */}
        {stage === 'topic-select' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Select a Topic</h1>
              <p className="text-muted-foreground mt-1">Choose the subject you want to assess</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-6 rounded-xl border text-left transition-all ${
                    selectedTopic === topic.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <h3 className="font-semibold text-foreground text-lg">{topic.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setStage('intro')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                className="bg-gradient-primary hover:opacity-90"
                onClick={startTest}
                disabled={!selectedTopic || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Start Test <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Test Stage */}
        {stage === 'test' && currentQuestion && (
          <div className="space-y-6 animate-fade-in">
            {/* Progress header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className={`flex items-center gap-2 ${timeRemaining <= 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{timeRemaining}s</span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-muted">
                    Difficulty: {currentQuestion.difficulty}/10
                  </span>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={selectedAnswer}
                  onValueChange={setSelectedAnswer}
                  disabled={showExplanation}
                  className="space-y-3"
                >
                  {currentQuestion.options?.map((option: any, index: number) => (
                    <label
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                        showExplanation
                          ? option.isCorrect
                            ? 'border-success bg-success/10'
                            : selectedAnswer === option.text
                            ? 'border-destructive bg-destructive/10'
                            : 'border-border opacity-50'
                          : selectedAnswer === option.text
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value={option.text} disabled={showExplanation} />
                      <span className="flex-1">{option.text}</span>
                      {showExplanation && option.isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                      {showExplanation && selectedAnswer === option.text && !option.isCorrect && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </label>
                  ))}
                </RadioGroup>

                {/* Explanation */}
                {showExplanation && (
                  <div className="p-4 rounded-lg bg-muted border border-border animate-fade-in">
                    <p className="font-medium text-foreground mb-1">Explanation:</p>
                    <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4">
                  {!showExplanation ? (
                    <Button
                      className="bg-gradient-primary hover:opacity-90"
                      onClick={() => handleSubmitAnswer(false)}
                      disabled={!selectedAnswer}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      className="bg-gradient-primary hover:opacity-90"
                      onClick={handleNextQuestion}
                    >
                      {currentQuestionIndex < questions.length - 1 ? (
                        <>Next Question <ArrowRight className="ml-2 h-4 w-4" /></>
                      ) : (
                        <>View Results <Sparkles className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Stage */}
        {stage === 'results' && (
          <div className="space-y-8 animate-fade-in py-8">
            {isSubmitting ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold">Analyzing Your Results...</h2>
                <p className="text-muted-foreground mt-2">Our AI is identifying your learning gaps</p>
              </div>
            ) : analysisResult ? (
              <>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Assessment Complete!</h1>
                  <p className="text-muted-foreground mt-1">Here's your performance summary</p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-foreground">
                        {analysisResult.summary?.accuracy || 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-foreground">
                        {analysisResult.summary?.correctAnswers || 0}/{analysisResult.summary?.totalQuestions || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Correct</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-foreground">
                        {analysisResult.summary?.averageTimePerQuestion || 0}s
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Time</p>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Insights */}
                {analysisResult.insights && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground">{analysisResult.insights}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => navigate('/gaps')}>
                    View Learning Gaps
                  </Button>
                  <Button
                    className="bg-gradient-primary hover:opacity-90"
                    onClick={() => navigate('/roadmap')}
                  >
                    Get Improvement Plan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Something went wrong. Please try again.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">
                  Return to Dashboard
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
