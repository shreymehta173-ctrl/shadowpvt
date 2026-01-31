// PrepMate - Behavioral Career Assessment System
// Situational, forced-choice, and validation questions
// Field-neutral questions that infer suitability without mentioning specific careers

export type CompletedClass = '10th' | '12th_science' | '12th_commerce';
export type Stream12th = 'PCM' | 'PCB' | 'PCMB' | null;

// 12 Internal Trait Dimensions (never shown to students)
export interface TraitDimensions {
  analytical_reasoning: number;
  system_thinking: number;
  people_involvement: number;
  persuasion_influence: number;
  creative_expression: number;
  visual_thinking: number;
  precision_orientation: number;
  risk_appetite: number;
  learning_depth_tolerance: number;
  ambiguity_tolerance: number;
  execution_drive: number;
  planning_drive: number;
}

// Legacy type alias for compatibility
export type ScoreDimensions = TraitDimensions;

export interface AssessmentOption {
  value: string;
  label: string;
  scores: Partial<TraitDimensions>;
}

export type QuestionType = 'situational' | 'forced_choice' | 'emotional' | 'discomfort' | 'validation';

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  question: string;
  context?: string; // For situational questions
  options: AssessmentOption[];
}

// Helper function to shuffle array
function shuffleOptions<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// SET-A: After 10th Standard - Behavioral Assessment
export const questionsAfter10th: AssessmentQuestion[] = [
  // Situational Questions (Q1-Q6)
  {
    id: 'q1',
    type: 'situational',
    context: 'You are part of a team working on a school project. The project suddenly starts failing.',
    question: 'Which role would you naturally take without being told?',
    options: [
      { value: 'A', label: 'Quietly analyse what is breaking and try to fix it', scores: { analytical_reasoning: 3, system_thinking: 2 } },
      { value: 'B', label: 'Bring the team together and re-organise the work', scores: { people_involvement: 3, planning_drive: 2 } },
      { value: 'C', label: 'Rethink the idea and try a completely new approach', scores: { creative_expression: 3, ambiguity_tolerance: 2 } },
      { value: 'D', label: 'Jump into action and start fixing things on the ground', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  {
    id: 'q2',
    type: 'situational',
    context: 'Your group has been given a complex puzzle that no one has solved before.',
    question: 'What is your first instinct?',
    options: [
      { value: 'A', label: 'Break the puzzle into smaller logical parts', scores: { analytical_reasoning: 3, system_thinking: 2 } },
      { value: 'B', label: 'Look for patterns others might have missed', scores: { visual_thinking: 2, creative_expression: 2, learning_depth_tolerance: 1 } },
      { value: 'C', label: 'Discuss with others to get different perspectives', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'D', label: 'Start experimenting with different approaches immediately', scores: { execution_drive: 2, risk_appetite: 2, ambiguity_tolerance: 1 } },
    ],
  },
  {
    id: 'q3',
    type: 'situational',
    context: 'You are asked to present an important idea to convince others.',
    question: 'How would you prepare?',
    options: [
      { value: 'A', label: 'Gather facts and data to support every point', scores: { analytical_reasoning: 2, precision_orientation: 3 } },
      { value: 'B', label: 'Create a visually compelling presentation', scores: { visual_thinking: 3, creative_expression: 2 } },
      { value: 'C', label: 'Think about what would emotionally connect with the audience', scores: { persuasion_influence: 3, people_involvement: 2 } },
      { value: 'D', label: 'Prepare a clear step-by-step plan to follow', scores: { planning_drive: 3, execution_drive: 1 } },
    ],
  },
  {
    id: 'q4',
    type: 'situational',
    context: 'You discover an error in work that has already been submitted.',
    question: 'What would you do first?',
    options: [
      { value: 'A', label: 'Analyse what caused the error and how to prevent it', scores: { system_thinking: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Inform the right people immediately', scores: { precision_orientation: 2, people_involvement: 2, planning_drive: 1 } },
      { value: 'C', label: 'Find a creative workaround to minimize the impact', scores: { creative_expression: 2, ambiguity_tolerance: 2, risk_appetite: 1 } },
      { value: 'D', label: 'Start fixing it right away, even if imperfect', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q5',
    type: 'situational',
    context: 'You have been given leadership of a diverse team with different opinions.',
    question: 'How would you handle disagreements?',
    options: [
      { value: 'A', label: 'Use logic and evidence to find the best solution', scores: { analytical_reasoning: 2, precision_orientation: 2, system_thinking: 1 } },
      { value: 'B', label: 'Listen to everyone and find a compromise', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Propose a completely new idea that combines all views', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Make a quick decision and move forward', scores: { execution_drive: 2, risk_appetite: 2, planning_drive: 1 } },
    ],
  },
  {
    id: 'q6',
    type: 'situational',
    context: 'You are learning something completely new with very little guidance.',
    question: 'What helps you learn best?',
    options: [
      { value: 'A', label: 'Reading deeply and understanding the underlying concepts', scores: { learning_depth_tolerance: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Watching demonstrations and visual explanations', scores: { visual_thinking: 3, creative_expression: 1 } },
      { value: 'C', label: 'Discussing with others who know the subject', scores: { people_involvement: 2, persuasion_influence: 1, learning_depth_tolerance: 1 } },
      { value: 'D', label: 'Trying things out and learning from mistakes', scores: { execution_drive: 3, risk_appetite: 1, ambiguity_tolerance: 1 } },
    ],
  },
  // Forced-Choice Trade-off Questions (Q7-Q10)
  {
    id: 'q7',
    type: 'forced_choice',
    question: 'Which situation would you prefer, even if both are challenging?',
    options: [
      { value: 'A', label: 'Working alone on a difficult problem with no guidance', scores: { analytical_reasoning: 2, learning_depth_tolerance: 2, ambiguity_tolerance: 2 } },
      { value: 'B', label: 'Working with many people and managing disagreements', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Working on something unclear where you must invent the solution', scores: { creative_expression: 3, ambiguity_tolerance: 2 } },
      { value: 'D', label: 'Working on something physical where mistakes are immediately visible', scores: { execution_drive: 3, precision_orientation: 2 } },
    ],
  },
  {
    id: 'q8',
    type: 'forced_choice',
    question: 'If you had to choose one strength to develop, which would it be?',
    options: [
      { value: 'A', label: 'The ability to understand complex systems deeply', scores: { system_thinking: 3, learning_depth_tolerance: 2 } },
      { value: 'B', label: 'The ability to influence and motivate others', scores: { persuasion_influence: 3, people_involvement: 2 } },
      { value: 'C', label: 'The ability to create original ideas and designs', scores: { creative_expression: 3, visual_thinking: 2 } },
      { value: 'D', label: 'The ability to execute tasks flawlessly', scores: { execution_drive: 2, precision_orientation: 3 } },
    ],
  },
  {
    id: 'q9',
    type: 'emotional',
    question: 'At the end of a long day, which type of work would leave you feeling most satisfied?',
    options: [
      { value: 'A', label: 'Solving one complex, challenging problem', scores: { analytical_reasoning: 2, learning_depth_tolerance: 2, system_thinking: 1 } },
      { value: 'B', label: 'Successfully coordinating with many people', scores: { people_involvement: 3, planning_drive: 1 } },
      { value: 'C', label: 'Creating something original and unique', scores: { creative_expression: 3, visual_thinking: 1 } },
      { value: 'D', label: 'Completing a list of important tasks', scores: { execution_drive: 3, precision_orientation: 1 } },
    ],
  },
  {
    id: 'q10',
    type: 'emotional',
    question: 'What kind of recognition would mean the most to you?',
    options: [
      { value: 'A', label: 'Being known as someone who solves the hardest problems', scores: { analytical_reasoning: 2, system_thinking: 2, learning_depth_tolerance: 1 } },
      { value: 'B', label: 'Being known as someone who brings people together', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Being known as someone with original ideas', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Being known as someone who gets things done', scores: { execution_drive: 3, planning_drive: 1 } },
    ],
  },
  // Discomfort Detection Questions (Q11-Q12)
  {
    id: 'q11',
    type: 'discomfort',
    question: 'Which situation would bother you the most?',
    options: [
      { value: 'A', label: 'Not understanding why something works', scores: { analytical_reasoning: 2, learning_depth_tolerance: 2, system_thinking: 1 } },
      { value: 'B', label: 'Not being able to convince others of your idea', scores: { persuasion_influence: 3, people_involvement: 1 } },
      { value: 'C', label: 'Not having freedom to modify your work', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Not seeing the results of your efforts', scores: { execution_drive: 3, precision_orientation: 1 } },
    ],
  },
  {
    id: 'q12',
    type: 'discomfort',
    question: 'What would frustrate you the most in a project?',
    options: [
      { value: 'A', label: 'Having to make decisions without enough information', scores: { precision_orientation: 2, analytical_reasoning: 2, risk_appetite: -1 } },
      { value: 'B', label: 'Working alone without any team interaction', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Following strict rules with no room for creativity', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Planning endlessly without taking action', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  // Validation Questions (Q13-Q15)
  {
    id: 'q13',
    type: 'validation',
    question: 'If you had to track one type of progress every week, what would it be?',
    options: [
      { value: 'A', label: 'How well you understand the underlying systems', scores: { system_thinking: 2, analytical_reasoning: 2, learning_depth_tolerance: 1 } },
      { value: 'B', label: 'How people are responding to your work', scores: { people_involvement: 2, persuasion_influence: 2 } },
      { value: 'C', label: 'How innovative your outcomes are', scores: { creative_expression: 3, visual_thinking: 1 } },
      { value: 'D', label: 'How many tasks you have completed', scores: { execution_drive: 3, planning_drive: 1 } },
    ],
  },
  {
    id: 'q14',
    type: 'validation',
    question: 'When facing uncertainty, you typically:',
    options: [
      { value: 'A', label: 'Gather more information before deciding', scores: { analytical_reasoning: 2, precision_orientation: 2, risk_appetite: -1 } },
      { value: 'B', label: 'Consult with others you trust', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Trust your instincts and adapt as you go', scores: { ambiguity_tolerance: 3, risk_appetite: 2 } },
      { value: 'D', label: 'Take small steps and adjust based on results', scores: { execution_drive: 2, planning_drive: 2, precision_orientation: 1 } },
    ],
  },
  {
    id: 'q15',
    type: 'validation',
    question: 'In your ideal work, you would spend most time:',
    options: [
      { value: 'A', label: 'Analyzing and solving complex challenges', scores: { analytical_reasoning: 3, system_thinking: 2 } },
      { value: 'B', label: 'Interacting with and helping others', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Designing and creating new things', scores: { creative_expression: 3, visual_thinking: 2 } },
      { value: 'D', label: 'Executing and completing tangible work', scores: { execution_drive: 3, precision_orientation: 1 } },
    ],
  },
];

// SET-B: After 12th Science (PCM / PCB / PCMB) - Behavioral Assessment
export const questionsAfter12thScience: AssessmentQuestion[] = [
  // Situational Questions (Q1-Q6)
  {
    id: 'q1',
    type: 'situational',
    context: 'A critical system you are responsible for has stopped working unexpectedly.',
    question: 'What is your first response?',
    options: [
      { value: 'A', label: 'Systematically trace through each component to find the fault', scores: { system_thinking: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Consider how this affects the people depending on it', scores: { people_involvement: 3, planning_drive: 1 } },
      { value: 'C', label: 'Look for patterns in the data to identify anomalies', scores: { analytical_reasoning: 3, precision_orientation: 1 } },
      { value: 'D', label: 'Try several quick fixes to restore functionality', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  {
    id: 'q2',
    type: 'situational',
    context: 'You are given an open-ended project with no clear right answer.',
    question: 'How do you approach it?',
    options: [
      { value: 'A', label: 'Define the problem precisely before exploring solutions', scores: { system_thinking: 2, precision_orientation: 2, planning_drive: 1 } },
      { value: 'B', label: 'Consider who will use the outcome and what they need', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Brainstorm multiple creative possibilities', scores: { creative_expression: 3, ambiguity_tolerance: 2 } },
      { value: 'D', label: 'Build a rough prototype quickly to test ideas', scores: { execution_drive: 3, visual_thinking: 1, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q3',
    type: 'situational',
    context: 'You notice that a process everyone follows has a fundamental flaw.',
    question: 'What would you do?',
    options: [
      { value: 'A', label: 'Document the flaw with detailed analysis before proposing changes', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'B', label: 'Discuss it with stakeholders to build consensus for change', scores: { people_involvement: 2, persuasion_influence: 3 } },
      { value: 'C', label: 'Design an innovative alternative process', scores: { creative_expression: 3, system_thinking: 1 } },
      { value: 'D', label: 'Implement a small improvement to demonstrate the issue', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q4',
    type: 'situational',
    context: 'You are leading a project that requires skills you do not have.',
    question: 'How would you handle this?',
    options: [
      { value: 'A', label: 'Study the subject deeply until you understand it', scores: { learning_depth_tolerance: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Find and collaborate with experts who have those skills', scores: { people_involvement: 3, planning_drive: 1 } },
      { value: 'C', label: 'Find a creative workaround that uses your existing strengths', scores: { creative_expression: 2, ambiguity_tolerance: 2, risk_appetite: 1 } },
      { value: 'D', label: 'Learn just enough to make progress and iterate', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q5',
    type: 'situational',
    context: 'Your research reveals information that contradicts popular belief.',
    question: 'What would you do?',
    options: [
      { value: 'A', label: 'Verify and re-verify the findings with rigorous analysis', scores: { precision_orientation: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Consider how to present this sensitively to others', scores: { people_involvement: 2, persuasion_influence: 3 } },
      { value: 'C', label: 'Explore what new possibilities this opens up', scores: { creative_expression: 2, ambiguity_tolerance: 2, learning_depth_tolerance: 1 } },
      { value: 'D', label: 'Test the findings practically in the real world', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q6',
    type: 'situational',
    context: 'You are offered two paths: one is safe and well-understood, the other is risky but innovative.',
    question: 'Which influences your choice more?',
    options: [
      { value: 'A', label: 'The logical assessment of long-term outcomes', scores: { analytical_reasoning: 3, system_thinking: 1 } },
      { value: 'B', label: 'The impact on the people involved', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'The opportunity to try something new', scores: { creative_expression: 2, risk_appetite: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'The certainty of achieving tangible results', scores: { execution_drive: 2, precision_orientation: 2, risk_appetite: -1 } },
    ],
  },
  // Forced-Choice Trade-off Questions (Q7-Q10)
  {
    id: 'q7',
    type: 'forced_choice',
    question: 'Which challenge would energize you the most?',
    options: [
      { value: 'A', label: 'Understanding why a complex system behaves the way it does', scores: { system_thinking: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Helping others overcome a difficult situation', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Discovering new patterns in large amounts of information', scores: { analytical_reasoning: 3, learning_depth_tolerance: 1, precision_orientation: 1 } },
      { value: 'D', label: 'Creating something that has never existed before', scores: { creative_expression: 3, visual_thinking: 2 } },
    ],
  },
  {
    id: 'q8',
    type: 'forced_choice',
    question: 'If you could master one ability, which would you choose?',
    options: [
      { value: 'A', label: 'Building and understanding intricate systems', scores: { system_thinking: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Connecting with and understanding people deeply', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Finding insights in data that others miss', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'D', label: 'Designing elegant solutions to complex problems', scores: { creative_expression: 3, visual_thinking: 2 } },
    ],
  },
  {
    id: 'q9',
    type: 'emotional',
    question: 'Which work outcome would give you the greatest sense of fulfillment?',
    options: [
      { value: 'A', label: 'A perfectly functioning system you built', scores: { system_thinking: 3, execution_drive: 1 } },
      { value: 'B', label: 'Positive change in someone\'s life because of your work', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'A breakthrough discovery or insight', scores: { analytical_reasoning: 2, learning_depth_tolerance: 2, creative_expression: 1 } },
      { value: 'D', label: 'An innovative creation that inspires others', scores: { creative_expression: 3, visual_thinking: 2 } },
    ],
  },
  {
    id: 'q10',
    type: 'emotional',
    question: 'What environment helps you do your best work?',
    options: [
      { value: 'A', label: 'A structured environment with clear processes', scores: { precision_orientation: 3, planning_drive: 2 } },
      { value: 'B', label: 'A collaborative environment with diverse perspectives', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'An open environment where you can explore freely', scores: { creative_expression: 2, ambiguity_tolerance: 3, risk_appetite: 1 } },
      { value: 'D', label: 'A fast-paced environment with visible results', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  // Discomfort Detection Questions (Q11-Q12)
  {
    id: 'q11',
    type: 'discomfort',
    question: 'Which would frustrate you the most?',
    options: [
      { value: 'A', label: 'A problem that cannot be solved with logic alone', scores: { system_thinking: 2, analytical_reasoning: 2, ambiguity_tolerance: -1 } },
      { value: 'B', label: 'Working in isolation without any human connection', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Analysis that leads nowhere actionable', scores: { execution_drive: 2, analytical_reasoning: 1, planning_drive: 1 } },
      { value: 'D', label: 'Constraints that limit your creative freedom', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
    ],
  },
  {
    id: 'q12',
    type: 'discomfort',
    question: 'Which situation would make you most uncomfortable?',
    options: [
      { value: 'A', label: 'Having to proceed without understanding the full picture', scores: { learning_depth_tolerance: 2, system_thinking: 2, risk_appetite: -1 } },
      { value: 'B', label: 'Making decisions that negatively affect others', scores: { people_involvement: 3, precision_orientation: 1 } },
      { value: 'C', label: 'Presenting work that is technically imperfect', scores: { precision_orientation: 3, analytical_reasoning: 1 } },
      { value: 'D', label: 'Following a conventional approach when a better way exists', scores: { creative_expression: 3, risk_appetite: 1 } },
    ],
  },
  // Validation Questions (Q13-Q15)
  {
    id: 'q13',
    type: 'validation',
    question: 'When starting something new, what do you focus on first?',
    options: [
      { value: 'A', label: 'Understanding how all the pieces fit together', scores: { system_thinking: 3, analytical_reasoning: 1 } },
      { value: 'B', label: 'Understanding who will benefit and how', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Understanding what has and has not been tried', scores: { analytical_reasoning: 2, creative_expression: 1, learning_depth_tolerance: 1 } },
      { value: 'D', label: 'Getting started and learning along the way', scores: { execution_drive: 3, risk_appetite: 1, ambiguity_tolerance: 1 } },
    ],
  },
  {
    id: 'q14',
    type: 'validation',
    question: 'How do you prefer to solve problems?',
    options: [
      { value: 'A', label: 'Breaking them down into logical components', scores: { analytical_reasoning: 3, system_thinking: 2 } },
      { value: 'B', label: 'Collaborating with others to find solutions', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Looking for unconventional approaches', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Testing solutions until one works', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q15',
    type: 'validation',
    question: 'What type of thinking do you find most natural?',
    options: [
      { value: 'A', label: 'Logical, step-by-step reasoning', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'B', label: 'Understanding people and their motivations', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Finding patterns and extracting insights', scores: { analytical_reasoning: 3, learning_depth_tolerance: 1 } },
      { value: 'D', label: 'Visualizing and creating new concepts', scores: { creative_expression: 3, visual_thinking: 2 } },
    ],
  },
];

// SET-C: After 12th Commerce - Behavioral Assessment
export const questionsAfter12thCommerce: AssessmentQuestion[] = [
  // Situational Questions (Q1-Q6)
  {
    id: 'q1',
    type: 'situational',
    context: 'Your organization is facing a financial decision with incomplete information.',
    question: 'How would you approach this?',
    options: [
      { value: 'A', label: 'Gather and analyze all available data before deciding', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'B', label: 'Consult with stakeholders to understand different perspectives', scores: { people_involvement: 2, persuasion_influence: 2, planning_drive: 1 } },
      { value: 'C', label: 'Find creative ways to get the missing information', scores: { creative_expression: 2, risk_appetite: 2, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Make the best decision with available information and adjust later', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  {
    id: 'q2',
    type: 'situational',
    context: 'You need to convince skeptical colleagues about a new approach.',
    question: 'What strategy would you use?',
    options: [
      { value: 'A', label: 'Present detailed data and logical arguments', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'B', label: 'Build relationships and address their concerns personally', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Create an engaging presentation that tells a compelling story', scores: { creative_expression: 3, visual_thinking: 1, persuasion_influence: 1 } },
      { value: 'D', label: 'Demonstrate results through a small pilot project', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q3',
    type: 'situational',
    context: 'You discover an opportunity that requires quick action but involves risk.',
    question: 'What is your response?',
    options: [
      { value: 'A', label: 'Calculate the risks and rewards carefully before acting', scores: { analytical_reasoning: 3, precision_orientation: 2, risk_appetite: -1 } },
      { value: 'B', label: 'Discuss with trusted advisors to get their input', scores: { people_involvement: 3, planning_drive: 1 } },
      { value: 'C', label: 'Look for a creative way to reduce the risk while capturing the opportunity', scores: { creative_expression: 2, risk_appetite: 2, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Act quickly to seize the opportunity', scores: { execution_drive: 3, risk_appetite: 3 } },
    ],
  },
  {
    id: 'q4',
    type: 'situational',
    context: 'A deadline is approaching but quality is being compromised.',
    question: 'How would you handle this tension?',
    options: [
      { value: 'A', label: 'Identify what is essential and prioritize accuracy', scores: { precision_orientation: 3, analytical_reasoning: 1, planning_drive: 1 } },
      { value: 'B', label: 'Communicate with stakeholders about realistic expectations', scores: { people_involvement: 2, persuasion_influence: 2, planning_drive: 1 } },
      { value: 'C', label: 'Find creative shortcuts that maintain quality', scores: { creative_expression: 2, ambiguity_tolerance: 2, execution_drive: 1 } },
      { value: 'D', label: 'Push through and deliver, then improve afterwards', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  {
    id: 'q5',
    type: 'situational',
    context: 'You are asked to lead a team where members have more experience than you.',
    question: 'How would you establish credibility?',
    options: [
      { value: 'A', label: 'Demonstrate expertise through thorough preparation and knowledge', scores: { learning_depth_tolerance: 2, analytical_reasoning: 2, precision_orientation: 1 } },
      { value: 'B', label: 'Build trust through genuine relationships and listening', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Bring fresh perspectives and innovative ideas', scores: { creative_expression: 3, risk_appetite: 1 } },
      { value: 'D', label: 'Focus on delivering results and let the work speak', scores: { execution_drive: 3, planning_drive: 1 } },
    ],
  },
  {
    id: 'q6',
    type: 'situational',
    context: 'Market conditions are changing rapidly and old strategies are not working.',
    question: 'What would be your priority?',
    options: [
      { value: 'A', label: 'Analyze the new conditions systematically', scores: { analytical_reasoning: 3, system_thinking: 2 } },
      { value: 'B', label: 'Understand how customers and competitors are responding', scores: { people_involvement: 2, persuasion_influence: 2, planning_drive: 1 } },
      { value: 'C', label: 'Develop innovative approaches for the new environment', scores: { creative_expression: 3, ambiguity_tolerance: 2 } },
      { value: 'D', label: 'Take quick action to test new strategies', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  // Forced-Choice Trade-off Questions (Q7-Q10)
  {
    id: 'q7',
    type: 'forced_choice',
    question: 'Which kind of work would you find most engaging?',
    options: [
      { value: 'A', label: 'Ensuring accuracy and compliance in complex matters', scores: { precision_orientation: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Leading teams and developing people', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Creating strategies to reach new audiences', scores: { creative_expression: 3, persuasion_influence: 1, risk_appetite: 1 } },
      { value: 'D', label: 'Analyzing trends to make better decisions', scores: { analytical_reasoning: 3, planning_drive: 1 } },
    ],
  },
  {
    id: 'q8',
    type: 'forced_choice',
    question: 'Which strength would serve you best in your ideal future?',
    options: [
      { value: 'A', label: 'Meticulous attention to detail and accuracy', scores: { precision_orientation: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Ability to inspire and lead others', scores: { people_involvement: 2, persuasion_influence: 3 } },
      { value: 'C', label: 'Creative thinking and communication', scores: { creative_expression: 3, visual_thinking: 1, persuasion_influence: 1 } },
      { value: 'D', label: 'Strategic decision-making with numbers', scores: { analytical_reasoning: 3, risk_appetite: 1, planning_drive: 1 } },
    ],
  },
  {
    id: 'q9',
    type: 'emotional',
    question: 'What type of achievement would make you most proud?',
    options: [
      { value: 'A', label: 'Solving a complex problem that required deep expertise', scores: { learning_depth_tolerance: 2, analytical_reasoning: 2, precision_orientation: 1 } },
      { value: 'B', label: 'Building and leading a successful team', scores: { people_involvement: 3, planning_drive: 1 } },
      { value: 'C', label: 'Creating a campaign or idea that resonated widely', scores: { creative_expression: 3, persuasion_influence: 2 } },
      { value: 'D', label: 'Making a decision that produced significant results', scores: { analytical_reasoning: 2, execution_drive: 2, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q10',
    type: 'emotional',
    question: 'Which work rhythm suits you best?',
    options: [
      { value: 'A', label: 'Methodical and consistent with high attention to detail', scores: { precision_orientation: 3, planning_drive: 2 } },
      { value: 'B', label: 'Interactive and people-focused with varied activities', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Dynamic and creative with room for innovation', scores: { creative_expression: 3, ambiguity_tolerance: 1, risk_appetite: 1 } },
      { value: 'D', label: 'Fast-paced and results-driven with clear goals', scores: { execution_drive: 3, planning_drive: 1 } },
    ],
  },
  // Discomfort Detection Questions (Q11-Q12)
  {
    id: 'q11',
    type: 'discomfort',
    question: 'Which situation would frustrate you the most?',
    options: [
      { value: 'A', label: 'Errors slipping through due to rushed work', scores: { precision_orientation: 3, analytical_reasoning: 1 } },
      { value: 'B', label: 'Working in isolation without team collaboration', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Following rigid processes with no room for creativity', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Endless planning without any execution', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q12',
    type: 'discomfort',
    question: 'What would bother you most about your work?',
    options: [
      { value: 'A', label: 'Uncertainty about whether you are correct', scores: { precision_orientation: 3, analytical_reasoning: 1, risk_appetite: -1 } },
      { value: 'B', label: 'Lack of recognition from others', scores: { persuasion_influence: 2, people_involvement: 2 } },
      { value: 'C', label: 'Repetitive tasks with no variety', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Goals that keep changing without resolution', scores: { planning_drive: 2, execution_drive: 2, precision_orientation: 1 } },
    ],
  },
  // Validation Questions (Q13-Q15)
  {
    id: 'q13',
    type: 'validation',
    question: 'When evaluating opportunities, what matters most to you?',
    options: [
      { value: 'A', label: 'The stability and predictability of outcomes', scores: { precision_orientation: 2, planning_drive: 2, risk_appetite: -1 } },
      { value: 'B', label: 'The opportunity to work with and lead others', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'The scope for creativity and self-expression', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'The potential for growth and high returns', scores: { risk_appetite: 3, analytical_reasoning: 1 } },
    ],
  },
  {
    id: 'q14',
    type: 'validation',
    question: 'How do you naturally approach new challenges?',
    options: [
      { value: 'A', label: 'With careful analysis and thorough preparation', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'B', label: 'By building a team and leveraging relationships', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'By finding innovative angles others have missed', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'By taking action and learning from experience', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q15',
    type: 'validation',
    question: 'In your ideal role, you would be known for:',
    options: [
      { value: 'A', label: 'Accuracy, expertise, and reliability', scores: { precision_orientation: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Leadership, influence, and team building', scores: { people_involvement: 2, persuasion_influence: 3 } },
      { value: 'C', label: 'Creativity, communication, and fresh ideas', scores: { creative_expression: 3, visual_thinking: 1, persuasion_influence: 1 } },
      { value: 'D', label: 'Results, strategy, and sound judgment', scores: { analytical_reasoning: 2, execution_drive: 2, planning_drive: 1 } },
    ],
  },
];

// Get questions for a specific class with randomized option order
export function getQuestionsForClass(completedClass: CompletedClass): AssessmentQuestion[] {
  let questions: AssessmentQuestion[];
  
  switch (completedClass) {
    case '10th':
      questions = questionsAfter10th;
      break;
    case '12th_science':
      questions = questionsAfter12thScience;
      break;
    case '12th_commerce':
      questions = questionsAfter12thCommerce;
      break;
    default:
      questions = questionsAfter10th;
  }

  // Randomize option order for each question to prevent pattern recognition
  return questions.map(q => ({
    ...q,
    options: shuffleOptions(q.options).map((opt, idx) => ({
      ...opt,
      value: String.fromCharCode(65 + idx), // Re-assign A, B, C, D after shuffle
    })),
  }));
}

// Calculate trait consistency score
export function calculateConsistencyScore(
  responses: Record<string, string>,
  questions: AssessmentQuestion[]
): number {
  const validationQuestions = questions.filter(q => q.type === 'validation');
  const mainQuestions = questions.filter(q => q.type !== 'validation');
  
  // Compare validation responses with main question patterns
  // Higher score = more consistent responses
  let consistencyPoints = 0;
  const maxPoints = validationQuestions.length;
  
  // Simplified consistency check - would be more sophisticated in production
  validationQuestions.forEach(vq => {
    const vResponse = responses[vq.id];
    if (vResponse) {
      consistencyPoints += 0.7 + Math.random() * 0.3; // Placeholder for actual consistency logic
    }
  });
  
  return maxPoints > 0 ? (consistencyPoints / maxPoints) * 100 : 100;
}
