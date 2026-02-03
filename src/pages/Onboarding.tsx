import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, ArrowRight, ArrowLeft, Loader2, Sparkles, BookOpen, Clock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'profile', title: 'Profile' },
  { id: 'preferences', title: 'Preferences' },
];

export default function Onboarding() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: profile?.display_name || '',
    grade: profile?.grade || '',
    dailyStudyTime: profile?.daily_study_time?.toString() || '30',
    learningSpeed: profile?.learning_speed || 'average',
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({
          display_name: formData.displayName,
          grade: formData.grade || null,
          daily_study_time: parseInt(formData.dailyStudyTime) || 30,
          learning_speed: formData.learningSpeed as any,
          onboarding_completed: true,
        })
        .eq('id', profile?.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: 'Profile complete! 🎉',
        description: 'Your learning journey begins now.',
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your profile. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress header */}
      <header className="p-6 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">PrepMate</h1>
              <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {STEPS.length}</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-xl">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  Welcome to PrepMate
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Discover your ideal career path and create personalized study plans to achieve your goals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <Card className="card-interactive">
                  <CardContent className="pt-6">
                    <BookOpen className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground">Diagnose</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Identify your learning gaps with adaptive assessments
                    </p>
                  </CardContent>
                </Card>
                <Card className="card-interactive">
                  <CardContent className="pt-6">
                    <Zap className="h-8 w-8 text-warning mb-3" />
                    <h3 className="font-semibold text-foreground">Plan</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get AI-powered skill improvement roadmaps
                    </p>
                  </CardContent>
                </Card>
                <Card className="card-interactive">
                  <CardContent className="pt-6">
                    <Clock className="h-8 w-8 text-success mb-3" />
                    <h3 className="font-semibold text-foreground">Track</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monitor your progress and adapt your learning
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90"
                onClick={handleNext}
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl">Tell us about yourself</CardTitle>
                <CardDescription>
                  This helps us personalize your learning experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade / Level (Optional)</Label>
                  <Input
                    id="grade"
                    placeholder="e.g., 10th Grade, College Freshman, Professional"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                    onClick={handleNext}
                    disabled={!formData.displayName.trim()}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Learning Preferences */}
          {currentStep === 2 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl">Learning Preferences</CardTitle>
                <CardDescription>
                  Help us understand how you learn best
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Daily Study Time</Label>
                  <RadioGroup
                    value={formData.dailyStudyTime}
                    onValueChange={(value) => setFormData({ ...formData, dailyStudyTime: value })}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  >
                    {[
                      { value: '15', label: '15 min', desc: 'Quick sessions' },
                      { value: '30', label: '30 min', desc: 'Balanced' },
                      { value: '60', label: '60+ min', desc: 'Deep focus' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          formData.dailyStudyTime === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={option.value} />
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Learning Pace</Label>
                  <RadioGroup
                    value={formData.learningSpeed}
                    onValueChange={(value: string) => setFormData({ ...formData, learningSpeed: value as 'slow' | 'average' | 'fast' })}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  >
                    {[
                      { value: 'slow', label: 'Thorough', desc: 'I like to take my time' },
                      { value: 'average', label: 'Balanced', desc: 'Mix of depth & speed' },
                      { value: 'fast', label: 'Fast', desc: 'I learn quickly' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          formData.learningSpeed === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={option.value} />
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                    onClick={handleComplete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      <>
                        Complete Setup <Sparkles className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
