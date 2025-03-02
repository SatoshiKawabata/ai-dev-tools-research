import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Todo = Database['public']['Tables']['todos']['Row'];

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  updateTodo: (id: string, updates: { title?: string; completed?: boolean }) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,
  
  fetchTodos: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ todos: data as Todo[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  addTodo: async (title: string) => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title, user_id: user.id }])
        .select();
      
      if (error) throw error;
      
      set({ 
        todos: [data[0] as Todo, ...get().todos],
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  updateTodo: async (id: string, updates: { title?: string; completed?: boolean }) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      set({
        todos: get().todos.map(todo => 
          todo.id === id ? { ...todo, ...updates } : todo
        ),
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  deleteTodo: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set({
        todos: get().todos.filter(todo => todo.id !== id),
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));