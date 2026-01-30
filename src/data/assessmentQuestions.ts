// PrepMate by Team Shadow - Career Assessment Question Sets
// Three assessment sets tailored to the Indian education system

export type CompletedClass = '10th' | '12th_science' | '12th_commerce';
export type Stream12th = 'PCM' | 'PCB' | 'PCMB' | null;

export interface ScoreDimensions {
  technical_orientation: number;
  biological_orientation: number;
  data_orientation: number;
  creative_orientation: number;
  business_orientation: number;
  financial_orientation: number;
  social_orientation: number;
  hands_on_orientation: number;
  pressure_tolerance: number;
  exam_tolerance: number;
}

export interface AssessmentOption {
  value: string;
  label: string;
  scores: Partial<ScoreDimensions>;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: AssessmentOption[];
}

// SET-A: After 10th Standard
export const questionsAfter10th: AssessmentQuestion[] = [
  {
    id: 'q1',
    question: 'Which activity gives you the most satisfaction?',
    options: [
      { value: 'A', label: 'Solving logical or numerical problems', scores: { technical_orientation: 2, data_orientation: 2 } },
      { value: 'B', label: 'Organising money, accounts or business ideas', scores: { business_orientation: 2, financial_orientation: 2 } },
      { value: 'C', label: 'Creating or expressing ideas (design, writing, media, art)', scores: { creative_orientation: 3, social_orientation: 1 } },
      { value: 'D', label: 'Building, repairing or operating machines or tools', scores: { hands_on_orientation: 3, technical_orientation: 1 } },
    ],
  },
  {
    id: 'q2',
    question: 'Which subject feels easiest for you to understand?',
    options: [
      { value: 'A', label: 'Mathematics', scores: { technical_orientation: 2, data_orientation: 2 } },
      { value: 'B', label: 'Economics / business related topics', scores: { business_orientation: 2, financial_orientation: 2 } },
      { value: 'C', label: 'Languages / social sciences', scores: { creative_orientation: 2, social_orientation: 2 } },
      { value: 'D', label: 'Practical or technical subjects', scores: { hands_on_orientation: 2, technical_orientation: 2 } },
    ],
  },
  {
    id: 'q3',
    question: 'How do you usually prefer to learn?',
    options: [
      { value: 'A', label: 'Through theory and problem solving', scores: { technical_orientation: 2, data_orientation: 1, exam_tolerance: 1 } },
      { value: 'B', label: 'Through case studies and real-world examples', scores: { business_orientation: 2, financial_orientation: 1 } },
      { value: 'C', label: 'Through discussion and reading', scores: { social_orientation: 2, creative_orientation: 1 } },
      { value: 'D', label: 'Through hands-on practice', scores: { hands_on_orientation: 3 } },
    ],
  },
  {
    id: 'q4',
    question: 'Which environment would you enjoy most?',
    options: [
      { value: 'A', label: 'Lab, research or technical environment', scores: { technical_orientation: 2, biological_orientation: 1, data_orientation: 1 } },
      { value: 'B', label: 'Office, business or finance environment', scores: { business_orientation: 2, financial_orientation: 2 } },
      { value: 'C', label: 'Creative or social environment', scores: { creative_orientation: 2, social_orientation: 2 } },
      { value: 'D', label: 'Workshop, field or production environment', scores: { hands_on_orientation: 3, technical_orientation: 1 } },
    ],
  },
  {
    id: 'q5',
    question: 'How comfortable are you with long academic preparation?',
    options: [
      { value: 'A', label: 'Very comfortable', scores: { exam_tolerance: 3, pressure_tolerance: 2 } },
      { value: 'B', label: 'Somewhat comfortable', scores: { exam_tolerance: 2, pressure_tolerance: 1 } },
      { value: 'C', label: 'Prefer moderate academic load', scores: { exam_tolerance: 1 } },
      { value: 'D', label: 'Prefer skill-based learning', scores: { hands_on_orientation: 2 } },
    ],
  },
  {
    id: 'q6',
    question: 'When working in a group, you mostly:',
    options: [
      { value: 'A', label: 'Solve difficult technical parts', scores: { technical_orientation: 2, data_orientation: 2 } },
      { value: 'B', label: 'Manage tasks and planning', scores: { business_orientation: 2, social_orientation: 1 } },
      { value: 'C', label: 'Generate ideas and communication', scores: { creative_orientation: 2, social_orientation: 2 } },
      { value: 'D', label: 'Handle execution and operations', scores: { hands_on_orientation: 2, pressure_tolerance: 1 } },
    ],
  },
  {
    id: 'q7',
    question: 'What motivates you more?',
    options: [
      { value: 'A', label: 'Solving complex problems', scores: { technical_orientation: 2, data_orientation: 2, pressure_tolerance: 1 } },
      { value: 'B', label: 'Making profit or managing resources', scores: { business_orientation: 2, financial_orientation: 2 } },
      { value: 'C', label: 'Expressing or influencing people', scores: { creative_orientation: 2, social_orientation: 2 } },
      { value: 'D', label: 'Producing something tangible', scores: { hands_on_orientation: 3 } },
    ],
  },
  {
    id: 'q8',
    question: 'How do you feel about competitive entrance exams?',
    options: [
      { value: 'A', label: 'I am ready for intense preparation', scores: { exam_tolerance: 3, pressure_tolerance: 3 } },
      { value: 'B', label: 'I can manage moderate competition', scores: { exam_tolerance: 2, pressure_tolerance: 1 } },
      { value: 'C', label: 'I prefer flexible admission routes', scores: { creative_orientation: 1 } },
      { value: 'D', label: 'I prefer direct skill-oriented programs', scores: { hands_on_orientation: 2 } },
    ],
  },
  {
    id: 'q9',
    question: 'Which best describes your thinking style?',
    options: [
      { value: 'A', label: 'Logical and analytical', scores: { technical_orientation: 2, data_orientation: 2 } },
      { value: 'B', label: 'Practical and strategic', scores: { business_orientation: 2, financial_orientation: 1 } },
      { value: 'C', label: 'Creative and expressive', scores: { creative_orientation: 3 } },
      { value: 'D', label: 'Mechanical and operational', scores: { hands_on_orientation: 2, technical_orientation: 1 } },
    ],
  },
  {
    id: 'q10',
    question: 'Which activity would you enjoy most for a long time?',
    options: [
      { value: 'A', label: 'Programming, research, calculations', scores: { technical_orientation: 2, data_orientation: 2 } },
      { value: 'B', label: 'Business analysis, finance, marketing', scores: { business_orientation: 2, financial_orientation: 2 } },
      { value: 'C', label: 'Content creation, writing, design', scores: { creative_orientation: 3, social_orientation: 1 } },
      { value: 'D', label: 'Technical or vocational work', scores: { hands_on_orientation: 3 } },
    ],
  },
  {
    id: 'q11',
    question: 'Which future lifestyle matters most to you?',
    options: [
      { value: 'A', label: 'Innovation and intellectual growth', scores: { technical_orientation: 2, data_orientation: 1, pressure_tolerance: 1 } },
      { value: 'B', label: 'Financial growth and leadership', scores: { business_orientation: 2, financial_orientation: 2 } },
      { value: 'C', label: 'Social impact and recognition', scores: { social_orientation: 3, creative_orientation: 1 } },
      { value: 'D', label: 'Stable skilled profession', scores: { hands_on_orientation: 2, pressure_tolerance: -1 } },
    ],
  },
  {
    id: 'q12',
    question: 'Which statement fits you best?',
    options: [
      { value: 'A', label: 'I enjoy complex abstract problems', scores: { technical_orientation: 2, data_orientation: 2 } },
      { value: 'B', label: 'I enjoy decision making and planning', scores: { business_orientation: 2, financial_orientation: 1 } },
      { value: 'C', label: 'I enjoy storytelling and communication', scores: { creative_orientation: 2, social_orientation: 2 } },
      { value: 'D', label: 'I enjoy physical or technical tasks', scores: { hands_on_orientation: 3 } },
    ],
  },
  {
    id: 'q13',
    question: 'Which risk level suits you?',
    options: [
      { value: 'A', label: 'High competition, high reward', scores: { pressure_tolerance: 3, exam_tolerance: 2 } },
      { value: 'B', label: 'Moderate risk with growth', scores: { business_orientation: 1, pressure_tolerance: 1 } },
      { value: 'C', label: 'Low risk, flexible path', scores: { creative_orientation: 1, social_orientation: 1 } },
      { value: 'D', label: 'Skill security and employability', scores: { hands_on_orientation: 2 } },
    ],
  },
  {
    id: 'q14',
    question: 'How important is creativity in your future work?',
    options: [
      { value: 'A', label: 'Not very important', scores: { technical_orientation: 1, data_orientation: 1 } },
      { value: 'B', label: 'Somewhat important', scores: { business_orientation: 1 } },
      { value: 'C', label: 'Very important', scores: { creative_orientation: 3, social_orientation: 1 } },
      { value: 'D', label: 'Only practical outcomes matter', scores: { hands_on_orientation: 2 } },
    ],
  },
  {
    id: 'q15',
    question: 'Which describes you best?',
    options: [
      { value: 'A', label: 'I enjoy technical depth', scores: { technical_orientation: 2, data_orientation: 2 } },
      { value: 'B', label: 'I enjoy managing people or money', scores: { business_orientation: 2, financial_orientation: 2 } },
      { value: 'C', label: 'I enjoy expressing ideas', scores: { creative_orientation: 2, social_orientation: 2 } },
      { value: 'D', label: 'I enjoy making things work', scores: { hands_on_orientation: 3, technical_orientation: 1 } },
    ],
  },
];

// SET-B: After 12th Science (PCM / PCB / PCMB)
export const questionsAfter12thScience: AssessmentQuestion[] = [
  {
    id: 'q1',
    question: 'Which type of problem excites you the most?',
    options: [
      { value: 'A', label: 'Engineering and system design problems', scores: { technical_orientation: 3, data_orientation: 1 } },
      { value: 'B', label: 'Biological or medical problems', scores: { biological_orientation: 3, social_orientation: 1 } },
      { value: 'C', label: 'Data, logic and algorithmic problems', scores: { data_orientation: 3, technical_orientation: 1 } },
      { value: 'D', label: 'Design and innovation problems', scores: { creative_orientation: 3, technical_orientation: 1 } },
    ],
  },
  {
    id: 'q2',
    question: 'Which academic activity do you enjoy most?',
    options: [
      { value: 'A', label: 'Applying physics and mathematics', scores: { technical_orientation: 2, data_orientation: 2 } },
      { value: 'B', label: 'Studying biological systems', scores: { biological_orientation: 3, social_orientation: 1 } },
      { value: 'C', label: 'Analysing data and models', scores: { data_orientation: 3, technical_orientation: 1 } },
      { value: 'D', label: 'Creating solutions visually or creatively', scores: { creative_orientation: 3 } },
    ],
  },
  {
    id: 'q3',
    question: 'Which environment suits you best?',
    options: [
      { value: 'A', label: 'Industry, engineering labs', scores: { technical_orientation: 2, hands_on_orientation: 2 } },
      { value: 'B', label: 'Hospitals, research labs', scores: { biological_orientation: 2, social_orientation: 2 } },
      { value: 'C', label: 'Tech companies or analytics teams', scores: { data_orientation: 2, technical_orientation: 2 } },
      { value: 'D', label: 'Design studios or innovation labs', scores: { creative_orientation: 2, technical_orientation: 1 } },
    ],
  },
  {
    id: 'q4',
    question: 'How do you handle long and stressful preparation?',
    options: [
      { value: 'A', label: 'I manage very well', scores: { pressure_tolerance: 3, exam_tolerance: 3 } },
      { value: 'B', label: 'I manage if the goal is meaningful', scores: { pressure_tolerance: 2, exam_tolerance: 2, social_orientation: 1 } },
      { value: 'C', label: 'I prefer practical learning', scores: { hands_on_orientation: 2, data_orientation: 1 } },
      { value: 'D', label: 'I prefer project-based learning', scores: { creative_orientation: 2, hands_on_orientation: 1 } },
    ],
  },
  {
    id: 'q5',
    question: 'Which skill do you want to master?',
    options: [
      { value: 'A', label: 'Systems and machines', scores: { technical_orientation: 3, hands_on_orientation: 1 } },
      { value: 'B', label: 'Human health and biology', scores: { biological_orientation: 3, social_orientation: 1 } },
      { value: 'C', label: 'Computing and analytics', scores: { data_orientation: 3, technical_orientation: 1 } },
      { value: 'D', label: 'Design and problem framing', scores: { creative_orientation: 3, data_orientation: 1 } },
    ],
  },
  {
    id: 'q6',
    question: 'Which describes you best?',
    options: [
      { value: 'A', label: 'Precise and structured', scores: { technical_orientation: 2, data_orientation: 1, pressure_tolerance: 1 } },
      { value: 'B', label: 'Caring and patient', scores: { biological_orientation: 1, social_orientation: 3 } },
      { value: 'C', label: 'Curious and analytical', scores: { data_orientation: 2, technical_orientation: 1 } },
      { value: 'D', label: 'Innovative and flexible', scores: { creative_orientation: 2, business_orientation: 1 } },
    ],
  },
  {
    id: 'q7',
    question: 'Which professional role sounds attractive?',
    options: [
      { value: 'A', label: 'Engineer', scores: { technical_orientation: 3, hands_on_orientation: 1 } },
      { value: 'B', label: 'Doctor / researcher', scores: { biological_orientation: 3, social_orientation: 1 } },
      { value: 'C', label: 'Data scientist / software professional', scores: { data_orientation: 3, technical_orientation: 1 } },
      { value: 'D', label: 'Product / design professional', scores: { creative_orientation: 2, business_orientation: 1, technical_orientation: 1 } },
    ],
  },
  {
    id: 'q8',
    question: 'How important is social interaction in your work?',
    options: [
      { value: 'A', label: 'Low', scores: { technical_orientation: 2, data_orientation: 1 } },
      { value: 'B', label: 'High', scores: { social_orientation: 3, biological_orientation: 1 } },
      { value: 'C', label: 'Moderate', scores: { data_orientation: 1, business_orientation: 1 } },
      { value: 'D', label: 'Balanced', scores: { creative_orientation: 1, social_orientation: 1, technical_orientation: 1 } },
    ],
  },
  {
    id: 'q9',
    question: 'Which challenge would you enjoy?',
    options: [
      { value: 'A', label: 'Building complex technical systems', scores: { technical_orientation: 3, hands_on_orientation: 1 } },
      { value: 'B', label: 'Solving health related issues', scores: { biological_orientation: 3, social_orientation: 1 } },
      { value: 'C', label: 'Finding patterns in data', scores: { data_orientation: 3 } },
      { value: 'D', label: 'Creating user-focused solutions', scores: { creative_orientation: 2, social_orientation: 1, technical_orientation: 1 } },
    ],
  },
  {
    id: 'q10',
    question: 'Which learning style fits you best?',
    options: [
      { value: 'A', label: 'Deep technical learning', scores: { technical_orientation: 2, pressure_tolerance: 1, exam_tolerance: 1 } },
      { value: 'B', label: 'Conceptual and biological learning', scores: { biological_orientation: 2, exam_tolerance: 2 } },
      { value: 'C', label: 'Mathematical and logical learning', scores: { data_orientation: 2, technical_orientation: 1 } },
      { value: 'D', label: 'Visual and creative learning', scores: { creative_orientation: 3 } },
    ],
  },
  {
    id: 'q11',
    question: 'Which long-term goal appeals to you?',
    options: [
      { value: 'A', label: 'Technological innovation', scores: { technical_orientation: 2, data_orientation: 1, hands_on_orientation: 1 } },
      { value: 'B', label: 'Healthcare contribution', scores: { biological_orientation: 2, social_orientation: 2 } },
      { value: 'C', label: 'Intelligent systems and automation', scores: { data_orientation: 3, technical_orientation: 1 } },
      { value: 'D', label: 'Creative technology and products', scores: { creative_orientation: 2, technical_orientation: 1, business_orientation: 1 } },
    ],
  },
  {
    id: 'q12',
    question: 'Which pressure level suits you?',
    options: [
      { value: 'A', label: 'High and competitive', scores: { pressure_tolerance: 3, exam_tolerance: 2, technical_orientation: 1 } },
      { value: 'B', label: 'High and emotionally demanding', scores: { pressure_tolerance: 2, social_orientation: 2, biological_orientation: 1 } },
      { value: 'C', label: 'Moderate and intellectually demanding', scores: { data_orientation: 1, pressure_tolerance: 1 } },
      { value: 'D', label: 'Flexible and project-oriented', scores: { creative_orientation: 2, hands_on_orientation: 1 } },
    ],
  },
  {
    id: 'q13',
    question: 'Which work outcome motivates you most?',
    options: [
      { value: 'A', label: 'Functional systems', scores: { technical_orientation: 2, hands_on_orientation: 2 } },
      { value: 'B', label: 'Improved human health', scores: { biological_orientation: 2, social_orientation: 2 } },
      { value: 'C', label: 'Better decision making', scores: { data_orientation: 2, business_orientation: 1 } },
      { value: 'D', label: 'Better user experience', scores: { creative_orientation: 2, social_orientation: 1 } },
    ],
  },
  {
    id: 'q14',
    question: 'Which future learning path suits you?',
    options: [
      { value: 'A', label: 'Engineering specialisation', scores: { technical_orientation: 2, exam_tolerance: 2 } },
      { value: 'B', label: 'Medical or life science research', scores: { biological_orientation: 2, exam_tolerance: 2, pressure_tolerance: 1 } },
      { value: 'C', label: 'AI, analytics and computing', scores: { data_orientation: 2, technical_orientation: 1 } },
      { value: 'D', label: 'Design and innovation', scores: { creative_orientation: 2, business_orientation: 1 } },
    ],
  },
  {
    id: 'q15',
    question: 'Which identity fits you best?',
    options: [
      { value: 'A', label: 'Technical expert', scores: { technical_orientation: 3, hands_on_orientation: 1 } },
      { value: 'B', label: 'Health professional', scores: { biological_orientation: 2, social_orientation: 2 } },
      { value: 'C', label: 'Data and computing professional', scores: { data_orientation: 3, technical_orientation: 1 } },
      { value: 'D', label: 'Creative technologist', scores: { creative_orientation: 2, technical_orientation: 1, business_orientation: 1 } },
    ],
  },
];

// SET-C: After 12th Commerce
export const questionsAfter12thCommerce: AssessmentQuestion[] = [
  {
    id: 'q1',
    question: 'Which type of work interests you most?',
    options: [
      { value: 'A', label: 'Accounting, auditing and compliance', scores: { financial_orientation: 3, pressure_tolerance: 2 } },
      { value: 'B', label: 'Business strategy and management', scores: { business_orientation: 3, social_orientation: 1 } },
      { value: 'C', label: 'Marketing, branding and sales', scores: { creative_orientation: 2, social_orientation: 2, business_orientation: 1 } },
      { value: 'D', label: 'Financial analysis and investments', scores: { financial_orientation: 2, data_orientation: 2, business_orientation: 1 } },
    ],
  },
  {
    id: 'q2',
    question: 'Which subject area do you enjoy most?',
    options: [
      { value: 'A', label: 'Accounts and taxation', scores: { financial_orientation: 3, pressure_tolerance: 1 } },
      { value: 'B', label: 'Business studies and management', scores: { business_orientation: 3, social_orientation: 1 } },
      { value: 'C', label: 'Communication and consumer behaviour', scores: { social_orientation: 2, creative_orientation: 2 } },
      { value: 'D', label: 'Economics and finance', scores: { financial_orientation: 2, data_orientation: 2 } },
    ],
  },
  {
    id: 'q3',
    question: 'Which activity sounds most engaging?',
    options: [
      { value: 'A', label: 'Preparing financial reports', scores: { financial_orientation: 3, data_orientation: 1 } },
      { value: 'B', label: 'Managing teams or projects', scores: { business_orientation: 2, social_orientation: 2 } },
      { value: 'C', label: 'Creating campaigns and content', scores: { creative_orientation: 3, social_orientation: 1 } },
      { value: 'D', label: 'Analysing markets and trends', scores: { data_orientation: 2, financial_orientation: 2 } },
    ],
  },
  {
    id: 'q4',
    question: 'Which role suits your personality?',
    options: [
      { value: 'A', label: 'Detail-oriented professional', scores: { financial_orientation: 2, pressure_tolerance: 2 } },
      { value: 'B', label: 'Leader and coordinator', scores: { business_orientation: 2, social_orientation: 2 } },
      { value: 'C', label: 'Influencer and communicator', scores: { social_orientation: 3, creative_orientation: 1 } },
      { value: 'D', label: 'Analyst and strategist', scores: { data_orientation: 2, financial_orientation: 1, business_orientation: 1 } },
    ],
  },
  {
    id: 'q5',
    question: 'Which pressure suits you best?',
    options: [
      { value: 'A', label: 'Regulatory and compliance pressure', scores: { financial_orientation: 2, pressure_tolerance: 2, exam_tolerance: 1 } },
      { value: 'B', label: 'Team and delivery pressure', scores: { business_orientation: 2, social_orientation: 1, pressure_tolerance: 1 } },
      { value: 'C', label: 'Sales and performance pressure', scores: { social_orientation: 2, business_orientation: 1, pressure_tolerance: 2 } },
      { value: 'D', label: 'Financial decision pressure', scores: { financial_orientation: 2, data_orientation: 1, pressure_tolerance: 2 } },
    ],
  },
  {
    id: 'q6',
    question: 'Which skill do you want to master?',
    options: [
      { value: 'A', label: 'Accounting and reporting', scores: { financial_orientation: 3, data_orientation: 1 } },
      { value: 'B', label: 'Management and operations', scores: { business_orientation: 3, social_orientation: 1 } },
      { value: 'C', label: 'Branding and persuasion', scores: { creative_orientation: 2, social_orientation: 2 } },
      { value: 'D', label: 'Financial modelling and valuation', scores: { financial_orientation: 2, data_orientation: 2 } },
    ],
  },
  {
    id: 'q7',
    question: 'Which professional path appeals to you most?',
    options: [
      { value: 'A', label: 'CA / CS / CMA', scores: { financial_orientation: 3, exam_tolerance: 3, pressure_tolerance: 2 } },
      { value: 'B', label: 'BBA / MBA', scores: { business_orientation: 3, social_orientation: 1 } },
      { value: 'C', label: 'Marketing / digital media', scores: { creative_orientation: 2, social_orientation: 2, business_orientation: 1 } },
      { value: 'D', label: 'Finance / investment roles', scores: { financial_orientation: 2, data_orientation: 2, business_orientation: 1 } },
    ],
  },
  {
    id: 'q8',
    question: 'Which working style fits you?',
    options: [
      { value: 'A', label: 'Structured and rule-based', scores: { financial_orientation: 2, pressure_tolerance: 1 } },
      { value: 'B', label: 'Organised and people-oriented', scores: { business_orientation: 2, social_orientation: 2 } },
      { value: 'C', label: 'Creative and interactive', scores: { creative_orientation: 2, social_orientation: 2 } },
      { value: 'D', label: 'Analytical and data-driven', scores: { data_orientation: 3, financial_orientation: 1 } },
    ],
  },
  {
    id: 'q9',
    question: 'Which environment would you enjoy?',
    options: [
      { value: 'A', label: 'Corporate compliance or audit firms', scores: { financial_orientation: 2, pressure_tolerance: 2 } },
      { value: 'B', label: 'Business operations or consulting', scores: { business_orientation: 2, social_orientation: 1, data_orientation: 1 } },
      { value: 'C', label: 'Media and marketing agencies', scores: { creative_orientation: 2, social_orientation: 2 } },
      { value: 'D', label: 'Financial institutions', scores: { financial_orientation: 2, data_orientation: 2, business_orientation: 1 } },
    ],
  },
  {
    id: 'q10',
    question: 'Which success matters most?',
    options: [
      { value: 'A', label: 'Professional credibility', scores: { financial_orientation: 2, exam_tolerance: 1, pressure_tolerance: 1 } },
      { value: 'B', label: 'Leadership and growth', scores: { business_orientation: 2, social_orientation: 1, pressure_tolerance: 1 } },
      { value: 'C', label: 'Public recognition', scores: { social_orientation: 2, creative_orientation: 2 } },
      { value: 'D', label: 'Financial expertise', scores: { financial_orientation: 2, data_orientation: 2 } },
    ],
  },
  {
    id: 'q11',
    question: 'Which risk profile suits you?',
    options: [
      { value: 'A', label: 'Low risk, stable growth', scores: { financial_orientation: 2, pressure_tolerance: -1 } },
      { value: 'B', label: 'Moderate risk, leadership growth', scores: { business_orientation: 2, pressure_tolerance: 1 } },
      { value: 'C', label: 'High creativity and dynamic market', scores: { creative_orientation: 2, social_orientation: 1, pressure_tolerance: 1 } },
      { value: 'D', label: 'Market-linked financial risk', scores: { financial_orientation: 2, data_orientation: 1, pressure_tolerance: 2 } },
    ],
  },
  {
    id: 'q12',
    question: 'Which work output motivates you?',
    options: [
      { value: 'A', label: 'Accurate and compliant work', scores: { financial_orientation: 2, pressure_tolerance: 1 } },
      { value: 'B', label: 'Successful projects', scores: { business_orientation: 2, social_orientation: 1, hands_on_orientation: 1 } },
      { value: 'C', label: 'Influenced customers', scores: { social_orientation: 2, creative_orientation: 2 } },
      { value: 'D', label: 'Profitable investments', scores: { financial_orientation: 2, data_orientation: 2, business_orientation: 1 } },
    ],
  },
  {
    id: 'q13',
    question: 'Which learning style suits you?',
    options: [
      { value: 'A', label: 'Rules and standards', scores: { financial_orientation: 2, exam_tolerance: 2 } },
      { value: 'B', label: 'Practical management learning', scores: { business_orientation: 2, hands_on_orientation: 1 } },
      { value: 'C', label: 'Communication and creativity', scores: { creative_orientation: 2, social_orientation: 2 } },
      { value: 'D', label: 'Numbers and analytics', scores: { data_orientation: 3, financial_orientation: 1 } },
    ],
  },
  {
    id: 'q14',
    question: 'Which long-term role appeals to you?',
    options: [
      { value: 'A', label: 'Financial controller', scores: { financial_orientation: 3, business_orientation: 1 } },
      { value: 'B', label: 'Business leader', scores: { business_orientation: 3, social_orientation: 1 } },
      { value: 'C', label: 'Brand or media professional', scores: { creative_orientation: 2, social_orientation: 2 } },
      { value: 'D', label: 'Investment professional', scores: { financial_orientation: 2, data_orientation: 2 } },
    ],
  },
  {
    id: 'q15',
    question: 'Which describes you best?',
    options: [
      { value: 'A', label: 'Reliable and precise', scores: { financial_orientation: 2, pressure_tolerance: 1 } },
      { value: 'B', label: 'Organised and motivating', scores: { business_orientation: 2, social_orientation: 2 } },
      { value: 'C', label: 'Persuasive and expressive', scores: { social_orientation: 2, creative_orientation: 2 } },
      { value: 'D', label: 'Analytical and strategic', scores: { data_orientation: 2, financial_orientation: 1, business_orientation: 1 } },
    ],
  },
];

// Helper function to get questions by completed class
export function getQuestionsForClass(completedClass: CompletedClass): AssessmentQuestion[] {
  switch (completedClass) {
    case '10th':
      return questionsAfter10th;
    case '12th_science':
      return questionsAfter12thScience;
    case '12th_commerce':
      return questionsAfter12thCommerce;
    default:
      return questionsAfter10th;
  }
}
