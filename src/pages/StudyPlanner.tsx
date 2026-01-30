import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useStudyPlanner } from '@/hooks/useStudyPlanner';
import { WeaknessManager } from '@/components/planner/WeaknessManager';
import { PreferencesForm } from '@/components/planner/PreferencesForm';
import { WeeklyCalendar } from '@/components/planner/WeeklyCalendar';
import { TodaySessions } from '@/components/planner/TodaySessions';
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
              Study Planner
            </h1>
            <p className="text-muted-foreground mt-1">
              Your personalized AI-powered study schedule
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasPlan && (
              <Badge variant="outline" className="gap-1 py-1">
                <TrendingUp className="h-3 w-3" />
                {sessions.filter(s => s.status === 'completed').length}/{sessions.length} sessions
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
                  Generating...
                </>
              ) : hasPlan ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Regenerate Plan
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Plan
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
                    <p className="text-xs text-muted-foreground">Study Sessions</p>
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
                    <p className="text-xs text-muted-foreground">Revisions</p>
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
                    <p className="text-xs text-muted-foreground">Focus Areas</p>
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
                    <p className="text-2xl font-bold">{Math.round((currentPlan?.total_planned_minutes || 0) / 60)}h</p>
                    <p className="text-xs text-muted-foreground">Planned Time</p>
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
              Today
            </TabsTrigger>
            <TabsTrigger value="week" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Weekly View
            </TabsTrigger>
            <TabsTrigger value="setup" className="gap-2">
              <Settings className="h-4 w-4" />
              Setup
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
                        AI Insights
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
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Follow these steps to create your personalized study plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl border ${hasWeaknesses ? 'border-success bg-success/5' : 'border-border'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${hasWeaknesses ? 'bg-success text-white' : 'bg-muted'}`}>
                          {hasWeaknesses ? '✓' : '1'}
                        </div>
                        <span className="font-medium">Add Topics</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add subjects and topics you want to focus on
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl border ${preferences ? 'border-success bg-success/5' : 'border-border'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${preferences ? 'bg-success text-white' : 'bg-muted'}`}>
                          {preferences ? '✓' : '2'}
                        </div>
                        <span className="font-medium">Set Preferences</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Configure your learning pace and schedule
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted">
                          3
                        </div>
                        <span className="font-medium">Generate Plan</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Click the button above to create your plan
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
