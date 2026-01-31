import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { SkillMeter } from '@/components/SkillMeter';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  GraduationCap,
  BookOpen,
  Rocket,
  Lightbulb,
  Trophy,
  Calendar,
  Clock,
  ExternalLink,
  Briefcase,
  DollarSign,
  Users,
  ChevronRight,
  Star,
  Zap,
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

// Competitive Exams Data
const COMPETITIVE_EXAMS = {
  after_10th: [
    {
      name: 'NTSE',
      fullName: 'National Talent Search Examination',
      description: 'Prestigious scholarship exam for class 10 students',
      date: 'November (Stage 1), May (Stage 2)',
      eligibility: 'Class 10 students',
      icon: '🏆',
      difficulty: 'High',
      preparation: ['Mental Ability', 'Scholastic Aptitude', 'Language Test'],
      resources: ['NCERT Books', 'Previous Year Papers', 'Online Mock Tests'],
    },
    {
      name: 'KVPY (Now INSPIRE)',
      fullName: 'INSPIRE Scholarship',
      description: 'Science aptitude test for research aptitude',
      date: 'Check official website',
      eligibility: 'Class 10-12 Science students',
      icon: '🔬',
      difficulty: 'High',
      preparation: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      resources: ['NCERT', 'Reference Books', 'Online Courses'],
    },
    {
      name: 'Olympiads',
      fullName: 'Science & Math Olympiads',
      description: 'Subject-specific competitive exams',
      date: 'December-February',
      eligibility: 'All students',
      icon: '🎯',
      difficulty: 'Medium-High',
      preparation: ['Subject specific deep study', 'Problem solving'],
      resources: ['Olympiad Books', 'Past Papers', 'Online Practice'],
    },
  ],
  after_12th_science: [
    {
      name: 'JEE Main',
      fullName: 'Joint Entrance Examination Main',
      description: 'Gateway to NITs, IIITs and other engineering colleges',
      date: 'January & April',
      eligibility: '12th pass/appearing with PCM',
      icon: '⚙️',
      difficulty: 'High',
      preparation: ['Physics', 'Chemistry', 'Mathematics'],
      resources: ['Coaching Material', 'NCERT', 'Previous Papers', 'Mock Tests'],
    },
    {
      name: 'JEE Advanced',
      fullName: 'Joint Entrance Examination Advanced',
      description: 'Entrance to IITs - premier engineering institutes',
      date: 'June',
      eligibility: 'Top 2.5 lakh JEE Main qualifiers',
      icon: '🎓',
      difficulty: 'Very High',
      preparation: ['Advanced Physics', 'Chemistry', 'Mathematics'],
      resources: ['HC Verma', 'Irodov', 'Coaching Materials'],
    },
    {
      name: 'NEET',
      fullName: 'National Eligibility cum Entrance Test',
      description: 'Medical entrance for MBBS/BDS courses',
      date: 'May',
      eligibility: '12th pass with PCB',
      icon: '🩺',
      difficulty: 'High',
      preparation: ['Physics', 'Chemistry', 'Biology'],
      resources: ['NCERT', 'MTG Books', 'Mock Tests'],
    },
    {
      name: 'BITSAT',
      fullName: 'BITS Admission Test',
      description: 'Entrance to BITS Pilani campuses',
      date: 'May',
      eligibility: '12th with 75% aggregate',
      icon: '💻',
      difficulty: 'High',
      preparation: ['Physics', 'Chemistry', 'Math', 'English', 'Logical Reasoning'],
      resources: ['Online Practice', 'Arihant Books'],
    },
  ],
  after_12th_commerce: [
    {
      name: 'CA Foundation',
      fullName: 'Chartered Accountancy Foundation',
      description: 'First step towards becoming a Chartered Accountant',
      date: 'May & November',
      eligibility: '12th pass',
      icon: '📊',
      difficulty: 'High',
      preparation: ['Accounting', 'Business Laws', 'Quantitative Aptitude', 'Economics'],
      resources: ['ICAI Material', 'Reference Books', 'Online Classes'],
    },
    {
      name: 'CS Foundation',
      fullName: 'Company Secretary Foundation',
      description: 'Entry to Company Secretary profession',
      date: 'June & December',
      eligibility: '12th pass',
      icon: '📋',
      difficulty: 'Medium-High',
      preparation: ['Business Environment', 'Business Management', 'Business Economics'],
      resources: ['ICSI Study Material', 'Online Resources'],
    },
    {
      name: 'CUET',
      fullName: 'Common University Entrance Test',
      description: 'Entrance for central universities',
      date: 'May',
      eligibility: '12th appearing/pass',
      icon: '🎓',
      difficulty: 'Medium',
      preparation: ['Domain Subjects', 'General Aptitude', 'Language'],
      resources: ['NCERT', 'Previous Papers', 'Mock Tests'],
    },
    {
      name: 'IPMAT',
      fullName: 'Integrated Program in Management Aptitude Test',
      description: 'Direct entry to IIM IPM program',
      date: 'May',
      eligibility: '12th with 60%',
      icon: '💼',
      difficulty: 'High',
      preparation: ['Quantitative Ability', 'Verbal Ability', 'Written Ability'],
      resources: ['CAT Prep Books', 'Online Mock Tests'],
    },
  ],
};

// Project & Startup Ideas
const PROJECT_IDEAS = {
  technology: [
    { title: 'AI-Powered Study Assistant', description: 'Build an app that uses AI to create personalized study plans', difficulty: 'Advanced', skills: ['Python', 'ML', 'React'] },
    { title: 'Campus Connect Platform', description: 'Social platform for students to collaborate on projects', difficulty: 'Intermediate', skills: ['React', 'Node.js', 'Database'] },
    { title: 'Smart Attendance System', description: 'Face recognition based attendance tracker', difficulty: 'Advanced', skills: ['Python', 'OpenCV', 'ML'] },
    { title: 'EdTech Mobile App', description: 'Interactive learning app with gamification', difficulty: 'Intermediate', skills: ['React Native', 'Firebase'] },
  ],
  business: [
    { title: 'Student Services Marketplace', description: 'Platform connecting students with tutors and services', difficulty: 'Intermediate', skills: ['Marketing', 'Operations', 'Tech'] },
    { title: 'Campus Food Delivery', description: 'Food delivery service within campus/locality', difficulty: 'Beginner', skills: ['Marketing', 'Logistics', 'Customer Service'] },
    { title: 'Skill Exchange Platform', description: 'Barter system for skill sharing among students', difficulty: 'Beginner', skills: ['Community Building', 'Marketing'] },
    { title: 'Educational Content Creation', description: 'YouTube channel or blog for subject tutorials', difficulty: 'Beginner', skills: ['Content Creation', 'Marketing'] },
  ],
  creative: [
    { title: 'Design Studio', description: 'Freelance design services for local businesses', difficulty: 'Intermediate', skills: ['Graphic Design', 'UI/UX', 'Marketing'] },
    { title: 'Photography/Video Services', description: 'Event coverage and content creation', difficulty: 'Beginner', skills: ['Photography', 'Video Editing'] },
    { title: 'Podcast Production', description: 'Educational or entertainment podcast for students', difficulty: 'Beginner', skills: ['Communication', 'Audio Editing'] },
    { title: 'Art & Craft E-commerce', description: 'Sell handmade products online', difficulty: 'Beginner', skills: ['Crafting', 'E-commerce', 'Marketing'] },
  ],
};

// Career Resources
const CAREER_RESOURCES = [
  { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning', category: 'Courses', icon: '📚' },
  { name: 'Coursera', url: 'https://www.coursera.org', category: 'Courses', icon: '🎓' },
  { name: 'Khan Academy', url: 'https://www.khanacademy.org', category: 'Free Learning', icon: '📖' },
  { name: 'Internshala', url: 'https://internshala.com', category: 'Internships', icon: '💼' },
  { name: 'AngelList', url: 'https://angel.co', category: 'Startups', icon: '🚀' },
  { name: 'GitHub Student Pack', url: 'https://education.github.com/pack', category: 'Developer Tools', icon: '💻' },
];

export default function Progress() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [skillsNeedingReassessment, setSkillsNeedingReassessment] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedExamCategory, setSelectedExamCategory] = useState<'after_10th' | 'after_12th_science' | 'after_12th_commerce'>('after_12th_science');

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const exams = COMPETITIVE_EXAMS[selectedExamCategory];

  return (
    <AppLayout>
      <motion.div 
        className="p-4 md:p-6 lg:p-8 space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              Progress & Resources
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your growth, explore exams, and discover opportunities
            </p>
          </div>
          <Button
            onClick={fetchProgressData}
            disabled={refreshing}
            variant="outline"
            className="gap-2"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex bg-muted/50 p-1">
              <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="h-4 w-4 hidden sm:block" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="exams" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <GraduationCap className="h-4 w-4 hidden sm:block" />
                Exams
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Rocket className="h-4 w-4 hidden sm:block" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="resources" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BookOpen className="h-4 w-4 hidden sm:block" />
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Stats Grid */}
                    {overallStats && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            AI Progress Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-foreground leading-relaxed">{aiSummary}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Skills Grid */}
                    {trendAnalysis.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {trendAnalysis.map((skill, index) => (
                          <motion.div
                            key={skill.skillId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/30">
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
                                <SkillMeter value={skill.currentScore} label="Current Proficiency" />
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Previous</p>
                                    <p className="font-medium">{Math.round(skill.previousScore)}%</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Change</p>
                                    <p className={`font-medium ${skill.improvementRate > 0 ? 'text-success' : skill.improvementRate < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                      {skill.improvementRate > 0 ? '+' : ''}{skill.improvementRate.toFixed(1)}%
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Consistency</p>
                                    <p className="font-medium">{Math.round(skill.consistency)}%</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-dashed">
                        <CardContent className="py-12 text-center">
                          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                            <BarChart3 className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-medium text-foreground text-lg">No Progress Data Yet</h3>
                          <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                            Complete assessments to start tracking your skill progress
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </TabsContent>

            {/* Exams Tab */}
            <TabsContent value="exams" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Category Selector */}
                <div className="flex flex-wrap gap-2">
                  {(['after_10th', 'after_12th_science', 'after_12th_commerce'] as const).map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedExamCategory === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedExamCategory(cat)}
                      className="gap-2"
                    >
                      {cat === 'after_10th' ? '🎓 After 10th' : cat === 'after_12th_science' ? '🔬 12th Science' : '📊 12th Commerce'}
                    </Button>
                  ))}
                </div>

                {/* Exams Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  {exams.map((exam, index) => (
                    <motion.div
                      key={exam.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/30 overflow-hidden group">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{exam.icon}</span>
                              <div>
                                <CardTitle className="text-lg">{exam.name}</CardTitle>
                                <CardDescription className="text-xs">{exam.fullName}</CardDescription>
                              </div>
                            </div>
                            <Badge variant={exam.difficulty === 'Very High' ? 'destructive' : exam.difficulty === 'High' ? 'secondary' : 'outline'}>
                              {exam.difficulty}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                          <p className="text-sm text-muted-foreground">{exam.description}</p>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">{exam.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground text-xs">{exam.eligibility}</span>
                            </div>
                          </div>

                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="preparation" className="border-none">
                              <AccordionTrigger className="text-sm py-2 hover:no-underline">
                                <span className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  Preparation Areas
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-wrap gap-1">
                                  {exam.preparation.map((prep, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {prep}
                                    </Badge>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="resources" className="border-none">
                              <AccordionTrigger className="text-sm py-2 hover:no-underline">
                                <span className="flex items-center gap-2">
                                  <Target className="h-4 w-4" />
                                  Resources
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {exam.resources.map((resource, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                      <ChevronRight className="h-3 w-3" />
                                      {resource}
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-accent" />
                      Startup & Project Ideas
                    </CardTitle>
                    <CardDescription>
                      Build your portfolio and gain practical experience with these project ideas
                    </CardDescription>
                  </CardHeader>
                </Card>

                {Object.entries(PROJECT_IDEAS).map(([category, ideas]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 capitalize">
                      {category === 'technology' && <Zap className="h-5 w-5 text-primary" />}
                      {category === 'business' && <Briefcase className="h-5 w-5 text-accent" />}
                      {category === 'creative' && <Star className="h-5 w-5 text-warning" />}
                      {category} Projects
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {ideas.map((idea, index) => (
                        <motion.div
                          key={idea.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="h-full hover:shadow-md transition-all hover:border-primary/30">
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-base">{idea.title}</CardTitle>
                                <Badge variant={idea.difficulty === 'Beginner' ? 'secondary' : idea.difficulty === 'Intermediate' ? 'outline' : 'default'}>
                                  {idea.difficulty}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-muted-foreground">{idea.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {idea.skills.map((skill, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-accent" />
                      Career Resources & Tools
                    </CardTitle>
                    <CardDescription>
                      Curated resources to help you learn, grow, and find opportunities
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {CAREER_RESOURCES.map((resource, index) => (
                    <motion.div
                      key={resource.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="h-full hover:shadow-md transition-all hover:border-primary/30 cursor-pointer group"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{resource.icon}</span>
                              <div>
                                <h4 className="font-semibold group-hover:text-primary transition-colors">
                                  {resource.name}
                                </h4>
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {resource.category}
                                </Badge>
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-warning" />
                      Quick Career Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        'Start building projects early - employers value practical experience',
                        'Network with professionals on LinkedIn and attend career fairs',
                        'Take online certifications to validate your skills',
                        'Contribute to open-source projects to build credibility',
                        'Create a portfolio website to showcase your work',
                        'Practice mock interviews and improve communication skills',
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
