import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useStudyPlanner } from '@/hooks/useStudyPlanner';
import { useLanguage } from '@/contexts/LanguageContext';
import { WeaknessManager } from '@/components/planner/WeaknessManager';
import { PreferencesForm } from '@/components/planner/PreferencesForm';
import { WeeklyCalendar } from '@/components/planner/WeeklyCalendar';
import { TodaySessions } from '@/components/planner/TodaySessions';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { 
  Calendar, 
  Settings, 
  Target, 
  Sparkles, 
  Loader2, 
  BookOpen,
  Brain,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

export default function StudyPlanner() {
  const { t } = useLanguage();
  const {
    weaknesses,
    preferences,
    currentPlan,
    sessions,
    loading,
    generating,
    addWeakness,
    removeWeakness,
    updatePreferences,
    generatePlan,
    updateSessionStatus,
  } = useStudyPlanner();

  const [activeTab, setActiveTab] = useState('today');

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64 lg:col-span-2" />
          </div>
        </div>
      </AppLayout>
    );
  }

  const hasWeaknesses = weaknesses.length > 0;
  const hasPlan = currentPlan !== null;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              {t('Study Planner', 'अध्ययन योजनाकार')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('Your personalized AI-powered study schedule', 'आपका व्यक्तिगत AI-संचालित अध्ययन कार्यक्रम')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            {hasPlan && (
              <Badge variant="outline" className="gap-1 py-1">
                <TrendingUp className="h-3 w-3" />
                {sessions.filter(s => s.status === 'completed').length}/{sessions.length} {t('sessions', 'सत्र')}
              </Badge>
            )}
            <Button
              onClick={generatePlan}
              disabled={!hasWeaknesses || generating}
              className="gap-2 bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('Generating...', 'बना रहे हैं...')}
                </>
              ) : hasPlan ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  {t('Regenerate Plan', 'योजना पुनः बनाएं')}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t('Generate Plan', 'योजना बनाएं')}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {hasPlan && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sessions.filter(s => s.session_type === 'study').length}</p>
                    <p className="text-xs text-muted-foreground">{t('Study Sessions', 'अध्ययन सत्र')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sessions.filter(s => s.session_type === 'revision').length}</p>
                    <p className="text-xs text-muted-foreground">{t('Revisions', 'पुनरावृत्ति')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{weaknesses.length}</p>
                    <p className="text-xs text-muted-foreground">{t('Focus Areas', 'फोकस क्षेत्र')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.round((currentPlan?.total_planned_minutes || 0) / 60)}{t('h', 'घं')}</p>
                    <p className="text-xs text-muted-foreground">{t('Planned Time', 'नियोजित समय')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="today" className="gap-2">
              <Calendar className="h-4 w-4" />
              {t('Today', 'आज')}
            </TabsTrigger>
            <TabsTrigger value="week" className="gap-2">
              <BookOpen className="h-4 w-4" />
              {t('Weekly View', 'साप्ताहिक दृश्य')}
            </TabsTrigger>
            <TabsTrigger value="setup" className="gap-2">
              <Settings className="h-4 w-4" />
              {t('Setup', 'सेटअप')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TodaySessions
                  sessions={sessions}
                  onUpdateSession={updateSessionStatus}
                />
              </div>
              <div className="space-y-6">
                {currentPlan?.ai_notes && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        {t('AI Insights', 'AI अंतर्दृष्टि')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                        <ReactMarkdown>{currentPlan.ai_notes}</ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <WeaknessManager
                  weaknesses={weaknesses}
                  onAdd={addWeakness}
                  onRemove={removeWeakness}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="week">
            <WeeklyCalendar
              plan={currentPlan}
              sessions={sessions}
              onUpdateSession={updateSessionStatus}
            />
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeaknessManager
                weaknesses={weaknesses}
                onAdd={addWeakness}
                onRemove={removeWeakness}
              />
              <PreferencesForm
                preferences={preferences}
                onSave={updatePreferences}
              />
            </div>

            {/* Getting Started Guide */}
            {!hasPlan && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-cyan-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {t('Getting Started', 'शुरू करें')}
                  </CardTitle>
                  <CardDescription>
                    {t('Follow these steps to create your personalized study plan', 'अपनी व्यक्तिगत अध्ययन योजना बनाने के लिए इन चरणों का पालन करें')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl border ${hasWeaknesses ? 'border-success bg-success/5' : 'border-border'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${hasWeaknesses ? 'bg-success text-white' : 'bg-muted'}`}>
                          {hasWeaknesses ? '✓' : '1'}
                        </div>
                        <span className="font-medium">{t('Add Topics', 'विषय जोड़ें')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('Add subjects and topics you want to focus on', 'उन विषयों और टॉपिक्स को जोड़ें जिन पर आप ध्यान देना चाहते हैं')}
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl border ${preferences ? 'border-success bg-success/5' : 'border-border'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${preferences ? 'bg-success text-white' : 'bg-muted'}`}>
                          {preferences ? '✓' : '2'}
                        </div>
                        <span className="font-medium">{t('Set Preferences', 'प्राथमिकताएं सेट करें')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('Configure your learning pace and schedule', 'अपनी सीखने की गति और कार्यक्रम कॉन्फ़िगर करें')}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted">
                          3
                        </div>
                        <span className="font-medium">{t('Generate Plan', 'योजना बनाएं')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('Click the button above to create your plan', 'अपनी योजना बनाने के लिए ऊपर बटन क्लिक करें')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
