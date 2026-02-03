import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sun, Moon, Clock, CheckCircle } from 'lucide-react';
import { SessionCard } from './SessionCard';
import type { StudySession } from '@/hooks/useStudyPlanner';

interface TodaySessionsProps {
  sessions: StudySession[];
  onUpdateSession: (
    sessionId: string,
    status: 'completed' | 'partial' | 'skipped',
    feedback?: { notes?: string; effectiveness?: number }
  ) => Promise<void>;
}

export function TodaySessions({ sessions, onUpdateSession }: TodaySessionsProps) {
  const { t } = useLanguage();
  const today = new Date().toISOString().split('T')[0];
  
  const todaySessions = useMemo(() => {
    return sessions
      .filter(s => s.scheduled_date === today)
      .sort((a, b) => (a.scheduled_time || '').localeCompare(b.scheduled_time || ''));
  }, [sessions, today]);

  const stats = useMemo(() => {
    const completed = todaySessions.filter(s => s.status === 'completed').length;
    const total = todaySessions.length;
    const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    const completedMinutes = todaySessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.duration_minutes, 0);

    return { completed, total, totalMinutes, completedMinutes };
  }, [todaySessions]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { 
      text: t('Good Morning', 'सुप्रभात'), 
      icon: Sun, 
      color: 'text-warning' 
    };
    if (hour < 17) return { 
      text: t('Good Afternoon', 'शुभ दोपहर'), 
      icon: Sun, 
      color: 'text-primary' 
    };
    return { 
      text: t('Good Evening', 'शुभ संध्या'), 
      icon: Moon, 
      color: 'text-purple-500' 
    };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  if (todaySessions.length === 0) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-muted/30 backdrop-blur-sm">
        <CardContent className="py-8 text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
          <h3 className="text-lg font-semibold mb-1">{t('No Sessions Today', 'आज कोई सत्र नहीं')}</h3>
          <p className="text-muted-foreground">
            {t('Enjoy your rest day or use the buffer time for extra practice!', 'आराम के दिन का आनंद लें या अतिरिक्त अभ्यास के लिए समय का उपयोग करें!')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <GreetingIcon className={`h-5 w-5 ${greeting.color}`} />
              {greeting.text}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {t("Today's Study Sessions", 'आज के अध्ययन सत्र')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={stats.completed === stats.total ? 'default' : 'secondary'}
              className="gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              {stats.completed}/{stats.total}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {stats.completedMinutes}/{stats.totalMinutes} {t('mins', 'मिनट')}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        {stats.total > 0 && (
          <div className="mt-3">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {todaySessions.map(session => (
          <SessionCard
            key={session.id}
            session={session}
            onUpdateStatus={onUpdateSession}
          />
        ))}
      </CardContent>
    </Card>
  );
}
