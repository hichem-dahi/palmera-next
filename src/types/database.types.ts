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
      deliveries: {
        Row: {
          destination: string
          driver_name: string
          id: string
          license_plate: string
          phone: string | null
        }
        Insert: {
          destination: string
          driver_name: string
          id?: string
          license_plate: string
          phone?: string | null
        }
        Update: {
          destination?: string
          driver_name?: string
          id?: string
          license_plate?: string
          phone?: string | null
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
          id?: string
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
          order_id: string
          product_id: string
          qte: number
          total_price: number
          unit_cost_price: number | null
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          qte: number
          total_price: number
          unit_cost_price?: number | null
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          qte?: number
          total_price?: number
          unit_cost_price?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_line_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_line_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          client_id: string | null
          date: string
          delivery_id: string | null
          doc_index: number | null
          document_type: number
          id: string
          index: number
          individual_id: string | null
          organization_id: string | null
          paid_price: number
          payment_method: string | null
          status: number
          total_price: number
          ttc: number | null
          tva: number | null
        }
        Insert: {
          client_id?: string | null
          date: string
          delivery_id?: string | null
          doc_index?: number | null
          document_type: number
          id?: string
          index?: number
          individual_id?: string | null
          organization_id?: string | null
          paid_price: number
          payment_method?: string | null
          status: number
          total_price: number
          ttc?: number | null
          tva?: number | null
        }
        Update: {
          client_id?: string | null
          date?: string
          delivery_id?: string | null
          doc_index?: number | null
          document_type?: number
          id?: string
          index?: number
          individual_id?: string | null
          organization_id?: string | null
          paid_price?: number
          payment_method?: string | null
          status?: number
          total_price?: number
          ttc?: number | null
          tva?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "individuals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          activity: string | null
          address: string | null
          art: number | null
          id: string
          name: string
          nif: number | null
          nis: number | null
          phone: string
          rc: string | null
        }
        Insert: {
          activity?: string | null
          address?: string | null
          art?: number | null
          id?: string
          name: string
          nif?: number | null
          nis?: number | null
          phone: string
          rc?: string | null
        }
        Update: {
          activity?: string | null
          address?: string | null
          art?: number | null
          id?: string
          name?: string
          nif?: number | null
          nis?: number | null
          phone?: string
          rc?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          date: string
          id: string
          order_id: string
        }
        Insert: {
          amount: number
          date: string
          id?: string
          order_id: string
        }
        Update: {
          amount?: number
          date?: string
          id?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          code: string
          cost_price: number | null
          id: string
          name: string
          organization_id: string
          price: number
          qte: number
        }
        Insert: {
          code: string
          cost_price?: number | null
          id?: string
          name: string
          organization_id: string
          price: number
          qte: number
        }
        Update: {
          code?: string
          cost_price?: number | null
          id?: string
          name?: string
          organization_id?: string
          price?: number
          qte?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          phone: string | null
        }
        Insert: {
          email?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          phone?: string | null
        }
        Update: {
          email?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          date: string
          id: string
          order_id: string | null
          product_id: string
          qte_change: number
        }
        Insert: {
          date: string
          id?: string
          order_id?: string | null
          product_id: string
          qte_change: number
        }
        Update: {
          date?: string
          id?: string
          order_id?: string | null
          product_id?: string
          qte_change?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_movement_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movement_product_id_fkey"
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
      [_ in never]: never
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

