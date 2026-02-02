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
  labelHi?: string; // Hindi translation
  scores: Partial<TraitDimensions>;
}

export type QuestionType = 'situational' | 'forced_choice' | 'emotional' | 'discomfort' | 'validation';

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  question: string;
  questionHi?: string; // Hindi translation
  context?: string; // For situational questions
  contextHi?: string; // Hindi translation
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
    contextHi: 'आप एक स्कूल प्रोजेक्ट पर टीम के साथ काम कर रहे हैं। प्रोजेक्ट अचानक असफल होने लगता है।',
    question: 'Which role would you naturally take without being told?',
    questionHi: 'बिना किसी के कहे आप स्वाभाविक रूप से कौन सी भूमिका निभाएंगे?',
    options: [
      { value: 'A', label: 'Quietly analyse what is breaking and try to fix it', labelHi: 'चुपचाप विश्लेषण करें कि क्या खराब हो रहा है और इसे ठीक करने का प्रयास करें', scores: { analytical_reasoning: 3, system_thinking: 2 } },
      { value: 'B', label: 'Bring the team together and re-organise the work', labelHi: 'टीम को एकजुट करें और काम को फिर से व्यवस्थित करें', scores: { people_involvement: 3, planning_drive: 2 } },
      { value: 'C', label: 'Rethink the idea and try a completely new approach', labelHi: 'विचार पर पुनर्विचार करें और पूरी तरह से नया दृष्टिकोण आजमाएं', scores: { creative_expression: 3, ambiguity_tolerance: 2 } },
      { value: 'D', label: 'Jump into action and start fixing things on the ground', labelHi: 'तुरंत काम में लग जाएं और जमीनी स्तर पर चीजों को ठीक करना शुरू करें', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  {
    id: 'q2',
    type: 'situational',
    context: 'Your group has been given a complex puzzle that no one has solved before.',
    contextHi: 'आपके समूह को एक जटिल पहेली दी गई है जिसे पहले किसी ने हल नहीं किया है।',
    question: 'What is your first instinct?',
    questionHi: 'आपकी पहली प्रवृत्ति क्या है?',
    options: [
      { value: 'A', label: 'Break the puzzle into smaller logical parts', labelHi: 'पहेली को छोटे तार्किक हिस्सों में तोड़ें', scores: { analytical_reasoning: 3, system_thinking: 2 } },
      { value: 'B', label: 'Look for patterns others might have missed', labelHi: 'उन पैटर्न को खोजें जो दूसरों से छूट गए हों', scores: { visual_thinking: 2, creative_expression: 2, learning_depth_tolerance: 1 } },
      { value: 'C', label: 'Discuss with others to get different perspectives', labelHi: 'विभिन्न दृष्टिकोण प्राप्त करने के लिए दूसरों से चर्चा करें', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'D', label: 'Start experimenting with different approaches immediately', labelHi: 'तुरंत अलग-अलग तरीकों से प्रयोग करना शुरू करें', scores: { execution_drive: 2, risk_appetite: 2, ambiguity_tolerance: 1 } },
    ],
  },
  {
    id: 'q3',
    type: 'situational',
    context: 'You are asked to present an important idea to convince others.',
    contextHi: 'आपसे दूसरों को समझाने के लिए एक महत्वपूर्ण विचार प्रस्तुत करने को कहा गया है।',
    question: 'How would you prepare?',
    questionHi: 'आप कैसे तैयारी करेंगे?',
    options: [
      { value: 'A', label: 'Gather facts and data to support every point', labelHi: 'हर बिंदु का समर्थन करने के लिए तथ्य और डेटा इकट्ठा करें', scores: { analytical_reasoning: 2, precision_orientation: 3 } },
      { value: 'B', label: 'Create a visually compelling presentation', labelHi: 'दृष्टिगत रूप से आकर्षक प्रस्तुति बनाएं', scores: { visual_thinking: 3, creative_expression: 2 } },
      { value: 'C', label: 'Think about what would emotionally connect with the audience', labelHi: 'सोचें कि दर्शकों के साथ भावनात्मक रूप से क्या जुड़ेगा', scores: { persuasion_influence: 3, people_involvement: 2 } },
      { value: 'D', label: 'Prepare a clear step-by-step plan to follow', labelHi: 'अनुसरण करने के लिए एक स्पष्ट चरण-दर-चरण योजना तैयार करें', scores: { planning_drive: 3, execution_drive: 1 } },
    ],
  },
  {
    id: 'q4',
    type: 'situational',
    context: 'You discover an error in work that has already been submitted.',
    contextHi: 'आपको उस काम में गलती मिलती है जो पहले ही जमा हो चुका है।',
    question: 'What would you do first?',
    questionHi: 'आप पहले क्या करेंगे?',
    options: [
      { value: 'A', label: 'Analyse what caused the error and how to prevent it', labelHi: 'विश्लेषण करें कि त्रुटि का कारण क्या था और इसे कैसे रोका जाए', scores: { system_thinking: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Inform the right people immediately', labelHi: 'तुरंत सही लोगों को सूचित करें', scores: { precision_orientation: 2, people_involvement: 2, planning_drive: 1 } },
      { value: 'C', label: 'Find a creative workaround to minimize the impact', labelHi: 'प्रभाव को कम करने के लिए एक रचनात्मक समाधान खोजें', scores: { creative_expression: 2, ambiguity_tolerance: 2, risk_appetite: 1 } },
      { value: 'D', label: 'Start fixing it right away, even if imperfect', labelHi: 'अभी ठीक करना शुरू करें, भले ही यह सटीक न हो', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q5',
    type: 'situational',
    context: 'You have been given leadership of a diverse team with different opinions.',
    contextHi: 'आपको विभिन्न विचारों वाली एक विविध टीम का नेतृत्व दिया गया है।',
    question: 'How would you handle disagreements?',
    questionHi: 'आप असहमतियों को कैसे संभालेंगे?',
    options: [
      { value: 'A', label: 'Use logic and evidence to find the best solution', labelHi: 'सबसे अच्छा समाधान खोजने के लिए तर्क और प्रमाण का उपयोग करें', scores: { analytical_reasoning: 2, precision_orientation: 2, system_thinking: 1 } },
      { value: 'B', label: 'Listen to everyone and find a compromise', labelHi: 'सभी की सुनें और समझौता खोजें', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Propose a completely new idea that combines all views', labelHi: 'एक पूरी तरह से नया विचार प्रस्तावित करें जो सभी दृष्टिकोणों को जोड़े', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Make a quick decision and move forward', labelHi: 'जल्दी निर्णय लें और आगे बढ़ें', scores: { execution_drive: 2, risk_appetite: 2, planning_drive: 1 } },
    ],
  },
  {
    id: 'q6',
    type: 'situational',
    context: 'You are learning something completely new with very little guidance.',
    contextHi: 'आप बहुत कम मार्गदर्शन के साथ कुछ पूरी तरह से नया सीख रहे हैं।',
    question: 'What helps you learn best?',
    questionHi: 'आप सबसे अच्छा कैसे सीखते हैं?',
    options: [
      { value: 'A', label: 'Reading deeply and understanding the underlying concepts', labelHi: 'गहराई से पढ़ना और अंतर्निहित अवधारणाओं को समझना', scores: { learning_depth_tolerance: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Watching demonstrations and visual explanations', labelHi: 'प्रदर्शन और दृश्य स्पष्टीकरण देखना', scores: { visual_thinking: 3, creative_expression: 1 } },
      { value: 'C', label: 'Discussing with others who know the subject', labelHi: 'विषय जानने वालों के साथ चर्चा करना', scores: { people_involvement: 2, persuasion_influence: 1, learning_depth_tolerance: 1 } },
      { value: 'D', label: 'Trying things out and learning from mistakes', labelHi: 'चीजों को आजमाना और गलतियों से सीखना', scores: { execution_drive: 3, risk_appetite: 1, ambiguity_tolerance: 1 } },
    ],
  },
  // Forced-Choice Trade-off Questions (Q7-Q10)
  {
    id: 'q7',
    type: 'forced_choice',
    question: 'Which situation would you prefer, even if both are challenging?',
    questionHi: 'आप कौन सी स्थिति पसंद करेंगे, भले ही दोनों चुनौतीपूर्ण हों?',
    options: [
      { value: 'A', label: 'Working alone on a difficult problem with no guidance', labelHi: 'बिना मार्गदर्शन के किसी कठिन समस्या पर अकेले काम करना', scores: { analytical_reasoning: 2, learning_depth_tolerance: 2, ambiguity_tolerance: 2 } },
      { value: 'B', label: 'Working with many people and managing disagreements', labelHi: 'कई लोगों के साथ काम करना और असहमतियों को प्रबंधित करना', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Working on something unclear where you must invent the solution', labelHi: 'किसी अस्पष्ट चीज पर काम करना जहां आपको समाधान खोजना है', scores: { creative_expression: 3, ambiguity_tolerance: 2 } },
      { value: 'D', label: 'Working on something physical where mistakes are immediately visible', labelHi: 'किसी भौतिक चीज पर काम करना जहां गलतियां तुरंत दिखाई देती हैं', scores: { execution_drive: 3, precision_orientation: 2 } },
    ],
  },
  {
    id: 'q8',
    type: 'forced_choice',
    question: 'If you had to choose one strength to develop, which would it be?',
    questionHi: 'यदि आपको एक शक्ति विकसित करनी हो, तो वह कौन सी होगी?',
    options: [
      { value: 'A', label: 'The ability to understand complex systems deeply', labelHi: 'जटिल प्रणालियों को गहराई से समझने की क्षमता', scores: { system_thinking: 3, learning_depth_tolerance: 2 } },
      { value: 'B', label: 'The ability to influence and motivate others', labelHi: 'दूसरों को प्रभावित और प्रेरित करने की क्षमता', scores: { persuasion_influence: 3, people_involvement: 2 } },
      { value: 'C', label: 'The ability to create original ideas and designs', labelHi: 'मौलिक विचार और डिज़ाइन बनाने की क्षमता', scores: { creative_expression: 3, visual_thinking: 2 } },
      { value: 'D', label: 'The ability to execute tasks flawlessly', labelHi: 'कार्यों को त्रुटिहीन रूप से निष्पादित करने की क्षमता', scores: { execution_drive: 2, precision_orientation: 3 } },
    ],
  },
  {
    id: 'q9',
    type: 'emotional',
    question: 'At the end of a long day, which type of work would leave you feeling most satisfied?',
    questionHi: 'एक लंबे दिन के अंत में, किस प्रकार का काम आपको सबसे अधिक संतुष्ट महसूस कराएगा?',
    options: [
      { value: 'A', label: 'Solving one complex, challenging problem', labelHi: 'एक जटिल, चुनौतीपूर्ण समस्या को हल करना', scores: { analytical_reasoning: 2, learning_depth_tolerance: 2, system_thinking: 1 } },
      { value: 'B', label: 'Successfully coordinating with many people', labelHi: 'कई लोगों के साथ सफलतापूर्वक समन्वय करना', scores: { people_involvement: 3, planning_drive: 1 } },
      { value: 'C', label: 'Creating something original and unique', labelHi: 'कुछ मौलिक और अनूठा बनाना', scores: { creative_expression: 3, visual_thinking: 1 } },
      { value: 'D', label: 'Completing a list of important tasks', labelHi: 'महत्वपूर्ण कार्यों की सूची पूरी करना', scores: { execution_drive: 3, precision_orientation: 1 } },
    ],
  },
  {
    id: 'q10',
    type: 'emotional',
    question: 'What kind of recognition would mean the most to you?',
    questionHi: 'किस प्रकार की मान्यता आपके लिए सबसे महत्वपूर्ण होगी?',
    options: [
      { value: 'A', label: 'Being known as someone who solves the hardest problems', labelHi: 'कठिनतम समस्याओं को हल करने वाले के रूप में जाना जाना', scores: { analytical_reasoning: 2, system_thinking: 2, learning_depth_tolerance: 1 } },
      { value: 'B', label: 'Being known as someone who brings people together', labelHi: 'लोगों को एक साथ लाने वाले के रूप में जाना जाना', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Being known as someone with original ideas', labelHi: 'मौलिक विचारों वाले व्यक्ति के रूप में जाना जाना', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Being known as someone who gets things done', labelHi: 'काम करवाने वाले के रूप में जाना जाना', scores: { execution_drive: 3, planning_drive: 1 } },
    ],
  },
  // Discomfort Detection Questions (Q11-Q12)
  {
    id: 'q11',
    type: 'discomfort',
    question: 'Which situation would bother you the most?',
    questionHi: 'कौन सी स्थिति आपको सबसे अधिक परेशान करेगी?',
    options: [
      { value: 'A', label: 'Not understanding why something works', labelHi: 'यह न समझना कि कुछ कैसे काम करता है', scores: { analytical_reasoning: 2, learning_depth_tolerance: 2, system_thinking: 1 } },
      { value: 'B', label: 'Not being able to convince others of your idea', labelHi: 'दूसरों को अपने विचार के बारे में समझाने में असमर्थ होना', scores: { persuasion_influence: 3, people_involvement: 1 } },
      { value: 'C', label: 'Not having freedom to modify your work', labelHi: 'अपने काम को संशोधित करने की स्वतंत्रता न होना', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Not seeing the results of your efforts', labelHi: 'अपने प्रयासों के परिणाम न देखना', scores: { execution_drive: 3, precision_orientation: 1 } },
    ],
  },
  {
    id: 'q12',
    type: 'discomfort',
    question: 'What would frustrate you the most in a project?',
    questionHi: 'किसी प्रोजेक्ट में आपको सबसे अधिक क्या निराश करेगा?',
    options: [
      { value: 'A', label: 'Having to make decisions without enough information', labelHi: 'पर्याप्त जानकारी के बिना निर्णय लेना', scores: { precision_orientation: 2, analytical_reasoning: 2, risk_appetite: -1 } },
      { value: 'B', label: 'Working alone without any team interaction', labelHi: 'बिना किसी टीम संवाद के अकेले काम करना', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Following strict rules with no room for creativity', labelHi: 'रचनात्मकता के लिए कोई जगह न होने के साथ सख्त नियमों का पालन करना', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Planning endlessly without taking action', labelHi: 'बिना कार्रवाई के अंतहीन योजना बनाना', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  // Validation Questions (Q13-Q15)
  {
    id: 'q13',
    type: 'validation',
    question: 'If you had to track one type of progress every week, what would it be?',
    questionHi: 'यदि आपको हर हफ्ते एक प्रकार की प्रगति को ट्रैक करना हो, तो वह क्या होगी?',
    options: [
      { value: 'A', label: 'How well you understand the underlying systems', labelHi: 'आप अंतर्निहित प्रणालियों को कितनी अच्छी तरह समझते हैं', scores: { system_thinking: 2, analytical_reasoning: 2, learning_depth_tolerance: 1 } },
      { value: 'B', label: 'How people are responding to your work', labelHi: 'लोग आपके काम पर कैसे प्रतिक्रिया दे रहे हैं', scores: { people_involvement: 2, persuasion_influence: 2 } },
      { value: 'C', label: 'How innovative your outcomes are', labelHi: 'आपके परिणाम कितने नवाचारी हैं', scores: { creative_expression: 3, visual_thinking: 1 } },
      { value: 'D', label: 'How many tasks you have completed', labelHi: 'आपने कितने कार्य पूरे किए हैं', scores: { execution_drive: 3, planning_drive: 1 } },
    ],
  },
  {
    id: 'q14',
    type: 'validation',
    question: 'When facing uncertainty, you typically:',
    questionHi: 'अनिश्चितता का सामना करते समय, आप आमतौर पर:',
    options: [
      { value: 'A', label: 'Gather more information before deciding', labelHi: 'निर्णय लेने से पहले अधिक जानकारी इकट्ठा करें', scores: { analytical_reasoning: 2, precision_orientation: 2, risk_appetite: -1 } },
      { value: 'B', label: 'Consult with others you trust', labelHi: 'विश्वसनीय लोगों से परामर्श करें', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Trust your instincts and adapt as you go', labelHi: 'अपनी प्रवृत्ति पर भरोसा करें और आगे बढ़ते हुए अनुकूलन करें', scores: { ambiguity_tolerance: 3, risk_appetite: 2 } },
      { value: 'D', label: 'Take small steps and adjust based on results', labelHi: 'छोटे कदम उठाएं और परिणामों के आधार पर समायोजित करें', scores: { execution_drive: 2, planning_drive: 2, precision_orientation: 1 } },
    ],
  },
  {
    id: 'q15',
    type: 'validation',
    question: 'In your ideal work, you would spend most time:',
    questionHi: 'अपने आदर्श काम में, आप अधिकांश समय बिताएंगे:',
    options: [
      { value: 'A', label: 'Analyzing and solving complex challenges', labelHi: 'जटिल चुनौतियों का विश्लेषण और समाधान करना', scores: { analytical_reasoning: 3, system_thinking: 2 } },
      { value: 'B', label: 'Interacting with and helping others', labelHi: 'दूसरों के साथ बातचीत करना और उनकी मदद करना', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Designing and creating new things', labelHi: 'नई चीजों को डिज़ाइन और बनाना', scores: { creative_expression: 3, visual_thinking: 2 } },
      { value: 'D', label: 'Executing and completing tangible work', labelHi: 'ठोस काम को निष्पादित और पूरा करना', scores: { execution_drive: 3, precision_orientation: 1 } },
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
    contextHi: 'एक महत्वपूर्ण प्रणाली जिसके लिए आप जिम्मेदार हैं, अचानक काम करना बंद कर देती है।',
    question: 'What is your first response?',
    questionHi: 'आपकी पहली प्रतिक्रिया क्या है?',
    options: [
      { value: 'A', label: 'Systematically trace through each component to find the fault', labelHi: 'दोष खोजने के लिए प्रत्येक घटक का व्यवस्थित रूप से पता लगाएं', scores: { system_thinking: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Consider how this affects the people depending on it', labelHi: 'विचार करें कि यह इस पर निर्भर लोगों को कैसे प्रभावित करता है', scores: { people_involvement: 3, planning_drive: 1 } },
      { value: 'C', label: 'Look for patterns in the data to identify anomalies', labelHi: 'विसंगतियों की पहचान करने के लिए डेटा में पैटर्न खोजें', scores: { analytical_reasoning: 3, precision_orientation: 1 } },
      { value: 'D', label: 'Try several quick fixes to restore functionality', labelHi: 'कार्यक्षमता बहाल करने के लिए कई त्वरित सुधार आजमाएं', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  {
    id: 'q2',
    type: 'situational',
    context: 'You are given an open-ended project with no clear right answer.',
    contextHi: 'आपको एक खुला प्रोजेक्ट दिया गया है जिसका कोई स्पष्ट सही उत्तर नहीं है।',
    question: 'How do you approach it?',
    questionHi: 'आप इसे कैसे संभालते हैं?',
    options: [
      { value: 'A', label: 'Define the problem precisely before exploring solutions', labelHi: 'समाधान खोजने से पहले समस्या को सटीक रूप से परिभाषित करें', scores: { system_thinking: 2, precision_orientation: 2, planning_drive: 1 } },
      { value: 'B', label: 'Consider who will use the outcome and what they need', labelHi: 'विचार करें कि परिणाम का उपयोग कौन करेगा और उन्हें क्या चाहिए', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Brainstorm multiple creative possibilities', labelHi: 'कई रचनात्मक संभावनाओं पर विचार-मंथन करें', scores: { creative_expression: 3, ambiguity_tolerance: 2 } },
      { value: 'D', label: 'Build a rough prototype quickly to test ideas', labelHi: 'विचारों का परीक्षण करने के लिए जल्दी से एक मोटा प्रोटोटाइप बनाएं', scores: { execution_drive: 3, visual_thinking: 1, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q3',
    type: 'situational',
    context: 'You notice that a process everyone follows has a fundamental flaw.',
    contextHi: 'आप देखते हैं कि जिस प्रक्रिया का सभी पालन करते हैं उसमें एक मौलिक दोष है।',
    question: 'What would you do?',
    questionHi: 'आप क्या करेंगे?',
    options: [
      { value: 'A', label: 'Document the flaw with detailed analysis before proposing changes', labelHi: 'परिवर्तन प्रस्तावित करने से पहले विस्तृत विश्लेषण के साथ दोष को दस्तावेज करें', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'B', label: 'Discuss it with stakeholders to build consensus for change', labelHi: 'परिवर्तन के लिए सहमति बनाने के लिए हितधारकों के साथ चर्चा करें', scores: { people_involvement: 2, persuasion_influence: 3 } },
      { value: 'C', label: 'Design an innovative alternative process', labelHi: 'एक नवाचारी वैकल्पिक प्रक्रिया डिज़ाइन करें', scores: { creative_expression: 3, system_thinking: 1 } },
      { value: 'D', label: 'Implement a small improvement to demonstrate the issue', labelHi: 'मुद्दे को प्रदर्शित करने के लिए एक छोटा सुधार लागू करें', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q4',
    type: 'situational',
    context: 'You are leading a project that requires skills you do not have.',
    contextHi: 'आप एक ऐसे प्रोजेक्ट का नेतृत्व कर रहे हैं जिसके लिए आपके पास कौशल नहीं है।',
    question: 'How would you handle this?',
    questionHi: 'आप इसे कैसे संभालेंगे?',
    options: [
      { value: 'A', label: 'Study the subject deeply until you understand it', labelHi: 'जब तक आप इसे नहीं समझ जाते तब तक विषय का गहराई से अध्ययन करें', scores: { learning_depth_tolerance: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Find and collaborate with experts who have those skills', labelHi: 'उन कौशल वाले विशेषज्ञों को खोजें और उनके साथ सहयोग करें', scores: { people_involvement: 3, planning_drive: 1 } },
      { value: 'C', label: 'Find a creative workaround that uses your existing strengths', labelHi: 'एक रचनात्मक समाधान खोजें जो आपकी मौजूदा शक्तियों का उपयोग करे', scores: { creative_expression: 2, ambiguity_tolerance: 2, risk_appetite: 1 } },
      { value: 'D', label: 'Learn just enough to make progress and iterate', labelHi: 'प्रगति करने और दोहराने के लिए बस पर्याप्त सीखें', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q5',
    type: 'situational',
    context: 'Your research reveals information that contradicts popular belief.',
    contextHi: 'आपका शोध ऐसी जानकारी प्रकट करता है जो लोकप्रिय धारणा के विपरीत है।',
    question: 'What would you do?',
    questionHi: 'आप क्या करेंगे?',
    options: [
      { value: 'A', label: 'Verify and re-verify the findings with rigorous analysis', labelHi: 'कठोर विश्लेषण के साथ निष्कर्षों को सत्यापित और पुनः सत्यापित करें', scores: { precision_orientation: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Consider how to present this sensitively to others', labelHi: 'विचार करें कि इसे दूसरों के सामने संवेदनशील रूप से कैसे प्रस्तुत किया जाए', scores: { people_involvement: 2, persuasion_influence: 3 } },
      { value: 'C', label: 'Explore what new possibilities this opens up', labelHi: 'पता लगाएं कि यह कौन सी नई संभावनाएं खोलता है', scores: { creative_expression: 2, ambiguity_tolerance: 2, learning_depth_tolerance: 1 } },
      { value: 'D', label: 'Test the findings practically in the real world', labelHi: 'वास्तविक दुनिया में निष्कर्षों का व्यावहारिक रूप से परीक्षण करें', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q6',
    type: 'situational',
    context: 'You are offered two paths: one is safe and well-understood, the other is risky but innovative.',
    contextHi: 'आपको दो रास्ते दिए गए हैं: एक सुरक्षित और अच्छी तरह से समझा गया है, दूसरा जोखिम भरा लेकिन नवाचारी है।',
    question: 'Which influences your choice more?',
    questionHi: 'आपकी पसंद को कौन अधिक प्रभावित करता है?',
    options: [
      { value: 'A', label: 'The logical assessment of long-term outcomes', labelHi: 'दीर्घकालिक परिणामों का तार्किक मूल्यांकन', scores: { analytical_reasoning: 3, system_thinking: 1 } },
      { value: 'B', label: 'The impact on the people involved', labelHi: 'शामिल लोगों पर प्रभाव', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'The opportunity to try something new', labelHi: 'कुछ नया आजमाने का अवसर', scores: { creative_expression: 2, risk_appetite: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'The certainty of achieving tangible results', labelHi: 'ठोस परिणाम प्राप्त करने की निश्चितता', scores: { execution_drive: 2, precision_orientation: 2, risk_appetite: -1 } },
    ],
  },
  // Forced-Choice Trade-off Questions (Q7-Q10)
  {
    id: 'q7',
    type: 'forced_choice',
    question: 'Which challenge would energize you the most?',
    questionHi: 'कौन सी चुनौती आपको सबसे अधिक ऊर्जा देगी?',
    options: [
      { value: 'A', label: 'Understanding why a complex system behaves the way it does', labelHi: 'समझना कि एक जटिल प्रणाली ऐसा व्यवहार क्यों करती है', scores: { system_thinking: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Helping others overcome a difficult situation', labelHi: 'दूसरों को कठिन स्थिति से उबरने में मदद करना', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Discovering new patterns in large amounts of information', labelHi: 'बड़ी मात्रा में जानकारी में नए पैटर्न खोजना', scores: { analytical_reasoning: 3, learning_depth_tolerance: 1, precision_orientation: 1 } },
      { value: 'D', label: 'Creating something that has never existed before', labelHi: 'कुछ ऐसा बनाना जो पहले कभी नहीं था', scores: { creative_expression: 3, visual_thinking: 2 } },
    ],
  },
  {
    id: 'q8',
    type: 'forced_choice',
    question: 'If you could master one ability, which would you choose?',
    questionHi: 'यदि आप एक क्षमता में महारत हासिल कर सकें, तो कौन सी चुनेंगे?',
    options: [
      { value: 'A', label: 'Building and understanding intricate systems', labelHi: 'जटिल प्रणालियों का निर्माण और समझ', scores: { system_thinking: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Connecting with and understanding people deeply', labelHi: 'लोगों से गहराई से जुड़ना और समझना', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Finding insights in data that others miss', labelHi: 'डेटा में ऐसी अंतर्दृष्टि खोजना जो दूसरों से छूट जाती है', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'D', label: 'Designing elegant solutions to complex problems', labelHi: 'जटिल समस्याओं के लिए सुरुचिपूर्ण समाधान डिज़ाइन करना', scores: { creative_expression: 3, visual_thinking: 2 } },
    ],
  },
  {
    id: 'q9',
    type: 'emotional',
    question: 'Which work outcome would give you the greatest sense of fulfillment?',
    questionHi: 'कौन सा कार्य परिणाम आपको सबसे बड़ी संतुष्टि देगा?',
    options: [
      { value: 'A', label: 'A perfectly functioning system you built', labelHi: 'आपके द्वारा बनाई गई एक पूर्ण रूप से काम करने वाली प्रणाली', scores: { system_thinking: 3, execution_drive: 1 } },
      { value: 'B', label: 'Positive change in someone\'s life because of your work', labelHi: 'आपके काम के कारण किसी के जीवन में सकारात्मक बदलाव', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'A breakthrough discovery or insight', labelHi: 'एक सफल खोज या अंतर्दृष्टि', scores: { analytical_reasoning: 2, learning_depth_tolerance: 2, creative_expression: 1 } },
      { value: 'D', label: 'An innovative creation that inspires others', labelHi: 'एक नवाचारी रचना जो दूसरों को प्रेरित करे', scores: { creative_expression: 3, visual_thinking: 2 } },
    ],
  },
  {
    id: 'q10',
    type: 'emotional',
    question: 'What environment helps you do your best work?',
    questionHi: 'कौन सा वातावरण आपको अपना सर्वश्रेष्ठ काम करने में मदद करता है?',
    options: [
      { value: 'A', label: 'A structured environment with clear processes', labelHi: 'स्पष्ट प्रक्रियाओं के साथ एक संरचित वातावरण', scores: { precision_orientation: 3, planning_drive: 2 } },
      { value: 'B', label: 'A collaborative environment with diverse perspectives', labelHi: 'विविध दृष्टिकोणों के साथ एक सहयोगी वातावरण', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'An open environment where you can explore freely', labelHi: 'एक खुला वातावरण जहां आप स्वतंत्र रूप से खोज सकते हैं', scores: { creative_expression: 2, ambiguity_tolerance: 3, risk_appetite: 1 } },
      { value: 'D', label: 'A fast-paced environment with visible results', labelHi: 'दृश्य परिणामों के साथ एक तेज़ गति वाला वातावरण', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  // Discomfort Detection Questions (Q11-Q12)
  {
    id: 'q11',
    type: 'discomfort',
    question: 'Which would frustrate you the most?',
    questionHi: 'आपको सबसे अधिक क्या निराश करेगा?',
    options: [
      { value: 'A', label: 'A problem that cannot be solved with logic alone', labelHi: 'एक समस्या जिसे केवल तर्क से हल नहीं किया जा सकता', scores: { system_thinking: 2, analytical_reasoning: 2, ambiguity_tolerance: -1 } },
      { value: 'B', label: 'Working in isolation without any human connection', labelHi: 'बिना किसी मानवीय संपर्क के अलगाव में काम करना', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Analysis that leads nowhere actionable', labelHi: 'विश्लेषण जो कहीं कार्रवाई योग्य नहीं ले जाता', scores: { execution_drive: 2, analytical_reasoning: 1, planning_drive: 1 } },
      { value: 'D', label: 'Constraints that limit your creative freedom', labelHi: 'बाधाएं जो आपकी रचनात्मक स्वतंत्रता को सीमित करती हैं', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
    ],
  },
  {
    id: 'q12',
    type: 'discomfort',
    question: 'Which situation would make you most uncomfortable?',
    questionHi: 'कौन सी स्थिति आपको सबसे अधिक असहज करेगी?',
    options: [
      { value: 'A', label: 'Having to proceed without understanding the full picture', labelHi: 'पूरी तस्वीर को समझे बिना आगे बढ़ना', scores: { learning_depth_tolerance: 2, system_thinking: 2, risk_appetite: -1 } },
      { value: 'B', label: 'Making decisions that negatively affect others', labelHi: 'ऐसे निर्णय लेना जो दूसरों को नकारात्मक रूप से प्रभावित करें', scores: { people_involvement: 3, precision_orientation: 1 } },
      { value: 'C', label: 'Presenting work that is technically imperfect', labelHi: 'ऐसा काम प्रस्तुत करना जो तकनीकी रूप से अपूर्ण हो', scores: { precision_orientation: 3, analytical_reasoning: 1 } },
      { value: 'D', label: 'Following a conventional approach when a better way exists', labelHi: 'जब बेहतर तरीका मौजूद हो तो पारंपरिक दृष्टिकोण का पालन करना', scores: { creative_expression: 3, risk_appetite: 1 } },
    ],
  },
  // Validation Questions (Q13-Q15)
  {
    id: 'q13',
    type: 'validation',
    question: 'When starting something new, what do you focus on first?',
    questionHi: 'कुछ नया शुरू करते समय, आप पहले किस पर ध्यान केंद्रित करते हैं?',
    options: [
      { value: 'A', label: 'Understanding how all the pieces fit together', labelHi: 'समझना कि सभी टुकड़े एक साथ कैसे फिट होते हैं', scores: { system_thinking: 3, analytical_reasoning: 1 } },
      { value: 'B', label: 'Understanding who will benefit and how', labelHi: 'समझना कि किसे और कैसे फायदा होगा', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Understanding what has and has not been tried', labelHi: 'समझना कि क्या आजमाया गया है और क्या नहीं', scores: { analytical_reasoning: 2, creative_expression: 1, learning_depth_tolerance: 1 } },
      { value: 'D', label: 'Getting started and learning along the way', labelHi: 'शुरू करना और रास्ते में सीखना', scores: { execution_drive: 3, risk_appetite: 1, ambiguity_tolerance: 1 } },
    ],
  },
  {
    id: 'q14',
    type: 'validation',
    question: 'How do you prefer to solve problems?',
    questionHi: 'आप समस्याओं को कैसे हल करना पसंद करते हैं?',
    options: [
      { value: 'A', label: 'Breaking them down into logical components', labelHi: 'उन्हें तार्किक घटकों में तोड़ना', scores: { analytical_reasoning: 3, system_thinking: 2 } },
      { value: 'B', label: 'Collaborating with others to find solutions', labelHi: 'समाधान खोजने के लिए दूसरों के साथ सहयोग करना', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Looking for unconventional approaches', labelHi: 'अपरंपरागत दृष्टिकोण की तलाश करना', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Testing solutions until one works', labelHi: 'समाधानों का परीक्षण करना जब तक एक काम न करे', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q15',
    type: 'validation',
    question: 'What type of thinking do you find most natural?',
    questionHi: 'किस प्रकार की सोच आपको सबसे स्वाभाविक लगती है?',
    options: [
      { value: 'A', label: 'Logical, step-by-step reasoning', labelHi: 'तार्किक, चरण-दर-चरण तर्क', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'B', label: 'Understanding people and their motivations', labelHi: 'लोगों और उनकी प्रेरणाओं को समझना', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Finding patterns and extracting insights', labelHi: 'पैटर्न खोजना और अंतर्दृष्टि निकालना', scores: { analytical_reasoning: 3, learning_depth_tolerance: 1 } },
      { value: 'D', label: 'Visualizing and creating new concepts', labelHi: 'नई अवधारणाओं की कल्पना और निर्माण करना', scores: { creative_expression: 3, visual_thinking: 2 } },
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
    contextHi: 'आपका संगठन अधूरी जानकारी के साथ एक वित्तीय निर्णय का सामना कर रहा है।',
    question: 'How would you approach this?',
    questionHi: 'आप इसे कैसे संभालेंगे?',
    options: [
      { value: 'A', label: 'Gather and analyze all available data before deciding', labelHi: 'निर्णय लेने से पहले सभी उपलब्ध डेटा इकट्ठा करें और विश्लेषण करें', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'B', label: 'Consult with stakeholders to understand different perspectives', labelHi: 'विभिन्न दृष्टिकोणों को समझने के लिए हितधारकों से परामर्श करें', scores: { people_involvement: 2, persuasion_influence: 2, planning_drive: 1 } },
      { value: 'C', label: 'Find creative ways to get the missing information', labelHi: 'लापता जानकारी प्राप्त करने के रचनात्मक तरीके खोजें', scores: { creative_expression: 2, risk_appetite: 2, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Make the best decision with available information and adjust later', labelHi: 'उपलब्ध जानकारी के साथ सबसे अच्छा निर्णय लें और बाद में समायोजित करें', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  {
    id: 'q2',
    type: 'situational',
    context: 'You need to convince skeptical colleagues about a new approach.',
    contextHi: 'आपको एक नए दृष्टिकोण के बारे में संशयी सहकर्मियों को समझाना है।',
    question: 'What strategy would you use?',
    questionHi: 'आप कौन सी रणनीति अपनाएंगे?',
    options: [
      { value: 'A', label: 'Present detailed data and logical arguments', labelHi: 'विस्तृत डेटा और तार्किक तर्क प्रस्तुत करें', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'B', label: 'Build relationships and address their concerns personally', labelHi: 'संबंध बनाएं और उनकी चिंताओं को व्यक्तिगत रूप से संबोधित करें', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Create an engaging presentation that tells a compelling story', labelHi: 'एक आकर्षक प्रस्तुति बनाएं जो एक सम्मोहक कहानी बताए', scores: { creative_expression: 3, visual_thinking: 1, persuasion_influence: 1 } },
      { value: 'D', label: 'Demonstrate results through a small pilot project', labelHi: 'एक छोटी पायलट परियोजना के माध्यम से परिणाम प्रदर्शित करें', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q3',
    type: 'situational',
    context: 'You discover an opportunity that requires quick action but involves risk.',
    contextHi: 'आपको एक अवसर मिलता है जिसमें त्वरित कार्रवाई की आवश्यकता है लेकिन जोखिम भी शामिल है।',
    question: 'What is your response?',
    questionHi: 'आपकी प्रतिक्रिया क्या है?',
    options: [
      { value: 'A', label: 'Calculate the risks and rewards carefully before acting', labelHi: 'कार्य करने से पहले जोखिम और पुरस्कारों की सावधानीपूर्वक गणना करें', scores: { analytical_reasoning: 3, precision_orientation: 2, risk_appetite: -1 } },
      { value: 'B', label: 'Discuss with trusted advisors to get their input', labelHi: 'उनकी राय लेने के लिए विश्वसनीय सलाहकारों से चर्चा करें', scores: { people_involvement: 3, planning_drive: 1 } },
      { value: 'C', label: 'Look for a creative way to reduce the risk while capturing the opportunity', labelHi: 'अवसर को प्राप्त करते हुए जोखिम को कम करने का रचनात्मक तरीका खोजें', scores: { creative_expression: 2, risk_appetite: 2, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Act quickly to seize the opportunity', labelHi: 'अवसर को पकड़ने के लिए जल्दी से कार्य करें', scores: { execution_drive: 3, risk_appetite: 3 } },
    ],
  },
  {
    id: 'q4',
    type: 'situational',
    context: 'A deadline is approaching but quality is being compromised.',
    contextHi: 'समय सीमा नजदीक आ रही है लेकिन गुणवत्ता से समझौता हो रहा है।',
    question: 'How would you handle this tension?',
    questionHi: 'आप इस तनाव को कैसे संभालेंगे?',
    options: [
      { value: 'A', label: 'Identify what is essential and prioritize accuracy', labelHi: 'पहचानें कि क्या आवश्यक है और सटीकता को प्राथमिकता दें', scores: { precision_orientation: 3, analytical_reasoning: 1, planning_drive: 1 } },
      { value: 'B', label: 'Communicate with stakeholders about realistic expectations', labelHi: 'यथार्थवादी अपेक्षाओं के बारे में हितधारकों के साथ संवाद करें', scores: { people_involvement: 2, persuasion_influence: 2, planning_drive: 1 } },
      { value: 'C', label: 'Find creative shortcuts that maintain quality', labelHi: 'रचनात्मक शॉर्टकट खोजें जो गुणवत्ता बनाए रखें', scores: { creative_expression: 2, ambiguity_tolerance: 2, execution_drive: 1 } },
      { value: 'D', label: 'Push through and deliver, then improve afterwards', labelHi: 'आगे बढ़ें और डिलीवर करें, फिर बाद में सुधार करें', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  {
    id: 'q5',
    type: 'situational',
    context: 'You are asked to lead a team where members have more experience than you.',
    contextHi: 'आपसे एक ऐसी टीम का नेतृत्व करने को कहा गया है जहां सदस्यों के पास आपसे अधिक अनुभव है।',
    question: 'How would you establish credibility?',
    questionHi: 'आप विश्वसनीयता कैसे स्थापित करेंगे?',
    options: [
      { value: 'A', label: 'Demonstrate expertise through thorough preparation and knowledge', labelHi: 'गहन तैयारी और ज्ञान के माध्यम से विशेषज्ञता प्रदर्शित करें', scores: { learning_depth_tolerance: 2, analytical_reasoning: 2, precision_orientation: 1 } },
      { value: 'B', label: 'Build trust through genuine relationships and listening', labelHi: 'वास्तविक संबंधों और सुनने के माध्यम से विश्वास बनाएं', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Bring fresh perspectives and innovative ideas', labelHi: 'नए दृष्टिकोण और नवाचारी विचार लाएं', scores: { creative_expression: 3, risk_appetite: 1 } },
      { value: 'D', label: 'Focus on delivering results and let the work speak', labelHi: 'परिणाम देने पर ध्यान दें और काम को बोलने दें', scores: { execution_drive: 3, planning_drive: 1 } },
    ],
  },
  {
    id: 'q6',
    type: 'situational',
    context: 'Market conditions are changing rapidly and old strategies are not working.',
    contextHi: 'बाजार की स्थितियां तेजी से बदल रही हैं और पुरानी रणनीतियां काम नहीं कर रही हैं।',
    question: 'What would be your priority?',
    questionHi: 'आपकी प्राथमिकता क्या होगी?',
    options: [
      { value: 'A', label: 'Analyze the new conditions systematically', labelHi: 'नई स्थितियों का व्यवस्थित रूप से विश्लेषण करें', scores: { analytical_reasoning: 3, system_thinking: 2 } },
      { value: 'B', label: 'Understand how customers and competitors are responding', labelHi: 'समझें कि ग्राहक और प्रतिस्पर्धी कैसे प्रतिक्रिया दे रहे हैं', scores: { people_involvement: 2, persuasion_influence: 2, planning_drive: 1 } },
      { value: 'C', label: 'Develop innovative approaches for the new environment', labelHi: 'नए वातावरण के लिए नवाचारी दृष्टिकोण विकसित करें', scores: { creative_expression: 3, ambiguity_tolerance: 2 } },
      { value: 'D', label: 'Take quick action to test new strategies', labelHi: 'नई रणनीतियों का परीक्षण करने के लिए त्वरित कार्रवाई करें', scores: { execution_drive: 3, risk_appetite: 2 } },
    ],
  },
  // Forced-Choice Trade-off Questions (Q7-Q10)
  {
    id: 'q7',
    type: 'forced_choice',
    question: 'Which kind of work would you find most engaging?',
    questionHi: 'किस प्रकार का काम आपको सबसे अधिक आकर्षक लगेगा?',
    options: [
      { value: 'A', label: 'Ensuring accuracy and compliance in complex matters', labelHi: 'जटिल मामलों में सटीकता और अनुपालन सुनिश्चित करना', scores: { precision_orientation: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Leading teams and developing people', labelHi: 'टीमों का नेतृत्व करना और लोगों को विकसित करना', scores: { people_involvement: 3, persuasion_influence: 2 } },
      { value: 'C', label: 'Creating strategies to reach new audiences', labelHi: 'नए दर्शकों तक पहुंचने के लिए रणनीतियां बनाना', scores: { creative_expression: 3, persuasion_influence: 1, risk_appetite: 1 } },
      { value: 'D', label: 'Analyzing trends to make better decisions', labelHi: 'बेहतर निर्णय लेने के लिए रुझानों का विश्लेषण करना', scores: { analytical_reasoning: 3, planning_drive: 1 } },
    ],
  },
  {
    id: 'q8',
    type: 'forced_choice',
    question: 'Which strength would serve you best in your ideal future?',
    questionHi: 'कौन सी शक्ति आपके आदर्श भविष्य में आपकी सबसे अच्छी सेवा करेगी?',
    options: [
      { value: 'A', label: 'Meticulous attention to detail and accuracy', labelHi: 'विवरण और सटीकता पर सूक्ष्म ध्यान', scores: { precision_orientation: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Ability to inspire and lead others', labelHi: 'दूसरों को प्रेरित और नेतृत्व करने की क्षमता', scores: { people_involvement: 2, persuasion_influence: 3 } },
      { value: 'C', label: 'Creative thinking and communication', labelHi: 'रचनात्मक सोच और संचार', scores: { creative_expression: 3, visual_thinking: 1, persuasion_influence: 1 } },
      { value: 'D', label: 'Strategic decision-making with numbers', labelHi: 'संख्याओं के साथ रणनीतिक निर्णय लेना', scores: { analytical_reasoning: 3, risk_appetite: 1, planning_drive: 1 } },
    ],
  },
  {
    id: 'q9',
    type: 'emotional',
    question: 'What type of achievement would make you most proud?',
    questionHi: 'किस प्रकार की उपलब्धि आपको सबसे अधिक गर्वित करेगी?',
    options: [
      { value: 'A', label: 'Solving a complex problem that required deep expertise', labelHi: 'एक जटिल समस्या को हल करना जिसमें गहरी विशेषज्ञता की आवश्यकता थी', scores: { learning_depth_tolerance: 2, analytical_reasoning: 2, precision_orientation: 1 } },
      { value: 'B', label: 'Building and leading a successful team', labelHi: 'एक सफल टीम बनाना और उसका नेतृत्व करना', scores: { people_involvement: 3, planning_drive: 1 } },
      { value: 'C', label: 'Creating a campaign or idea that resonated widely', labelHi: 'एक अभियान या विचार बनाना जो व्यापक रूप से गूंजा', scores: { creative_expression: 3, persuasion_influence: 2 } },
      { value: 'D', label: 'Making a decision that produced significant results', labelHi: 'एक निर्णय लेना जिसने महत्वपूर्ण परिणाम दिए', scores: { analytical_reasoning: 2, execution_drive: 2, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q10',
    type: 'emotional',
    question: 'Which work rhythm suits you best?',
    questionHi: 'कौन सी कार्य लय आपको सबसे अधिक सूट करती है?',
    options: [
      { value: 'A', label: 'Methodical and consistent with high attention to detail', labelHi: 'व्यवस्थित और विवरण पर उच्च ध्यान के साथ संगत', scores: { precision_orientation: 3, planning_drive: 2 } },
      { value: 'B', label: 'Interactive and people-focused with varied activities', labelHi: 'विविध गतिविधियों के साथ इंटरैक्टिव और लोगों पर केंद्रित', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Dynamic and creative with room for innovation', labelHi: 'नवाचार के लिए जगह के साथ गतिशील और रचनात्मक', scores: { creative_expression: 3, ambiguity_tolerance: 1, risk_appetite: 1 } },
      { value: 'D', label: 'Fast-paced and results-driven with clear goals', labelHi: 'स्पष्ट लक्ष्यों के साथ तेज़ गति और परिणाम-संचालित', scores: { execution_drive: 3, planning_drive: 1 } },
    ],
  },
  // Discomfort Detection Questions (Q11-Q12)
  {
    id: 'q11',
    type: 'discomfort',
    question: 'Which situation would frustrate you the most?',
    questionHi: 'कौन सी स्थिति आपको सबसे अधिक निराश करेगी?',
    options: [
      { value: 'A', label: 'Errors slipping through due to rushed work', labelHi: 'जल्दबाजी में काम के कारण गलतियां निकल जाना', scores: { precision_orientation: 3, analytical_reasoning: 1 } },
      { value: 'B', label: 'Working in isolation without team collaboration', labelHi: 'टीम सहयोग के बिना अलगाव में काम करना', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'Following rigid processes with no room for creativity', labelHi: 'रचनात्मकता के लिए कोई जगह न होने के साथ कठोर प्रक्रियाओं का पालन करना', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Endless planning without any execution', labelHi: 'बिना किसी निष्पादन के अंतहीन योजना बनाना', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q12',
    type: 'discomfort',
    question: 'What would bother you most about your work?',
    questionHi: 'आपके काम के बारे में आपको सबसे अधिक क्या परेशान करेगा?',
    options: [
      { value: 'A', label: 'Uncertainty about whether you are correct', labelHi: 'इस बारे में अनिश्चितता कि आप सही हैं या नहीं', scores: { precision_orientation: 3, analytical_reasoning: 1, risk_appetite: -1 } },
      { value: 'B', label: 'Lack of recognition from others', labelHi: 'दूसरों से मान्यता की कमी', scores: { persuasion_influence: 2, people_involvement: 2 } },
      { value: 'C', label: 'Repetitive tasks with no variety', labelHi: 'बिना किसी विविधता के दोहराव वाले कार्य', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'Goals that keep changing without resolution', labelHi: 'लक्ष्य जो बिना समाधान के बदलते रहते हैं', scores: { planning_drive: 2, execution_drive: 2, precision_orientation: 1 } },
    ],
  },
  // Validation Questions (Q13-Q15)
  {
    id: 'q13',
    type: 'validation',
    question: 'When evaluating opportunities, what matters most to you?',
    questionHi: 'अवसरों का मूल्यांकन करते समय, आपके लिए सबसे महत्वपूर्ण क्या है?',
    options: [
      { value: 'A', label: 'The stability and predictability of outcomes', labelHi: 'परिणामों की स्थिरता और पूर्वानुमेयता', scores: { precision_orientation: 2, planning_drive: 2, risk_appetite: -1 } },
      { value: 'B', label: 'The opportunity to work with and lead others', labelHi: 'दूसरों के साथ काम करने और उनका नेतृत्व करने का अवसर', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'The scope for creativity and self-expression', labelHi: 'रचनात्मकता और आत्म-अभिव्यक्ति का दायरा', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'The potential for growth and high returns', labelHi: 'विकास और उच्च रिटर्न की संभावना', scores: { risk_appetite: 3, analytical_reasoning: 1 } },
    ],
  },
  {
    id: 'q14',
    type: 'validation',
    question: 'How do you naturally approach new challenges?',
    questionHi: 'आप स्वाभाविक रूप से नई चुनौतियों को कैसे संभालते हैं?',
    options: [
      { value: 'A', label: 'With careful analysis and thorough preparation', labelHi: 'सावधानीपूर्वक विश्लेषण और गहन तैयारी के साथ', scores: { analytical_reasoning: 3, precision_orientation: 2 } },
      { value: 'B', label: 'By building a team and leveraging relationships', labelHi: 'टीम बनाकर और संबंधों का लाभ उठाकर', scores: { people_involvement: 3, persuasion_influence: 1 } },
      { value: 'C', label: 'By finding innovative angles others have missed', labelHi: 'ऐसे नवाचारी कोण खोजकर जो दूसरों से छूट गए', scores: { creative_expression: 3, ambiguity_tolerance: 1 } },
      { value: 'D', label: 'By taking action and learning from experience', labelHi: 'कार्रवाई करके और अनुभव से सीखकर', scores: { execution_drive: 3, risk_appetite: 1 } },
    ],
  },
  {
    id: 'q15',
    type: 'validation',
    question: 'In your ideal role, you would be known for:',
    questionHi: 'अपनी आदर्श भूमिका में, आप किसके लिए जाने जाएंगे:',
    options: [
      { value: 'A', label: 'Accuracy, expertise, and reliability', labelHi: 'सटीकता, विशेषज्ञता और विश्वसनीयता', scores: { precision_orientation: 3, analytical_reasoning: 2 } },
      { value: 'B', label: 'Leadership, influence, and team building', labelHi: 'नेतृत्व, प्रभाव और टीम निर्माण', scores: { people_involvement: 2, persuasion_influence: 3 } },
      { value: 'C', label: 'Creativity, communication, and fresh ideas', labelHi: 'रचनात्मकता, संचार और नए विचार', scores: { creative_expression: 3, visual_thinking: 1, persuasion_influence: 1 } },
      { value: 'D', label: 'Results, strategy, and sound judgment', labelHi: 'परिणाम, रणनीति और सही निर्णय', scores: { analytical_reasoning: 2, execution_drive: 2, planning_drive: 1 } },
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
