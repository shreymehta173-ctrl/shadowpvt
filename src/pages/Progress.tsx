import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { SkillMeter } from '@/components/SkillMeter';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Loader2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Target,
} from 'lucide-react';

interface TrendAnalysis {
  skillId: string;
  skillName: string;
  currentScore: number;
  previousScore: number;
  trend: 'improving' | 'stable' | 'declining';
  improvementRate: number;
  consistency: number;
  lastSessionDate: string;
  needsReassessment: boolean;
}

interface OverallStats {
  totalSkillsTracked: number;
  improvingSkills: number;
  stableSkills: number;
  decliningSkills: number;
  averageConsistency: number;
  averageImprovement: number;
}

export default function Progress() {
  const { profile, session } = useAuth();
  const { toast } = useToast();
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [skillsNeedingReassessment, setSkillsNeedingReassessment] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProgressData = async () => {
    if (!profile?.id) return;

    setRefreshing(true);
    try {
      const response = await supabase.functions.invoke('progress-tracking-agent', {
        body: { studentId: profile.id, action: 'analyze' },
      });

      if (response.error) throw response.error;

      if (response.data) {
        setTrendAnalysis(response.data.trendAnalysis || []);
        setOverallStats(response.data.overallStats || null);
        setAiSummary(response.data.aiSummary || '');
        setSkillsNeedingReassessment(response.data.skillsNeedingReassessment || []);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch progress data.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, [profile?.id]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-success';
      case 'declining':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Progress Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your learning journey over time
            </p>
          </div>
          <Button
            onClick={fetchProgressData}
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh Data
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            {overallStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Skills Tracked"
                  value={overallStats.totalSkillsTracked}
                  subtitle="active skills"
                  icon={BarChart3}
                />
                <StatCard
                  title="Improving"
                  value={overallStats.improvingSkills}
                  subtitle="skills growing"
                  icon={TrendingUp}
                  variant="success"
                />
                <StatCard
                  title="Needs Attention"
                  value={overallStats.decliningSkills}
                  subtitle="skills declining"
                  icon={AlertTriangle}
                  variant={overallStats.decliningSkills > 0 ? 'warning' : 'default'}
                />
                <StatCard
                  title="Avg. Improvement"
                  value={`${overallStats.averageImprovement > 0 ? '+' : ''}${overallStats.averageImprovement}%`}
                  subtitle="overall trend"
                  icon={Target}
                />
              </div>
            )}

            {/* AI Summary */}
            {aiSummary && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Progress Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{aiSummary}</p>
                </CardContent>
              </Card>
            )}

            {/* Skills Needing Reassessment */}
            {skillsNeedingReassessment.length > 0 && (
              <Card className="border-warning/30 bg-warning/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-warning">
                    <AlertTriangle className="h-5 w-5" />
                    Skills Needing Reassessment
                  </CardTitle>
                  <CardDescription>
                    These skills haven't been assessed recently or show inconsistent progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {trendAnalysis
                      .filter(t => t.needsReassessment)
                      .map(skill => (
                        <Badge key={skill.skillId} variant="outline" className="border-warning text-warning">
                          {skill.skillName}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skill Progress Grid */}
            {trendAnalysis.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Skill Progress</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {trendAnalysis.map((skill) => (
                    <Card key={skill.skillId} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{skill.skillName}</CardTitle>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(skill.trend)}
                            <span className={`text-sm font-medium capitalize ${getTrendColor(skill.trend)}`}>
                              {skill.trend}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <SkillMeter
                          value={skill.currentScore}
                          label="Current Proficiency"
                        />

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Previous</p>
                            <p className="font-medium">{Math.round(skill.previousScore)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Change</p>
                            <p className={`font-medium ${
                              skill.improvementRate > 0 ? 'text-success' : 
                              skill.improvementRate < 0 ? 'text-destructive' : 'text-muted-foreground'
                            }`}>
                              {skill.improvementRate > 0 ? '+' : ''}{skill.improvementRate.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Consistency</p>
                            <p className="font-medium">{Math.round(skill.consistency)}%</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            Last assessed: {skill.lastSessionDate !== 'Never' 
                              ? new Date(skill.lastSessionDate).toLocaleDateString()
                              : 'Never'}
                          </span>
                          {skill.needsReassessment && (
                            <Badge variant="outline" className="text-warning border-warning">
                              Reassess Soon
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground text-lg">No Progress Data Yet</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  Complete diagnostic tests to start tracking your skill progress over time
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
