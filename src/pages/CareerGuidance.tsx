import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import { useCareerGuidance, CareerRecommendation } from '@/hooks/useCareerGuidance';
import { CareerCard } from '@/components/career/CareerCard';
import { CareerDetailDrawer } from '@/components/career/CareerDetailDrawer';
import { CareerChatbot } from '@/components/career/CareerChatbot';
import { ProfileSummaryCard } from '@/components/career/ProfileSummaryCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Compass,
  RefreshCw,
  Globe,
  Sparkles,
  Loader2,
  TrendingUp,
  Target,
  Rocket,
  Award,
  BookOpen,
  Lightbulb,
  Brain,
  Zap,
  ArrowRight,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const QUICK_INSIGHTS = [
  { 
    icon: TrendingUp, 
    label: 'AI/ML', 
    value: '+45%', 
    desc: 'Job Growth',
    color: 'from-success to-success/80'
  },
  { 
    icon: Award, 
    label: 'Data Science', 
    value: '₹15L+', 
    desc: 'Avg Salary',
    color: 'from-primary to-primary/80'
  },
  { 
    icon: Rocket, 
    label: 'Cloud Computing', 
    value: 'Hot', 
    desc: 'Demand',
    color: 'from-accent to-accent/80'
  },
  { 
    icon: Brain, 
    label: 'Cybersecurity', 
    value: '2M+', 
    desc: 'Open Roles',
    color: 'from-warning to-warning/80'
  },
];

const TRENDING_SKILLS = [
  'Python', 'React', 'AWS', 'Machine Learning', 'SQL', 'Docker', 'TypeScript', 'Kubernetes'
];

export default function CareerGuidance() {
  const { profile } = useAuth();
  const {
    recommendations,
    loading,
    chatMessages,
    chatLoading,
    fetchRecommendations,
    getCareerDetail,
    sendChatMessage,
    clearChat,
  } = useCareerGuidance();

  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchRecommendations(language);
    }
  }, [profile?.id, fetchRecommendations]);

  const handleLanguageChange = (newLanguage: 'English' | 'Hindi') => {
    setLanguage(newLanguage);
    fetchRecommendations(newLanguage);
  };

  const handleCareerClick = async (career: CareerRecommendation) => {
    setSelectedCareer(career);
    setDrawerOpen(true);
    setDetailLoading(true);

    const detail = await getCareerDetail(career.career_id, language);
    if (detail) {
      setSelectedCareer(prev => prev ? { ...prev, ...detail } : null);
    }
    setDetailLoading(false);
  };

  const topMatch = recommendations.length > 0 ? recommendations[0] : null;

  return (
    <AppLayout>
      <div className="min-h-screen relative">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-success/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 relative">
          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-success/10 border border-border/30 p-6 lg:p-8">
            {/* Animated decorations */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl animate-pulse" />
            <div className="absolute bottom-4 left-8 w-16 h-16 rounded-full bg-gradient-to-br from-success/20 to-primary/20 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30">
                    <Compass className="h-8 w-8 lg:h-10 lg:w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-lg flex items-center justify-center shadow-lg">
                    <Zap className="h-3.5 w-3.5 text-success-foreground" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                    Career Guidance
                  </h1>
                  <p className="text-muted-foreground mt-1 lg:mt-2 text-sm lg:text-base max-w-xl">
                    AI-powered career matching based on your unique skills, interests, and goals
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Select value={language} onValueChange={(v) => handleLanguageChange(v as 'English' | 'Hindi')}>
                  <SelectTrigger className="w-[140px] bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
                    <Globe className="h-4 w-4 mr-2 text-primary" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">हिंदी</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => fetchRecommendations(language)}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh Analysis
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Insights Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_INSIGHTS.map((insight, index) => (
              <Card 
                key={insight.label}
                className={cn(
                  "group overflow-hidden border-border/30 bg-gradient-to-br from-card to-muted/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer animate-fade-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500" />
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={cn(
                      "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300",
                      insight.color
                    )}>
                      <insight.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{insight.label}</p>
                      <p className="text-lg font-bold text-foreground">{insight.value}</p>
                      <p className="text-[10px] text-muted-foreground">{insight.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trending Skills Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 animate-fade-in">
            <div className="flex items-center gap-2 shrink-0">
              <Lightbulb className="h-4 w-4 text-warning" />
              <span className="text-sm font-semibold text-muted-foreground">Trending:</span>
            </div>
            <div className="flex gap-2">
              {TRENDING_SKILLS.map((skill, index) => (
                <Badge 
                  key={skill}
                  variant="secondary"
                  className={cn(
                    "cursor-pointer whitespace-nowrap transition-all duration-300",
                    "hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-primary-foreground hover:scale-105 hover:shadow-md",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Chatbot */}
            <div className="lg:col-span-1 space-y-6">
              {profile && <ProfileSummaryCard profile={profile} />}
              
              {/* Top Match Highlight */}
              {topMatch && (
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-success/10 via-success/5 to-background border border-success/20 animate-fade-in">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Star className="h-5 w-5 text-success fill-success" />
                      <span className="bg-gradient-to-r from-success to-success/70 bg-clip-text text-transparent font-bold">Your Best Match</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => handleCareerClick(topMatch)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Target className="h-6 w-6 text-success-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate group-hover:text-success transition-colors">{topMatch.career_name}</p>
                        <p className="text-xs text-muted-foreground">{topMatch.industry}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-success">{Math.round(topMatch.match_score)}%</p>
                        <p className="text-[10px] text-muted-foreground">Match</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full mt-3 text-success hover:text-success hover:bg-success/10 group"
                      onClick={() => handleCareerClick(topMatch)}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              <div className="h-[520px]">
                <CareerChatbot
                  messages={chatMessages}
                  loading={chatLoading}
                  onSendMessage={sendChatMessage}
                  onClearChat={clearChat}
                />
              </div>
            </div>

            {/* Right Column - Career Recommendations */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-foreground">Career Matches</h2>
                    <p className="text-xs text-muted-foreground">Personalized recommendations based on your profile</p>
                  </div>
                </div>
                {recommendations.length > 0 && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-semibold px-3 py-1 animate-pulse">
                    {recommendations.length} matches
                  </Badge>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="space-y-3 p-5 border rounded-xl bg-card animate-pulse">
                      <div className="flex items-start justify-between">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-2.5 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              ) : recommendations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendations.map((career, index) => (
                    <CareerCard
                      key={career.career_id}
                      career={career}
                      onClick={() => handleCareerClick(career)}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border rounded-2xl bg-gradient-to-br from-muted/30 via-background to-muted/30 border-border/30">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
                    <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-muted to-background flex items-center justify-center">
                      <Compass className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-2">Discover Your Path</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Complete diagnostic tests to unlock AI-powered career matches tailored to your unique skills and interests
                  </p>
                  <Button 
                    onClick={() => fetchRecommendations(language)}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Recommendations
                  </Button>
                </div>
              )}

              {/* Learning Resources Section */}
              {recommendations.length > 0 && (
                <Card className="mt-6 overflow-hidden border-border/30 bg-gradient-to-br from-card to-muted/20 animate-fade-in">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span>Quick Start Resources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { title: 'Skill Assessment', desc: 'Evaluate your current level', icon: Target, color: 'from-primary to-primary/80' },
                        { title: 'Learning Paths', desc: 'Curated courses & tutorials', icon: Rocket, color: 'from-accent to-accent/80' },
                        { title: 'Career Insights', desc: 'Industry trends & salary data', icon: TrendingUp, color: 'from-success to-success/80' },
                      ].map((item, index) => (
                        <div 
                          key={item.title}
                          className={cn(
                            "group p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 hover:from-primary/10 hover:to-accent/10 border border-border/30 hover:border-primary/30 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
                          )}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md",
                            item.color
                          )}>
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Career Detail Drawer */}
          <CareerDetailDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            career={selectedCareer}
            loading={detailLoading}
            studentSkills={profile?.interests || []}
          />
        </div>
      </div>
    </AppLayout>
  );
}
