import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { SkillMeter, GapIndicator } from '@/components/SkillMeter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Map,
  Clock,
  BookOpen,
  Video,
  FileText,
  Loader2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Target,
} from 'lucide-react';

interface Recommendation {
  skillId: string;
  skillName: string;
  conceptName: string;
  topicName: string;
  gapId: string;
  priority: number;
  severity: 'critical' | 'moderate' | 'minor';
  practiceType: string;
  estimatedDuration: number;
  title: string;
  description: string;
  confidenceScore: number;
  resources: { type: string; title: string; url: string }[];
}

export default function Roadmap() {
  const { profile, session } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [roadmapSummary, setRoadmapSummary] = useState('');
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchRecommendations = async () => {
    if (!profile?.id) return;

    setLoading(true);
    try {
      // First try to fetch existing plans
      const { data: plans } = await supabase
        .from('improvement_plans')
        .select('*')
        .eq('student_id', profile.id)
        .eq('status', 'pending')
        .order('priority', { ascending: true });

      if (plans && plans.length > 0) {
        // Get skill names
        const skillIds = plans.map(p => p.skill_id).filter(Boolean);
        const { data: skills } = await supabase
          .from('skills')
          .select('id, name')
          .in('id', skillIds);

        const skillsMap: Record<string, string> = {};
        skills?.forEach(s => { skillsMap[s.id] = s.name; });

        setRecommendations(plans.map(plan => ({
          skillId: plan.skill_id || '',
          skillName: skillsMap[plan.skill_id || ''] || 'Unknown',
          conceptName: '',
          topicName: '',
          gapId: plan.gap_id || '',
          priority: plan.priority || 1,
          severity: 'moderate' as const,
          practiceType: plan.practice_type || 'exercises',
          estimatedDuration: plan.estimated_duration || 30,
          title: plan.title || '',
          description: plan.description || '',
          confidenceScore: 50,
          resources: (plan.recommended_resources as any) || [],
        })));
        setTotalTime(plans.reduce((sum, p) => sum + (p.estimated_duration || 0), 0));
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (!profile?.id) return;

    setGenerating(true);
    try {
      const response = await supabase.functions.invoke('skill-recommendation-agent', {
        body: { studentId: profile.id },
      });

      if (response.error) throw response.error;

      if (response.data) {
        setRecommendations(response.data.recommendations || []);
        setRoadmapSummary(response.data.roadmapSummary || '');
        setTotalTime(response.data.estimatedTotalTime || 0);

        toast({
          title: 'Roadmap Generated! 🎯',
          description: 'Your personalized skill improvement plan is ready.',
        });
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate recommendations. Please try again.',
      });
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [profile?.id]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'reading':
      case 'tutorial':
        return FileText;
      default:
        return BookOpen;
    }
  };

  const getPracticeTypeLabel = (type: string) => {
    switch (type) {
      case 'fundamentals':
        return 'Start from Basics';
      case 'guided_practice':
        return 'Guided Practice';
      case 'exercises':
        return 'Practice Exercises';
      case 'challenges':
        return 'Advanced Challenges';
      default:
        return type;
    }
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Skill Improvement Roadmap
            </h1>
            <p className="text-muted-foreground mt-1">
              Your personalized path to mastery
            </p>
          </div>
          <Button
            onClick={generateRecommendations}
            disabled={generating}
            className="bg-gradient-primary hover:opacity-90"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Plan
              </>
            )}
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{recommendations.length}</p>
                  <p className="text-sm text-muted-foreground">Skills to Improve</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(totalTime / 60)}h {totalTime % 60}m
                  </p>
                  <p className="text-sm text-muted-foreground">Estimated Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Map className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {recommendations.filter(r => r.severity === 'critical').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Priority Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Summary */}
        {roadmapSummary && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Learning Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{roadmapSummary}</p>
            </CardContent>
          </Card>
        )}

        {/* Recommendations List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Prioritized Skills</h2>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={rec.gapId || index} className="overflow-hidden">
                  <div className="flex">
                    {/* Priority indicator */}
                    <div className={`w-2 ${
                      rec.severity === 'critical' ? 'bg-destructive' :
                      rec.severity === 'moderate' ? 'bg-warning' : 'bg-info'
                    }`} />
                    
                    <div className="flex-1">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-semibold text-sm">
                              {index + 1}
                            </span>
                            <div>
                              <CardTitle className="text-lg">{rec.title}</CardTitle>
                              <CardDescription>{rec.description}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {rec.estimatedDuration} min
                            </Badge>
                            <GapIndicator severity={rec.severity} />
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {getPracticeTypeLabel(rec.practiceType)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {rec.skillName}
                          </span>
                        </div>

                        {rec.resources && rec.resources.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">Recommended Resources:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {rec.resources.map((resource, i) => {
                                const Icon = getResourceIcon(resource.type);
                                return (
                                  <button
                                    key={i}
                                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-left"
                                  >
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm truncate">{resource.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <SkillMeter
                          value={100 - rec.confidenceScore}
                          label="Target Improvement"
                        />
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Map className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground text-lg">No Improvement Plan Yet</h3>
            <p className="text-muted-foreground mt-1 max-w-md mx-auto">
              Complete a diagnostic test to get personalized skill improvement recommendations
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <Link to="/diagnostic">
                <Button className="bg-gradient-primary hover:opacity-90">
                  Start Diagnostic Test
                </Button>
              </Link>
              <Button variant="outline" onClick={generateRecommendations} disabled={generating}>
                Generate from Existing Gaps
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
