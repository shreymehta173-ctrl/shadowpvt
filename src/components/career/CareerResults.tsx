import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  MessageCircle,
  Download,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CareerScores, QuestionnaireAnswers } from './CareerQuestionnaire';
import { toast } from 'sonner';

interface CareerMatch {
  id: string;
  name: string;
  category: string;
  matchScore: number;
  description: string;
  whyFits: string[];
  nextSteps: string[];
  skills: string[];
  salary: string;
  growth: string;
  icon: string;
  color: string;
}

interface CareerResultsProps {
  answers: QuestionnaireAnswers;
  scores: CareerScores;
  onRetake: () => void;
  onChatWithMentor: () => void;
}

// Career database with matching logic
const careerDatabase: Omit<CareerMatch, 'matchScore' | 'whyFits'>[] = [
  // After 10th - Science path
  {
    id: 'engineering',
    name: 'Engineering (B.Tech/B.E)',
    category: 'Science',
    description: 'Design, build, and innovate technology solutions across various domains like software, mechanical, civil, and electronics.',
    nextSteps: ['Complete 12th with PCM', 'Prepare for JEE Main/Advanced', 'Explore college options'],
    skills: ['Problem Solving', 'Mathematics', 'Logical Thinking', 'Technical Skills'],
    salary: '₹4-15 LPA (entry)',
    growth: 'Very High',
    icon: '⚙️',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'medical',
    name: 'Medical / Healthcare',
    category: 'Science',
    description: 'Diagnose, treat, and care for patients. Become a doctor, surgeon, or healthcare specialist.',
    nextSteps: ['Complete 12th with PCB', 'Prepare for NEET', 'Apply to medical colleges'],
    skills: ['Biology', 'Patience', 'Empathy', 'Attention to Detail'],
    salary: '₹5-20 LPA (entry)',
    growth: 'High',
    icon: '🏥',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 'it_software',
    name: 'IT / Software Development',
    category: 'Technology',
    description: 'Build applications, websites, and software systems that power modern businesses and services.',
    nextSteps: ['Learn programming basics', 'Take online courses', 'Build portfolio projects'],
    skills: ['Coding', 'Logic', 'Problem Solving', 'Continuous Learning'],
    salary: '₹4-25 LPA (entry)',
    growth: 'Very High',
    icon: '💻',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'data_ai',
    name: 'Data Science / AI',
    category: 'Technology',
    description: 'Analyze data patterns and build intelligent systems that learn and make predictions.',
    nextSteps: ['Strong math foundation', 'Learn Python & Statistics', 'Work on data projects'],
    skills: ['Mathematics', 'Statistics', 'Programming', 'Analytical Thinking'],
    salary: '₹6-30 LPA (entry)',
    growth: 'Very High',
    icon: '🤖',
    color: 'from-emerald-500 to-teal-500',
  },
  // Commerce path
  {
    id: 'ca_finance',
    name: 'CA / Finance',
    category: 'Commerce',
    description: 'Manage finances, audit accounts, and provide financial advisory services to businesses.',
    nextSteps: ['Complete 12th Commerce', 'Register for CA Foundation', 'Clear CA exams'],
    skills: ['Accounting', 'Analysis', 'Attention to Detail', 'Ethics'],
    salary: '₹7-25 LPA (entry)',
    growth: 'High',
    icon: '📊',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'business_management',
    name: 'Business Management / MBA',
    category: 'Commerce',
    description: 'Lead teams, manage operations, and drive business strategy for organizations.',
    nextSteps: ['Complete graduation', 'Prepare for CAT/XAT', 'Gain work experience'],
    skills: ['Leadership', 'Communication', 'Strategy', 'Decision Making'],
    salary: '₹8-30 LPA (after MBA)',
    growth: 'High',
    icon: '📈',
    color: 'from-amber-500 to-yellow-500',
  },
  // Arts/Creative path
  {
    id: 'design',
    name: 'Design / UX/UI',
    category: 'Creative',
    description: 'Create visual designs, user experiences, and creative solutions for digital products.',
    nextSteps: ['Build design portfolio', 'Learn design tools', 'Take design courses'],
    skills: ['Creativity', 'Visual Thinking', 'User Empathy', 'Aesthetics'],
    salary: '₹4-15 LPA (entry)',
    growth: 'High',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'journalism',
    name: 'Journalism / Content',
    category: 'Arts',
    description: 'Tell stories, report news, and create compelling content across various media platforms.',
    nextSteps: ['Start a blog/portfolio', 'Study mass communication', 'Build writing samples'],
    skills: ['Writing', 'Research', 'Communication', 'Critical Thinking'],
    salary: '₹3-10 LPA (entry)',
    growth: 'Moderate',
    icon: '📝',
    color: 'from-gray-500 to-slate-500',
  },
  {
    id: 'psychology',
    name: 'Psychology / Counseling',
    category: 'Arts',
    description: 'Understand human behavior and help people overcome mental health challenges.',
    nextSteps: ['Study psychology in 11-12th', 'BA/BSc Psychology', 'MA & Clinical training'],
    skills: ['Empathy', 'Listening', 'Analysis', 'Patience'],
    salary: '₹4-12 LPA (entry)',
    growth: 'Growing',
    icon: '🧠',
    color: 'from-violet-500 to-purple-500',
  },
  // Skill-based paths
  {
    id: 'diploma_tech',
    name: 'Diploma / Polytechnic',
    category: 'Skill-Based',
    description: 'Hands-on technical training in specific fields like mechanical, electrical, or computer hardware.',
    nextSteps: ['Apply to polytechnic after 10th', 'Choose specialization', 'Gain practical skills'],
    skills: ['Technical Skills', 'Hands-on Work', 'Problem Solving'],
    salary: '₹2-6 LPA (entry)',
    growth: 'Stable',
    icon: '🔧',
    color: 'from-stone-500 to-zinc-500',
  },
  {
    id: 'animation',
    name: 'Animation / Gaming',
    category: 'Creative Tech',
    description: 'Create animated content, visual effects, and interactive gaming experiences.',
    nextSteps: ['Learn animation software', 'Build demo reel', 'Join animation course'],
    skills: ['Creativity', 'Technical Skills', 'Storytelling', 'Patience'],
    salary: '₹3-12 LPA (entry)',
    growth: 'High',
    icon: '🎮',
    color: 'from-fuchsia-500 to-pink-500',
  },
  {
    id: 'research',
    name: 'Research / Academia',
    category: 'Science',
    description: 'Conduct research, discover new knowledge, and teach at universities.',
    nextSteps: ['Focus on strong academics', 'Pursue MSc/PhD', 'Publish research papers'],
    skills: ['Research', 'Critical Thinking', 'Writing', 'Patience'],
    salary: '₹4-15 LPA (entry)',
    growth: 'Stable',
    icon: '🔬',
    color: 'from-cyan-500 to-blue-500',
  },
];

function calculateCareerMatches(scores: CareerScores, answers: QuestionnaireAnswers): CareerMatch[] {
  const matches: CareerMatch[] = careerDatabase.map((career) => {
    let matchScore = 0;
    const whyFits: string[] = [];

    // Calculate match based on scores
    switch (career.id) {
      case 'engineering':
        matchScore = (scores.logical * 3 + scores.technical * 3) / 6;
        if (scores.logical > 3) whyFits.push('Strong logical thinking abilities');
        if (scores.technical > 3) whyFits.push('Natural interest in technology');
        break;
      case 'medical':
        matchScore = (scores.social * 2 + scores.logical * 2) / 4;
        if (scores.social > 3) whyFits.push('Empathy and desire to help others');
        if (answers.competitiveExams === 'yes') whyFits.push('Ready for competitive exams');
        break;
      case 'it_software':
        matchScore = (scores.technical * 3 + scores.logical * 2) / 5;
        if (scores.technical > 3) whyFits.push('Strong tech interest');
        if (answers.continuousLearning === 'enjoy') whyFits.push('Enjoys continuous learning');
        break;
      case 'data_ai':
        matchScore = (scores.logical * 3 + scores.technical * 2) / 5;
        if (scores.logical > 4) whyFits.push('Excellent analytical skills');
        if (answers.thinkingStyle === 'theory') whyFits.push('Appreciates theoretical concepts');
        break;
      case 'ca_finance':
        matchScore = (scores.business * 2 + scores.logical * 2) / 4;
        if (scores.business > 2) whyFits.push('Interest in business and finance');
        if (answers.thinkingStyle === 'rules') whyFits.push('Prefers structured work');
        break;
      case 'business_management':
        matchScore = (scores.business * 2 + scores.social * 2) / 4;
        if (scores.business > 2) whyFits.push('Business mindset');
        if (scores.social > 2) whyFits.push('Good with people');
        break;
      case 'design':
        matchScore = (scores.creative * 3 + scores.technical * 1) / 4;
        if (scores.creative > 3) whyFits.push('High creativity');
        if (answers.excitingActivity === 'designing') whyFits.push('Loves creating new things');
        break;
      case 'journalism':
        matchScore = (scores.creative * 2 + scores.social * 2) / 4;
        if (scores.creative > 2) whyFits.push('Creative expression');
        if (answers.freeTimeActivity === 'reading') whyFits.push('Interest in reading/writing');
        break;
      case 'psychology':
        matchScore = (scores.social * 3 + scores.creative * 1) / 4;
        if (scores.social > 4) whyFits.push('Strong empathy');
        if (answers.excitingActivity === 'explaining') whyFits.push('Enjoys helping others understand');
        break;
      case 'diploma_tech':
        matchScore = (scores.handsOn * 3 + scores.technical * 1) / 4;
        if (scores.handsOn > 2) whyFits.push('Prefers hands-on work');
        if (answers.competitiveExams === 'no') whyFits.push('Skill-based learning preference');
        break;
      case 'animation':
        matchScore = (scores.creative * 2 + scores.technical * 2) / 4;
        if (scores.creative > 3) whyFits.push('Creative talent');
        if (answers.freeTimeActivity === 'gaming') whyFits.push('Passion for gaming/animation');
        break;
      case 'research':
        matchScore = (scores.logical * 2 + scores.technical * 1) / 3;
        if (scores.logical > 3) whyFits.push('Strong analytical mind');
        if (answers.expertOrVariety === 'expert') whyFits.push('Prefers deep expertise');
        break;
    }

    // Normalize to percentage
    matchScore = Math.min(Math.round(matchScore * 20), 100);

    // Add generic fits
    if (whyFits.length === 0) {
      whyFits.push('Matches your profile interests');
    }

    return {
      ...career,
      matchScore,
      whyFits,
    };
  });

  // Sort by match score
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

// Question labels for the report
const questionLabels: Record<keyof QuestionnaireAnswers, string> = {
  classCompleted: 'Class Completed',
  subjects10th: 'Subjects Enjoyed (10th)',
  stream12th: 'Stream in 12th',
  freeTimeActivity: 'Free Time Activity',
  excitingActivity: 'Most Exciting Activity',
  problemSolving: 'Problem Solving Approach',
  thinkingStyle: 'Thinking Style',
  bestSkills: 'Best Skills',
  preferredTask: 'Preferred Task Type',
  competitiveExams: 'Competitive Exams Comfort',
  priority: 'Career Priority',
  continuousLearning: 'Continuous Learning Attitude',
  careerPath: 'Career Path Preference',
  expertOrVariety: 'Expertise vs Variety',
  failureResponse: 'Response to Failure',
};

export function CareerResults({ answers, scores, onRetake, onChatWithMentor }: CareerResultsProps) {
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const results = calculateCareerMatches(scores, answers);
    setMatches(results);
  }, [scores, answers]);

  const topMatch = matches[0];
  const alternatives = matches.slice(1, 3);
  const otherOptions = matches.slice(3);

  // Generate PDF report content
  const generateReportContent = useCallback(() => {
    const reportDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const answeredQuestions = Object.entries(answers)
      .filter(([_, value]) => value !== null && value !== undefined && (Array.isArray(value) ? value.length > 0 : true))
      .map(([key, value]) => ({
        question: questionLabels[key as keyof QuestionnaireAnswers] || key,
        answer: Array.isArray(value) ? value.join(', ') : String(value)
      }));

    const careerRecommendations = matches.slice(0, 5).map((career, index) => ({
      rank: index + 1,
      name: career.name,
      category: career.category,
      matchScore: career.matchScore,
      description: career.description,
      whyFits: career.whyFits,
      skills: career.skills,
      salary: career.salary,
      growth: career.growth,
      nextSteps: career.nextSteps
    }));

    return {
      reportDate,
      scores,
      answeredQuestions,
      careerRecommendations,
      topMatch: topMatch ? {
        name: topMatch.name,
        matchScore: topMatch.matchScore,
        whyFits: topMatch.whyFits
      } : null
    };
  }, [answers, matches, scores, topMatch]);

  // Download as PDF (HTML-based printable document)
  const downloadAsPDF = useCallback(() => {
    const report = generateReportContent();
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>PrepMate Career Assessment Report - by Team Shadow</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      max-width: 850px; 
      margin: 0 auto; 
      padding: 40px; 
      color: #1e293b; 
      background: #f8fafc;
      line-height: 1.6;
    }
    
    /* Brand Colors: Deep Indigo + Teal + Amber */
    :root {
      --primary: #4f46e5;
      --primary-dark: #3730a3;
      --secondary: #0d9488;
      --accent: #f59e0b;
      --accent-light: #fef3c7;
      --bg-light: #eef2ff;
      --text-dark: #1e293b;
      --text-muted: #64748b;
    }
    
    .brand-header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 50%, var(--secondary) 100%);
      color: white;
      padding: 40px;
      border-radius: 20px;
      text-align: center;
      margin-bottom: 30px;
      box-shadow: 0 10px 40px rgba(79, 70, 229, 0.3);
    }
    
    .brand-logo {
      font-size: 48px;
      margin-bottom: 10px;
    }
    
    .brand-name {
      font-size: 36px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -1px;
    }
    
    .brand-tagline {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
      font-weight: 500;
    }
    
    .brand-team {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid rgba(255,255,255,0.2);
    }
    
    .report-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--primary);
      text-align: center;
      margin: 30px 0 10px;
    }
    
    .report-date {
      text-align: center;
      color: var(--text-muted);
      font-size: 14px;
      margin-bottom: 30px;
    }
    
    .section {
      background: white;
      border-radius: 16px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--bg-light);
    }
    
    .section-icon {
      font-size: 24px;
    }
    
    /* Scores Grid */
    .scores-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }
    
    .score-card {
      background: linear-gradient(135deg, var(--bg-light) 0%, #f1f5f9 100%);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    
    .score-value {
      font-size: 32px;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .score-label {
      font-size: 13px;
      color: var(--text-muted);
      text-transform: capitalize;
      font-weight: 600;
      margin-top: 5px;
    }
    
    .score-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      margin-top: 10px;
      overflow: hidden;
    }
    
    .score-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      border-radius: 3px;
    }
    
    /* Questions */
    .question-grid {
      display: grid;
      gap: 12px;
    }
    
    .question-item {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      padding: 16px 20px;
      background: #f8fafc;
      border-radius: 10px;
      border-left: 4px solid var(--secondary);
    }
    
    .question-label {
      font-weight: 600;
      color: var(--text-dark);
      font-size: 14px;
    }
    
    .question-answer {
      color: var(--text-muted);
      font-size: 14px;
    }
    
    /* Career Cards */
    .career-card {
      margin-bottom: 20px;
      padding: 25px;
      border-radius: 16px;
      border: 2px solid #e2e8f0;
      background: white;
      transition: all 0.3s ease;
    }
    
    .career-card.top-match {
      border-color: var(--primary);
      background: linear-gradient(135deg, var(--bg-light) 0%, #fdf4ff 50%, #f0fdfa 100%);
      box-shadow: 0 8px 30px rgba(79, 70, 229, 0.15);
    }
    
    .career-rank {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: var(--primary);
      color: white;
      border-radius: 50%;
      font-weight: 700;
      font-size: 14px;
      margin-right: 12px;
    }
    
    .career-card.top-match .career-rank {
      background: linear-gradient(135deg, var(--accent), #ea580c);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    }
    
    .career-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }
    
    .career-name {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-dark);
    }
    
    .career-category {
      display: inline-block;
      font-size: 11px;
      background: var(--secondary);
      color: white;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-left: 12px;
    }
    
    .career-score-badge {
      text-align: right;
    }
    
    .career-score {
      font-size: 36px;
      font-weight: 800;
      color: var(--primary);
    }
    
    .career-card.top-match .career-score {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .career-score-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .career-description {
      color: var(--text-muted);
      margin-bottom: 20px;
      font-size: 15px;
      line-height: 1.7;
    }
    
    .career-sections-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .career-section {
      background: #f8fafc;
      padding: 18px;
      border-radius: 12px;
    }
    
    .career-section-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .career-section-icon {
      font-size: 16px;
    }
    
    .career-list {
      margin: 0;
      padding-left: 18px;
      font-size: 13px;
    }
    
    .career-list li {
      margin: 8px 0;
      color: var(--text-dark);
    }
    
    .career-meta {
      display: flex;
      gap: 30px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      font-size: 14px;
      color: var(--text-muted);
    }
    
    .career-meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .career-meta-icon {
      font-size: 18px;
    }
    
    /* Why This Career Section */
    .why-section {
      background: linear-gradient(135deg, var(--accent-light) 0%, #fef9c3 100%);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      border-left: 4px solid var(--accent);
    }
    
    .why-title {
      font-size: 14px;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .why-list {
      margin: 0;
      padding-left: 20px;
    }
    
    .why-list li {
      color: #78350f;
      margin: 6px 0;
      font-size: 14px;
    }
    
    /* Footer */
    .footer {
      margin-top: 40px;
      text-align: center;
      padding: 30px;
      background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
      color: white;
      border-radius: 16px;
    }
    
    .footer-brand {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .footer-tagline {
      font-size: 13px;
      opacity: 0.9;
      margin-bottom: 15px;
    }
    
    .footer-disclaimer {
      font-size: 11px;
      opacity: 0.7;
      max-width: 500px;
      margin: 0 auto;
      line-height: 1.6;
    }
    
    .footer-team {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid rgba(255,255,255,0.2);
      font-size: 12px;
      opacity: 0.8;
    }
    
    /* Print Styles */
    @media print { 
      body { 
        padding: 20px; 
        background: white;
      }
      .section, .career-card {
        break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <!-- Brand Header -->
  <div class="brand-header">
    <div class="brand-logo">🎓</div>
    <h1 class="brand-name">PrepMate</h1>
    <p class="brand-tagline">Your Personal Career Discovery & Study Planning Platform</p>
    <p class="brand-team">Developed by Team Shadow</p>
  </div>
  
  <h2 class="report-title">📊 Career Assessment Report</h2>
  <p class="report-date">Generated on ${report.reportDate}</p>

  <!-- Executive Summary -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">🎯</span>
      Executive Summary
    </div>
    <p style="color: var(--text-muted); margin-bottom: 15px;">
      This comprehensive career assessment analyzes your interests, cognitive style, skills, and work preferences 
      to recommend the most suitable career paths for you. Based on our 15-question psychological framework, 
      we've identified your top career matches with detailed reasoning.
    </p>
    ${report.topMatch ? `
    <div style="background: linear-gradient(135deg, var(--bg-light), #f0fdfa); padding: 20px; border-radius: 12px; border: 2px solid var(--primary);">
      <p style="margin: 0; font-size: 16px;"><strong style="color: var(--primary-dark);">Top Recommendation:</strong> 
      <span style="font-size: 18px; font-weight: 700; color: var(--primary);">${report.topMatch.name}</span> 
      with a <strong style="color: var(--accent);">${report.topMatch.matchScore}% match score</strong></p>
    </div>
    ` : ''}
  </div>

  <!-- Profile Strengths -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">💪</span>
      Your Profile Strengths
    </div>
    <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 14px;">
      These scores represent your aptitude across six key dimensions that influence career compatibility.
    </p>
    <div class="scores-grid">
      ${Object.entries(report.scores)
        .sort(([, a], [, b]) => b - a)
        .map(([key, value]) => `
          <div class="score-card">
            <div class="score-value">${value}</div>
            <div class="score-label">${key}</div>
            <div class="score-bar">
              <div class="score-bar-fill" style="width: ${(value / 10) * 100}%"></div>
            </div>
          </div>
        `).join('')}
    </div>
  </div>

  <!-- Questionnaire Responses -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">📝</span>
      Your Assessment Responses
    </div>
    <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 14px;">
      Below are your responses to our 15-question career discovery assessment.
    </p>
    <div class="question-grid">
      ${report.answeredQuestions.map(q => `
        <div class="question-item">
          <div class="question-label">${q.question}</div>
          <div class="question-answer">${q.answer}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- Career Recommendations -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">🏆</span>
      Career Recommendations
    </div>
    <p style="color: var(--text-muted); margin-bottom: 25px; font-size: 14px;">
      Based on your profile, we've identified the following career paths ranked by compatibility. 
      Each recommendation includes detailed reasoning for why this career suits you.
    </p>
    
    ${report.careerRecommendations.map((career, idx) => `
      <div class="career-card ${idx === 0 ? 'top-match' : ''}">
        <div class="career-header">
          <div style="display: flex; align-items: center;">
            <span class="career-rank">${idx === 0 ? '★' : career.rank}</span>
            <div>
              <span class="career-name">${career.name}</span>
              <span class="career-category">${career.category}</span>
            </div>
          </div>
          <div class="career-score-badge">
            <div class="career-score">${career.matchScore}%</div>
            <div class="career-score-label">Match Score</div>
          </div>
        </div>
        
        <p class="career-description">${career.description}</p>
        
        <!-- Why This Career Fits -->
        <div class="why-section">
          <div class="why-title">
            <span>💡</span>
            Why This Career Fits You
          </div>
          <ul class="why-list">
            ${career.whyFits.map(fit => `<li>${fit}</li>`).join('')}
          </ul>
        </div>
        
        <div class="career-sections-grid">
          <div class="career-section">
            <div class="career-section-title">
              <span class="career-section-icon">🎯</span>
              Required Skills
            </div>
            <ul class="career-list">
              ${career.skills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
          </div>
          
          <div class="career-section">
            <div class="career-section-title">
              <span class="career-section-icon">📋</span>
              Next Steps
            </div>
            <ul class="career-list">
              ${career.nextSteps.map((step, i) => `<li><strong>Step ${i + 1}:</strong> ${step}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="career-meta">
          <div class="career-meta-item">
            <span class="career-meta-icon">💰</span>
            <span><strong>Salary:</strong> ${career.salary}</span>
          </div>
          <div class="career-meta-item">
            <span class="career-meta-icon">📈</span>
            <span><strong>Growth:</strong> ${career.growth}</span>
          </div>
        </div>
      </div>
    `).join('')}
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-brand">🎓 PrepMate</div>
    <div class="footer-tagline">Your Personal Career Discovery & Study Planning Platform</div>
    <p class="footer-disclaimer">
      This report is generated based on your self-assessment responses and is intended to guide your career exploration. 
      We recommend discussing these findings with career counselors, teachers, and family for comprehensive guidance.
    </p>
    <div class="footer-team">
      Developed with ❤️ by <strong>Team Shadow</strong>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    
    toast.success('PrepMate career report opened for printing/saving as PDF');
  }, [generateReportContent]);

  // Download as CSV
  const downloadAsCSV = useCallback(() => {
    const report = generateReportContent();
    
    let csvContent = 'PrepMate Career Assessment Report\n';
    csvContent += 'Developed by Team Shadow\n';
    csvContent += `Generated on,${report.reportDate}\n\n`;
    
    // Executive Summary
    csvContent += 'EXECUTIVE SUMMARY\n';
    if (report.topMatch) {
      csvContent += `Top Career Match,"${report.topMatch.name}"\n`;
      csvContent += `Match Score,${report.topMatch.matchScore}%\n`;
    }
    csvContent += '\n';
    
    // Scores section
    csvContent += 'PROFILE STRENGTHS\n';
    csvContent += 'Dimension,Score,Out Of,Percentage\n';
    Object.entries(report.scores).forEach(([key, value]) => {
      csvContent += `${key},${value},10,${(value / 10) * 100}%\n`;
    });
    
    csvContent += '\nASSESSMENT RESPONSES\n';
    csvContent += 'Question Number,Question,Your Response\n';
    report.answeredQuestions.forEach((q, idx) => {
      csvContent += `${idx + 1},"${q.question}","${q.answer}"\n`;
    });
    
    csvContent += '\nCAREER RECOMMENDATIONS\n';
    csvContent += 'Rank,Career Name,Category,Match Score,Description,Why This Career Fits You,Required Skills,Expected Salary,Growth Potential,Next Steps\n';
    report.careerRecommendations.forEach(career => {
      csvContent += `${career.rank},"${career.name}","${career.category}",${career.matchScore}%,"${career.description}","${career.whyFits.join('; ')}","${career.skills.join('; ')}","${career.salary}","${career.growth}","${career.nextSteps.join('; ')}"\n`;
    });
    
    csvContent += '\n---\n';
    csvContent += 'Report Generated by PrepMate - Your Personal Career Discovery Platform\n';
    csvContent += 'Developed by Team Shadow\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prepmate-career-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('PrepMate career report downloaded as CSV');
  }, [generateReportContent]);


  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl animate-bounce">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-3">
          Your Career Matches Are Ready!
        </h1>
        <p className="text-muted-foreground">
          Based on your interests, skills, and preferences, here are the careers that suit you best.
        </p>
      </div>

      {/* Score Summary */}
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-center mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Your Profile Strengths
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(scores)
              .sort(([, a], [, b]) => b - a)
              .map(([key, value]) => (
                <div key={key} className="text-center">
                  <p className="text-xs text-muted-foreground capitalize mb-1">{key}</p>
                  <Progress value={(value / 10) * 100} className="h-2" />
                  <p className="text-sm font-medium mt-1">{value}/10</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Match */}
      {topMatch && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Best Match for You
          </h2>
          <Card className={`relative overflow-hidden border-2 border-primary shadow-2xl bg-gradient-to-br ${topMatch.color}`}>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
            
            <CardContent className="p-6 md:p-8 text-white relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{topMatch.icon}</span>
                  <div>
                    <Badge className="bg-white/20 text-white mb-2">{topMatch.category}</Badge>
                    <h3 className="text-2xl font-bold">{topMatch.name}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">{topMatch.matchScore}%</p>
                  <p className="text-sm opacity-80">Match Score</p>
                </div>
              </div>

              <p className="text-white/90 mb-4">{topMatch.description}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Why This Fits You
                  </h4>
                  <ul className="space-y-1 text-sm text-white/90">
                    {topMatch.whyFits.map((fit, i) => (
                      <li key={i}>✓ {fit}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Next Steps
                  </h4>
                  <ul className="space-y-1 text-sm text-white/90">
                    {topMatch.nextSteps.map((step, i) => (
                      <li key={i}>{i + 1}. {step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {topMatch.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-white/20 text-white">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm opacity-80">
                <span>💰 {topMatch.salary}</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Growth: {topMatch.growth}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alternative Paths */}
      {alternatives.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Strong Alternatives
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {alternatives.map((career) => (
              <Card 
                key={career.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-primary/10"
                onClick={() => setExpandedCard(expandedCard === career.id ? null : career.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{career.icon}</span>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1">{career.category}</Badge>
                        <h3 className="font-semibold">{career.name}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{career.matchScore}%</p>
                    </div>
                  </div>

                  {expandedCard === career.id && (
                    <div className="mt-4 pt-4 border-t space-y-3 animate-in fade-in duration-200">
                      <p className="text-sm text-muted-foreground">{career.description}</p>
                      <div>
                        <p className="text-xs font-medium mb-1">Why it fits:</p>
                        <ul className="text-xs text-muted-foreground">
                          {career.whyFits.map((fit, i) => (
                            <li key={i}>• {fit}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>💰 {career.salary}</span>
                        <span>📈 {career.growth}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center mt-2">
                    {expandedCard === career.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other Options */}
      {otherOptions.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="w-full mb-4"
          >
            {showAll ? 'Hide' : 'Show'} Other Options ({otherOptions.length})
            {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>

          {showAll && (
            <div className="grid gap-3">
              {otherOptions.map((career) => (
                <Card key={career.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{career.icon}</span>
                      <div>
                        <p className="font-medium">{career.name}</p>
                        <p className="text-xs text-muted-foreground">{career.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={career.matchScore} className="w-24 h-2" />
                      <span className="text-sm font-medium w-12 text-right">{career.matchScore}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          onClick={onChatWithMentor}
          size="lg"
          className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 gap-2"
        >
          <MessageCircle className="h-5 w-5" />
          Chat with AI Mentor
        </Button>
        
        {/* Download Report Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-primary/30 hover:bg-primary/5"
            >
              <Download className="h-5 w-5" />
              Download Report
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem onClick={downloadAsPDF} className="cursor-pointer">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Save as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadAsCSV} className="cursor-pointer">
              <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-500" />
              Export as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="lg"
          onClick={onRetake}
          className="gap-2"
        >
          <RefreshCw className="h-5 w-5" />
          Retake Assessment
        </Button>
      </div>
    </div>
  );
}
