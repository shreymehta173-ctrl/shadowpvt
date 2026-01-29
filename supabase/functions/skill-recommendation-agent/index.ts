import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface LearningGap {
  id: string;
  concept_id: string;
  skill_id: string;
  topic_id: string;
  severity: 'critical' | 'moderate' | 'minor';
  confidence_score: number;
  details: {
    performanceRatio: number;
    totalQuestions: number;
  };
}

interface SkillRecommendation {
  skillId: string;
  skillName: string;
  conceptName: string;
  topicName: string;
  gapId: string;
  priority: number;
  severity: 'critical' | 'moderate' | 'minor';
  practiceType: string;
  estimatedDuration: number;
  title: string;
  description: string;
  confidenceScore: number;
  resources: {
    type: string;
    title: string;
    url: string;
  }[];
}

// Weighted scoring model for skill prioritization
function calculatePriority(
  severity: 'critical' | 'moderate' | 'minor',
  careerRelevance: number,
  confidenceScore: number,
  hasPrerequisites: boolean
): number {
  const severityWeight = {
    'critical': 10,
    'moderate': 6,
    'minor': 3,
  };

  // Priority formula: severity * 0.4 + career * 0.3 + (100-confidence) * 0.2 + prereq * 0.1
  const severityScore = severityWeight[severity] * 0.4;
  const careerScore = careerRelevance * 0.3;
  const confidenceGap = ((100 - confidenceScore) / 10) * 0.2;
  const prereqBonus = hasPrerequisites ? 0 : 1; // Prioritize fundamentals

  return Math.round((severityScore + careerScore + confidenceGap + prereqBonus) * 10);
}

// Determine practice type based on gap characteristics
function recommendPracticeType(
  severity: 'critical' | 'moderate' | 'minor',
  performanceRatio: number
): string {
  if (severity === 'critical' || performanceRatio < 0.3) {
    return 'fundamentals'; // Start from basics
  }
  if (performanceRatio < 0.5) {
    return 'guided_practice'; // Step-by-step exercises
  }
  if (performanceRatio < 0.7) {
    return 'exercises'; // Independent practice
  }
  return 'challenges'; // Advanced problems
}

// Estimate time to mastery based on gap severity
function estimateDuration(
  severity: 'critical' | 'moderate' | 'minor',
  performanceRatio: number
): number {
  const baseDuration = {
    'critical': 180, // 3 hours
    'moderate': 90,  // 1.5 hours
    'minor': 45,     // 45 minutes
  };

  // Adjust based on current performance
  const adjustmentFactor = 1 + (0.5 - performanceRatio);
  return Math.round(baseDuration[severity] * adjustmentFactor);
}

// Generate learning resources based on skill and practice type
function generateResources(
  skillName: string,
  practiceType: string,
  topicName: string
): { type: string; title: string; url: string }[] {
  const resources = [];

  if (practiceType === 'fundamentals') {
    resources.push(
      { type: 'video', title: `Introduction to ${skillName}`, url: '#' },
      { type: 'reading', title: `${skillName} Fundamentals Guide`, url: '#' },
      { type: 'quiz', title: 'Concept Check Quiz', url: '#' }
    );
  } else if (practiceType === 'guided_practice') {
    resources.push(
      { type: 'tutorial', title: `Step-by-Step ${skillName} Tutorial`, url: '#' },
      { type: 'exercise', title: 'Guided Practice Problems', url: '#' },
      { type: 'video', title: 'Worked Examples', url: '#' }
    );
  } else if (practiceType === 'exercises') {
    resources.push(
      { type: 'exercise', title: `${skillName} Practice Set`, url: '#' },
      { type: 'project', title: 'Mini Project', url: '#' },
      { type: 'quiz', title: 'Progress Assessment', url: '#' }
    );
  } else {
    resources.push(
      { type: 'challenge', title: `Advanced ${skillName} Challenges`, url: '#' },
      { type: 'project', title: 'Capstone Project', url: '#' },
      { type: 'competition', title: 'Skill Competition', url: '#' }
    );
  }

  return resources;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get authorization header for user context
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { studentId, gapIds } = await req.json();

    if (!studentId) {
      return new Response(JSON.stringify({ error: 'Student ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[RecommendationAgent] Generating recommendations for student ${studentId}`);

    // Fetch unresolved learning gaps
    let gapsQuery = supabase
      .from('learning_gaps')
      .select(`
        id,
        concept_id,
        skill_id,
        topic_id,
        severity,
        confidence_score,
        details
      `)
      .eq('student_id', studentId)
      .is('resolved_at', null)
      .in('severity', ['critical', 'moderate', 'minor']);

    if (gapIds && gapIds.length > 0) {
      gapsQuery = gapsQuery.in('id', gapIds);
    }

    const { data: gaps, error: gapsError } = await gapsQuery;

    if (gapsError) {
      console.error('[RecommendationAgent] Error fetching gaps:', gapsError);
      throw new Error('Failed to fetch learning gaps');
    }

    if (!gaps || gaps.length === 0) {
      return new Response(JSON.stringify({ 
        recommendations: [],
        message: 'No learning gaps found to address. Great job!' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch skill and topic details
    const skillIds = [...new Set(gaps.map(g => g.skill_id).filter(Boolean))];
    const topicIds = [...new Set(gaps.map(g => g.topic_id).filter(Boolean))];
    const conceptIds = [...new Set(gaps.map(g => g.concept_id).filter(Boolean))];

    const [skillsResult, topicsResult, conceptsResult] = await Promise.all([
      supabase.from('skills').select('id, name, career_relevance').in('id', skillIds),
      supabase.from('topics').select('id, name').in('id', topicIds),
      supabase.from('concepts').select('id, name, prerequisites').in('id', conceptIds),
    ]);

    const skillsMap = new Map(skillsResult.data?.map(s => [s.id, s]) || []);
    const topicsMap = new Map(topicsResult.data?.map(t => [t.id, t]) || []);
    const conceptsMap = new Map(conceptsResult.data?.map(c => [c.id, c]) || []);

    // Generate recommendations for each gap
    const recommendations: SkillRecommendation[] = gaps.map((gap: LearningGap) => {
      const skill = skillsMap.get(gap.skill_id);
      const topic = topicsMap.get(gap.topic_id);
      const concept = conceptsMap.get(gap.concept_id);

      const careerRelevance = skill?.career_relevance || 5;
      const hasPrerequisites = (concept?.prerequisites?.length || 0) > 0;
      const performanceRatio = gap.details?.performanceRatio || 0.5;

      const priority = calculatePriority(
        gap.severity,
        careerRelevance,
        gap.confidence_score,
        hasPrerequisites
      );

      const practiceType = recommendPracticeType(gap.severity, performanceRatio);
      const estimatedDuration = estimateDuration(gap.severity, performanceRatio);
      const resources = generateResources(
        skill?.name || 'General Skill',
        practiceType,
        topic?.name || 'General Topic'
      );

      return {
        skillId: gap.skill_id,
        skillName: skill?.name || 'Unknown Skill',
        conceptName: concept?.name || 'Unknown Concept',
        topicName: topic?.name || 'Unknown Topic',
        gapId: gap.id,
        priority,
        severity: gap.severity,
        practiceType,
        estimatedDuration,
        title: `Improve ${skill?.name || 'skill'}: ${concept?.name || 'concept'}`,
        description: `Focus on ${practiceType.replace('_', ' ')} to strengthen your ${skill?.name || 'skills'}`,
        resources,
        confidenceScore: gap.confidence_score,
      };
    });

    // Sort by priority (highest first)
    recommendations.sort((a, b) => b.priority - a.priority);

    // Use AI to generate personalized roadmap narrative
    let aiRoadmap = '';
    if (LOVABLE_API_KEY && recommendations.length > 0) {
      try {
        const topRecs = recommendations.slice(0, 5).map((r, i) => 
          `${i + 1}. ${r.title} (${r.severity}, ~${r.estimatedDuration} min)`
        ).join('\n');

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-3-flash-preview',
            messages: [
              {
                role: 'system',
                content: `You are an encouraging educational coach creating personalized learning roadmaps.
                Create a brief, motivating roadmap summary (3-4 sentences) that:
                1. Acknowledges the learning journey ahead
                2. Highlights the logical order of skills to tackle
                3. Provides an encouraging milestone to aim for
                Keep it personal and motivating, not generic.`
              },
              {
                role: 'user',
                content: `Generate a roadmap for these prioritized skills:\n${topRecs}`
              }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiRoadmap = aiData.choices?.[0]?.message?.content || '';
        }
      } catch (aiError) {
        console.error('[RecommendationAgent] AI roadmap generation error:', aiError);
      }
    }

    // Store improvement plans in database
    const plansToInsert = recommendations.map((rec, index) => ({
      student_id: studentId,
      gap_id: rec.gapId,
      skill_id: rec.skillId,
      title: rec.title,
      description: rec.description,
      priority: index + 1, // 1-indexed priority
      practice_type: rec.practiceType,
      recommended_resources: rec.resources,
      estimated_duration: rec.estimatedDuration,
      status: 'pending',
    }));

    // Upsert to handle existing plans
    const { error: insertError } = await supabase
      .from('improvement_plans')
      .upsert(plansToInsert, { 
        onConflict: 'gap_id',
        ignoreDuplicates: false 
      });

    if (insertError) {
      console.error('[RecommendationAgent] Error inserting plans:', insertError);
    }

    const result = {
      recommendations: recommendations.slice(0, 10), // Top 10 recommendations
      roadmapSummary: aiRoadmap,
      totalGaps: gaps.length,
      estimatedTotalTime: recommendations.reduce((sum, r) => sum + r.estimatedDuration, 0),
      timestamp: new Date().toISOString(),
    };

    console.log(`[RecommendationAgent] Generated ${recommendations.length} recommendations`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[RecommendationAgent] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
