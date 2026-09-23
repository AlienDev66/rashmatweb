export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Subset of app DB types used by Creator Studio. */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          is_creator: boolean;
          creator_slug: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          is_creator?: boolean;
          creator_slug?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      programs: {
        Row: {
          id: string;
          creator_id: string;
          creator_user_id: string | null;
          title: string;
          description: string | null;
          cover_url: string | null;
          weeks: number;
          days_per_week: number;
          minutes: number;
          level: string;
          tags: string[];
          is_premium: boolean;
          status: "draft" | "published";
          created_at: string;
        };
        Insert: {
          id: string;
          creator_id: string;
          creator_user_id?: string | null;
          title: string;
          description?: string | null;
          cover_url?: string | null;
          weeks?: number;
          days_per_week?: number;
          minutes?: number;
          level: string;
          tags?: string[];
          is_premium?: boolean;
          status?: "draft" | "published";
        };
        Update: Partial<Database["public"]["Tables"]["programs"]["Insert"]>;
        Relationships: [];
      };
      workout_sessions: {
        Row: {
          id: string;
          program_id: string;
          title: string;
          description: string | null;
          cover_url: string | null;
          tags: string[];
          sets: number;
          day: number;
          minutes: number;
          mux_playback_id: string | null;
          video_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          program_id: string;
          title: string;
          description?: string | null;
          cover_url?: string | null;
          tags?: string[];
          sets?: number;
          day?: number;
          minutes?: number;
          mux_playback_id?: string | null;
          video_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["workout_sessions"]["Insert"]>;
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          session_id: string;
          name: string;
          thumbnail_url: string | null;
          reps: string | null;
          sort_order: number;
          rest_seconds: number;
          mux_playback_id: string | null;
          video_url: string | null;
        };
        Insert: {
          id: string;
          session_id: string;
          name: string;
          thumbnail_url?: string | null;
          reps?: string | null;
          sort_order?: number;
          rest_seconds?: number;
          mux_playback_id?: string | null;
          video_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["exercises"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      activate_creator: {
        Args: { p_slug?: string | null };
        Returns: Json;
      };
      creator_student_progress: {
        Args: { p_program_id?: string | null };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type StudioProgram = Database["public"]["Tables"]["programs"]["Row"];
export type StudioSession = Database["public"]["Tables"]["workout_sessions"]["Row"];
export type StudioExercise = Database["public"]["Tables"]["exercises"]["Row"];

export type StudentProgressRow = {
  enrollment_id: string;
  program_id: string;
  program_title: string;
  student_id: string;
  student_name: string;
  student_avatar: string | null;
  progress_pct: number;
  current_day: number;
  enrolled_at: string;
  last_completed_at: string | null;
  sessions_done: number;
};
