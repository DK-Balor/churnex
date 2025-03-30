export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      stripe_accounts: {
        Row: {
          id: string
          user_id: string
          stripe_account_id: string
          connected: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_account_id: string
          connected: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_account_id?: string
          connected?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      account_status: {
        Row: {
          id: string
          user_id: string
          account_type: 'demo' | 'trial' | 'paid'
          subscription_tier?: string
          expires_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_type: 'demo' | 'trial' | 'paid'
          subscription_tier?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_type?: 'demo' | 'trial' | 'paid'
          subscription_tier?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
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
  }
}
