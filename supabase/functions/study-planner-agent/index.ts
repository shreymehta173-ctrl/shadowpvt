import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Weakness {
  id: string;
  subject: string;
  topic: string;
  difficulty: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_effort: number;
}

interface StudyPreferences {
  learning_pace: 'slow' | 'medium' | 'fast';
  daily_time_limit: number;
  preferred_study_days: string[];
  session_duration: number;
  break_duration: number;
}

interface StudySession {
  subject: string;
  topic: string;
  session_type: 'study' | 'revision' | 'buffer';
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  difficulty: number;
  weakness_id?: string;
}

// Priority weights for ranking
const priorityWeights = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

// Learning pace adjustments
const paceAdjustments = {
  slow: { sessionMultiplier: 0.7, revisionFrequency: 2 },
  medium: { sessionMultiplier: 1.0, revisionFrequency: 3 },
  fast: { sessionMultiplier: 1.3, revisionFrequency: 4 },
};

// Rank weaknesses by priority and difficulty
function rankWeaknesses(weaknesses: Weakness[]): Weakness[] {
  return [...weaknesses].sort((a, b) => {
    const priorityDiff = priorityWeights[b.priority] - priorityWeights[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.difficulty - a.difficulty;
  });
}

// Calculate session duration based on learning pace and difficulty
function calculateSessionDuration(
  baseDuration: number,
  pace: 'slow' | 'medium' | 'fast',
  difficulty: number
): number {
  const paceMultiplier = paceAdjustments[pace].sessionMultiplier;
  const difficultyFactor = difficulty <= 2 ? 0.8 : difficulty >= 4 ? 1.2 : 1.0;
  
  // Slower learners get shorter but more frequent sessions
  let duration = Math.round(baseDuration * paceMultiplier * difficultyFactor);
  
  // Clamp between 20 and 90 minutes
  return Math.max(20, Math.min(90, duration));
}

// Get study time slots based on preferred time
function getTimeSlots(preferredTime: string): string[] {
  const slots = {
    morning: ['06:00', '07:00', '08:00', '09:00', '10:00'],
    afternoon: ['12:00', '13:00', '14:00', '15:00', '16:00'],
    evening: ['17:00', '18:00', '19:00', '20:00'],
    night: ['20:00', '21:00', '22:00'],
  };
  return slots[preferredTime as keyof typeof slots] || slots.evening;
}

// Generate weekly study plan
function generateWeeklyPlan(
  weaknesses: Weakness[],
  preferences: StudyPreferences,
  weekStartDate: Date
): StudySession[] {
  const sessions: StudySession[] = [];
  const rankedWeaknesses = rankWeaknesses(weaknesses);
  
  if (rankedWeaknesses.length === 0) {
    return sessions;
  }

  const pace = preferences.learning_pace || 'medium';
  const dailyLimit = preferences.daily_time_limit || 120;
  const studyDays = preferences.preferred_study_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const baseDuration = preferences.session_duration || 45;
  
  const revisionFrequency = paceAdjustments[pace].revisionFrequency;
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  let sessionCount = 0;
  let lastSubject = '';
  const topicsSeen: Set<string> = new Set();

  // Generate dates for the week
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + i);
    const dayName = dayNames[date.getDay()];
    if (studyDays.includes(dayName)) {
      weekDates.push(date);
    }
  }

  // Distribute sessions across days
  for (const date of weekDates) {
    let dailyTimeUsed = 0;
    const dateStr = date.toISOString().split('T')[0];
    const timeSlots = getTimeSlots('evening');
    let slotIndex = 0;

    while (dailyTimeUsed < dailyLimit && slotIndex < timeSlots.length) {
      // Pick next weakness (avoid same subject consecutively)
      let weakness = rankedWeaknesses.find(w => w.subject !== lastSubject);
      if (!weakness) {
        weakness = rankedWeaknesses[0];
      }

      const duration = calculateSessionDuration(baseDuration, pace, weakness.difficulty);

      // Check if adding this session would exceed daily limit
      if (dailyTimeUsed + duration > dailyLimit) {
        break;
      }

      // Add study session
      sessions.push({
        subject: weakness.subject,
        topic: weakness.topic,
        session_type: 'study',
        scheduled_date: dateStr,
        scheduled_time: timeSlots[slotIndex],
        duration_minutes: duration,
        difficulty: weakness.difficulty,
        weakness_id: weakness.id,
      });

      topicsSeen.add(`${weakness.subject}-${weakness.topic}`);
      lastSubject = weakness.subject;
      dailyTimeUsed += duration + (preferences.break_duration || 10);
      sessionCount++;
      slotIndex++;

      // Add revision session periodically
      if (sessionCount % revisionFrequency === 0 && topicsSeen.size > 0) {
        const revisionDuration = Math.round(duration * 0.6);
        
        if (dailyTimeUsed + revisionDuration <= dailyLimit && slotIndex < timeSlots.length) {
          // Pick a random previously studied topic for revision
          const topics = Array.from(topicsSeen);
          const revisionTopic = topics[Math.floor(Math.random() * topics.length)];
          const [revSubject, revTopic] = revisionTopic.split('-');

          sessions.push({
            subject: revSubject,
            topic: revTopic,
            session_type: 'revision',
            scheduled_date: dateStr,
            scheduled_time: timeSlots[slotIndex],
            duration_minutes: revisionDuration,
            difficulty: 2,
          });

          dailyTimeUsed += revisionDuration + (preferences.break_duration || 10);
          slotIndex++;
        }
      }

      // Rotate through weaknesses
      const index = rankedWeaknesses.indexOf(weakness);
      if (index > -1) {
        rankedWeaknesses.push(rankedWeaknesses.splice(index, 1)[0]);
      }
    }

    // Add buffer slot at end of day if there's remaining time
    const bufferTime = dailyLimit - dailyTimeUsed;
    if (bufferTime >= 15 && slotIndex < timeSlots.length) {
      sessions.push({
        subject: 'Flexible',
        topic: 'Catch-up or extra practice',
        session_type: 'buffer',
        scheduled_date: dateStr,
        scheduled_time: timeSlots[slotIndex],
        duration_minutes: Math.min(30, bufferTime),
        difficulty: 1,
      });
    }
  }

  return sessions;
}

// Predict session success probability (lightweight ML-like scoring)
function predictSuccessProbability(
  pace: string,
  difficulty: number,
  completionHistory: number[]
): number {
  // Base probability by pace
  const baseProbability = {
    slow: 0.6,
    medium: 0.75,
    fast: 0.85,
  }[pace] || 0.75;

  // Difficulty adjustment (-10% per difficulty level above 3)
  const difficultyPenalty = Math.max(0, (difficulty - 3) * 0.1);

  // Historical completion rate boost
  const historyBoost = completionHistory.length > 0
    ? (completionHistory.reduce((a, b) => a + b, 0) / completionHistory.length) * 0.2
    : 0;

  return Math.min(1, Math.max(0.3, baseProbability - difficultyPenalty + historyBoost));
}

// Generate AI notes for the plan
function generateAINotes(
  weaknesses: Weakness[],
  preferences: StudyPreferences,
  sessions: StudySession[]
): string {
  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const studySessions = sessions.filter(s => s.session_type === 'study').length;
  const revisionSessions = sessions.filter(s => s.session_type === 'revision').length;
  const bufferSessions = sessions.filter(s => s.session_type === 'buffer').length;

  const criticalTopics = weaknesses.filter(w => w.priority === 'critical' || w.priority === 'high');
  
  let notes = `## Weekly Plan Summary\n\n`;
  notes += `📚 **Total Study Time**: ${Math.round(totalStudyTime / 60)} hours ${totalStudyTime % 60} minutes\n`;
  notes += `📖 **Study Sessions**: ${studySessions}\n`;
  notes += `🔄 **Revision Sessions**: ${revisionSessions}\n`;
  notes += `⏰ **Buffer Slots**: ${bufferSessions}\n\n`;

  if (criticalTopics.length > 0) {
    notes += `### 🎯 Priority Focus Areas\n`;
    criticalTopics.forEach(t => {
      notes += `- **${t.subject}**: ${t.topic}\n`;
    });
    notes += `\n`;
  }

  notes += `### 💡 Tips for Your Learning Pace\n`;
  if (preferences.learning_pace === 'slow') {
    notes += `- Take breaks frequently, don't rush\n`;
    notes += `- Focus on understanding concepts deeply\n`;
    notes += `- Use the revision sessions to reinforce learning\n`;
  } else if (preferences.learning_pace === 'fast') {
    notes += `- Challenge yourself with harder problems\n`;
    notes += `- Use buffer time for advanced topics\n`;
    notes += `- Consider helping peers to solidify knowledge\n`;
  } else {
    notes += `- Maintain a balanced approach\n`;
    notes += `- Adjust pace based on topic difficulty\n`;
    notes += `- Use revision slots wisely\n`;
  }

  return notes;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, weaknesses, preferences, weekStartDate, completionHistory } = await req.json();

    if (action === 'generate') {
      if (!weaknesses || !preferences) {
        return new Response(
          JSON.stringify({ error: 'Missing weaknesses or preferences' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const startDate = weekStartDate ? new Date(weekStartDate) : new Date();
      // Adjust to start of week (Monday)
      const dayOfWeek = startDate.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDate.setDate(startDate.getDate() + diff);

      const sessions = generateWeeklyPlan(weaknesses, preferences, startDate);
      const aiNotes = generateAINotes(weaknesses, preferences, sessions);
      const totalPlannedMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);

      const weekEndDate = new Date(startDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      return new Response(
        JSON.stringify({
          success: true,
          plan: {
            week_start_date: startDate.toISOString().split('T')[0],
            week_end_date: weekEndDate.toISOString().split('T')[0],
            total_planned_minutes: totalPlannedMinutes,
            ai_notes: aiNotes,
            sessions,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'predict') {
      const { pace, difficulty } = await req.json();
      const probability = predictSuccessProbability(
        pace || 'medium',
        difficulty || 3,
        completionHistory || []
      );

      return new Response(
        JSON.stringify({ success: true, probability }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Study planner error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
