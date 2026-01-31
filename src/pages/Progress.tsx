import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Target,
  GraduationCap,
  BookOpen,
  Rocket,
  Lightbulb,
  Calendar,
  ExternalLink,
  Briefcase,
  Users,
  ChevronRight,
  Star,
  Zap,
  CheckCircle2,
  Clock,
  Brain,
  Coffee,
  Award,
} from 'lucide-react';

interface DailyGoal {
  id: string;
  text: string;
  textHi: string;
  completed: boolean;
  category: 'study' | 'health' | 'skill';
}

// Daily Goals Data
const DAILY_GOALS: DailyGoal[] = [
  { id: '1', text: 'Complete 2 hours of focused study', textHi: '2 घंटे की केंद्रित पढ़ाई पूरी करें', completed: false, category: 'study' },
  { id: '2', text: 'Solve 10 practice problems', textHi: '10 अभ्यास प्रश्न हल करें', completed: false, category: 'study' },
  { id: '3', text: "Review yesterday's notes", textHi: 'कल के नोट्स की समीक्षा करें', completed: false, category: 'study' },
  { id: '4', text: 'Take a 15-min break every hour', textHi: 'हर घंटे 15 मिनट का ब्रेक लें', completed: false, category: 'health' },
  { id: '5', text: 'Learn one new concept today', textHi: 'आज एक नई अवधारणा सीखें', completed: false, category: 'skill' },
  { id: '6', text: 'Stay hydrated - drink 8 glasses', textHi: 'हाइड्रेटेड रहें - 8 गिलास पानी पिएं', completed: false, category: 'health' },
];

// Study Tips Data
const STUDY_TIPS = [
  { 
    title: 'Pomodoro Technique', 
    titleHi: 'पोमोडोरो तकनीक',
    description: 'Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer break.',
    descriptionHi: '25 मिनट पढ़ाई करें, फिर 5 मिनट का ब्रेक लें। 4 सत्रों के बाद, लंबा ब्रेक लें।',
    icon: Clock 
  },
  { 
    title: 'Active Recall', 
    titleHi: 'सक्रिय स्मरण',
    description: 'Test yourself frequently instead of just re-reading. This strengthens memory.',
    descriptionHi: 'केवल दोबारा पढ़ने के बजाय बार-बार खुद का परीक्षण करें। यह स्मृति को मजबूत करता है।',
    icon: Brain 
  },
  { 
    title: 'Spaced Repetition', 
    titleHi: 'स्पेस्ड रिपीटिशन',
    description: 'Review material at increasing intervals to improve long-term retention.',
    descriptionHi: 'दीर्घकालिक स्मरण में सुधार के लिए बढ़ते अंतराल पर सामग्री की समीक्षा करें।',
    icon: Calendar 
  },
  { 
    title: 'Mind Mapping', 
    titleHi: 'माइंड मैपिंग',
    description: 'Create visual diagrams to connect concepts and improve understanding.',
    descriptionHi: 'अवधारणाओं को जोड़ने और समझ में सुधार के लिए विज़ुअल डायग्राम बनाएं।',
    icon: Target 
  },
];

// Competitive Exams Data
const COMPETITIVE_EXAMS = {
  after_10th: [
    {
      name: 'NTSE',
      nameHi: 'एनटीएसई',
      fullName: 'National Talent Search Examination',
      fullNameHi: 'राष्ट्रीय प्रतिभा खोज परीक्षा',
      description: 'Prestigious scholarship exam for class 10 students',
      descriptionHi: 'कक्षा 10 के छात्रों के लिए प्रतिष्ठित छात्रवृत्ति परीक्षा',
      date: 'November (Stage 1), May (Stage 2)',
      dateHi: 'नवंबर (चरण 1), मई (चरण 2)',
      eligibility: 'Class 10 students',
      eligibilityHi: 'कक्षा 10 के छात्र',
      icon: '🏆',
      difficulty: 'High',
      preparation: ['Mental Ability', 'Scholastic Aptitude', 'Language Test'],
      resources: ['NCERT Books', 'Previous Year Papers', 'Online Mock Tests'],
    },
    {
      name: 'KVPY (Now INSPIRE)',
      nameHi: 'केवीपीवाई (अब इंस्पायर)',
      fullName: 'INSPIRE Scholarship',
      fullNameHi: 'इंस्पायर छात्रवृत्ति',
      description: 'Science aptitude test for research aptitude',
      descriptionHi: 'अनुसंधान योग्यता के लिए विज्ञान योग्यता परीक्षा',
      date: 'Check official website',
      dateHi: 'आधिकारिक वेबसाइट देखें',
      eligibility: 'Class 10-12 Science students',
      eligibilityHi: 'कक्षा 10-12 विज्ञान के छात्र',
      icon: '🔬',
      difficulty: 'High',
      preparation: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      resources: ['NCERT', 'Reference Books', 'Online Courses'],
    },
    {
      name: 'Olympiads',
      nameHi: 'ओलंपियाड',
      fullName: 'Science & Math Olympiads',
      fullNameHi: 'विज्ञान और गणित ओलंपियाड',
      description: 'Subject-specific competitive exams',
      descriptionHi: 'विषय-विशिष्ट प्रतियोगी परीक्षाएं',
      date: 'December-February',
      dateHi: 'दिसंबर-फरवरी',
      eligibility: 'All students',
      eligibilityHi: 'सभी छात्र',
      icon: '🎯',
      difficulty: 'Medium-High',
      preparation: ['Subject specific deep study', 'Problem solving'],
      resources: ['Olympiad Books', 'Past Papers', 'Online Practice'],
    },
  ],
  after_12th_science: [
    {
      name: 'JEE Main',
      nameHi: 'जेईई मेन',
      fullName: 'Joint Entrance Examination Main',
      fullNameHi: 'संयुक्त प्रवेश परीक्षा मेन',
      description: 'Gateway to NITs, IIITs and other engineering colleges',
      descriptionHi: 'NITs, IIITs और अन्य इंजीनियरिंग कॉलेजों का प्रवेश द्वार',
      date: 'January & April',
      dateHi: 'जनवरी और अप्रैल',
      eligibility: '12th pass/appearing with PCM',
      eligibilityHi: 'PCM के साथ 12वीं पास/उपस्थित',
      icon: '⚙️',
      difficulty: 'High',
      preparation: ['Physics', 'Chemistry', 'Mathematics'],
      resources: ['Coaching Material', 'NCERT', 'Previous Papers', 'Mock Tests'],
    },
    {
      name: 'JEE Advanced',
      nameHi: 'जेईई एडवांस्ड',
      fullName: 'Joint Entrance Examination Advanced',
      fullNameHi: 'संयुक्त प्रवेश परीक्षा एडवांस्ड',
      description: 'Entrance to IITs - premier engineering institutes',
      descriptionHi: 'IITs में प्रवेश - प्रमुख इंजीनियरिंग संस्थान',
      date: 'June',
      dateHi: 'जून',
      eligibility: 'Top 2.5 lakh JEE Main qualifiers',
      eligibilityHi: 'शीर्ष 2.5 लाख JEE Main क्वालिफायर',
      icon: '🎓',
      difficulty: 'Very High',
      preparation: ['Advanced Physics', 'Chemistry', 'Mathematics'],
      resources: ['HC Verma', 'Irodov', 'Coaching Materials'],
    },
    {
      name: 'NEET',
      nameHi: 'नीट',
      fullName: 'National Eligibility cum Entrance Test',
      fullNameHi: 'राष्ट्रीय पात्रता सह प्रवेश परीक्षा',
      description: 'Medical entrance for MBBS/BDS courses',
      descriptionHi: 'MBBS/BDS पाठ्यक्रमों के लिए मेडिकल प्रवेश',
      date: 'May',
      dateHi: 'मई',
      eligibility: '12th pass with PCB',
      eligibilityHi: 'PCB के साथ 12वीं पास',
      icon: '🩺',
      difficulty: 'High',
      preparation: ['Physics', 'Chemistry', 'Biology'],
      resources: ['NCERT', 'MTG Books', 'Mock Tests'],
    },
    {
      name: 'BITSAT',
      nameHi: 'बिट्सैट',
      fullName: 'BITS Admission Test',
      fullNameHi: 'BITS प्रवेश परीक्षा',
      description: 'Entrance to BITS Pilani campuses',
      descriptionHi: 'BITS पिलानी कैंपस में प्रवेश',
      date: 'May',
      dateHi: 'मई',
      eligibility: '12th with 75% aggregate',
      eligibilityHi: '75% कुल के साथ 12वीं',
      icon: '💻',
      difficulty: 'High',
      preparation: ['Physics', 'Chemistry', 'Math', 'English', 'Logical Reasoning'],
      resources: ['Online Practice', 'Arihant Books'],
    },
  ],
  after_12th_commerce: [
    {
      name: 'CA Foundation',
      nameHi: 'सीए फाउंडेशन',
      fullName: 'Chartered Accountancy Foundation',
      fullNameHi: 'चार्टर्ड एकाउंटेंसी फाउंडेशन',
      description: 'First step towards becoming a Chartered Accountant',
      descriptionHi: 'चार्टर्ड एकाउंटेंट बनने का पहला कदम',
      date: 'May & November',
      dateHi: 'मई और नवंबर',
      eligibility: '12th pass',
      eligibilityHi: '12वीं पास',
      icon: '📊',
      difficulty: 'High',
      preparation: ['Accounting', 'Business Laws', 'Quantitative Aptitude', 'Economics'],
      resources: ['ICAI Material', 'Reference Books', 'Online Classes'],
    },
    {
      name: 'CS Foundation',
      nameHi: 'सीएस फाउंडेशन',
      fullName: 'Company Secretary Foundation',
      fullNameHi: 'कंपनी सेक्रेटरी फाउंडेशन',
      description: 'Entry to Company Secretary profession',
      descriptionHi: 'कंपनी सेक्रेटरी पेशे में प्रवेश',
      date: 'June & December',
      dateHi: 'जून और दिसंबर',
      eligibility: '12th pass',
      eligibilityHi: '12वीं पास',
      icon: '📋',
      difficulty: 'Medium-High',
      preparation: ['Business Environment', 'Business Management', 'Business Economics'],
      resources: ['ICSI Study Material', 'Online Resources'],
    },
    {
      name: 'CUET',
      nameHi: 'सीयूईटी',
      fullName: 'Common University Entrance Test',
      fullNameHi: 'सामान्य विश्वविद्यालय प्रवेश परीक्षा',
      description: 'Entrance for central universities',
      descriptionHi: 'केंद्रीय विश्वविद्यालयों में प्रवेश',
      date: 'May',
      dateHi: 'मई',
      eligibility: '12th appearing/pass',
      eligibilityHi: '12वीं उपस्थित/पास',
      icon: '🎓',
      difficulty: 'Medium',
      preparation: ['Domain Subjects', 'General Aptitude', 'Language'],
      resources: ['NCERT', 'Previous Papers', 'Mock Tests'],
    },
    {
      name: 'IPMAT',
      nameHi: 'आईपीएमएटी',
      fullName: 'Integrated Program in Management Aptitude Test',
      fullNameHi: 'प्रबंधन योग्यता परीक्षा में एकीकृत कार्यक्रम',
      description: 'Direct entry to IIM IPM program',
      descriptionHi: 'IIM IPM कार्यक्रम में सीधी प्रविष्टि',
      date: 'May',
      dateHi: 'मई',
      eligibility: '12th with 60%',
      eligibilityHi: '60% के साथ 12वीं',
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
    { title: 'AI-Powered Study Assistant', titleHi: 'AI-संचालित अध्ययन सहायक', description: 'Build an app that uses AI to create personalized study plans', descriptionHi: 'AI का उपयोग करके व्यक्तिगत अध्ययन योजनाएं बनाने वाला ऐप बनाएं', difficulty: 'Advanced', skills: ['Python', 'ML', 'React'] },
    { title: 'Campus Connect Platform', titleHi: 'कैंपस कनेक्ट प्लेटफॉर्म', description: 'Social platform for students to collaborate on projects', descriptionHi: 'छात्रों के लिए प्रोजेक्ट्स पर सहयोग करने का सोशल प्लेटफॉर्म', difficulty: 'Intermediate', skills: ['React', 'Node.js', 'Database'] },
    { title: 'Smart Attendance System', titleHi: 'स्मार्ट उपस्थिति प्रणाली', description: 'Face recognition based attendance tracker', descriptionHi: 'चेहरे की पहचान आधारित उपस्थिति ट्रैकर', difficulty: 'Advanced', skills: ['Python', 'OpenCV', 'ML'] },
    { title: 'EdTech Mobile App', titleHi: 'एडटेक मोबाइल ऐप', description: 'Interactive learning app with gamification', descriptionHi: 'गेमिफिकेशन के साथ इंटरैक्टिव लर्निंग ऐप', difficulty: 'Intermediate', skills: ['React Native', 'Firebase'] },
  ],
  business: [
    { title: 'Student Services Marketplace', titleHi: 'छात्र सेवा मार्केटप्लेस', description: 'Platform connecting students with tutors and services', descriptionHi: 'छात्रों को ट्यूटर्स और सेवाओं से जोड़ने वाला प्लेटफॉर्म', difficulty: 'Intermediate', skills: ['Marketing', 'Operations', 'Tech'] },
    { title: 'Campus Food Delivery', titleHi: 'कैंपस फूड डिलीवरी', description: 'Food delivery service within campus/locality', descriptionHi: 'कैंपस/स्थानीयता के भीतर खाद्य वितरण सेवा', difficulty: 'Beginner', skills: ['Marketing', 'Logistics', 'Customer Service'] },
    { title: 'Skill Exchange Platform', titleHi: 'कौशल आदान-प्रदान मंच', description: 'Barter system for skill sharing among students', descriptionHi: 'छात्रों के बीच कौशल साझा करने की वस्तु विनिमय प्रणाली', difficulty: 'Beginner', skills: ['Community Building', 'Marketing'] },
    { title: 'Educational Content Creation', titleHi: 'शैक्षिक सामग्री निर्माण', description: 'YouTube channel or blog for subject tutorials', descriptionHi: 'विषय ट्यूटोरियल के लिए YouTube चैनल या ब्लॉग', difficulty: 'Beginner', skills: ['Content Creation', 'Marketing'] },
  ],
  creative: [
    { title: 'Design Studio', titleHi: 'डिज़ाइन स्टूडियो', description: 'Freelance design services for local businesses', descriptionHi: 'स्थानीय व्यवसायों के लिए फ्रीलांस डिज़ाइन सेवाएं', difficulty: 'Intermediate', skills: ['Graphic Design', 'UI/UX', 'Marketing'] },
    { title: 'Photography/Video Services', titleHi: 'फोटोग्राफी/वीडियो सेवाएं', description: 'Event coverage and content creation', descriptionHi: 'इवेंट कवरेज और कंटेंट क्रिएशन', difficulty: 'Beginner', skills: ['Photography', 'Video Editing'] },
    { title: 'Podcast Production', titleHi: 'पॉडकास्ट प्रोडक्शन', description: 'Educational or entertainment podcast for students', descriptionHi: 'छात्रों के लिए शैक्षिक या मनोरंजन पॉडकास्ट', difficulty: 'Beginner', skills: ['Communication', 'Audio Editing'] },
    { title: 'Art & Craft E-commerce', titleHi: 'कला और शिल्प ई-कॉमर्स', description: 'Sell handmade products online', descriptionHi: 'हस्तनिर्मित उत्पादों को ऑनलाइन बेचें', difficulty: 'Beginner', skills: ['Crafting', 'E-commerce', 'Marketing'] },
  ],
};

// Career Resources
const CAREER_RESOURCES = [
  { name: 'LinkedIn Learning', nameHi: 'लिंक्डइन लर्निंग', url: 'https://www.linkedin.com/learning', category: 'Courses', categoryHi: 'पाठ्यक्रम', icon: '📚' },
  { name: 'Coursera', nameHi: 'कोर्सेरा', url: 'https://www.coursera.org', category: 'Courses', categoryHi: 'पाठ्यक्रम', icon: '🎓' },
  { name: 'Khan Academy', nameHi: 'खान अकादमी', url: 'https://www.khanacademy.org', category: 'Free Learning', categoryHi: 'मुफ्त शिक्षा', icon: '📖' },
  { name: 'Internshala', nameHi: 'इंटर्नशाला', url: 'https://internshala.com', category: 'Internships', categoryHi: 'इंटर्नशिप', icon: '💼' },
  { name: 'AngelList', nameHi: 'एंजेललिस्ट', url: 'https://angel.co', category: 'Startups', categoryHi: 'स्टार्टअप', icon: '🚀' },
  { name: 'GitHub Student Pack', nameHi: 'गिटहब स्टूडेंट पैक', url: 'https://education.github.com/pack', category: 'Developer Tools', categoryHi: 'डेवलपर टूल्स', icon: '💻' },
];

export default function Progress() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('goals');
  const [selectedExamCategory, setSelectedExamCategory] = useState<'after_10th' | 'after_12th_science' | 'after_12th_commerce'>('after_12th_science');
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(() => {
    const stored = localStorage.getItem('prepmate_daily_goals');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DAILY_GOALS;
      }
    }
    return DAILY_GOALS;
  });

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('prepmate_daily_goals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  // Reset goals at midnight
  useEffect(() => {
    const lastReset = localStorage.getItem('prepmate_goals_last_reset');
    const today = new Date().toDateString();
    if (lastReset !== today) {
      setDailyGoals(DAILY_GOALS);
      localStorage.setItem('prepmate_goals_last_reset', today);
    }
  }, []);

  const toggleGoal = (goalId: string) => {
    setDailyGoals(prev => 
      prev.map(goal => 
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const completedGoals = dailyGoals.filter(g => g.completed).length;
  const totalGoals = dailyGoals.length;
  const progressPercent = Math.round((completedGoals / totalGoals) * 100);

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
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              {t('Student Resources', 'छात्र संसाधन')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('Set goals, explore exams, and discover opportunities', 'लक्ष्य निर्धारित करें, परीक्षाएं खोजें, और अवसर खोजें')}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex bg-muted/50 p-1">
              <TabsTrigger value="goals" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Target className="h-4 w-4 hidden sm:block" />
                {t('Daily Goals', 'दैनिक लक्ष्य')}
              </TabsTrigger>
              <TabsTrigger value="exams" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <GraduationCap className="h-4 w-4 hidden sm:block" />
                {t('Exams', 'परीक्षाएं')}
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Rocket className="h-4 w-4 hidden sm:block" />
                {t('Projects', 'प्रोजेक्ट्स')}
              </TabsTrigger>
              <TabsTrigger value="resources" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BookOpen className="h-4 w-4 hidden sm:block" />
                {t('Resources', 'संसाधन')}
              </TabsTrigger>
            </TabsList>

            {/* Daily Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key="goals"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Progress Summary */}
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{t("Today's Progress", 'आज की प्रगति')}</h3>
                          <p className="text-muted-foreground text-sm">
                            {completedGoals} {t('of', 'में से')} {totalGoals} {t('goals completed', 'लक्ष्य पूर्ण')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-primary">{progressPercent}%</span>
                        </div>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Goals Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Goals List */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          {t('Daily Goals', 'दैनिक लक्ष्य')}
                        </CardTitle>
                        <CardDescription>
                          {t('Check off tasks as you complete them', 'कार्य पूरे होने पर उन्हें चेक करें')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {dailyGoals.map((goal) => (
                          <motion.div
                            key={goal.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                              goal.completed 
                                ? 'bg-success/10 border-success/30' 
                                : 'bg-card border-border hover:border-primary/30'
                            }`}
                            onClick={() => toggleGoal(goal.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <Checkbox 
                              checked={goal.completed} 
                              onCheckedChange={() => toggleGoal(goal.id)}
                              className="pointer-events-none"
                            />
                            <span className={`flex-1 text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {t(goal.text, goal.textHi)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {goal.category === 'study' ? t('Study', 'अध्ययन') : 
                               goal.category === 'health' ? t('Health', 'स्वास्थ्य') : t('Skill', 'कौशल')}
                            </Badge>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Study Tips */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-accent" />
                          {t('Study Tips', 'अध्ययन युक्तियाँ')}
                        </CardTitle>
                        <CardDescription>
                          {t('Proven techniques to boost your learning', 'आपकी सीखने की क्षमता बढ़ाने की सिद्ध तकनीकें')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {STUDY_TIPS.map((tip, index) => (
                          <motion.div
                            key={tip.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="p-2 rounded-lg bg-primary/10 h-fit">
                              <tip.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{t(tip.title, tip.titleHi)}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t(tip.description, tip.descriptionHi)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Motivational Quote */}
                  <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
                    <CardContent className="p-6 text-center">
                      <Coffee className="h-8 w-8 text-accent mx-auto mb-3" />
                      <p className="text-lg font-medium italic text-foreground">
                        {t('"Success is the sum of small efforts, repeated day in and day out."', 
                           '"सफलता छोटे प्रयासों का योग है, जो दिन-प्रतिदिन दोहराए जाते हैं।"')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">— Robert Collier</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
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
                      {cat === 'after_10th' 
                        ? t('🎓 After 10th', '🎓 10वीं के बाद') 
                        : cat === 'after_12th_science' 
                          ? t('🔬 12th Science', '🔬 12वीं विज्ञान') 
                          : t('📊 12th Commerce', '📊 12वीं कॉमर्स')}
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
                                <CardTitle className="text-lg">{t(exam.name, exam.nameHi)}</CardTitle>
                                <CardDescription className="text-xs">{t(exam.fullName, exam.fullNameHi)}</CardDescription>
                              </div>
                            </div>
                            <Badge variant={exam.difficulty === 'Very High' ? 'destructive' : exam.difficulty === 'High' ? 'secondary' : 'outline'}>
                              {exam.difficulty}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                          <p className="text-sm text-muted-foreground">{t(exam.description, exam.descriptionHi)}</p>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">{t(exam.date, exam.dateHi)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground text-xs">{t(exam.eligibility, exam.eligibilityHi)}</span>
                            </div>
                          </div>

                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="preparation" className="border-none">
                              <AccordionTrigger className="text-sm py-2 hover:no-underline">
                                <span className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  {t('Preparation Areas', 'तैयारी के क्षेत्र')}
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
                                  {t('Resources', 'संसाधन')}
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
                      {t('Startup & Project Ideas', 'स्टार्टअप और प्रोजेक्ट आइडियाज')}
                    </CardTitle>
                    <CardDescription>
                      {t('Build your portfolio and gain practical experience with these project ideas', 
                         'इन प्रोजेक्ट आइडियाज के साथ अपना पोर्टफोलियो बनाएं और व्यावहारिक अनुभव प्राप्त करें')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {Object.entries(PROJECT_IDEAS).map(([category, ideas]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 capitalize">
                      {category === 'technology' && <Zap className="h-5 w-5 text-primary" />}
                      {category === 'business' && <Briefcase className="h-5 w-5 text-accent" />}
                      {category === 'creative' && <Star className="h-5 w-5 text-warning" />}
                      {t(`${category} Projects`, 
                         category === 'technology' ? 'टेक्नोलॉजी प्रोजेक्ट्स' : 
                         category === 'business' ? 'बिज़नेस प्रोजेक्ट्स' : 'क्रिएटिव प्रोजेक्ट्स')}
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
                                <CardTitle className="text-base">{t(idea.title, idea.titleHi)}</CardTitle>
                                <Badge variant={idea.difficulty === 'Beginner' ? 'secondary' : idea.difficulty === 'Intermediate' ? 'outline' : 'default'}>
                                  {idea.difficulty}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-muted-foreground">{t(idea.description, idea.descriptionHi)}</p>
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
                      <Award className="h-5 w-5 text-accent" />
                      {t('Career Resources & Tools', 'करियर संसाधन और उपकरण')}
                    </CardTitle>
                    <CardDescription>
                      {t('Curated resources to help you learn, grow, and find opportunities', 
                         'आपको सीखने, बढ़ने और अवसर खोजने में मदद करने के लिए क्यूरेटेड संसाधन')}
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
                                  {t(resource.name, resource.nameHi)}
                                </h4>
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {t(resource.category, resource.categoryHi)}
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
                      {t('Quick Career Tips', 'त्वरित करियर टिप्स')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        { en: 'Start building projects early - employers value practical experience', hi: 'जल्दी प्रोजेक्ट्स बनाना शुरू करें - नियोक्ता व्यावहारिक अनुभव को महत्व देते हैं' },
                        { en: 'Network with professionals on LinkedIn and attend career fairs', hi: 'LinkedIn पर पेशेवरों के साथ नेटवर्क करें और करियर मेलों में भाग लें' },
                        { en: 'Take online certifications to validate your skills', hi: 'अपने कौशल को मान्य करने के लिए ऑनलाइन सर्टिफिकेशन लें' },
                        { en: 'Contribute to open-source projects to build credibility', hi: 'विश्वसनीयता बनाने के लिए ओपन-सोर्स प्रोजेक्ट्स में योगदान दें' },
                        { en: 'Create a portfolio website to showcase your work', hi: 'अपने काम को प्रदर्शित करने के लिए एक पोर्टफोलियो वेबसाइट बनाएं' },
                        { en: 'Practice mock interviews and improve communication skills', hi: 'मॉक इंटरव्यू का अभ्यास करें और संचार कौशल में सुधार करें' },
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{t(tip.en, tip.hi)}</span>
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
