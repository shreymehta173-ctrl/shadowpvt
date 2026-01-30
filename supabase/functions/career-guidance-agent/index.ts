import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { action, student_id, career_id, message, language = "English" } = await req.json();

    switch (action) {
      case "get_recommendations":
        return await getRecommendations(supabaseClient, student_id, language);
      case "get_career_detail":
        return await getCareerDetail(supabaseClient, student_id, career_id, language);
      case "chat":
        return await handleChat(supabaseClient, student_id, message, language);
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
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
  await supabaseClient.from("career_recommendations").upsert({
    student_id: studentId,
    career_id: careerId,
    match_score: 75,
    ai_explanation: aiExplanation,
    ai_roadmap: aiRoadmap,
    language,
  }, { onConflict: 'student_id,career_id' });

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
  try {
    const prompt = language === "Hindi"
      ? `आप एक करियर सलाहकार हैं। ${profile?.display_name || "छात्र"} के लिए बताएं कि ${career.name} उनके लिए क्यों अच्छा विकल्प है। उनकी रुचियां: ${profile?.interests?.join(", ") || "N/A"}. 2-3 वाक्यों में जवाब दें।`
      : `You are a career advisor. Explain why ${career.name} could be a good fit for ${profile?.display_name || "this student"}. Their interests: ${profile?.interests?.join(", ") || "N/A"}. Keep it to 2-3 sentences.`;

    const response = await fetch("https://api.lovable.dev/v1/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error("AI API error");
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
    return `${career.name} एक उत्कृष्ट करियर विकल्प है जो ${career.industry} क्षेत्र में अवसर प्रदान करता है।`;
  }
  return `${career.name} is an excellent career choice offering opportunities in the ${career.industry} sector.`;
}

async function generateAIRoadmap(career: any, profile: any, language: string): Promise<any> {
  try {
    const prompt = language === "Hindi"
      ? `${career.name} बनने के लिए एक 4-चरणीय रोडमैप बनाएं। JSON format में जवाब दें: {"steps": [{"phase": "चरण नाम", "duration": "समय", "focus_areas": ["क्षेत्र"], "milestones": ["लक्ष्य"]}]}`
      : `Create a 4-step roadmap to become a ${career.name}. Respond in JSON format: {"steps": [{"phase": "Phase name", "duration": "Duration", "focus_areas": ["areas"], "milestones": ["goals"]}]}`;

    const response = await fetch("https://api.lovable.dev/v1/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error("AI API error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Try to parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
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
        { phase: "नींव", duration: "6 महीने", focus_areas: ["मूल अवधारणाएं"], milestones: ["बुनियादी ज्ञान"] },
        { phase: "कौशल विकास", duration: "1 वर्ष", focus_areas: ["व्यावहारिक कौशल"], milestones: ["प्रोजेक्ट्स"] },
        { phase: "विशेषज्ञता", duration: "6 महीने", focus_areas: ["उन्नत विषय"], milestones: ["प्रमाणपत्र"] },
        { phase: "करियर प्रवेश", duration: "3 महीने", focus_areas: ["इंटर्नशिप"], milestones: ["नौकरी"] },
      ],
    };
  }
  return {
    steps: [
      { phase: "Foundation", duration: "6 months", focus_areas: ["Core concepts"], milestones: ["Basic knowledge"] },
      { phase: "Skill Development", duration: "1 year", focus_areas: ["Practical skills"], milestones: ["Projects"] },
      { phase: "Specialization", duration: "6 months", focus_areas: ["Advanced topics"], milestones: ["Certifications"] },
      { phase: "Career Entry", duration: "3 months", focus_areas: ["Internships"], milestones: ["Job placement"] },
    ],
  };
}

async function handleChat(supabaseClient: any, studentId: string, message: string, language: string) {
  // Fetch student context
  const { data: profile } = await supabaseClient
    .from("student_profiles")
    .select("*")
    .eq("id", studentId)
    .single();

  const { data: recommendations } = await supabaseClient
    .from("career_recommendations")
    .select("*, careers(*)")
    .eq("student_id", studentId)
    .limit(5);

  // Build context
  const careerContext = recommendations
    ?.map((r: any) => `${r.careers?.name} (${r.match_score}% match)`)
    .join(", ");

  const systemPrompt = language === "Hindi"
    ? `आप एक करियर सलाहकार AI हैं। छात्र का नाम ${profile?.display_name || "छात्र"} है। उनकी रुचियां: ${profile?.interests?.join(", ") || "N/A"}। शीर्ष करियर मिलान: ${careerContext || "अभी तक कोई नहीं"}। हिंदी में जवाब दें।`
    : `You are a career advisor AI. Student name: ${profile?.display_name || "Student"}. Interests: ${profile?.interests?.join(", ") || "N/A"}. Top career matches: ${careerContext || "None yet"}. Keep responses helpful and concise.`;

  try {
    const response = await fetch("https://api.lovable.dev/v1/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error("AI API error");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || getDefaultChatResponse(language);

    // Store chat history
    await supabaseClient.from("career_chat_history").insert({
      student_id: studentId,
      role: "user",
      content: message,
    });
    await supabaseClient.from("career_chat_history").insert({
      student_id: studentId,
      role: "assistant",
      content: aiResponse,
    });

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
    return "मैं आपकी करियर मार्गदर्शन में मदद करने के लिए यहां हूं। कृपया अपना प्रश्न पूछें।";
  }
  return "I'm here to help with your career guidance. Please feel free to ask any questions.";
}
