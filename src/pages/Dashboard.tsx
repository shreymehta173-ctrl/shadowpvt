import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Compass, 
  TrendingUp, 
  Target, 
  ArrowRight,
  Sparkles,
  Rocket,
  Clock,
  Star,
  Brain,
  Calendar,
  BookOpen,
} from 'lucide-react';

interface DashboardStats {
  totalSessions: number;
  averageScore: number;
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hasQuestionnaireData, setHasQuestionnaireData] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!profile?.id) return;

      try {
        // Fetch diagnostic sessions
        const { data: sessions } = await supabase
          .from('diagnostic_sessions')
          .select('*')
          .eq('student_id', profile.id);

        // Calculate stats
        const totalSessions = sessions?.length || 0;
        const averageScore = sessions?.length 
          ? Math.round(sessions.reduce((sum, s) => sum + (s.correct_answers / (s.total_questions || 1)) * 100, 0) / sessions.length)
          : 0;

        setStats({ totalSessions, averageScore });

        // Check if user has completed career questionnaire
        const storedData = localStorage.getItem(`career_questionnaire_${profile.id}`);
        setHasQuestionnaireData(!!storedData);
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
              Welcome to your career discovery journey
            </p>
          </div>
          <Link to="/career">
            <Button className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
              <Compass className="mr-2 h-4 w-4" />
              {hasQuestionnaireData ? 'View Career Matches' : 'Discover Your Career'}
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Career Discovery"
            value={hasQuestionnaireData ? 'Complete' : 'Pending'}
            subtitle={hasQuestionnaireData ? 'Questionnaire completed' : 'Take the assessment'}
            icon={Compass}
            variant={hasQuestionnaireData ? 'success' : 'default'}
          />
          <StatCard
            title="Sessions"
            value={stats.totalSessions}
            subtitle="learning sessions"
            icon={Target}
          />
          <StatCard
            title="Progress"
            value={stats.averageScore > 0 ? `${stats.averageScore}%` : '—'}
            subtitle="overall performance"
            icon={TrendingUp}
            variant={stats.averageScore >= 70 ? 'success' : 'default'}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Career Discovery Card */}
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
            <div className="absolute top-4 right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <span>Career Discovery</span>
              </CardTitle>
              <CardDescription>
                {hasQuestionnaireData 
                  ? 'View your personalized career recommendations'
                  : 'Take a 3-minute assessment to discover your ideal career path'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasQuestionnaireData ? (
                <>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-success/10 border border-success/20">
                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                      <Star className="h-6 w-6 text-success fill-success" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Assessment Complete!</p>
                      <p className="text-sm text-muted-foreground">Your career matches are ready</p>
                    </div>
                  </div>
                  <Link to="/career" className="block">
                    <Button className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
                      View Career Matches
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3">
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
                  <Link to="/career" className="block">
                    <Button className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
                      Start Discovery
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/career" className="block">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Compass className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Career Guidance</p>
                    <p className="text-xs text-muted-foreground">Discover careers that match you</p>
                  </div>
                </Button>
              </Link>
              <Link to="/planner" className="block">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Calendar className="mr-3 h-5 w-5 text-cyan-500" />
                  <div className="text-left">
                    <p className="font-medium">Study Planner</p>
                    <p className="text-xs text-muted-foreground">Create personalized study schedules</p>
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
        </div>

        {/* Tips Section */}
        <Card className="bg-gradient-to-br from-muted/50 to-background border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Pro Tip</h3>
                <p className="text-sm text-muted-foreground">
                  Complete the career discovery questionnaire to get AI-powered career recommendations 
                  tailored to your interests, skills, and goals. Our AI mentor can then help you 
                  plan your career journey step by step.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
