export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      companies: {
        Row: {
          activity: string
          address: string
          art: number
          id: string
          name: string
          nif: number
          nis: number
          phone: string
          rc: string
          updated_at: string
        }
        Insert: {
          activity: string
          address: string
          art: number
          id?: string
          name: string
          nif: number
          nis: number
          phone: string
          rc: string
          updated_at?: string
        }
        Update: {
          activity?: string
          address?: string
          art?: number
          id?: string
          name?: string
          nif?: number
          nis?: number
          phone?: string
          rc?: string
          updated_at?: string
        }
        Relationships: []
      }
      individuals: {
        Row: {
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          id: string
          name: string
          phone?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      order_lines: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          qte: number | null
          total_price: number
        }
        Insert: {
          id: string
          order_id?: string | null
          product_id?: string | null
          qte?: number | null
          total_price: number
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          qte?: number | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_lines_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          company_id: string | null
          date: string
          doc_index: number | null
          document_type: number
          id: string
          index: number
          individual_id: string | null
          order_lines: Json
          paid_price: number
          payment_method: string | null
          state: number
          total_price: number
          ttc: number | null
          tva: number | null
        }
        Insert: {
          company_id?: string | null
          date: string
          doc_index?: number | null
          document_type: number
          id: string
          index?: number
          individual_id?: string | null
          order_lines: Json
          paid_price: number
          payment_method?: string | null
          state: number
          total_price: number
          ttc?: number | null
          tva?: number | null
        }
        Update: {
          company_id?: string | null
          date?: string
          doc_index?: number | null
          document_type?: number
          id?: string
          index?: number
          individual_id?: string | null
          order_lines?: Json
          paid_price?: number
          payment_method?: string | null
          state?: number
          total_price?: number
          ttc?: number | null
          tva?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "individuals"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          code: string
          id: string
          name: string
          price: number | null
          qte: number | null
        }
        Insert: {
          code: string
          id: string
          name: string
          price?: number | null
          qte?: number | null
        }
        Update: {
          code?: string
          id?: string
          name?: string
          price?: number | null
          qte?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_id: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          date: string
          id: string
          order_id: string | null
          product_id: string | null
          qte_change: number
        }
        Insert: {
          date: string
          id: string
          order_id?: string | null
          product_id?: string | null
          qte_change: number
        }
        Update: {
          date?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          qte_change?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
      document_type: "Invoice" | "DeliveryNote" | "Voucher" | "Proforma"
      order_state: "Pending" | "Confirmed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

