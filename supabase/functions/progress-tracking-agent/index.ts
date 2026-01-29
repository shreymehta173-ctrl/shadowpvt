import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ProgressEntry {
  skill_id: string;
  score: number;
  recorded_at: string;
}

interface TrendAnalysis {
  skillId: string;
  skillName: string;
  currentScore: number;
  previousScore: number;
  trend: 'improving' | 'stable' | 'declining';
  improvementRate: number;
  consistency: number;
  lastSessionDate: string;
  needsReassessment: boolean;
}

// Time-series analysis: Calculate improvement trend
function analyzeTrend(scores: number[]): {
  trend: 'improving' | 'stable' | 'declining';
  rate: number;
  consistency: number;
} {
  if (scores.length < 2) {
    return { trend: 'stable', rate: 0, consistency: 100 };
  }

  // Calculate moving average for smoothing
  const windowSize = Math.min(3, scores.length);
  const smoothedScores: number[] = [];
  
  for (let i = 0; i < scores.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = scores.slice(start, i + 1);
    const avg = window.reduce((a, b) => a + b, 0) / window.length;
    smoothedScores.push(avg);
  }

  // Calculate overall trend using linear regression
  const n = smoothedScores.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  
  const sumX = indices.reduce((a, b) => a + b, 0);
  const sumY = smoothedScores.reduce((a, b) => a + b, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * smoothedScores[i], 0);
  const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // Calculate consistency (inverse of variance)
  const mean = sumY / n;
  const variance = smoothedScores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  const consistency = Math.max(0, 100 - stdDev);

  // Determine trend based on slope
  let trend: 'improving' | 'stable' | 'declining';
  if (slope > 2) {
    trend = 'improving';
  } else if (slope < -2) {
    trend = 'declining';
  } else {
    trend = 'stable';
  }

  // Calculate improvement rate as percentage
  const firstScore = smoothedScores[0];
  const lastScore = smoothedScores[smoothedScores.length - 1];
  const rate = firstScore > 0 ? ((lastScore - firstScore) / firstScore) * 100 : 0;

  return { trend, rate, consistency };
}

// Threshold-based trigger for re-assessment
function shouldTriggerReassessment(
  lastAssessmentDays: number,
  trend: 'improving' | 'stable' | 'declining',
  consistency: number
): boolean {
  // Trigger if declining
  if (trend === 'declining') {
    return true;
  }
  
  // Trigger if no assessment in 14 days
  if (lastAssessmentDays > 14) {
    return true;
  }
  
  // Trigger if inconsistent performance
  if (consistency < 50 && lastAssessmentDays > 7) {
    return true;
  }
  
  // Trigger if stable for too long (might be ready to advance)
  if (trend === 'stable' && lastAssessmentDays > 21) {
    return true;
  }
  
  return false;
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

    // Get authorization header
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

    const { studentId, action } = await req.json();

    if (!studentId) {
      return new Response(JSON.stringify({ error: 'Student ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[ProgressAgent] Tracking progress for student ${studentId}, action: ${action || 'analyze'}`);

    // Fetch progress history (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: progressHistory, error: historyError } = await supabase
      .from('progress_history')
      .select('skill_id, score, recorded_at')
      .eq('student_id', studentId)
      .gte('recorded_at', thirtyDaysAgo.toISOString())
      .order('recorded_at', { ascending: true });

    if (historyError) {
      console.error('[ProgressAgent] Error fetching history:', historyError);
      throw new Error('Failed to fetch progress history');
    }

    // Fetch current skill progress
    const { data: currentProgress, error: progressError } = await supabase
      .from('skill_progress')
      .select(`
        skill_id,
        current_level,
        confidence_score,
        previous_score,
        improvement_rate,
        last_assessed_at
      `)
      .eq('student_id', studentId);

    if (progressError) {
      console.error('[ProgressAgent] Error fetching current progress:', progressError);
    }

    // Get skill names
    const skillIds = [...new Set([
      ...(progressHistory?.map(p => p.skill_id) || []),
      ...(currentProgress?.map(p => p.skill_id) || []),
    ])];

    const { data: skills } = await supabase
      .from('skills')
      .select('id, name')
      .in('id', skillIds);

    const skillsMap = new Map(skills?.map(s => [s.id, s.name]) || []);

    // Group progress by skill for trend analysis
    const progressBySkill = new Map<string, number[]>();
    const latestDateBySkill = new Map<string, string>();

    for (const entry of (progressHistory || []) as ProgressEntry[]) {
      if (!progressBySkill.has(entry.skill_id)) {
        progressBySkill.set(entry.skill_id, []);
      }
      progressBySkill.get(entry.skill_id)!.push(entry.score);
      latestDateBySkill.set(entry.skill_id, entry.recorded_at);
    }

    // Analyze trends for each skill
    const trendAnalysis: TrendAnalysis[] = [];
    const skillsNeedingReassessment: string[] = [];

    for (const [skillId, scores] of progressBySkill) {
      const { trend, rate, consistency } = analyzeTrend(scores);
      
      const currentSkillProgress = currentProgress?.find(p => p.skill_id === skillId);
      const currentScore = currentSkillProgress?.confidence_score || scores[scores.length - 1] || 0;
      const previousScore = currentSkillProgress?.previous_score || (scores.length > 1 ? scores[scores.length - 2] : currentScore);
      
      const lastSessionDate = latestDateBySkill.get(skillId) || currentSkillProgress?.last_assessed_at;
      const daysSinceLastAssessment = lastSessionDate 
        ? Math.floor((Date.now() - new Date(lastSessionDate).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      const needsReassessment = shouldTriggerReassessment(
        daysSinceLastAssessment,
        trend,
        consistency
      );

      if (needsReassessment) {
        skillsNeedingReassessment.push(skillId);
      }

      trendAnalysis.push({
        skillId,
        skillName: skillsMap.get(skillId) || 'Unknown Skill',
        currentScore,
        previousScore,
        trend,
        improvementRate: rate,
        consistency,
        lastSessionDate: lastSessionDate || 'Never',
        needsReassessment,
      });
    }

    // Update skill_progress table with latest analysis
    for (const analysis of trendAnalysis) {
      await supabase
        .from('skill_progress')
        .upsert({
          student_id: studentId,
          skill_id: analysis.skillId,
          confidence_score: analysis.currentScore,
          previous_score: analysis.previousScore,
          improvement_rate: analysis.improvementRate,
          last_assessed_at: analysis.lastSessionDate !== 'Never' ? analysis.lastSessionDate : new Date().toISOString(),
        }, {
          onConflict: 'student_id,skill_id',
        });
    }

    // Calculate overall statistics
    const overallStats = {
      totalSkillsTracked: trendAnalysis.length,
      improvingSkills: trendAnalysis.filter(t => t.trend === 'improving').length,
      stableSkills: trendAnalysis.filter(t => t.trend === 'stable').length,
      decliningSkills: trendAnalysis.filter(t => t.trend === 'declining').length,
      averageConsistency: trendAnalysis.length > 0 
        ? Math.round(trendAnalysis.reduce((sum, t) => sum + t.consistency, 0) / trendAnalysis.length)
        : 0,
      averageImprovement: trendAnalysis.length > 0
        ? Math.round(trendAnalysis.reduce((sum, t) => sum + t.improvementRate, 0) / trendAnalysis.length * 10) / 10
        : 0,
    };

    // Use AI for personalized progress summary
    let aiSummary = '';
    if (LOVABLE_API_KEY && trendAnalysis.length > 0) {
      try {
        const progressSummary = trendAnalysis
          .map(t => `${t.skillName}: ${t.trend} (${t.currentScore.toFixed(0)}%, ${t.improvementRate > 0 ? '+' : ''}${t.improvementRate.toFixed(1)}%)`)
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
                content: `You are an encouraging learning coach providing progress updates.
                Give a brief (2-3 sentences) personalized progress summary that:
                1. Celebrates improvements and consistency
                2. Gently acknowledges areas needing attention
                3. Provides one specific actionable recommendation
                Be warm, encouraging, and specific to their progress.`
              },
              {
                role: 'user',
                content: `Student progress over last 30 days:\n${progressSummary}\n\nOverall: ${overallStats.improvingSkills} improving, ${overallStats.stableSkills} stable, ${overallStats.decliningSkills} declining`
              }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiSummary = aiData.choices?.[0]?.message?.content || '';
        }
      } catch (aiError) {
        console.error('[ProgressAgent] AI summary error:', aiError);
      }
    }

    const result = {
      studentId,
      overallStats,
      trendAnalysis: trendAnalysis.sort((a, b) => {
        // Sort: declining first, then improving, then stable
        const order = { declining: 0, improving: 1, stable: 2 };
        return order[a.trend] - order[b.trend];
      }),
      skillsNeedingReassessment,
      aiSummary,
      lastUpdated: new Date().toISOString(),
    };

    console.log(`[ProgressAgent] Analysis complete. ${skillsNeedingReassessment.length} skills need reassessment.`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[ProgressAgent] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
