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
      todos: {
        Row: {
          id: string
          created_at: string
          title: string
          completed: boolean
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          completed?: boolean
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          completed?: boolean
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          username?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string | null
          avatar_url?: string | null
        }
      }
    }
  }
}