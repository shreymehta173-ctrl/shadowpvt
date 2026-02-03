import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, BookOpen, RefreshCw, Clock } from 'lucide-react';
import { SessionCard } from './SessionCard';
import type { StudySession, WeeklyPlan } from '@/hooks/useStudyPlanner';

interface WeeklyCalendarProps {
  plan: WeeklyPlan | null;
  sessions: StudySession[];
  onUpdateSession: (
    sessionId: string,
    status: 'completed' | 'partial' | 'skipped',
    feedback?: { notes?: string; effectiveness?: number }
  ) => Promise<void>;
}

const dayNames = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
};

const shortDayNames = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
};

export function WeeklyCalendar({ plan, sessions, onUpdateSession }: WeeklyCalendarProps) {
  const { t, language } = useLanguage();
  
  const sessionsByDay = useMemo(() => {
    const grouped: Record<string, StudySession[]> = {};
    
    sessions.forEach(session => {
      if (!grouped[session.scheduled_date]) {
        grouped[session.scheduled_date] = [];
      }
      grouped[session.scheduled_date].push(session);
    });

    // Sort sessions within each day by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => (a.scheduled_time || '').localeCompare(b.scheduled_time || ''));
    });

    return grouped;
  }, [sessions]);

  const weekDates = useMemo(() => {
    if (!plan) return [];
    
    const dates: Date[] = [];
    const startDate = new Date(plan.week_start_date);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  }, [plan]);

  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const completed = sessions.filter(s => s.status === 'completed').length;
    const total = sessions.length;
    const studySessions = sessions.filter(s => s.session_type === 'study').length;
    const revisionSessions = sessions.filter(s => s.session_type === 'revision').length;
    
    return { completed, total, studySessions, revisionSessions };
  }, [sessions]);

  if (!plan) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="py-12 text-center">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">{t('No Plan Generated Yet', 'अभी तक कोई योजना नहीं बनी')}</h3>
          <p className="text-muted-foreground">
            {t('Add your focus topics and generate a personalized study plan', 'अपने फोकस विषय जोड़ें और एक व्यक्तिगत अध्ययन योजना बनाएं')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t('Weekly Schedule', 'साप्ताहिक कार्यक्रम')}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(plan.week_start_date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { 
                day: 'numeric', month: 'short' 
              })} - {new Date(plan.week_end_date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { 
                day: 'numeric', month: 'short', year: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <BookOpen className="h-3 w-3" />
              {stats.studySessions} {t('study', 'अध्ययन')}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <RefreshCw className="h-3 w-3" />
              {stats.revisionSessions} {t('revision', 'पुनरावृत्ति')}
            </Badge>
            <Badge 
              variant={stats.completed === stats.total ? 'default' : 'secondary'}
              className="gap-1"
            >
              <Clock className="h-3 w-3" />
              {stats.completed}/{stats.total} {t('done', 'पूर्ण')}
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">{t('Weekly Progress', 'साप्ताहिक प्रगति')}</span>
            <span className="font-medium">
              {plan.total_completed_minutes || 0} / {plan.total_planned_minutes} {t('mins', 'मिनट')}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
              style={{ 
                width: `${Math.min(100, ((plan.total_completed_minutes || 0) / plan.total_planned_minutes) * 100)}%` 
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {weekDates.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const daySessions = sessionsByDay[dateStr] || [];
            const isToday = dateStr === today;
            const isPast = dateStr < today;

            return (
              <div 
                key={dateStr}
                className={`rounded-xl p-3 border ${
                  isToday 
                    ? 'border-primary bg-primary/5' 
                    : isPast 
                      ? 'border-border/30 bg-muted/30' 
                      : 'border-border/50 bg-card/30'
                }`}
              >
                <div className="text-center mb-3">
                  <p className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {language === 'hi' ? shortDayNames.hi[date.getDay()] : shortDayNames.en[date.getDay()]}
                  </p>
                  <p className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {date.getDate()}
                  </p>
                  {isToday && (
                    <Badge className="text-xs mt-1" variant="default">{t('Today', 'आज')}</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  {daySessions.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      {t('Rest day', 'आराम का दिन')}
                    </p>
                  ) : (
                    daySessions.map(session => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        compact
                        onUpdateStatus={onUpdateSession}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
