import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Rocket, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Brain,
  Target,
  Lightbulb,
  Heart,
  Zap
} from 'lucide-react';

export interface QuestionnaireAnswers {
  classCompleted: '10th' | '12th' | null;
  subjects10th: string[];
  stream12th: 'PCM' | 'PCB' | 'PCMB' | null;
  freeTimeActivity: string | null;
  excitingActivity: string | null;
  problemSolving: string | null;
  thinkingStyle: string | null;
  bestSkills: string[];
  preferredTask: string | null;
  competitiveExams: string | null;
  priority: string | null;
  continuousLearning: string | null;
  careerPath: string | null;
  expertOrVariety: string | null;
  failureResponse: string | null;
}

export interface CareerScores {
  logical: number;
  creative: number;
  social: number;
  technical: number;
  business: number;
  handsOn: number;
}

interface CareerQuestionnaireProps {
  onComplete: (answers: QuestionnaireAnswers, scores: CareerScores) => void;
}

interface Question {
  id: keyof QuestionnaireAnswers;
  question: string;
  icon: React.ReactNode;
  options: { value: string; label: string; scores?: Partial<CareerScores> }[];
  multiple?: boolean;
  maxSelect?: number;
  conditional?: (answers: QuestionnaireAnswers) => boolean;
}

const questions: Question[] = [
  {
    id: 'classCompleted',
    question: 'What class have you completed?',
    icon: <Target className="h-6 w-6" />,
    options: [
      { value: '10th', label: '10th Standard' },
      { value: '12th', label: '12th Standard (Science)' },
    ],
  },
  {
    id: 'subjects10th',
    question: 'Which subjects did you enjoy most in 9th–10th?',
    icon: <Lightbulb className="h-6 w-6" />,
    options: [
      { value: 'maths', label: 'Maths', scores: { logical: 2, technical: 1 } },
      { value: 'science', label: 'Science', scores: { logical: 1, technical: 2 } },
      { value: 'english', label: 'English', scores: { creative: 1, social: 1 } },
      { value: 'social', label: 'Social Science', scores: { social: 2 } },
      { value: 'computers', label: 'Computers', scores: { technical: 2, logical: 1 } },
      { value: 'drawing', label: 'Drawing / Creative', scores: { creative: 2, handsOn: 1 } },
      { value: 'none', label: 'None in particular' },
    ],
    multiple: true,
    conditional: (answers) => answers.classCompleted === '10th',
  },
  {
    id: 'stream12th',
    question: 'Which stream did you choose in 12th?',
    icon: <Brain className="h-6 w-6" />,
    options: [
      { value: 'PCM', label: 'PCM (Physics, Chemistry, Maths)', scores: { logical: 2, technical: 2 } },
      { value: 'PCB', label: 'PCB (Physics, Chemistry, Biology)', scores: { logical: 1, social: 1 } },
      { value: 'PCMB', label: 'PCMB (All four)', scores: { logical: 2, technical: 1 } },
    ],
    conditional: (answers) => answers.classCompleted === '12th',
  },
  {
    id: 'freeTimeActivity',
    question: 'When you get free time, what do you enjoy most?',
    icon: <Heart className="h-6 w-6" />,
    options: [
      { value: 'puzzles', label: 'Solving puzzles / logical games', scores: { logical: 2, technical: 1 } },
      { value: 'tech_videos', label: 'Watching science / tech videos', scores: { technical: 2, logical: 1 } },
      { value: 'creative', label: 'Drawing, editing, content creation', scores: { creative: 2, handsOn: 1 } },
      { value: 'reading', label: 'Reading / writing', scores: { creative: 1, social: 1 } },
      { value: 'helping', label: 'Helping others / teaching', scores: { social: 2 } },
      { value: 'business', label: 'Business / money / trading videos', scores: { business: 2 } },
      { value: 'gaming', label: 'Playing games only', scores: { technical: 1 } },
    ],
  },
  {
    id: 'excitingActivity',
    question: 'Which activity excites you the most?',
    icon: <Zap className="h-6 w-6" />,
    options: [
      { value: 'building', label: 'Building or fixing things', scores: { handsOn: 2, technical: 1 } },
      { value: 'explaining', label: 'Explaining something to others', scores: { social: 2 } },
      { value: 'designing', label: 'Designing or creating something new', scores: { creative: 2 } },
      { value: 'analyzing', label: 'Analysing data or numbers', scores: { logical: 2, business: 1 } },
      { value: 'organizing', label: 'Organising people or events', scores: { business: 1, social: 1 } },
      { value: 'machines', label: 'Understanding how machines / apps work', scores: { technical: 2, logical: 1 } },
    ],
  },
  {
    id: 'problemSolving',
    question: 'If a problem is difficult, what do you usually do?',
    icon: <Brain className="h-6 w-6" />,
    options: [
      { value: 'persist', label: 'Try again and again till I solve it', scores: { logical: 2 } },
      { value: 'simpler', label: 'Look for a simpler method', scores: { creative: 1, logical: 1 } },
      { value: 'ask', label: 'Ask someone and understand', scores: { social: 1 } },
      { value: 'later', label: 'Leave it and come back later', scores: { creative: 1 } },
      { value: 'stressed', label: 'Feel stressed quickly' },
    ],
  },
  {
    id: 'thinkingStyle',
    question: 'Which describes you better?',
    icon: <Lightbulb className="h-6 w-6" />,
    options: [
      { value: 'rules', label: 'I like clear rules and fixed steps', scores: { logical: 1, technical: 1 } },
      { value: 'creative', label: 'I like open problems and creativity', scores: { creative: 2 } },
      { value: 'practical', label: 'I like practical hands-on work', scores: { handsOn: 2 } },
      { value: 'theory', label: 'I like theory and concepts', scores: { logical: 1 } },
    ],
  },
  {
    id: 'bestSkills',
    question: 'Which skills describe you best? (choose max 2)',
    icon: <Sparkles className="h-6 w-6" />,
    options: [
      { value: 'logical', label: 'Logical thinking', scores: { logical: 2 } },
      { value: 'communication', label: 'Communication', scores: { social: 2 } },
      { value: 'creativity', label: 'Creativity', scores: { creative: 2 } },
      { value: 'leadership', label: 'Leadership', scores: { business: 1, social: 1 } },
      { value: 'detail', label: 'Attention to detail', scores: { logical: 1, technical: 1 } },
      { value: 'tech', label: 'Technology interest', scores: { technical: 2 } },
      { value: 'empathy', label: 'Helping and empathy', scores: { social: 2 } },
    ],
    multiple: true,
    maxSelect: 2,
  },
  {
    id: 'preferredTask',
    question: 'Which task would you prefer?',
    icon: <Target className="h-6 w-6" />,
    options: [
      { value: 'computer', label: 'Work on computer most of the time', scores: { technical: 2, logical: 1 } },
      { value: 'people', label: 'Work with people most of the time', scores: { social: 2 } },
      { value: 'machines', label: 'Work with machines/tools', scores: { handsOn: 2, technical: 1 } },
      { value: 'mix', label: 'Mix of everything', scores: { business: 1 } },
    ],
  },
  {
    id: 'competitiveExams',
    question: 'Are you comfortable with competitive exams and long preparation?',
    icon: <Brain className="h-6 w-6" />,
    options: [
      { value: 'yes', label: 'Yes, I can handle it', scores: { logical: 1 } },
      { value: 'maybe', label: 'Maybe' },
      { value: 'no', label: 'No, I prefer skill-based learning', scores: { handsOn: 1, creative: 1 } },
    ],
  },
  {
    id: 'priority',
    question: 'Which is more important for you?',
    icon: <Heart className="h-6 w-6" />,
    options: [
      { value: 'salary', label: 'High salary', scores: { business: 1, technical: 1 } },
      { value: 'satisfaction', label: 'Job satisfaction', scores: { creative: 1 } },
      { value: 'balance', label: 'Work-life balance' },
      { value: 'impact', label: 'Social impact', scores: { social: 2 } },
    ],
  },
  {
    id: 'continuousLearning',
    question: 'How do you feel about continuous learning (new tools, courses, exams)?',
    icon: <Rocket className="h-6 w-6" />,
    options: [
      { value: 'enjoy', label: 'I enjoy learning new things', scores: { technical: 1, logical: 1 } },
      { value: 'manage', label: 'I can manage if required' },
      { value: 'stable', label: 'I prefer stable and simple work', scores: { handsOn: 1 } },
    ],
  },
  {
    id: 'careerPath',
    question: 'Do you prefer:',
    icon: <Target className="h-6 w-6" />,
    options: [
      { value: 'fixed', label: 'Clear career path (fixed ladder)', scores: { logical: 1 } },
      { value: 'flexible', label: 'Flexible career path (changing roles)', scores: { creative: 1, business: 1 } },
    ],
  },
  {
    id: 'expertOrVariety',
    question: 'Which statement feels closer to you?',
    icon: <Lightbulb className="h-6 w-6" />,
    options: [
      { value: 'expert', label: 'I like being an expert in one thing', scores: { technical: 1, logical: 1 } },
      { value: 'variety', label: 'I like doing many different things', scores: { creative: 1, business: 1 } },
    ],
  },
  {
    id: 'failureResponse',
    question: 'If you fail once, what is most likely?',
    icon: <Heart className="h-6 w-6" />,
    options: [
      { value: 'retry', label: 'I will try again', scores: { logical: 1 } },
      { value: 'change', label: 'I will change the path', scores: { creative: 1 } },
      { value: 'confidence', label: 'I will lose confidence' },
      { value: 'support', label: 'I will look for support', scores: { social: 1 } },
    ],
  },
];

export function CareerQuestionnaire({ onComplete }: CareerQuestionnaireProps) {
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    classCompleted: null,
    subjects10th: [],
    stream12th: null,
    freeTimeActivity: null,
    excitingActivity: null,
    problemSolving: null,
    thinkingStyle: null,
    bestSkills: [],
    preferredTask: null,
    competitiveExams: null,
    priority: null,
    continuousLearning: null,
    careerPath: null,
    expertOrVariety: null,
    failureResponse: null,
  });

  // Filter questions based on conditions
  const activeQuestions = questions.filter(
    (q) => !q.conditional || q.conditional(answers)
  );

  // Group questions into screens (3-4 per screen)
  const questionScreens: Question[][] = [];
  let currentGroup: Question[] = [];
  
  activeQuestions.forEach((q, index) => {
    currentGroup.push(q);
    if (currentGroup.length === 3 || index === activeQuestions.length - 1) {
      questionScreens.push([...currentGroup]);
      currentGroup = [];
    }
  });

  const totalScreens = questionScreens.length + 1; // +1 for intro
  const progress = (currentScreen / totalScreens) * 100;

  const handleAnswer = (questionId: keyof QuestionnaireAnswers, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleMultipleAnswer = (questionId: keyof QuestionnaireAnswers, value: string, maxSelect?: number) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter((v) => v !== value) };
      }
      if (maxSelect && current.length >= maxSelect) {
        return prev;
      }
      return { ...prev, [questionId]: [...current, value] };
    });
  };

  const calculateScores = (): CareerScores => {
    const scores: CareerScores = {
      logical: 0,
      creative: 0,
      social: 0,
      technical: 0,
      business: 0,
      handsOn: 0,
    };

    activeQuestions.forEach((question) => {
      const answer = answers[question.id];
      if (!answer) return;

      if (question.multiple) {
        (answer as string[]).forEach((val) => {
          const option = question.options.find((o) => o.value === val);
          if (option?.scores) {
            Object.entries(option.scores).forEach(([key, value]) => {
              scores[key as keyof CareerScores] += value || 0;
            });
          }
        });
      } else {
        const option = question.options.find((o) => o.value === answer);
        if (option?.scores) {
          Object.entries(option.scores).forEach(([key, value]) => {
            scores[key as keyof CareerScores] += value || 0;
          });
        }
      }
    });

    return scores;
  };

  const canProceed = () => {
    if (currentScreen === 0) return true;
    const screenQuestions = questionScreens[currentScreen - 1];
    return screenQuestions.every((q) => {
      const answer = answers[q.id];
      if (q.multiple) {
        return (answer as string[])?.length > 0;
      }
      return answer !== null && answer !== undefined;
    });
  };

  const handleNext = () => {
    if (currentScreen === totalScreens - 1) {
      const scores = calculateScores();
      onComplete(answers, scores);
    } else {
      setCurrentScreen((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentScreen((prev) => Math.max(0, prev - 1));
  };

  // Intro Screen
  if (currentScreen === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-gradient-to-br from-background via-background to-primary/5 border-primary/20 shadow-2xl overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary via-purple-500 to-cyan-500 flex items-center justify-center shadow-xl animate-bounce">
                <Rocket className="h-12 w-12 text-white" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-4">
                Let's Discover Your Career Path
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Answer 15 simple questions and we'll find the perfect career matches for you in just <span className="text-primary font-semibold">3 minutes</span>!
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
                <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <Brain className="h-6 w-6 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Interests</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                  <Sparkles className="h-6 w-6 mx-auto text-purple-500 mb-1" />
                  <p className="text-xs text-muted-foreground">Skills</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                  <Target className="h-6 w-6 mx-auto text-cyan-500 mb-1" />
                  <p className="text-xs text-muted-foreground">Goals</p>
                </div>
              </div>

              <Button 
                onClick={handleNext}
                size="lg"
                className="bg-gradient-to-r from-primary via-purple-500 to-cyan-500 hover:opacity-90 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Start Discovery
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-xs text-muted-foreground mt-6">
                🔒 Your answers are private and secure
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Question Screens
  const screenQuestions = questionScreens[currentScreen - 1];

  return (
    <div className="min-h-[80vh] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Screen {currentScreen} of {totalScreens - 1}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {screenQuestions.map((question, index) => (
            <Card 
              key={question.id} 
              className="border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary flex-shrink-0">
                    {question.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground pt-2">
                    {question.question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-0 sm:ml-16">
                  {question.options.map((option) => {
                    const isSelected = question.multiple
                      ? (answers[question.id] as string[] || []).includes(option.value)
                      : answers[question.id] === option.value;

                    if (question.multiple) {
                      return (
                        <div
                          key={option.value}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-primary bg-primary/10 shadow-md'
                              : 'border-border hover:border-primary/50 hover:bg-primary/5'
                          }`}
                          onClick={() => handleMultipleAnswer(question.id, option.value, question.maxSelect)}
                        >
                          <Checkbox
                            checked={isSelected}
                            className="pointer-events-none"
                          />
                          <Label className="cursor-pointer flex-1 text-sm">
                            {option.label}
                          </Label>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(question.id, option.value)}
                        className={`p-3 rounded-xl border-2 text-left text-sm transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-md font-medium'
                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 gap-2"
          >
            {currentScreen === totalScreens - 1 ? 'See My Results' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
