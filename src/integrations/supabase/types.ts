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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          doctor_id: string
          id: string
          notes: string | null
          patient_id: string
          payment_amount: number | null
          payment_method: string | null
          payment_status: string | null
          status: Database["public"]["Enums"]["appointment_status"] | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          doctor_id: string
          id?: string
          notes?: string | null
          patient_id: string
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      blood_banks: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          operating_hours: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          operating_hours?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          operating_hours?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blood_inventory: {
        Row: {
          blood_bank_id: string
          blood_type: string
          id: string
          last_updated: string
          units_available: number
        }
        Insert: {
          blood_bank_id: string
          blood_type: string
          id?: string
          last_updated?: string
          units_available?: number
        }
        Update: {
          blood_bank_id?: string
          blood_type?: string
          id?: string
          last_updated?: string
          units_available?: number
        }
        Relationships: [
          {
            foreignKeyName: "blood_inventory_blood_bank_id_fkey"
            columns: ["blood_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      blood_notifications: {
        Row: {
          created_at: string
          emergency_request_id: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emergency_request_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          emergency_request_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blood_notifications_emergency_request_id_fkey"
            columns: ["emergency_request_id"]
            isOneToOne: false
            referencedRelation: "emergency_blood_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_availability: {
        Row: {
          created_at: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          doctor_id?: string
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_availability_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          about: string | null
          address: string | null
          city: string | null
          consultation_fee: number
          created_at: string
          experience_years: number | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          qualification: string
          rating: number | null
          reviews_count: number | null
          specialization_id: string
        }
        Insert: {
          about?: string | null
          address?: string | null
          city?: string | null
          consultation_fee: number
          created_at?: string
          experience_years?: number | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          qualification: string
          rating?: number | null
          reviews_count?: number | null
          specialization_id: string
        }
        Update: {
          about?: string | null
          address?: string | null
          city?: string | null
          consultation_fee?: number
          created_at?: string
          experience_years?: number | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          qualification?: string
          rating?: number | null
          reviews_count?: number | null
          specialization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "specializations"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_requests: {
        Row: {
          blood_bank_id: string
          blood_type: string
          created_at: string
          id: string
          notes: string | null
          preferred_date: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          blood_bank_id: string
          blood_type: string
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          blood_bank_id?: string
          blood_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_requests_blood_bank_id_fkey"
            columns: ["blood_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_profiles: {
        Row: {
          blood_type: string | null
          city: string | null
          created_at: string
          id: string
          is_available: boolean | null
          last_donation_date: string | null
          receive_emergency_alerts: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          blood_type?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          last_donation_date?: string | null
          receive_emergency_alerts?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          blood_type?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          last_donation_date?: string | null
          receive_emergency_alerts?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emergency_blood_requests: {
        Row: {
          blood_bank_id: string | null
          blood_type: string
          contact_phone: string
          created_at: string
          expires_at: string
          hospital_address: string | null
          hospital_name: string
          id: string
          notes: string | null
          patient_name: string | null
          requester_id: string | null
          status: string
          units_needed: number
          updated_at: string
          urgency_level: string
        }
        Insert: {
          blood_bank_id?: string | null
          blood_type: string
          contact_phone: string
          created_at?: string
          expires_at?: string
          hospital_address?: string | null
          hospital_name: string
          id?: string
          notes?: string | null
          patient_name?: string | null
          requester_id?: string | null
          status?: string
          units_needed?: number
          updated_at?: string
          urgency_level?: string
        }
        Update: {
          blood_bank_id?: string | null
          blood_type?: string
          contact_phone?: string
          created_at?: string
          expires_at?: string
          hospital_address?: string | null
          hospital_name?: string
          id?: string
          notes?: string | null
          patient_name?: string | null
          requester_id?: string | null
          status?: string
          units_needed?: number
          updated_at?: string
          urgency_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_blood_requests_blood_bank_id_fkey"
            columns: ["blood_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          appointment_id: string
          comment: string | null
          created_at: string | null
          doctor_id: string
          id: string
          patient_id: string
          rating: number
          updated_at: string | null
        }
        Insert: {
          appointment_id: string
          comment?: string | null
          created_at?: string | null
          doctor_id: string
          id?: string
          patient_id: string
          rating: number
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string
          comment?: string | null
          created_at?: string | null
          doctor_id?: string
          id?: string
          patient_id?: string
          rating?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      specializations: {
        Row: {
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          doctor_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "admin"
      appointment_status: "pending" | "confirmed" | "cancelled" | "completed"
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
      app_role: ["patient", "doctor", "admin"],
      appointment_status: ["pending", "confirmed", "cancelled", "completed"],
    },
  },
} as const
