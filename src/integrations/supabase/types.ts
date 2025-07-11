export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      batches: {
        Row: {
          course_id: string | null
          course_type: string | null
          created_at: string
          description: string | null
          end_date: string | null
          fee: number | null
          id: string
          image_url: string | null
          name: string
          start_date: string | null
          status: string | null
          subjects: string[] | null
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          course_type?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          fee?: number | null
          id?: string
          image_url?: string | null
          name: string
          start_date?: string | null
          status?: string | null
          subjects?: string[] | null
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          course_type?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          fee?: number | null
          id?: string
          image_url?: string | null
          name?: string
          start_date?: string | null
          status?: string | null
          subjects?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          batch_id: string | null
          content_type: string
          created_at: string
          description: string | null
          duration: string | null
          id: string
          live_date: string | null
          live_time: string | null
          metadata: Json | null
          subject_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          batch_id?: string | null
          content_type: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          live_date?: string | null
          live_time?: string | null
          metadata?: Json | null
          subject_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          batch_id?: string | null
          content_type?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          live_date?: string | null
          live_time?: string | null
          metadata?: Json | null
          subject_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      dpps: {
        Row: {
          batch_id: string | null
          created_at: string | null
          description: string | null
          id: string
          pdf_url: string
          subject: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          pdf_url: string
          subject?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          pdf_url?: string
          subject?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dpps_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      lectures: {
        Row: {
          batch_id: string | null
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          subject: string | null
          title: string
          topic: string | null
          updated_at: string | null
          video_url: string
        }
        Insert: {
          batch_id?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          subject?: string | null
          title: string
          topic?: string | null
          updated_at?: string | null
          video_url: string
        }
        Update: {
          batch_id?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          subject?: string | null
          title?: string
          topic?: string | null
          updated_at?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "lectures_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      Lectures: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      notes: {
        Row: {
          batch_id: string | null
          created_at: string | null
          description: string | null
          id: string
          pdf_url: string
          subject: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          pdf_url: string
          subject?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          pdf_url?: string
          subject?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      Notes: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      telegram_channels: {
        Row: {
          bot_token: string | null
          channel_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_processed_message_id: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          bot_token?: string | null
          channel_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_processed_message_id?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          bot_token?: string | null
          channel_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_processed_message_id?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_verifications: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          updated_at: string
          user_id: string
          verification_type: string
          verified_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          updated_at?: string
          user_id: string
          verification_type?: string
          verified_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          verification_type?: string
          verified_at?: string
        }
        Relationships: []
      }
      video_jobs: {
        Row: {
          channel_id: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          error_message: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          original_file_id: string
          source_url: string | null
          status: Database["public"]["Enums"]["processing_status"] | null
          telegram_message_id: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          error_message?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          original_file_id: string
          source_url?: string | null
          status?: Database["public"]["Enums"]["processing_status"] | null
          telegram_message_id: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          error_message?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          original_file_id?: string
          source_url?: string | null
          status?: Database["public"]["Enums"]["processing_status"] | null
          telegram_message_id?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_jobs_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "telegram_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      video_variants: {
        Row: {
          bitrate: number | null
          cdn_url: string | null
          created_at: string | null
          duration: number | null
          file_path: string
          file_size: number | null
          format: string
          id: string
          job_id: string | null
          quality: Database["public"]["Enums"]["video_quality"]
          resolution: string | null
          streaming_url: string | null
        }
        Insert: {
          bitrate?: number | null
          cdn_url?: string | null
          created_at?: string | null
          duration?: number | null
          file_path: string
          file_size?: number | null
          format: string
          id?: string
          job_id?: string | null
          quality: Database["public"]["Enums"]["video_quality"]
          resolution?: string | null
          streaming_url?: string | null
        }
        Update: {
          bitrate?: number | null
          cdn_url?: string | null
          created_at?: string | null
          duration?: number | null
          file_path?: string
          file_size?: number | null
          format?: string
          id?: string
          job_id?: string | null
          quality?: Database["public"]["Enums"]["video_quality"]
          resolution?: string | null
          streaming_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_variants_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "video_jobs"
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
      processing_status:
        | "pending"
        | "downloading"
        | "converting"
        | "uploading"
        | "completed"
        | "failed"
      video_quality: "240p" | "480p" | "720p" | "1080p"
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
      processing_status: [
        "pending",
        "downloading",
        "converting",
        "uploading",
        "completed",
        "failed",
      ],
      video_quality: ["240p", "480p", "720p", "1080p"],
    },
  },
} as const
