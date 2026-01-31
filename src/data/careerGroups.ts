// PrepMate - Career Groups and Behavioral Recommendation Logic
// Maps behavioral traits to academic paths (hidden from students)

import { TraitDimensions, CompletedClass } from './assessmentQuestions';

// Hidden career path labels (internal use only)
export interface CareerPath {
  id: string;
  name: string; // Display name (generic, not field-specific)
  internalLabel: string; // Actual career category (hidden)
  category: string;
  description: string;
  eligibleAfter: CompletedClass[];
  streamRequirement?: ('PCM' | 'PCB' | 'PCMB' | 'any')[];
  educationPath: string[];
  entranceExams?: string[];
  skills: string[];
  salaryRange: string;
  growthOutlook: 'Very High' | 'High' | 'Moderate' | 'Stable';
  workEnvironment: string;
  typicalDay: string;
  icon: string;
  color: string;
  // Weights for each trait (used in scoring)
  traitWeights: Partial<TraitDimensions>;
  // Minimum thresholds for eligibility
  minimumThresholds?: Partial<TraitDimensions>;
}

// Career paths after 10th (labeled generically)
export const careersAfter10th: CareerPath[] = [
  {
    id: 'path_analytical',
    name: 'Academic-Intensive Path',
    internalLabel: 'Science Stream',
    category: 'Deep Study',
    description: 'For those who enjoy understanding complex systems, solving challenging problems, and thinking deeply about how things work.',
    eligibleAfter: ['10th'],
    educationPath: ['Foundation Studies', 'Advanced Specialization', 'Professional Degree'],
    skills: ['Analytical Thinking', 'Problem Solving', 'Logical Reasoning', 'Research Aptitude'],
    salaryRange: 'Varies by specialization',
    growthOutlook: 'Very High',
    workEnvironment: 'Research centers, technical environments, innovation labs',
    typicalDay: 'Solving complex problems, conducting experiments, analyzing data, collaborating with experts',
    icon: '🔬',
    color: 'from-primary to-accent',
    traitWeights: {
      analytical_reasoning: 0.25,
      system_thinking: 0.25,
      learning_depth_tolerance: 0.2,
      precision_orientation: 0.15,
      planning_drive: 0.15,
    },
    minimumThresholds: {
      analytical_reasoning: 10,
      learning_depth_tolerance: 8,
    },
  },
  {
    id: 'path_strategic',
    name: 'Business-Oriented Path',
    internalLabel: 'Commerce Stream',
    category: 'Strategy & Growth',
    description: 'For those who enjoy planning, working with numbers, understanding markets, and making strategic decisions.',
    eligibleAfter: ['10th'],
    educationPath: ['Foundation Studies', 'Business Specialization', 'Professional Courses'],
    skills: ['Strategic Thinking', 'Numerical Ability', 'Communication', 'Planning'],
    salaryRange: 'Varies by specialization',
    growthOutlook: 'High',
    workEnvironment: 'Corporate offices, financial institutions, consulting firms',
    typicalDay: 'Analyzing data, making decisions, managing resources, meeting stakeholders',
    icon: '📊',
    color: 'from-warning to-destructive',
    traitWeights: {
      planning_drive: 0.25,
      analytical_reasoning: 0.2,
      persuasion_influence: 0.2,
      precision_orientation: 0.2,
      risk_appetite: 0.15,
    },
  },
  {
    id: 'path_expressive',
    name: 'Creative & Social Path',
    internalLabel: 'Arts/Humanities Stream',
    category: 'Expression & Impact',
    description: 'For those who enjoy expressing ideas, connecting with people, creating content, and making social impact.',
    eligibleAfter: ['10th'],
    educationPath: ['Foundation Studies', 'Creative Specialization', 'Professional Courses'],
    skills: ['Communication', 'Creativity', 'Empathy', 'Critical Thinking'],
    salaryRange: 'Varies by specialization',
    growthOutlook: 'Moderate',
    workEnvironment: 'Creative studios, media, social organizations, educational institutions',
    typicalDay: 'Creating content, engaging with audiences, developing ideas, collaborating on projects',
    icon: '🎨',
    color: 'from-info to-primary',
    traitWeights: {
      creative_expression: 0.3,
      people_involvement: 0.25,
      visual_thinking: 0.15,
      persuasion_influence: 0.2,
      ambiguity_tolerance: 0.1,
    },
  },
  {
    id: 'path_practical',
    name: 'Skill-Oriented Path',
    internalLabel: 'Diploma/Vocational',
    category: 'Hands-On Work',
    description: 'For those who prefer practical work, tangible results, and building real things with their hands.',
    eligibleAfter: ['10th'],
    educationPath: ['Technical Training', 'Skill Certification', 'Industry Placement'],
    entranceExams: ['Technical Entrance', 'Skill Assessment'],
    skills: ['Technical Skills', 'Hands-on Work', 'Practical Problem Solving'],
    salaryRange: '₹2-8 LPA',
    growthOutlook: 'Stable',
    workEnvironment: 'Workshops, technical services, field work, production',
    typicalDay: 'Building, repairing, operating equipment, completing tangible tasks',
    icon: '🔧',
    color: 'from-muted-foreground to-foreground',
    traitWeights: {
      execution_drive: 0.35,
      precision_orientation: 0.2,
      system_thinking: 0.15,
      risk_appetite: 0.15,
      ambiguity_tolerance: -0.15,
    },
  },
];

// Career paths after 12th Science (labeled generically)
export const careersAfter12thScience: CareerPath[] = [
  {
    id: 'path_systems',
    name: 'Systems & Technology Path',
    internalLabel: 'Engineering',
    category: 'Building Systems',
    description: 'For those who enjoy building complex systems, solving technical challenges, and creating functional solutions.',
    eligibleAfter: ['12th_science'],
    streamRequirement: ['PCM', 'PCMB'],
    educationPath: ['Foundation Exam', 'Technical Degree (4 years)', 'Specialization'],
    entranceExams: ['National Entrance', 'Advanced Entrance', 'State Exams'],
    skills: ['Problem Solving', 'System Design', 'Logical Thinking', 'Technical Skills'],
    salaryRange: '₹4-25 LPA (entry)',
    growthOutlook: 'Very High',
    workEnvironment: 'Tech companies, manufacturing, R&D labs, startups',
    typicalDay: 'Designing systems, writing code, testing solutions, collaborating with teams',
    icon: '⚙️',
    color: 'from-primary to-info',
    traitWeights: {
      system_thinking: 0.3,
      analytical_reasoning: 0.25,
      execution_drive: 0.15,
      precision_orientation: 0.15,
      learning_depth_tolerance: 0.15,
    },
    minimumThresholds: {
      system_thinking: 10,
      analytical_reasoning: 8,
    },
  },
  {
    id: 'path_human',
    name: 'Human & Life Path',
    internalLabel: 'Medical/Healthcare',
    category: 'Serving People',
    description: 'For those who want to help others, understand human systems, and make a direct impact on lives.',
    eligibleAfter: ['12th_science'],
    streamRequirement: ['PCB', 'PCMB'],
    educationPath: ['National Entrance', 'Professional Degree (5.5 years)', 'Specialization'],
    entranceExams: ['National Medical Entrance', 'Specialized Exams'],
    skills: ['Life Sciences', 'Patience', 'Empathy', 'Attention to Detail', 'Communication'],
    salaryRange: '₹5-30 LPA (after specialization)',
    growthOutlook: 'High',
    workEnvironment: 'Healthcare facilities, research labs, clinical settings',
    typicalDay: 'Patient care, diagnosis, treatment planning, research, learning continuously',
    icon: '🏥',
    color: 'from-destructive to-warning',
    traitWeights: {
      people_involvement: 0.3,
      precision_orientation: 0.25,
      learning_depth_tolerance: 0.2,
      analytical_reasoning: 0.15,
      planning_drive: 0.1,
    },
    minimumThresholds: {
      people_involvement: 10,
      learning_depth_tolerance: 10,
      precision_orientation: 8,
    },
  },
  {
    id: 'path_data',
    name: 'Data & Intelligence Path',
    internalLabel: 'Data Science/AI',
    category: 'Pattern Discovery',
    description: 'For those fascinated by patterns in data, building intelligent systems, and deriving insights from information.',
    eligibleAfter: ['12th_science'],
    streamRequirement: ['PCM', 'PCMB'],
    educationPath: ['Foundation Degree', 'Specialization in Data/AI', 'Advanced Studies'],
    entranceExams: ['Entrance Exams', 'University Admissions'],
    skills: ['Mathematics', 'Statistics', 'Programming', 'Analytical Thinking'],
    salaryRange: '₹6-35 LPA (entry)',
    growthOutlook: 'Very High',
    workEnvironment: 'Tech companies, startups, research labs, consulting',
    typicalDay: 'Analyzing data, building models, finding patterns, presenting insights',
    icon: '🤖',
    color: 'from-success to-primary',
    traitWeights: {
      analytical_reasoning: 0.35,
      system_thinking: 0.2,
      learning_depth_tolerance: 0.2,
      precision_orientation: 0.15,
      creative_expression: 0.1,
    },
    minimumThresholds: {
      analytical_reasoning: 12,
    },
  },
  {
    id: 'path_design',
    name: 'Design & Innovation Path',
    internalLabel: 'Design/Product',
    category: 'Creative Solutions',
    description: 'For those who blend creativity with technical thinking to create user-focused, innovative solutions.',
    eligibleAfter: ['12th_science'],
    streamRequirement: ['PCM', 'PCB', 'PCMB'],
    educationPath: ['Design Entrance', 'Design Degree', 'Portfolio Development'],
    entranceExams: ['Design Aptitude Tests', 'Portfolio Reviews'],
    skills: ['Creativity', 'Visual Thinking', 'User Empathy', 'Technical Skills'],
    salaryRange: '₹4-20 LPA (entry)',
    growthOutlook: 'High',
    workEnvironment: 'Design studios, tech companies, startups, agencies',
    typicalDay: 'Designing solutions, prototyping, user research, creative collaboration',
    icon: '✨',
    color: 'from-accent to-info',
    traitWeights: {
      creative_expression: 0.3,
      visual_thinking: 0.25,
      people_involvement: 0.15,
      execution_drive: 0.15,
      ambiguity_tolerance: 0.15,
    },
    minimumThresholds: {
      creative_expression: 10,
      visual_thinking: 8,
    },
  },
  {
    id: 'path_research',
    name: 'Research & Discovery Path',
    internalLabel: 'Research/Academia',
    category: 'Deep Knowledge',
    description: 'For those driven by curiosity, who want to push boundaries of knowledge and discover new things.',
    eligibleAfter: ['12th_science'],
    streamRequirement: ['PCM', 'PCB', 'PCMB'],
    educationPath: ['Undergraduate Degree', 'Masters', 'Doctoral Research'],
    entranceExams: ['Aptitude Tests', 'Research Fellowships'],
    skills: ['Research', 'Critical Thinking', 'Writing', 'Patience', 'Deep Analysis'],
    salaryRange: '₹4-15 LPA (initial)',
    growthOutlook: 'Stable',
    workEnvironment: 'Universities, research institutions, labs',
    typicalDay: 'Reading papers, conducting experiments, writing findings, teaching',
    icon: '🔬',
    color: 'from-info to-success',
    traitWeights: {
      learning_depth_tolerance: 0.35,
      analytical_reasoning: 0.25,
      precision_orientation: 0.2,
      ambiguity_tolerance: 0.1,
      planning_drive: 0.1,
    },
    minimumThresholds: {
      learning_depth_tolerance: 12,
    },
  },
];

// Career paths after 12th Commerce (labeled generically)
export const careersAfter12thCommerce: CareerPath[] = [
  {
    id: 'path_professional',
    name: 'Professional & Regulatory Path',
    internalLabel: 'CA/CS/CMA',
    category: 'Expertise & Compliance',
    description: 'For those who value precision, expertise, and working within complex regulatory frameworks.',
    eligibleAfter: ['12th_commerce'],
    educationPath: ['Foundation Exam', 'Intermediate', 'Final Qualification'],
    entranceExams: ['Foundation Exams', 'Professional Levels'],
    skills: ['Accounting', 'Analysis', 'Attention to Detail', 'Ethics', 'Compliance'],
    salaryRange: '₹7-30 LPA',
    growthOutlook: 'High',
    workEnvironment: 'Professional firms, corporate finance, consulting',
    typicalDay: 'Reviewing documents, ensuring compliance, advising clients, detailed analysis',
    icon: '📋',
    color: 'from-primary to-accent',
    traitWeights: {
      precision_orientation: 0.35,
      analytical_reasoning: 0.25,
      learning_depth_tolerance: 0.2,
      planning_drive: 0.1,
      risk_appetite: -0.1,
    },
    minimumThresholds: {
      precision_orientation: 12,
      learning_depth_tolerance: 10,
    },
  },
  {
    id: 'path_leadership',
    name: 'Business & Leadership Path',
    internalLabel: 'Management/MBA',
    category: 'Leading Teams',
    description: 'For those who enjoy leading teams, making strategic decisions, and driving organizational success.',
    eligibleAfter: ['12th_commerce'],
    educationPath: ['Undergraduate Degree', 'Work Experience', 'Management Program'],
    entranceExams: ['Management Aptitude Tests', 'Admission Tests'],
    skills: ['Leadership', 'Communication', 'Strategy', 'Decision Making', 'Teamwork'],
    salaryRange: '₹8-40 LPA (post program)',
    growthOutlook: 'High',
    workEnvironment: 'Corporate offices, consulting, startups',
    typicalDay: 'Leading meetings, making decisions, managing teams, strategizing growth',
    icon: '📈',
    color: 'from-warning to-destructive',
    traitWeights: {
      persuasion_influence: 0.3,
      people_involvement: 0.25,
      planning_drive: 0.2,
      execution_drive: 0.15,
      risk_appetite: 0.1,
    },
    minimumThresholds: {
      persuasion_influence: 10,
      people_involvement: 8,
    },
  },
  {
    id: 'path_communication',
    name: 'Market & Communication Path',
    internalLabel: 'Marketing/Media',
    category: 'Influence & Creativity',
    description: 'For those who enjoy creative communication, understanding audiences, and influencing perceptions.',
    eligibleAfter: ['12th_commerce'],
    educationPath: ['Undergraduate in Communication/Business', 'Specialization', 'Portfolio Building'],
    entranceExams: ['University Entrance', 'Aptitude Tests'],
    skills: ['Creativity', 'Communication', 'Consumer Psychology', 'Digital Tools'],
    salaryRange: '₹4-18 LPA',
    growthOutlook: 'High',
    workEnvironment: 'Agencies, corporate marketing, startups, freelance',
    typicalDay: 'Creating campaigns, analyzing audience data, collaborating with teams, pitching ideas',
    icon: '📣',
    color: 'from-info to-accent',
    traitWeights: {
      creative_expression: 0.3,
      persuasion_influence: 0.25,
      people_involvement: 0.2,
      visual_thinking: 0.15,
      risk_appetite: 0.1,
    },
    minimumThresholds: {
      creative_expression: 8,
      persuasion_influence: 10,
    },
  },
  {
    id: 'path_analysis',
    name: 'Finance & Analysis Path',
    internalLabel: 'Finance/Investment',
    category: 'Numbers & Risk',
    description: 'For those who enjoy analyzing markets, making data-driven decisions, and working with financial risk.',
    eligibleAfter: ['12th_commerce'],
    educationPath: ['Finance Degree', 'Professional Certifications', 'Specialization'],
    entranceExams: ['Certification Exams', 'Aptitude Tests'],
    skills: ['Financial Analysis', 'Market Understanding', 'Quantitative Skills', 'Risk Assessment'],
    salaryRange: '₹6-50 LPA',
    growthOutlook: 'Very High',
    workEnvironment: 'Financial institutions, investment firms, consulting',
    typicalDay: 'Analyzing data, building models, making recommendations, monitoring markets',
    icon: '💹',
    color: 'from-success to-primary',
    traitWeights: {
      analytical_reasoning: 0.3,
      risk_appetite: 0.25,
      precision_orientation: 0.2,
      planning_drive: 0.15,
      execution_drive: 0.1,
    },
    minimumThresholds: {
      analytical_reasoning: 10,
      risk_appetite: 8,
    },
  },
];

// Get career paths based on completed class
export function getCareerPathsForClass(completedClass: CompletedClass): CareerPath[] {
  switch (completedClass) {
    case '10th':
      return careersAfter10th;
    case '12th_science':
      return careersAfter12thScience;
    case '12th_commerce':
      return careersAfter12thCommerce;
    default:
      return careersAfter10th;
  }
}

// Softmax function for probability distribution
function softmax(scores: number[], temperature: number = 1.0): number[] {
  const maxScore = Math.max(...scores);
  const expScores = scores.map(s => Math.exp((s - maxScore) / temperature));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  return expScores.map(e => e / sumExp);
}

// Calculate entropy for confidence estimation
function calculateEntropy(probabilities: number[]): number {
  return -probabilities.reduce((sum, p) => {
    if (p > 0) {
      return sum + p * Math.log2(p);
    }
    return sum;
  }, 0);
}

// Calculate career match scores using behavioral trait analysis
export function calculateCareerScores(
  traits: TraitDimensions,
  careers: CareerPath[]
): { career: CareerPath; score: number; confidence: number; reasons: string[] }[] {
  const results = careers.map(career => {
    let weightedScore = 0;
    let totalWeight = 0;
    const reasons: string[] = [];
    let meetsThresholds = true;

    // Check minimum thresholds
    if (career.minimumThresholds) {
      for (const [trait, threshold] of Object.entries(career.minimumThresholds)) {
        const traitValue = traits[trait as keyof TraitDimensions] || 0;
        if (traitValue < (threshold || 0)) {
          meetsThresholds = false;
          break;
        }
      }
    }

    // Calculate weighted score based on trait weights
    for (const [trait, weight] of Object.entries(career.traitWeights)) {
      if (weight === undefined) continue;
      const traitValue = traits[trait as keyof TraitDimensions] || 0;
      const normalizedValue = traitValue / 20; // Normalize to 0-1 range
      weightedScore += normalizedValue * weight;
      totalWeight += Math.abs(weight);

      // Generate behavioral reasons for high-scoring traits
      if (traitValue > 12 && weight > 0.2) {
        const traitDescriptions: Record<string, string> = {
          analytical_reasoning: 'strong analytical thinking',
          system_thinking: 'systems-oriented mindset',
          people_involvement: 'people-focused approach',
          persuasion_influence: 'natural influencing ability',
          creative_expression: 'creative thinking style',
          visual_thinking: 'visual-spatial strengths',
          precision_orientation: 'attention to precision',
          risk_appetite: 'comfort with calculated risks',
          learning_depth_tolerance: 'deep learning preference',
          ambiguity_tolerance: 'adaptability to uncertainty',
          execution_drive: 'action-oriented nature',
          planning_drive: 'strategic planning ability',
        };
        if (traitDescriptions[trait]) {
          reasons.push(`Your ${traitDescriptions[trait]}`);
        }
      }
    }

    // Normalize score
    const normalizedScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    
    // Apply threshold penalty (but don't disqualify)
    const finalScore = meetsThresholds ? normalizedScore : normalizedScore * 0.7;

    return {
      career,
      score: finalScore,
      rawScore: finalScore,
      meetsThresholds,
      reasons: reasons.length > 0 ? reasons : ['Aligns with your behavioral profile'],
    };
  });

  // Apply softmax for probability-like distribution
  const rawScores = results.map(r => r.rawScore);
  const probabilities = softmax(rawScores, 0.5);
  
  // Calculate confidence from entropy
  const entropy = calculateEntropy(probabilities);
  const maxEntropy = Math.log2(probabilities.length);
  const baseConfidence = 1 - (entropy / maxEntropy);

  // Combine with softmax probabilities for final ranking
  const finalResults = results.map((r, i) => ({
    career: r.career,
    score: Math.round(probabilities[i] * 100),
    confidence: Math.round((baseConfidence + (r.meetsThresholds ? 0.1 : -0.1)) * 100) / 100,
    reasons: r.reasons,
  }));

  // Sort by score descending
  return finalResults.sort((a, b) => b.score - a.score);
}

// Get trait profile summary for display
export function getTraitProfileSummary(traits: TraitDimensions): {
  dominant: string[];
  secondary: string[];
  workStyle: string;
  learningStyle: string;
} {
  const traitEntries = Object.entries(traits) as [keyof TraitDimensions, number][];
  const sorted = traitEntries.sort(([, a], [, b]) => b - a);
  
  const traitLabels: Record<keyof TraitDimensions, string> = {
    analytical_reasoning: 'Analytical Thinking',
    system_thinking: 'Systems Thinking',
    people_involvement: 'People-Oriented',
    persuasion_influence: 'Influential',
    creative_expression: 'Creative',
    visual_thinking: 'Visual Thinker',
    precision_orientation: 'Detail-Focused',
    risk_appetite: 'Risk-Comfortable',
    learning_depth_tolerance: 'Deep Learner',
    ambiguity_tolerance: 'Adaptable',
    execution_drive: 'Action-Oriented',
    planning_drive: 'Strategic Planner',
  };

  const dominant = sorted.slice(0, 3).map(([k]) => traitLabels[k]);
  const secondary = sorted.slice(3, 6).map(([k]) => traitLabels[k]);

  // Determine work style
  let workStyle = 'Balanced';
  if (traits.people_involvement > 15) workStyle = 'Collaborative';
  else if (traits.analytical_reasoning > 15) workStyle = 'Independent & Analytical';
  else if (traits.execution_drive > 15) workStyle = 'Action-Oriented';
  else if (traits.creative_expression > 15) workStyle = 'Creative & Explorative';

  // Determine learning style
  let learningStyle = 'Adaptive';
  if (traits.learning_depth_tolerance > 15) learningStyle = 'Deep & Conceptual';
  else if (traits.visual_thinking > 12) learningStyle = 'Visual & Hands-on';
  else if (traits.people_involvement > 12) learningStyle = 'Collaborative & Discussion-based';
  else if (traits.execution_drive > 12) learningStyle = 'Experiential & Practical';

  return { dominant, secondary, workStyle, learningStyle };
}
