import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface DiagnosticResponse {
  questionId: string;
  isCorrect: boolean;
  timeTaken: number;
  difficulty: number;
  conceptId: string;
  skillId: string;
  topicId: string;
}

interface GapAnalysis {
  conceptId: string;
  conceptName: string;
  skillId: string;
  skillName: string;
  topicId: string;
  topicName: string;
  severity: 'critical' | 'moderate' | 'minor' | 'none';
  confidenceScore: number;
  details: {
    totalQuestions: number;
    correctAnswers: number;
    averageTime: number;
    expectedTime: number;
    performanceRatio: number;
  };
}

// ML Classification Logic: Determine skill level based on performance metrics
function classifySkillLevel(
  correctRatio: number,
  timeEfficiency: number,
  difficulty: number
): { level: 'beginner' | 'intermediate' | 'advanced'; confidence: number } {
  // Weighted scoring model
  const performanceScore = correctRatio * 0.5 + timeEfficiency * 0.3 + (difficulty / 10) * 0.2;
  
  if (performanceScore >= 0.8) {
    return { level: 'advanced', confidence: Math.min(100, performanceScore * 100) };
  } else if (performanceScore >= 0.5) {
    return { level: 'intermediate', confidence: Math.min(100, performanceScore * 100) };
  } else {
    return { level: 'beginner', confidence: Math.max(0, (1 - performanceScore) * 100) };
  }
}

// Determine gap severity using rule-based scoring + thresholds
function determineGapSeverity(
  correctRatio: number,
  avgDifficulty: number,
  timeEfficiency: number
): 'critical' | 'moderate' | 'minor' | 'none' {
  // Critical: Low accuracy on easy questions
  if (correctRatio < 0.3 && avgDifficulty <= 4) {
    return 'critical';
  }
  // Critical: Very low accuracy regardless of difficulty
  if (correctRatio < 0.2) {
    return 'critical';
  }
  // Moderate: Below average performance
  if (correctRatio < 0.5 || (correctRatio < 0.6 && timeEfficiency < 0.5)) {
    return 'moderate';
  }
  // Minor: Room for improvement
  if (correctRatio < 0.75) {
    return 'minor';
  }
  // No significant gap
  return 'none';
}

// Analyze responses and identify learning gaps
function analyzeResponses(responses: DiagnosticResponse[]): Map<string, GapAnalysis> {
  const conceptAnalysis = new Map<string, {
    responses: DiagnosticResponse[];
    conceptId: string;
    skillId: string;
    topicId: string;
  }>();

  // Group responses by concept
  for (const response of responses) {
    const key = response.conceptId;
    if (!conceptAnalysis.has(key)) {
      conceptAnalysis.set(key, {
        responses: [],
        conceptId: response.conceptId,
        skillId: response.skillId,
        topicId: response.topicId,
      });
    }
    conceptAnalysis.get(key)!.responses.push(response);
  }

  const gaps = new Map<string, GapAnalysis>();

  for (const [conceptId, data] of conceptAnalysis) {
    const totalQuestions = data.responses.length;
    const correctAnswers = data.responses.filter(r => r.isCorrect).length;
    const correctRatio = correctAnswers / totalQuestions;
    
    const avgTime = data.responses.reduce((sum, r) => sum + r.timeTaken, 0) / totalQuestions;
    const avgDifficulty = data.responses.reduce((sum, r) => sum + r.difficulty, 0) / totalQuestions;
    const expectedTime = 45 + (avgDifficulty * 5); // Base 45s + 5s per difficulty level
    const timeEfficiency = Math.min(1, expectedTime / avgTime);

    const severity = determineGapSeverity(correctRatio, avgDifficulty, timeEfficiency);
    const { confidence } = classifySkillLevel(correctRatio, timeEfficiency, avgDifficulty);

    gaps.set(conceptId, {
      conceptId: data.conceptId,
      conceptName: '', // Will be filled from DB
      skillId: data.skillId,
      skillName: '',
      topicId: data.topicId,
      topicName: '',
      severity,
      confidenceScore: severity === 'none' ? confidence : 100 - confidence,
      details: {
        totalQuestions,
        correctAnswers,
        averageTime: avgTime,
        expectedTime,
        performanceRatio: correctRatio,
      },
    });
  }

  return gaps;
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

    const { sessionId, responses } = await req.json();

    if (!sessionId || !responses || responses.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid request data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[DiagnosticAgent] Analyzing ${responses.length} responses for session ${sessionId}`);

    // Perform gap analysis
    const gaps = analyzeResponses(responses);

    // Fetch concept, skill, and topic names
    const conceptIds = Array.from(gaps.keys());
    const { data: concepts } = await supabase
      .from('concepts')
      .select('id, name, topic_id')
      .in('id', conceptIds);

    const skillIds = [...new Set(Array.from(gaps.values()).map(g => g.skillId))];
    const { data: skills } = await supabase
      .from('skills')
      .select('id, name')
      .in('id', skillIds);

    const topicIds = [...new Set(Array.from(gaps.values()).map(g => g.topicId))];
    const { data: topics } = await supabase
      .from('topics')
      .select('id, name')
      .in('id', topicIds);

    // Enrich gap data with names
    for (const gap of gaps.values()) {
      const concept = concepts?.find(c => c.id === gap.conceptId);
      const skill = skills?.find(s => s.id === gap.skillId);
      const topic = topics?.find(t => t.id === gap.topicId);
      gap.conceptName = concept?.name || 'Unknown Concept';
      gap.skillName = skill?.name || 'Unknown Skill';
      gap.topicName = topic?.name || 'Unknown Topic';
    }

    // Get student profile
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Student profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store gaps in database
    const gapsToInsert = Array.from(gaps.values())
      .filter(g => g.severity !== 'none')
      .map(gap => ({
        student_id: profile.id,
        session_id: sessionId,
        topic_id: gap.topicId,
        concept_id: gap.conceptId,
        skill_id: gap.skillId,
        severity: gap.severity,
        confidence_score: gap.confidenceScore,
        details: gap.details,
      }));

    if (gapsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('learning_gaps')
        .insert(gapsToInsert);

      if (insertError) {
        console.error('[DiagnosticAgent] Error inserting gaps:', insertError);
      }
    }

    // Use AI to generate personalized insights
    let aiInsights = '';
    if (LOVABLE_API_KEY) {
      try {
        const gapSummary = Array.from(gaps.values())
          .filter(g => g.severity !== 'none')
          .map(g => `${g.conceptName} (${g.severity}): ${Math.round(g.details.performanceRatio * 100)}% correct`)
          .join('\n');

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
                content: `You are an educational AI assistant analyzing a student's learning gaps. 
                Provide encouraging, actionable insights in 2-3 sentences. Focus on:
                1. Acknowledging their strengths
                2. Identifying the most important area to focus on
                3. A specific, encouraging next step
                Keep the tone supportive and motivating.`
              },
              {
                role: 'user',
                content: `Student diagnostic results:\n${gapSummary}\n\nProvide personalized learning insights.`
              }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiInsights = aiData.choices?.[0]?.message?.content || '';
        }
      } catch (aiError) {
        console.error('[DiagnosticAgent] AI insight generation error:', aiError);
      }
    }

    // Update session status
    const totalQuestions = responses.length;
    const correctAnswers = responses.filter((r: DiagnosticResponse) => r.isCorrect).length;
    const avgTime = responses.reduce((sum: number, r: DiagnosticResponse) => sum + r.timeTaken, 0) / totalQuestions;

    await supabase
      .from('diagnostic_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        average_time_per_question: avgTime,
      })
      .eq('id', sessionId);

    const result = {
      sessionId,
      summary: {
        totalQuestions,
        correctAnswers,
        accuracy: Math.round((correctAnswers / totalQuestions) * 100),
        averageTimePerQuestion: Math.round(avgTime),
      },
      gaps: Array.from(gaps.values()),
      insights: aiInsights,
      timestamp: new Date().toISOString(),
    };

    console.log(`[DiagnosticAgent] Analysis complete. Found ${gapsToInsert.length} gaps.`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[DiagnosticAgent] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
