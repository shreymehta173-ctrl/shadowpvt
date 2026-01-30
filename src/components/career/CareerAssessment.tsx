import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  GraduationCap, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle,
  BookOpen,
  Target,
  TrendingUp,
  Shield,
  Clock,
  Info
} from 'lucide-react';
import {
  CompletedClass,
  Stream12th,
  ScoreDimensions,
  AssessmentQuestion,
  getQuestionsForClass,
} from '@/data/assessmentQuestions';

export interface AssessmentAnswers {
  completedClass: CompletedClass | null;
  stream12th: Stream12th;
  responses: Record<string, string>;
}

interface CareerAssessmentProps {
  onComplete: (answers: AssessmentAnswers, scores: ScoreDimensions) => void;
}

const initialScores: ScoreDimensions = {
  technical_orientation: 0,
  biological_orientation: 0,
  data_orientation: 0,
  creative_orientation: 0,
  business_orientation: 0,
  financial_orientation: 0,
  social_orientation: 0,
  hands_on_orientation: 0,
  pressure_tolerance: 0,
  exam_tolerance: 0,
};

export function CareerAssessment({ onComplete }: CareerAssessmentProps) {
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

  const calculateScores = useCallback((): ScoreDimensions => {
    const scores = { ...initialScores };
    
    questions.forEach(question => {
      const response = answers.responses[question.id];
      if (!response) return;
      
      const selectedOption = question.options.find(opt => opt.value === response);
      if (selectedOption?.scores) {
        Object.entries(selectedOption.scores).forEach(([key, value]) => {
          scores[key as keyof ScoreDimensions] += value || 0;
        });
      }
    });

    return scores;
  }, [questions, answers.responses]);

  const handleComplete = () => {
    const scores = calculateScores();
    onComplete(answers, scores);
  };

  const progress = questions.length > 0 
    ? ((currentQuestionIndex + 1) / questions.length) * 100 
    : 0;

  const canProceed = answers.responses[questions[currentQuestionIndex]?.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Class Selection Screen
  if (step === 'class-select') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-8">
        <Card className="max-w-3xl w-full border-slate-200 shadow-xl bg-white">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900">
              Career Discovery Assessment
            </CardTitle>
            <p className="text-slate-600 mt-2">
              PrepMate by Team Shadow - Helping you make informed career decisions
            </p>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Important Disclaimer</p>
                  <p className="text-sm text-amber-700 mt-1">
                    This assessment is a decision support tool, not a final authority. 
                    Results should be discussed with parents, teachers, and career counselors 
                    before making important academic decisions.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Which class have you completed?
              </h3>
              <p className="text-slate-500 text-sm">
                This determines which assessment set you'll receive
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <button
                onClick={() => handleClassSelect('10th')}
                className="group p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-200 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">After 10th Standard</h4>
                <p className="text-sm text-slate-500">
                  Explore Science, Commerce, Arts, or Vocational paths
                </p>
              </button>

              <button
                onClick={() => handleClassSelect('12th_science')}
                className="group p-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">After 12th Science</h4>
                <p className="text-sm text-slate-500">
                  Engineering, Medical, Data Science, Design paths
                </p>
              </button>

              <button
                onClick={() => handleClassSelect('12th_commerce')}
                className="group p-6 rounded-xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all duration-200 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">After 12th Commerce</h4>
                <p className="text-sm text-slate-500">
                  CA, MBA, Finance, Marketing paths
                </p>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>15 Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Private & Secure</span>
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
      <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-8">
        <Card className="max-w-2xl w-full border-slate-200 shadow-xl bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-xl md:text-2xl font-bold text-slate-900">
              Select Your Stream
            </CardTitle>
            <p className="text-slate-600">
              Which subjects did you study in 11th-12th?
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              <button
                onClick={() => handleStreamSelect('PCM')}
                className="p-5 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
              >
                <h4 className="font-semibold text-slate-900">PCM (Physics, Chemistry, Mathematics)</h4>
                <p className="text-sm text-slate-500 mt-1">Engineering, Technology, Pure Sciences</p>
              </button>
              
              <button
                onClick={() => handleStreamSelect('PCB')}
                className="p-5 rounded-xl border-2 border-slate-200 hover:border-green-500 hover:bg-green-50/50 transition-all text-left"
              >
                <h4 className="font-semibold text-slate-900">PCB (Physics, Chemistry, Biology)</h4>
                <p className="text-sm text-slate-500 mt-1">Medical, Life Sciences, Healthcare</p>
              </button>
              
              <button
                onClick={() => handleStreamSelect('PCMB')}
                className="p-5 rounded-xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all text-left"
              >
                <h4 className="font-semibold text-slate-900">PCMB (All Four Subjects)</h4>
                <p className="text-sm text-slate-500 mt-1">Open to all Science career paths</p>
              </button>
            </div>

            <Button
              variant="ghost"
              onClick={() => setStep('class-select')}
              className="mt-6"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment Questions
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return <div className="p-8 text-center text-slate-500">Loading questions...</div>;
  }

  return (
    <div className="min-h-[80vh] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-slate-50">
              {answers.completedClass === '10th' && 'After 10th Assessment'}
              {answers.completedClass === '12th_science' && `After 12th Science (${answers.stream12th})`}
              {answers.completedClass === '12th_commerce' && 'After 12th Commerce Assessment'}
            </Badge>
            <span className="text-sm font-medium text-slate-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-100" />
        </div>

        {/* Question Card */}
        <Card className="border-slate-200 shadow-lg bg-white">
          <CardContent className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            <RadioGroup
              value={answers.responses[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    answers.responses[currentQuestion.id] === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer text-base text-slate-700"
                  >
                    <span className="font-medium text-indigo-600 mr-2">{option.value}.</span>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <Button
                variant="ghost"
                onClick={() => {
                  if (currentQuestionIndex === 0) {
                    setStep(answers.completedClass === '12th_science' ? 'stream-select' : 'class-select');
                  } else {
                    setCurrentQuestionIndex(prev => prev - 1);
                  }
                }}
                className="text-slate-600"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={handleComplete}
                  disabled={!canProceed}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8"
                >
                  View Results
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={!canProceed}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Next Question
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Helper Info */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
          <Info className="h-4 w-4" />
          <span>Answer honestly for the most accurate recommendations</span>
        </div>
      </div>
    </div>
  );
}
