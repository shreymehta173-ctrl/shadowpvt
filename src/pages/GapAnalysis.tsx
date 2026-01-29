import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { GapIndicator, SkillMeter } from '@/components/SkillMeter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle2, ArrowRight, Filter, Loader2, Target } from 'lucide-react';

interface LearningGap {
  id: string;
  severity: 'critical' | 'moderate' | 'minor' | 'none';
  confidence_score: number;
  details: {
    totalQuestions: number;
    correctAnswers: number;
    performanceRatio: number;
    averageTime: number;
  };
  identified_at: string;
  resolved_at: string | null;
  concept_name: string;
  skill_name: string;
  topic_name: string;
}

export default function GapAnalysis() {
  const { profile } = useAuth();
  const [gaps, setGaps] = useState<LearningGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'moderate' | 'minor'>('all');

  useEffect(() => {
    const fetchGaps = async () => {
      if (!profile?.id) return;

      try {
        const { data: gapsData, error } = await supabase
          .from('learning_gaps')
          .select('*')
          .eq('student_id', profile.id)
          .is('resolved_at', null)
          .in('severity', ['critical', 'moderate', 'minor'])
          .order('identified_at', { ascending: false });

        if (error) throw error;

        if (!gapsData || gapsData.length === 0) {
          setGaps([]);
          return;
        }

        // Fetch related names
        const conceptIds = gapsData.map(g => g.concept_id).filter(Boolean);
        const skillIds = gapsData.map(g => g.skill_id).filter(Boolean);
        const topicIds = gapsData.map(g => g.topic_id).filter(Boolean);

        const [conceptsResult, skillsResult, topicsResult] = await Promise.all([
          conceptIds.length > 0
            ? supabase.from('concepts').select('id, name').in('id', conceptIds)
            : { data: [] },
          skillIds.length > 0
            ? supabase.from('skills').select('id, name').in('id', skillIds)
            : { data: [] },
          topicIds.length > 0
            ? supabase.from('topics').select('id, name').in('id', topicIds)
            : { data: [] },
        ]);

        const conceptsMap = new Map<string, string>();
        const skillsMap = new Map<string, string>();
        const topicsMap = new Map<string, string>();
        conceptsResult.data?.forEach(c => conceptsMap.set(c.id, c.name));
        skillsResult.data?.forEach(s => skillsMap.set(s.id, s.name));
        topicsResult.data?.forEach(t => topicsMap.set(t.id, t.name));

        setGaps(gapsData.map(gap => ({
          id: gap.id,
          severity: gap.severity as 'critical' | 'moderate' | 'minor' | 'none',
          confidence_score: gap.confidence_score || 0,
          details: (gap.details as any) || { totalQuestions: 0, correctAnswers: 0, performanceRatio: 0, averageTime: 0 },
          identified_at: gap.identified_at,
          resolved_at: gap.resolved_at,
          concept_name: conceptsMap.get(gap.concept_id) || 'Unknown Concept',
          skill_name: skillsMap.get(gap.skill_id) || 'Unknown Skill',
          topic_name: topicsMap.get(gap.topic_id) || 'Unknown Topic',
        })));
      } catch (error) {
        console.error('Error fetching gaps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGaps();
  }, [profile?.id]);

  const filteredGaps = filter === 'all' 
    ? gaps 
    : gaps.filter(g => g.severity === filter);

  const gapStats = {
    critical: gaps.filter(g => g.severity === 'critical').length,
    moderate: gaps.filter(g => g.severity === 'moderate').length,
    minor: gaps.filter(g => g.severity === 'minor').length,
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Learning Gap Analysis
            </h1>
            <p className="text-muted-foreground mt-1">
              Understand your knowledge gaps and prioritize improvement
            </p>
          </div>
          <Link to="/roadmap">
            <Button className="bg-gradient-primary hover:opacity-90">
              View Improvement Plan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Gaps</p>
                  <p className="text-3xl font-bold text-destructive">{gapStats.critical}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Moderate Gaps</p>
                  <p className="text-3xl font-bold text-warning">{gapStats.moderate}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-warning" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Should address soon</p>
            </CardContent>
          </Card>

          <Card className="border-info/30 bg-info/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Minor Gaps</p>
                  <p className="text-3xl font-bold text-info">{gapStats.minor}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-info" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Low priority refinement</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All ({gaps.length})</TabsTrigger>
            <TabsTrigger value="critical">Critical ({gapStats.critical})</TabsTrigger>
            <TabsTrigger value="moderate">Moderate ({gapStats.moderate})</TabsTrigger>
            <TabsTrigger value="minor">Minor ({gapStats.minor})</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredGaps.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredGaps.map((gap) => (
                  <Card key={gap.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{gap.concept_name}</CardTitle>
                          <CardDescription>{gap.topic_name}</CardDescription>
                        </div>
                        <GapIndicator severity={gap.severity} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Skill</p>
                          <p className="font-medium">{gap.skill_name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Performance</p>
                          <p className="font-medium">
                            {gap.details?.correctAnswers || 0}/{gap.details?.totalQuestions || 0} correct
                          </p>
                        </div>
                      </div>

                      <SkillMeter
                        value={Math.round((gap.details?.performanceRatio || 0) * 100)}
                        label="Current Level"
                      />

                      <p className="text-xs text-muted-foreground">
                        Identified {new Date(gap.identified_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-medium text-foreground text-lg">No Learning Gaps Found</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  {filter === 'all'
                    ? "Take a diagnostic test to identify areas for improvement"
                    : `No ${filter} gaps found. Great progress!`}
                </p>
                {filter === 'all' && (
                  <Link to="/diagnostic" className="mt-4 inline-block">
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Start Diagnostic Test
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
