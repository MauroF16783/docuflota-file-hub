export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conductores: {
        Row: {
          apellidos: string
          cedula: string
          created_at: string | null
          email: string | null
          id: string
          nombres: string
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          apellidos: string
          cedula: string
          created_at?: string | null
          email?: string | null
          id?: string
          nombres: string
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          apellidos?: string
          cedula?: string
          created_at?: string | null
          email?: string | null
          id?: string
          nombres?: string
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tipos_documentos: {
        Row: {
          activo: boolean | null
          categoria: Database["public"]["Enums"]["categoria_documento"]
          codigo: string
          created_at: string | null
          id: string
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          categoria: Database["public"]["Enums"]["categoria_documento"]
          codigo: string
          created_at?: string | null
          id?: string
          nombre: string
        }
        Update: {
          activo?: boolean | null
          categoria?: Database["public"]["Enums"]["categoria_documento"]
          codigo?: string
          created_at?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      vehiculos: {
        Row: {
          año: number | null
          created_at: string | null
          id: string
          marca: string | null
          modelo: string | null
          placa: string
          updated_at: string | null
        }
        Insert: {
          año?: number | null
          created_at?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          placa: string
          updated_at?: string | null
        }
        Update: {
          año?: number | null
          created_at?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          placa?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      categoria_documento: "vehiculo" | "conductor"
      tipo_documento:
        | "mantenimiento"
        | "revision_tecnomecanica"
        | "soat"
        | "tarjeta_propiedad"
        | "seguridad_social"
        | "pase"
        | "cedula"
        | "cursos"
        | "examenes_medicos"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      categoria_documento: ["vehiculo", "conductor"],
      tipo_documento: [
        "mantenimiento",
        "revision_tecnomecanica",
        "soat",
        "tarjeta_propiedad",
        "seguridad_social",
        "pase",
        "cedula",
        "cursos",
        "examenes_medicos",
      ],
    },
  },
} as const
