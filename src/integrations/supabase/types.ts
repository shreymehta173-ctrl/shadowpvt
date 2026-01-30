export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      career_chat_history: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          student_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          student_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_chat_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      career_recommendations: {
        Row: {
          ai_explanation: string | null
          ai_roadmap: Json | null
          career_id: string
          gap_penalty_score: number | null
          generated_at: string
          id: string
          interest_fit_score: number | null
          language: string | null
          match_score: number
          skill_fit_score: number | null
          student_id: string
        }
        Insert: {
          ai_explanation?: string | null
          ai_roadmap?: Json | null
          career_id: string
          gap_penalty_score?: number | null
          generated_at?: string
          id?: string
          interest_fit_score?: number | null
          language?: string | null
          match_score?: number
          skill_fit_score?: number | null
          student_id: string
        }
        Update: {
          ai_explanation?: string | null
          ai_roadmap?: Json | null
          career_id?: string
          gap_penalty_score?: number | null
          generated_at?: string
          id?: string
          interest_fit_score?: number | null
          language?: string | null
          match_score?: number
          skill_fit_score?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_recommendations_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_recommendations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      career_skill_mappings: {
        Row: {
          career_id: string
          created_at: string
          id: string
          importance_weight: number
          is_mandatory: boolean
          skill_id: string
        }
        Insert: {
          career_id: string
          created_at?: string
          id?: string
          importance_weight?: number
          is_mandatory?: boolean
          skill_id: string
        }
        Update: {
          career_id?: string
          created_at?: string
          id?: string
          importance_weight?: number
          is_mandatory?: boolean
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_skill_mappings_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_skill_mappings_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      careers: {
        Row: {
          average_salary_max: number | null
          average_salary_min: number | null
          color: string | null
          created_at: string
          description: string | null
          difficulty_level: number
          future_scope_score: number
          growth_rate: string | null
          icon: string | null
          id: string
          industry: string
          minimum_education: string
          name: string
          preferred_subjects: string[] | null
          required_skills: string[]
        }
        Insert: {
          average_salary_max?: number | null
          average_salary_min?: number | null
          color?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: number
          future_scope_score?: number
          growth_rate?: string | null
          icon?: string | null
          id?: string
          industry: string
          minimum_education?: string
          name: string
          preferred_subjects?: string[] | null
          required_skills?: string[]
        }
        Update: {
          average_salary_max?: number | null
          average_salary_min?: number | null
          color?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: number
          future_scope_score?: number
          growth_rate?: string | null
          icon?: string | null
          id?: string
          industry?: string
          minimum_education?: string
          name?: string
          preferred_subjects?: string[] | null
          required_skills?: string[]
        }
        Relationships: []
      }
      concepts: {
        Row: {
          created_at: string
          description: string | null
          difficulty: number | null
          id: string
          name: string
          prerequisites: string[] | null
          topic_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: number | null
          id?: string
          name: string
          prerequisites?: string[] | null
          topic_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: number | null
          id?: string
          name?: string
          prerequisites?: string[] | null
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concepts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_responses: {
        Row: {
          attempt_number: number | null
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
          session_id: string
          student_answer: string | null
          time_taken: number
        }
        Insert: {
          attempt_number?: number | null
          created_at?: string
          id?: string
          is_correct: boolean
          question_id: string
          session_id: string
          student_answer?: string | null
          time_taken: number
        }
        Update: {
          attempt_number?: number | null
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          session_id?: string
          student_answer?: string | null
          time_taken?: number
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_sessions: {
        Row: {
          average_time_per_question: number | null
          completed_at: string | null
          correct_answers: number | null
          id: string
          started_at: string
          status: string | null
          student_id: string
          topic_id: string | null
          total_questions: number | null
        }
        Insert: {
          average_time_per_question?: number | null
          completed_at?: string | null
          correct_answers?: number | null
          id?: string
          started_at?: string
          status?: string | null
          student_id: string
          topic_id?: string | null
          total_questions?: number | null
        }
        Update: {
          average_time_per_question?: number | null
          completed_at?: string | null
          correct_answers?: number | null
          id?: string
          started_at?: string
          status?: string | null
          student_id?: string
          topic_id?: string | null
          total_questions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      improvement_plans: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          estimated_duration: number | null
          gap_id: string | null
          id: string
          practice_type: string | null
          priority: number | null
          recommended_resources: Json | null
          skill_id: string | null
          status: string | null
          student_id: string
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          gap_id?: string | null
          id?: string
          practice_type?: string | null
          priority?: number | null
          recommended_resources?: Json | null
          skill_id?: string | null
          status?: string | null
          student_id: string
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          gap_id?: string | null
          id?: string
          practice_type?: string | null
          priority?: number | null
          recommended_resources?: Json | null
          skill_id?: string | null
          status?: string | null
          student_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "improvement_plans_gap_id_fkey"
            columns: ["gap_id"]
            isOneToOne: false
            referencedRelation: "learning_gaps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "improvement_plans_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "improvement_plans_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_gaps: {
        Row: {
          concept_id: string | null
          confidence_score: number | null
          details: Json | null
          id: string
          identified_at: string
          resolved_at: string | null
          session_id: string | null
          severity: Database["public"]["Enums"]["gap_severity"]
          skill_id: string | null
          student_id: string
          topic_id: string | null
        }
        Insert: {
          concept_id?: string | null
          confidence_score?: number | null
          details?: Json | null
          id?: string
          identified_at?: string
          resolved_at?: string | null
          session_id?: string | null
          severity?: Database["public"]["Enums"]["gap_severity"]
          skill_id?: string | null
          student_id: string
          topic_id?: string | null
        }
        Update: {
          concept_id?: string | null
          confidence_score?: number | null
          details?: Json | null
          id?: string
          identified_at?: string
          resolved_at?: string | null
          session_id?: string | null
          severity?: Database["public"]["Enums"]["gap_severity"]
          skill_id?: string | null
          student_id?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_gaps_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_gaps_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_gaps_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_gaps_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_gaps_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_history: {
        Row: {
          id: string
          recorded_at: string
          score: number
          session_id: string | null
          skill_id: string | null
          student_id: string
        }
        Insert: {
          id?: string
          recorded_at?: string
          score: number
          session_id?: string | null
          skill_id?: string | null
          student_id: string
        }
        Update: {
          id?: string
          recorded_at?: string
          score?: number
          session_id?: string | null
          skill_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_history_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          concept_id: string | null
          correct_answer: string | null
          created_at: string
          difficulty: number | null
          explanation: string | null
          id: string
          options: Json | null
          question_text: string
          question_type: string | null
          skill_id: string | null
          time_limit: number | null
          topic_id: string
        }
        Insert: {
          concept_id?: string | null
          correct_answer?: string | null
          created_at?: string
          difficulty?: number | null
          explanation?: string | null
          id?: string
          options?: Json | null
          question_text: string
          question_type?: string | null
          skill_id?: string | null
          time_limit?: number | null
          topic_id: string
        }
        Update: {
          concept_id?: string | null
          correct_answer?: string | null
          created_at?: string
          difficulty?: number | null
          explanation?: string | null
          id?: string
          options?: Json | null
          question_text?: string
          question_type?: string | null
          skill_id?: string | null
          time_limit?: number | null
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      session_feedback: {
        Row: {
          completion_percentage: number | null
          created_at: string
          difficulty_felt: string | null
          focus_level: string | null
          id: string
          notes: string | null
          session_id: string
          student_id: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          difficulty_felt?: string | null
          focus_level?: string | null
          id?: string
          notes?: string | null
          session_id: string
          student_id: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          difficulty_felt?: string | null
          focus_level?: string | null
          id?: string
          notes?: string | null
          session_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_feedback_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_progress: {
        Row: {
          confidence_score: number | null
          created_at: string
          current_level: Database["public"]["Enums"]["skill_level"] | null
          id: string
          improvement_rate: number | null
          last_assessed_at: string | null
          previous_score: number | null
          skill_id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          current_level?: Database["public"]["Enums"]["skill_level"] | null
          id?: string
          improvement_rate?: number | null
          last_assessed_at?: string | null
          previous_score?: number | null
          skill_id: string
          student_id: string
          updated_at?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          current_level?: Database["public"]["Enums"]["skill_level"] | null
          id?: string
          improvement_rate?: number | null
          last_assessed_at?: string | null
          previous_score?: number | null
          skill_id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_progress_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          career_relevance: number | null
          concept_ids: string[] | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          career_relevance?: number | null
          concept_ids?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          career_relevance?: number | null
          concept_ids?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          created_at: string
          daily_study_time: number | null
          display_name: string
          grade: string | null
          id: string
          interests: string[] | null
          learning_speed: Database["public"]["Enums"]["learning_speed"] | null
          onboarding_completed: boolean | null
          preferred_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_study_time?: number | null
          display_name: string
          grade?: string | null
          id?: string
          interests?: string[] | null
          learning_speed?: Database["public"]["Enums"]["learning_speed"] | null
          onboarding_completed?: boolean | null
          preferred_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_study_time?: number | null
          display_name?: string
          grade?: string | null
          id?: string
          interests?: string[] | null
          learning_speed?: Database["public"]["Enums"]["learning_speed"] | null
          onboarding_completed?: boolean | null
          preferred_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_weaknesses: {
        Row: {
          created_at: string
          difficulty: number | null
          estimated_effort: number | null
          id: string
          is_resolved: boolean | null
          priority: Database["public"]["Enums"]["priority_level"] | null
          student_id: string
          subject: string
          topic: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty?: number | null
          estimated_effort?: number | null
          id?: string
          is_resolved?: boolean | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          student_id: string
          subject: string
          topic: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: number | null
          estimated_effort?: number | null
          id?: string
          is_resolved?: boolean | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          student_id?: string
          subject?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_weaknesses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_preferences: {
        Row: {
          break_duration: number | null
          created_at: string
          daily_time_limit: number | null
          id: string
          learning_pace:
            | Database["public"]["Enums"]["learning_pace_enum"]
            | null
          preferred_study_days: string[] | null
          preferred_study_time: string | null
          session_duration: number | null
          student_id: string
          updated_at: string
        }
        Insert: {
          break_duration?: number | null
          created_at?: string
          daily_time_limit?: number | null
          id?: string
          learning_pace?:
            | Database["public"]["Enums"]["learning_pace_enum"]
            | null
          preferred_study_days?: string[] | null
          preferred_study_time?: string | null
          session_duration?: number | null
          student_id: string
          updated_at?: string
        }
        Update: {
          break_duration?: number | null
          created_at?: string
          daily_time_limit?: number | null
          id?: string
          learning_pace?:
            | Database["public"]["Enums"]["learning_pace_enum"]
            | null
          preferred_study_days?: string[] | null
          preferred_study_time?: string | null
          session_duration?: number | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_preferences_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          difficulty: number | null
          duration_minutes: number
          effectiveness_score: number | null
          feedback_notes: string | null
          id: string
          plan_id: string
          scheduled_date: string
          scheduled_time: string | null
          session_type: string | null
          status: Database["public"]["Enums"]["session_status"] | null
          student_id: string
          subject: string
          topic: string
          updated_at: string
          weakness_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          difficulty?: number | null
          duration_minutes: number
          effectiveness_score?: number | null
          feedback_notes?: string | null
          id?: string
          plan_id: string
          scheduled_date: string
          scheduled_time?: string | null
          session_type?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          student_id: string
          subject: string
          topic: string
          updated_at?: string
          weakness_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          difficulty?: number | null
          duration_minutes?: number
          effectiveness_score?: number | null
          feedback_notes?: string | null
          id?: string
          plan_id?: string
          scheduled_date?: string
          scheduled_time?: string | null
          session_type?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          student_id?: string
          subject?: string
          topic?: string
          updated_at?: string
          weakness_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "weekly_study_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_weakness_id_fkey"
            columns: ["weakness_id"]
            isOneToOne: false
            referencedRelation: "student_weaknesses"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      weekly_study_plans: {
        Row: {
          ai_notes: string | null
          created_at: string
          id: string
          status: string | null
          student_id: string
          total_completed_minutes: number | null
          total_planned_minutes: number | null
          updated_at: string
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          ai_notes?: string | null
          created_at?: string
          id?: string
          status?: string | null
          student_id: string
          total_completed_minutes?: number | null
          total_planned_minutes?: number | null
          updated_at?: string
          week_end_date: string
          week_start_date: string
        }
        Update: {
          ai_notes?: string | null
          created_at?: string
          id?: string
          status?: string | null
          student_id?: string
          total_completed_minutes?: number | null
          total_planned_minutes?: number | null
          updated_at?: string
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_study_plans_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gap_severity: "critical" | "moderate" | "minor" | "none"
      learning_pace_enum: "slow" | "medium" | "fast"
      learning_speed: "slow" | "average" | "fast"
      priority_level: "low" | "medium" | "high" | "critical"
      session_status: "pending" | "completed" | "partial" | "skipped"
      skill_level: "beginner" | "intermediate" | "advanced"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gap_severity: ["critical", "moderate", "minor", "none"],
      learning_pace_enum: ["slow", "medium", "fast"],
      learning_speed: ["slow", "average", "fast"],
      priority_level: ["low", "medium", "high", "critical"],
      session_status: ["pending", "completed", "partial", "skipped"],
      skill_level: ["beginner", "intermediate", "advanced"],
    },
  },
} as const
