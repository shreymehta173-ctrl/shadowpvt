import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-3-flash-preview";

interface CareerMatch {
  career_id: string;
  career_name: string;
  industry: string;
  match_score: number;
  skill_fit_score: number;
  interest_fit_score: number;
  gap_penalty_score: number;
  description: string;
  icon: string;
  color: string;
  difficulty_level: number;
  future_scope_score: number;
  growth_rate: string;
  average_salary_min: number;
  average_salary_max: number;
  required_skills: string[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized: Missing or invalid authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate JWT token and get user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    
    if (userError || !user) {
      console.error("JWT validation error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    const { action, student_id, career_id, message, language = "English", chat_history = [], assessment_context } = await req.json();

    // Verify the student_id belongs to the authenticated user
    const { data: studentProfile, error: profileError } = await supabaseClient
      .from("student_profiles")
      .select("id")
      .eq("id", student_id)
      .eq("user_id", userId)
      .single();

    if (profileError || !studentProfile) {
      console.error("Profile authorization error:", profileError);
      return new Response(JSON.stringify({ error: "Forbidden: You do not have access to this student profile" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (action) {
      case "get_recommendations":
        return await getRecommendations(supabaseClient, student_id, language);
      case "get_career_detail":
        return await getCareerDetail(supabaseClient, student_id, career_id, language);
      case "chat":
        return await handleChat(supabaseClient, student_id, message, language, chat_history, assessment_context);
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function getRecommendations(supabaseClient: any, studentId: string, language: string) {
  // Fetch student profile
  const { data: profile } = await supabaseClient
    .from("student_profiles")
    .select("*")
    .eq("id", studentId)
    .single();

  // Fetch all careers
  const { data: careers } = await supabaseClient.from("careers").select("*");

  // Fetch student's skill progress
  const { data: skillProgress } = await supabaseClient
    .from("skill_progress")
    .select("*, skills(*)")
    .eq("student_id", studentId);

  // Fetch learning gaps
  const { data: learningGaps } = await supabaseClient
    .from("learning_gaps")
    .select("*")
    .eq("student_id", studentId)
    .is("resolved_at", null);

  // Calculate match scores for each career
  const recommendations: CareerMatch[] = careers?.map((career: any) => {
    const match = calculateCareerMatch(career, profile, skillProgress, learningGaps);
    return {
      career_id: career.id,
      career_name: career.name,
      industry: career.industry,
      match_score: match.total,
      skill_fit_score: match.skillFit,
      interest_fit_score: match.interestFit,
      gap_penalty_score: match.gapPenalty,
      description: career.description,
      icon: career.icon,
      color: career.color,
      difficulty_level: career.difficulty_level,
      future_scope_score: career.future_scope_score,
      growth_rate: career.growth_rate,
      average_salary_min: career.average_salary_min,
      average_salary_max: career.average_salary_max,
      required_skills: career.required_skills,
    };
  }) || [];

  // Sort by match score
  recommendations.sort((a, b) => b.match_score - a.match_score);

  return new Response(JSON.stringify({ recommendations: recommendations.slice(0, 10) }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function calculateCareerMatch(
  career: any,
  profile: any,
  skillProgress: any[],
  learningGaps: any[]
) {
  let skillFit = 0;
  let interestFit = 0;
  let gapPenalty = 0;

  // Skill Fit (40% weight)
  const requiredSkills = career.required_skills || [];
  const studentSkills = skillProgress?.map((sp) => sp.skills?.name?.toLowerCase()) || [];
  const matchedSkills = requiredSkills.filter((skill: string) =>
    studentSkills.some((s: string) => s?.includes(skill.toLowerCase()))
  );
  skillFit = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 50;

  // Interest Fit (25% weight)
  const interests = profile?.interests || [];
  const preferredSubjects = career.preferred_subjects || [];
  const industryMatch = interests.some(
    (i: string) =>
      i.toLowerCase().includes(career.industry.toLowerCase()) ||
      career.industry.toLowerCase().includes(i.toLowerCase())
  );
  const subjectMatch = interests.filter((i: string) =>
    preferredSubjects.some((s: string) => s.toLowerCase().includes(i.toLowerCase()))
  ).length;
  interestFit = industryMatch ? 70 : 30;
  interestFit += Math.min(subjectMatch * 10, 30);

  // Gap Penalty (up to 15% reduction)
  const criticalGaps = learningGaps?.filter((g) => g.severity === "critical").length || 0;
  const moderateGaps = learningGaps?.filter((g) => g.severity === "moderate").length || 0;
  gapPenalty = Math.min(criticalGaps * 5 + moderateGaps * 2, 15);

  // Future Scope bonus (20% weight)
  const futureBonus = (career.future_scope_score / 10) * 20;

  const total = skillFit * 0.4 + interestFit * 0.25 + futureBonus - gapPenalty;

  return {
    total: Math.min(Math.max(total, 0), 100),
    skillFit,
    interestFit,
    gapPenalty,
  };
}

async function getCareerDetail(
  supabaseClient: any,
  studentId: string,
  careerId: string,
  language: string
) {
  const { data: career } = await supabaseClient
    .from("careers")
    .select("*")
    .eq("id", careerId)
    .single();

  if (!career) {
    return new Response(JSON.stringify({ error: "Career not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Fetch student profile for personalized explanation
  const { data: profile } = await supabaseClient
    .from("student_profiles")
    .select("*")
    .eq("id", studentId)
    .single();

  // Generate AI explanation using Lovable AI
  const aiExplanation = await generateAIExplanation(career, profile, language);
  const aiRoadmap = await generateAIRoadmap(career, profile, language);

  // Store the recommendation
  try {
    await supabaseClient.from("career_recommendations").upsert({
      student_id: studentId,
      career_id: careerId,
      match_score: 75,
      ai_explanation: aiExplanation,
      ai_roadmap: aiRoadmap,
      language,
    }, { onConflict: 'student_id,career_id' });
  } catch (e) {
    console.error("Error storing recommendation:", e);
  }

  return new Response(
    JSON.stringify({
      ...career,
      ai_explanation: aiExplanation,
      ai_roadmap: aiRoadmap,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function generateAIExplanation(career: any, profile: any, language: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY is not configured");
    return getDefaultExplanation(career, language);
  }

  try {
    const prompt = language === "Hindi"
      ? `आप एक अनुभवी करियर सलाहकार हैं। ${profile?.display_name || "छात्र"} के लिए बताएं कि ${career.name} उनके लिए क्यों एक उत्कृष्ट विकल्प हो सकता है। उनकी रुचियां: ${profile?.interests?.join(", ") || "अभी तक ज्ञात नहीं"}। 3-4 वाक्यों में व्यक्तिगत और प्रेरक जवाब दें।`
      : `You are an experienced career advisor. Explain why ${career.name} could be an excellent fit for ${profile?.display_name || "this student"}. Their interests include: ${profile?.interests?.join(", ") || "not yet specified"}. Provide a personalized, encouraging response in 3-4 sentences.`;

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error [${response.status}]:`, errorText);
      if (response.status === 429) {
        return "Rate limit exceeded. Please try again later.";
      }
      if (response.status === 402) {
        return "AI credits exhausted. Please add credits to continue.";
      }
      return getDefaultExplanation(career, language);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || getDefaultExplanation(career, language);
  } catch (error) {
    console.error("AI explanation error:", error);
    return getDefaultExplanation(career, language);
  }
}

function getDefaultExplanation(career: any, language: string): string {
  if (language === "Hindi") {
    return `${career.name} एक उत्कृष्ट करियर विकल्प है जो ${career.industry} क्षेत्र में शानदार अवसर प्रदान करता है। इस क्षेत्र में विकास की संभावनाएं बहुत अच्छी हैं।`;
  }
  return `${career.name} is an excellent career choice offering great opportunities in the ${career.industry} sector. This field has strong growth potential and offers rewarding career paths.`;
}

async function generateAIRoadmap(career: any, profile: any, language: string): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY is not configured");
    return getDefaultRoadmap(career, language);
  }

  try {
    const prompt = language === "Hindi"
      ? `${career.name} बनने के लिए एक विस्तृत 4-चरणीय रोडमैप बनाएं। छात्र का नाम: ${profile?.display_name || "छात्र"}। कृपया JSON format में जवाब दें: {"steps": [{"phase": "चरण नाम", "duration": "अवधि", "focus_areas": ["फोकस क्षेत्र"], "milestones": ["उपलब्धियां"]}]}`
      : `Create a detailed 4-step career roadmap to become a ${career.name}. Student name: ${profile?.display_name || "Student"}. Respond ONLY with valid JSON in this format: {"steps": [{"phase": "Phase name", "duration": "Duration", "focus_areas": ["focus areas"], "milestones": ["achievement goals"]}]}`;

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      console.error(`AI roadmap API error [${response.status}]`);
      return getDefaultRoadmap(career, language);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Try to parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return getDefaultRoadmap(career, language);
      }
    }
    return getDefaultRoadmap(career, language);
  } catch (error) {
    console.error("AI roadmap error:", error);
    return getDefaultRoadmap(career, language);
  }
}

function getDefaultRoadmap(career: any, language: string): any {
  if (language === "Hindi") {
    return {
      steps: [
        { phase: "नींव निर्माण", duration: "6 महीने", focus_areas: ["मूल अवधारणाएं", "बुनियादी कौशल"], milestones: ["प्रमाणपत्र", "पोर्टफोलियो शुरू"] },
        { phase: "कौशल विकास", duration: "1 वर्ष", focus_areas: ["व्यावहारिक अनुभव", "प्रोजेक्ट्स"], milestones: ["3+ प्रोजेक्ट्स", "GitHub प्रोफाइल"] },
        { phase: "विशेषज्ञता", duration: "6 महीने", focus_areas: ["उन्नत विषय", "विशेष कौशल"], milestones: ["उन्नत प्रमाणपत्र", "मेंटॉरशिप"] },
        { phase: "करियर प्रवेश", duration: "3 महीने", focus_areas: ["इंटर्नशिप", "नेटवर्किंग"], milestones: ["नौकरी आवेदन", "साक्षात्कार सफलता"] },
      ],
    };
  }
  return {
    steps: [
      { phase: "Foundation Building", duration: "6 months", focus_areas: ["Core concepts", "Basic skills"], milestones: ["Certifications", "Start portfolio"] },
      { phase: "Skill Development", duration: "1 year", focus_areas: ["Hands-on experience", "Real projects"], milestones: ["3+ projects", "GitHub profile"] },
      { phase: "Specialization", duration: "6 months", focus_areas: ["Advanced topics", "Domain expertise"], milestones: ["Advanced certs", "Mentorship"] },
      { phase: "Career Entry", duration: "3 months", focus_areas: ["Internships", "Networking"], milestones: ["Job applications", "Interview success"] },
    ],
  };
}

async function handleChat(
  supabaseClient: any, 
  studentId: string, 
  message: string, 
  language: string,
  chatHistory: Array<{ role: string; content: string }>,
  assessmentContext?: {
    completed_class: string;
    stream?: string;
    scores: Record<string, number>;
    career_matches: Array<{
      name: string;
      matchScore: number;
      description: string;
      educationPath?: string[];
      entranceExams?: string[];
      salaryRange?: string;
      growthOutlook?: string;
      reasons?: string[];
    }>;
    top_career?: {
      name: string;
      matchScore: number;
      description: string;
      educationPath?: string[];
      reasons?: string[];
    };
  }
) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY is not configured");
    return new Response(
      JSON.stringify({ error: "AI service not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Fetch student context
  const { data: profile } = await supabaseClient
    .from("student_profiles")
    .select("*")
    .eq("id", studentId)
    .single();

  // Build comprehensive pathway-specific context
  let pathwayContext = "";
  let careerContext = "";
  let strengthsContext = "";
  let examGuidance = "";
  
  if (assessmentContext) {
    // Determine pathway label and relevant guidance
    if (assessmentContext.completed_class === 'after_10th') {
      pathwayContext = 'After 10th Standard';
      examGuidance = `
**Relevant Competitive Exams:**
- NTSE (National Talent Search Examination) - November/May
- Science/Math Olympiads - December-February
- KVPY/INSPIRE - For science aptitude
- Polytechnic Entrance - For diploma courses

**Stream Options to Discuss:**
- Science (PCM/PCB) → Engineering/Medical/Research
- Commerce → CA/CS/MBA/Finance
- Arts/Humanities → Law/Civil Services/Journalism
- Diploma/ITI → Technical skills/Early employment`;
    } else if (assessmentContext.completed_class === 'after_12th_science') {
      pathwayContext = `After 12th Science (${assessmentContext.stream || 'General'})`;
      examGuidance = assessmentContext.stream === 'PCM' || assessmentContext.stream === 'PCMB'
        ? `
**Engineering Entrance Exams:**
- JEE Main (January/April) - NITs, IIITs
- JEE Advanced (June) - IITs
- BITSAT (May) - BITS Pilani
- State Engineering Entrances - State colleges
- VITEEE, SRMJEE, MET - Private universities

**Other Options:**
- BSc + Research path
- Defense Services (NDA, CDS)
- Architecture (JEE Paper 2, NATA)`
        : `
**Medical Entrance Exams:**
- NEET UG (May) - MBBS/BDS/BAMS/BHMS
- AIIMS (through NEET)
- JIPMER (through NEET)

**Allied Health Sciences:**
- Nursing, Physiotherapy, Lab Technology
- BSc Biotechnology, Microbiology
- Pharmacy (B.Pharm)`;
    } else {
      pathwayContext = 'After 12th Commerce';
      examGuidance = `
**Professional Course Exams:**
- CA Foundation (May/November) - Chartered Accountant
- CS Foundation (June/December) - Company Secretary
- CMA Foundation - Cost Accountant

**University Entrances:**
- CUET - Central Universities
- IPMAT - IIM IPM Program
- DU JAT - Delhi University
- SET - Symbiosis Entrance
- NPAT - NMIMS Programs

**Other Paths:**
- B.Com + CA/CS articleship
- BBA + MBA
- Economics Honours → Civil Services`;
    }
    
    // Build career recommendations context
    if (assessmentContext.career_matches && assessmentContext.career_matches.length > 0) {
      careerContext = assessmentContext.career_matches
        .slice(0, 5)
        .map((c, i) => {
          const details = [
            `${i + 1}. **${c.name}** (${c.matchScore}% match)`,
            `   ${c.description}`,
            c.educationPath ? `   📚 Path: ${c.educationPath.join(' → ')}` : '',
            c.entranceExams ? `   📝 Exams: ${c.entranceExams.join(', ')}` : '',
            c.salaryRange ? `   💰 Salary: ${c.salaryRange}` : '',
            c.growthOutlook ? `   📈 Growth: ${c.growthOutlook}` : '',
            c.reasons && c.reasons.length > 0 ? `   ✨ Why it fits: ${c.reasons.join(', ')}` : '',
          ].filter(Boolean).join('\n');
          return details;
        })
        .join('\n\n');
    }
    
    // Build strengths context from behavioral scores
    if (assessmentContext.scores) {
      const traitLabels: Record<string, string> = {
        analytical_reasoning: 'Analytical Thinking',
        system_thinking: 'Systems Thinking',
        people_involvement: 'People Skills',
        persuasion_influence: 'Persuasion & Influence',
        creative_expression: 'Creativity',
        visual_thinking: 'Visual Thinking',
        precision_orientation: 'Precision & Detail',
        risk_appetite: 'Risk Appetite',
        learning_depth_tolerance: 'Deep Learning',
        ambiguity_tolerance: 'Adaptability',
        execution_drive: 'Execution Drive',
        planning_drive: 'Strategic Planning',
      };
      
      const sortedScores = Object.entries(assessmentContext.scores)
        .sort(([,a], [,b]) => b - a);
      
      const maxScore = Math.max(...Object.values(assessmentContext.scores), 1);
      
      const topStrengths = sortedScores.slice(0, 4)
        .map(([key, value]) => `${traitLabels[key] || key} (${Math.round((value / maxScore) * 100)}%)`)
        .join(', ');
      
      const growthAreas = sortedScores.slice(-2)
        .map(([key, value]) => `${traitLabels[key] || key} (${Math.round((value / maxScore) * 100)}%)`)
        .join(', ');
      
      strengthsContext = `
**Top Behavioral Strengths:** ${topStrengths}
**Areas for Development:** ${growthAreas}`;
    }
  } else {
    // Fallback context
    pathwayContext = "Assessment not yet completed";
  }

  const systemPrompt = language === "Hindi"
    ? `आप PrepMate के एक विशेषज्ञ करियर मेंटर AI हैं। आप एक टीम हैं:
- करियर मनोवैज्ञानिक
- भारतीय शिक्षा परामर्शदाता
- प्रवेश परीक्षा विशेषज्ञ
- कौशल विकास कोच

**छात्र प्रोफाइल:**
- नाम: ${profile?.display_name || "छात्र"}
- कक्षा: ${profile?.grade || "अज्ञात"}
- मूल्यांकन: ${pathwayContext}
- रुचियां: ${profile?.interests?.join(", ") || "अभी तक निर्दिष्ट नहीं"}

**करियर सिफारिशें:**
${careerContext || 'कोई सिफारिश उपलब्ध नहीं - मूल्यांकन पूरा करें'}

${strengthsContext}

${examGuidance}

**आपकी क्षमताएं:**
1. करियर मार्गदर्शन और विश्लेषण
2. प्रवेश परीक्षा रणनीति और समयसीमा
3. कौशल विकास योजना
4. कॉलेज और कोर्स चयन सलाह
5. स्टार्टअप और प्रोजेक्ट आइडियाज
6. इंटर्नशिप और नौकरी तैयारी
7. दिन-प्रतिदिन करियर परिदृश्य
8. वेतन और विकास संभावनाएं

**निर्देश:**
- हमेशा छात्र के मूल्यांकन परिणामों के आधार पर व्यक्तिगत सलाह दें
- विशिष्ट परीक्षा नाम, तिथियां और तैयारी रणनीति बताएं
- प्रेरक और सहायक बनें
- Markdown फ़ॉर्मेटिंग का उपयोग करें
- हिंदी में जवाब दें`
    : `You are an expert Career Mentor AI from PrepMate by Team Shadow. You embody a team of:
- Career Psychologist
- Behavioral Scientist  
- Indian Education Counselor
- Entrance Exam Specialist
- Skills Development Coach

**Student Profile:**
- Name: ${profile?.display_name || "Student"}
- Grade: ${profile?.grade || "Not specified"}
- Assessment Type: ${pathwayContext}
- Interests: ${profile?.interests?.join(", ") || "Not yet specified"}
- Learning Pace: ${profile?.learning_speed || "average"}

**Career Recommendations from Behavioral Assessment:**
${careerContext || 'No recommendations yet - student should complete assessment first'}

${strengthsContext}

${examGuidance}

**Your Capabilities - You Can Help With:**
1. **Career Analysis** - Deep dive into any career path, daily work life, challenges, rewards
2. **Entrance Exam Strategy** - Specific exam names, dates, syllabus, preparation timeline
3. **Skill Development Plans** - What to learn, resources, certifications
4. **College & Course Selection** - Best institutions, cutoffs, admission process
5. **Startup & Project Ideas** - Relevant to student's interests and skills
6. **Internship & Job Prep** - Resume, interview, networking tips
7. **Day-in-the-Life Scenarios** - Realistic stories of professionals in different careers
8. **Salary & Growth Insights** - Realistic expectations and career progression
9. **Alternative Paths** - If someone wants to switch streams or explore unconventional careers

**Response Guidelines:**
- ALWAYS ground your advice in the student's assessment results and match scores
- Provide specific exam names, dates, and preparation strategies
- Use bullet points, numbered lists, and headers for clarity
- Be encouraging but realistic about challenges
- Include actionable next steps
- If asked about career outside their pathway, explain transition possibilities
- Generate detailed day-in-the-life scenarios when asked
- Use markdown formatting for better readability
- Be warm, supportive, and personalized in your responses`;

  try {
    // Build messages array with history
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.slice(-12).map(msg => ({ 
        role: msg.role as "user" | "assistant", 
        content: msg.content 
      })),
      { role: "user", content: message },
    ];

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI chat error [${response.status}]:`, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ response: getDefaultChatResponse(language) }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || getDefaultChatResponse(language);

    // Store chat history asynchronously (don't block response)
    Promise.all([
      supabaseClient.from("career_chat_history").insert({
        student_id: studentId,
        role: "user",
        content: message,
      }),
      supabaseClient.from("career_chat_history").insert({
        student_id: studentId,
        role: "assistant",
        content: aiResponse,
      }),
    ]).catch(e => console.error("Error storing chat history:", e));

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ response: getDefaultChatResponse(language) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

function getDefaultChatResponse(language: string): string {
  if (language === "Hindi") {
    return "मैं आपकी करियर मार्गदर्शन में मदद करने के लिए यहां हूं। कृपया अपना प्रश्न पूछें - करियर, परीक्षा, कॉलेज, या कौशल के बारे में कुछ भी पूछ सकते हैं!";
  }
  return "I'm here to help with your career guidance! Feel free to ask about careers, entrance exams, college selection, skill development, or anything else. I'll provide personalized advice based on your assessment results.";
}
