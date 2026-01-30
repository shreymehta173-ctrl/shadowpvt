// PrepMate by Team Shadow - Career Groups and Recommendation Logic
// Career paths based on the 10-dimension scoring model

import { ScoreDimensions, CompletedClass } from './assessmentQuestions';

export interface CareerPath {
  id: string;
  name: string;
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
  icon: string;
  color: string;
  // Weights for each dimension (used in scoring)
  dimensionWeights: Partial<ScoreDimensions>;
  // Minimum thresholds for eligibility
  minimumThresholds?: Partial<ScoreDimensions>;
}

// Career paths after 10th
export const careersAfter10th: CareerPath[] = [
  {
    id: 'science_stream',
    name: 'Science Stream (11th-12th)',
    category: 'Academic Path',
    description: 'Foundation for Engineering, Medical, Research, and Technology careers. Requires strong analytical and mathematical abilities.',
    eligibleAfter: ['10th'],
    educationPath: ['11th Science', '12th Science (PCM/PCB/PCMB)', 'Professional Degree'],
    skills: ['Mathematics', 'Analytical Thinking', 'Problem Solving', 'Scientific Reasoning'],
    salaryRange: 'Depends on specialization',
    growthOutlook: 'Very High',
    workEnvironment: 'Labs, Tech Companies, Hospitals, Research Centers',
    icon: '🔬',
    color: 'from-blue-500 to-cyan-500',
    dimensionWeights: {
      technical_orientation: 0.25,
      data_orientation: 0.2,
      biological_orientation: 0.15,
      exam_tolerance: 0.2,
      pressure_tolerance: 0.2,
    },
    minimumThresholds: {
      exam_tolerance: 8,
    },
  },
  {
    id: 'commerce_stream',
    name: 'Commerce Stream (11th-12th)',
    category: 'Academic Path',
    description: 'Foundation for Business, Finance, Accounting, and Management careers. Focus on economics and business studies.',
    eligibleAfter: ['10th'],
    educationPath: ['11th Commerce', '12th Commerce', 'B.Com / BBA / Professional Courses'],
    skills: ['Business Acumen', 'Numerical Ability', 'Communication', 'Organization'],
    salaryRange: 'Depends on specialization',
    growthOutlook: 'High',
    workEnvironment: 'Offices, Banks, Financial Institutions, Startups',
    icon: '📊',
    color: 'from-amber-500 to-orange-500',
    dimensionWeights: {
      business_orientation: 0.3,
      financial_orientation: 0.3,
      social_orientation: 0.15,
      pressure_tolerance: 0.15,
      exam_tolerance: 0.1,
    },
  },
  {
    id: 'arts_stream',
    name: 'Arts / Humanities Stream',
    category: 'Academic Path',
    description: 'Foundation for Law, Journalism, Psychology, Civil Services, Creative Arts, and Social Sciences.',
    eligibleAfter: ['10th'],
    educationPath: ['11th Arts', '12th Arts', 'BA / Professional Courses'],
    skills: ['Communication', 'Creativity', 'Critical Thinking', 'Empathy'],
    salaryRange: 'Depends on specialization',
    growthOutlook: 'Moderate',
    workEnvironment: 'Media, NGOs, Government, Creative Studios, Educational Institutions',
    icon: '🎨',
    color: 'from-purple-500 to-pink-500',
    dimensionWeights: {
      creative_orientation: 0.3,
      social_orientation: 0.3,
      data_orientation: 0.1,
      pressure_tolerance: 0.1,
      exam_tolerance: 0.2,
    },
  },
  {
    id: 'diploma_vocational',
    name: 'Diploma / Vocational Training',
    category: 'Skill-Based Path',
    description: 'Direct entry into skilled professions. Shorter duration, practical training, and faster employment.',
    eligibleAfter: ['10th'],
    educationPath: ['Polytechnic Diploma', 'ITI', 'Skill Development Programs'],
    entranceExams: ['Polytechnic Entrance', 'ITI Admission'],
    skills: ['Technical Skills', 'Hands-on Work', 'Practical Problem Solving'],
    salaryRange: '₹2-8 LPA',
    growthOutlook: 'Stable',
    workEnvironment: 'Workshops, Factories, Field Work, Technical Services',
    icon: '🔧',
    color: 'from-slate-500 to-zinc-600',
    dimensionWeights: {
      hands_on_orientation: 0.4,
      technical_orientation: 0.3,
      pressure_tolerance: -0.1,
      exam_tolerance: -0.2,
    },
  },
];

// Career paths after 12th Science
export const careersAfter12thScience: CareerPath[] = [
  {
    id: 'engineering',
    name: 'Engineering (B.Tech / B.E)',
    category: 'Technology',
    description: 'Design, build, and innovate technology solutions. Multiple specializations from Computer Science to Civil Engineering.',
    eligibleAfter: ['12th_science'],
    streamRequirement: ['PCM', 'PCMB'],
    educationPath: ['12th PCM', 'JEE Main/Advanced', 'B.Tech (4 years)', 'M.Tech (optional)'],
    entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs'],
    skills: ['Problem Solving', 'Mathematics', 'Logical Thinking', 'Technical Skills'],
    salaryRange: '₹4-25 LPA (entry)',
    growthOutlook: 'Very High',
    workEnvironment: 'Tech Companies, Manufacturing, Construction, R&D Labs',
    icon: '⚙️',
    color: 'from-blue-600 to-indigo-600',
    dimensionWeights: {
      technical_orientation: 0.35,
      data_orientation: 0.2,
      hands_on_orientation: 0.15,
      exam_tolerance: 0.15,
      pressure_tolerance: 0.15,
    },
    minimumThresholds: {
      technical_orientation: 10,
      exam_tolerance: 8,
    },
  },
  {
    id: 'medical',
    name: 'Medical / Healthcare (MBBS)',
    category: 'Healthcare',
    description: 'Become a doctor, surgeon, or healthcare specialist. Long but rewarding journey to serve humanity.',
    eligibleAfter: ['12th_science'],
    streamRequirement: ['PCB', 'PCMB'],
    educationPath: ['12th PCB', 'NEET UG', 'MBBS (5.5 years)', 'PG Specialization'],
    entranceExams: ['NEET UG', 'AIIMS (merged with NEET)', 'JIPMER'],
    skills: ['Biology', 'Patience', 'Empathy', 'Attention to Detail', 'Communication'],
    salaryRange: '₹5-30 LPA (after PG)',
    growthOutlook: 'High',
    workEnvironment: 'Hospitals, Clinics, Research Labs, Public Health',
    icon: '🏥',
    color: 'from-red-500 to-rose-600',
    dimensionWeights: {
      biological_orientation: 0.35,
      social_orientation: 0.2,
      pressure_tolerance: 0.2,
      exam_tolerance: 0.15,
      data_orientation: 0.1,
    },
    minimumThresholds: {
      biological_orientation: 12,
      exam_tolerance: 10,
      pressure_tolerance: 8,
    },
  },
  {
    id: 'data_ai',
    name: 'Data Science / AI / ML',
    category: 'Technology',
    description: 'Analyze data patterns and build intelligent systems. One of the fastest-growing career fields globally.',
    eligibleAfter: ['12th_science'],
    streamRequirement: ['PCM', 'PCMB'],
    educationPath: ['12th PCM', 'B.Tech/B.Sc', 'Specialization in AI/ML/Data Science'],
    entranceExams: ['JEE', 'CUET', 'University Entrance'],
    skills: ['Mathematics', 'Statistics', 'Programming', 'Analytical Thinking'],
    salaryRange: '₹6-35 LPA (entry)',
    growthOutlook: 'Very High',
    workEnvironment: 'Tech Companies, Startups, Research Labs, Consulting',
    icon: '🤖',
    color: 'from-emerald-500 to-teal-600',
    dimensionWeights: {
      data_orientation: 0.35,
      technical_orientation: 0.25,
      pressure_tolerance: 0.15,
      exam_tolerance: 0.15,
      creative_orientation: 0.1,
    },
    minimumThresholds: {
      data_orientation: 10,
    },
  },
  {
    id: 'design_innovation',
    name: 'Design / Innovation',
    category: 'Creative Tech',
    description: 'Create user experiences, products, and innovative solutions. Blend of creativity and technology.',
    eligibleAfter: ['12th_science'],
    streamRequirement: ['PCM', 'PCB', 'PCMB'],
    educationPath: ['12th Science', 'B.Des/B.Tech Design', 'Portfolio Development'],
    entranceExams: ['UCEED', 'NID DAT', 'NIFT', 'CEED'],
    skills: ['Creativity', 'Visual Thinking', 'User Empathy', 'Technical Skills'],
    salaryRange: '₹4-20 LPA (entry)',
    growthOutlook: 'High',
    workEnvironment: 'Design Studios, Tech Companies, Startups, Agencies',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    dimensionWeights: {
      creative_orientation: 0.35,
      technical_orientation: 0.2,
      social_orientation: 0.15,
      data_orientation: 0.15,
      hands_on_orientation: 0.15,
    },
    minimumThresholds: {
      creative_orientation: 10,
    },
  },
  {
    id: 'research_academia',
    name: 'Research / Academia',
    category: 'Science',
    description: 'Pursue scientific research, discover new knowledge, and contribute to academia.',
    eligibleAfter: ['12th_science'],
    streamRequirement: ['PCM', 'PCB', 'PCMB'],
    educationPath: ['BSc/BTech', 'MSc', 'PhD', 'Postdoctoral Research'],
    entranceExams: ['NEST', 'JAM', 'NET', 'GATE'],
    skills: ['Research', 'Critical Thinking', 'Writing', 'Patience', 'Analysis'],
    salaryRange: '₹4-15 LPA (initial)',
    growthOutlook: 'Stable',
    workEnvironment: 'Universities, Research Institutions, Labs',
    icon: '🔬',
    color: 'from-cyan-500 to-blue-500',
    dimensionWeights: {
      data_orientation: 0.25,
      technical_orientation: 0.2,
      biological_orientation: 0.15,
      exam_tolerance: 0.2,
      pressure_tolerance: 0.2,
    },
    minimumThresholds: {
      exam_tolerance: 10,
    },
  },
];

// Career paths after 12th Commerce
export const careersAfter12thCommerce: CareerPath[] = [
  {
    id: 'ca_cs_cma',
    name: 'CA / CS / CMA',
    category: 'Professional Accounting',
    description: 'Chartered Accountant, Company Secretary, or Cost & Management Accountant. Highly respected professional qualifications.',
    eligibleAfter: ['12th_commerce'],
    educationPath: ['12th Commerce', 'Foundation/CPT', 'Intermediate', 'Final'],
    entranceExams: ['CA Foundation', 'CS Foundation', 'CMA Foundation'],
    skills: ['Accounting', 'Analysis', 'Attention to Detail', 'Ethics', 'Compliance'],
    salaryRange: '₹7-30 LPA',
    growthOutlook: 'High',
    workEnvironment: 'Audit Firms, Corporate Finance, Consulting',
    icon: '📋',
    color: 'from-blue-600 to-indigo-600',
    dimensionWeights: {
      financial_orientation: 0.35,
      pressure_tolerance: 0.2,
      exam_tolerance: 0.25,
      data_orientation: 0.1,
      business_orientation: 0.1,
    },
    minimumThresholds: {
      financial_orientation: 12,
      exam_tolerance: 12,
      pressure_tolerance: 8,
    },
  },
  {
    id: 'management_mba',
    name: 'Business Management / MBA',
    category: 'Management',
    description: 'Lead teams, manage operations, and drive business strategy. Gateway to corporate leadership.',
    eligibleAfter: ['12th_commerce'],
    educationPath: ['12th Commerce', 'BBA/B.Com', 'Work Experience', 'MBA'],
    entranceExams: ['CAT', 'XAT', 'SNAP', 'NMAT', 'IPMAT (for integrated)'],
    skills: ['Leadership', 'Communication', 'Strategy', 'Decision Making', 'Teamwork'],
    salaryRange: '₹8-40 LPA (post MBA)',
    growthOutlook: 'High',
    workEnvironment: 'Corporate Offices, Consulting, Startups',
    icon: '📈',
    color: 'from-amber-500 to-orange-500',
    dimensionWeights: {
      business_orientation: 0.35,
      social_orientation: 0.25,
      pressure_tolerance: 0.15,
      financial_orientation: 0.15,
      creative_orientation: 0.1,
    },
    minimumThresholds: {
      business_orientation: 10,
      social_orientation: 8,
    },
  },
  {
    id: 'marketing_media',
    name: 'Marketing / Digital Media',
    category: 'Creative Business',
    description: 'Create campaigns, build brands, and influence consumer behavior. Dynamic and creative field.',
    eligibleAfter: ['12th_commerce'],
    educationPath: ['12th Commerce', 'BBA Marketing/Mass Communication', 'MBA Marketing'],
    entranceExams: ['CUET', 'University Entrance', 'IPM'],
    skills: ['Creativity', 'Communication', 'Consumer Psychology', 'Digital Tools'],
    salaryRange: '₹4-18 LPA',
    growthOutlook: 'High',
    workEnvironment: 'Agencies, Corporate Marketing, Startups, Freelance',
    icon: '📣',
    color: 'from-pink-500 to-purple-500',
    dimensionWeights: {
      creative_orientation: 0.3,
      social_orientation: 0.3,
      business_orientation: 0.2,
      data_orientation: 0.1,
      pressure_tolerance: 0.1,
    },
    minimumThresholds: {
      creative_orientation: 8,
      social_orientation: 10,
    },
  },
  {
    id: 'finance_investment',
    name: 'Finance / Investment Banking',
    category: 'Finance',
    description: 'Analyze markets, manage investments, and provide financial advisory. High-stakes, high-reward career.',
    eligibleAfter: ['12th_commerce'],
    educationPath: ['12th Commerce', 'B.Com/BBA Finance', 'CFA/FRM', 'MBA Finance'],
    entranceExams: ['CFA', 'FRM', 'MBA Entrance'],
    skills: ['Financial Analysis', 'Market Understanding', 'Quantitative Skills', 'Risk Assessment'],
    salaryRange: '₹6-50 LPA',
    growthOutlook: 'Very High',
    workEnvironment: 'Banks, Investment Firms, Hedge Funds, Consulting',
    icon: '💹',
    color: 'from-green-500 to-emerald-600',
    dimensionWeights: {
      financial_orientation: 0.3,
      data_orientation: 0.25,
      business_orientation: 0.2,
      pressure_tolerance: 0.15,
      exam_tolerance: 0.1,
    },
    minimumThresholds: {
      financial_orientation: 10,
      data_orientation: 8,
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
function softmax(scores: number[]): number[] {
  const maxScore = Math.max(...scores);
  const expScores = scores.map(s => Math.exp(s - maxScore));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  return expScores.map(e => e / sumExp);
}

// Calculate career match scores using weighted aggregation
export function calculateCareerScores(
  dimensions: ScoreDimensions,
  careers: CareerPath[]
): { career: CareerPath; score: number; confidence: number; reasons: string[] }[] {
  const results = careers.map(career => {
    let weightedScore = 0;
    let totalWeight = 0;
    const reasons: string[] = [];
    let meetsThresholds = true;

    // Check minimum thresholds
    if (career.minimumThresholds) {
      for (const [dim, threshold] of Object.entries(career.minimumThresholds)) {
        const dimValue = dimensions[dim as keyof ScoreDimensions] || 0;
        if (dimValue < (threshold || 0)) {
          meetsThresholds = false;
          break;
        }
      }
    }

    // Calculate weighted score
    for (const [dim, weight] of Object.entries(career.dimensionWeights)) {
      if (weight === undefined) continue;
      const dimValue = dimensions[dim as keyof ScoreDimensions] || 0;
      const normalizedValue = dimValue / 15; // Normalize to 0-1 range (max possible ~15)
      weightedScore += normalizedValue * weight;
      totalWeight += Math.abs(weight);

      // Generate reasons for high-scoring dimensions
      if (dimValue > 10 && weight > 0.2) {
        const dimNames: Record<string, string> = {
          technical_orientation: 'strong technical aptitude',
          biological_orientation: 'interest in life sciences',
          data_orientation: 'analytical mindset',
          creative_orientation: 'creative thinking',
          business_orientation: 'business acumen',
          financial_orientation: 'financial aptitude',
          social_orientation: 'people skills',
          hands_on_orientation: 'practical abilities',
          pressure_tolerance: 'stress resilience',
          exam_tolerance: 'exam readiness',
        };
        if (dimNames[dim]) {
          reasons.push(`Your ${dimNames[dim]}`);
        }
      }
    }

    // Normalize score
    const normalizedScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    
    // Apply threshold penalty
    const finalScore = meetsThresholds ? normalizedScore : normalizedScore * 0.6;

    return {
      career,
      score: finalScore,
      confidence: meetsThresholds ? 1 : 0.6,
      reasons: reasons.length > 0 ? reasons : ['Matches your overall profile'],
    };
  });

  // Apply softmax for probability-like distribution
  const scores = results.map(r => r.score);
  const probabilities = softmax(scores);

  // Combine with softmax probabilities for final ranking
  const finalResults = results.map((r, i) => ({
    ...r,
    score: Math.round(probabilities[i] * 100),
  }));

  // Sort by score descending
  return finalResults.sort((a, b) => b.score - a.score);
}
