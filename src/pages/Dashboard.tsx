import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { StatCard } from '@/components/StatCard';
import { SkillMeter, GapIndicator } from '@/components/SkillMeter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  Zap,
} from 'lucide-react';

interface DashboardStats {
  totalSessions: number;
  totalGaps: number;
  gapsResolved: number;
  averageScore: number;
}

interface RecentGap {
  id: string;
  severity: 'critical' | 'moderate' | 'minor';
  concept_name: string;
  skill_name: string;
  confidence_score: number;
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    totalGaps: 0,
    gapsResolved: 0,
    averageScore: 0,
  });
  const [recentGaps, setRecentGaps] = useState<RecentGap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!profile?.id) return;

      try {
        // Fetch diagnostic sessions
        const { data: sessions } = await supabase
          .from('diagnostic_sessions')
          .select('*')
          .eq('student_id', profile.id);

        // Fetch learning gaps
        const { data: gaps } = await supabase
          .from('learning_gaps')
          .select('*')
          .eq('student_id', profile.id);

        // Calculate stats
        const totalSessions = sessions?.length || 0;
        const totalGaps = gaps?.filter(g => g.severity !== 'none').length || 0;
        const gapsResolved = gaps?.filter(g => g.resolved_at).length || 0;
        const averageScore = sessions?.length 
          ? Math.round(sessions.reduce((sum, s) => sum + (s.correct_answers / (s.total_questions || 1)) * 100, 0) / sessions.length)
          : 0;

        setStats({ totalSessions, totalGaps, gapsResolved, averageScore });

        // Fetch recent unresolved gaps with names
        if (gaps && gaps.length > 0) {
          const unresolvedGaps = gaps
            .filter(g => !g.resolved_at && g.severity !== 'none')
            .slice(0, 5);

          // Get concept and skill names
          const conceptIds = unresolvedGaps.map(g => g.concept_id).filter(Boolean);
          const skillIds = unresolvedGaps.map(g => g.skill_id).filter(Boolean);

          const [conceptsResult, skillsResult] = await Promise.all([
            conceptIds.length > 0 
              ? supabase.from('concepts').select('id, name').in('id', conceptIds)
              : { data: [] },
            skillIds.length > 0
              ? supabase.from('skills').select('id, name').in('id', skillIds)
              : { data: [] },
          ]);

        const conceptsMap = new Map<string, string>();
        const skillsMap = new Map<string, string>();
        conceptsResult.data?.forEach(c => conceptsMap.set(c.id, c.name));
        skillsResult.data?.forEach(s => skillsMap.set(s.id, s.name));

        setRecentGaps(unresolvedGaps.map(gap => ({
          id: gap.id,
          severity: gap.severity as 'critical' | 'moderate' | 'minor',
          concept_name: conceptsMap.get(gap.concept_id) || 'Unknown',
          skill_name: skillsMap.get(gap.skill_id) || 'Unknown',
          confidence_score: gap.confidence_score || 0,
        })));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      }
    };

    fetchDashboardData();
  }, [profile?.id]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {getGreeting()}, {profile?.display_name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your learning journey
            </p>
          </div>
          <Link to="/diagnostic">
            <Button className="bg-gradient-primary hover:opacity-90">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Start Diagnostic Test
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Assessments Taken"
            value={stats.totalSessions}
            subtitle="diagnostic sessions"
            icon={ClipboardCheck}
          />
          <StatCard
            title="Learning Gaps"
            value={stats.totalGaps}
            subtitle={`${stats.gapsResolved} resolved`}
            icon={AlertTriangle}
            variant={stats.totalGaps > 5 ? 'warning' : 'default'}
          />
          <StatCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            subtitle="across all tests"
            icon={Target}
            variant={stats.averageScore >= 70 ? 'success' : 'default'}
          />
          <StatCard
            title="Improvement"
            value={stats.gapsResolved > 0 ? `+${Math.round((stats.gapsResolved / Math.max(stats.totalGaps, 1)) * 100)}%` : '—'}
            subtitle="gaps resolved"
            icon={TrendingUp}
            trend={stats.gapsResolved > 0 ? { value: 12, label: 'this week', positive: true } : undefined}
          />
        </div>

        {/* Quick Actions & Recent Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/diagnostic" className="block">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <BookOpen className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Take Diagnostic Test</p>
                    <p className="text-xs text-muted-foreground">Identify new learning gaps</p>
                  </div>
                </Button>
              </Link>
              <Link to="/roadmap" className="block">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Zap className="mr-3 h-5 w-5 text-warning" />
                  <div className="text-left">
                    <p className="font-medium">View Skill Roadmap</p>
                    <p className="text-xs text-muted-foreground">See your improvement plan</p>
                  </div>
                </Button>
              </Link>
              <Link to="/progress" className="block">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Clock className="mr-3 h-5 w-5 text-success" />
                  <div className="text-left">
                    <p className="font-medium">Track Progress</p>
                    <p className="text-xs text-muted-foreground">Monitor your improvement</p>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Gaps */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Active Learning Gaps
                </CardTitle>
                <CardDescription>Areas that need your attention</CardDescription>
              </div>
              <Link to="/gaps">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentGaps.length > 0 ? (
                <div className="space-y-4">
                  {recentGaps.map((gap) => (
                    <div 
                      key={gap.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <GapIndicator severity={gap.severity} showLabel={false} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{gap.concept_name}</p>
                        <p className="text-sm text-muted-foreground">{gap.skill_name}</p>
                      </div>
                      <SkillMeter 
                        value={100 - gap.confidence_score} 
                        size="sm" 
                        showLabel={false}
                        className="w-24"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="font-medium text-foreground">No Active Gaps!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Take a diagnostic test to identify areas for improvement
                  </p>
                  <Link to="/diagnostic" className="mt-4 inline-block">
                    <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                      Start Test
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
