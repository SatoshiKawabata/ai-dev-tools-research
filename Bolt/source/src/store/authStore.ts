import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  
  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ user: data.user, session: data.session });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ user: null, session: null });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  getUser: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { user, session } } = await supabase.auth.getUser();
      
      set({ user, session, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));