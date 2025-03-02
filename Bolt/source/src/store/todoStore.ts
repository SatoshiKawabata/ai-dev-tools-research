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
  reorderTodos: (todos: Todo[]) => Promise<void>;
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
        .order('position', { ascending: true });
      
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
      
      // Get the highest position value
      const todos = get().todos;
      const highestPosition = todos.length > 0 
        ? Math.max(...todos.map(todo => todo.position)) 
        : -1;
      
      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          title, 
          user_id: user.id,
          position: highestPosition + 1 
        }])
        .select();
      
      if (error) throw error;
      
      set({ 
        todos: [...get().todos, data[0] as Todo],
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
  
  reorderTodos: async (reorderedTodos: Todo[]) => {
    try {
      set({ loading: true, error: null });
      
      // Update local state immediately for responsive UI
      set({ todos: reorderedTodos });
      
      // Prepare batch updates with new positions
      const updates = reorderedTodos.map((todo, index) => ({
        id: todo.id,
        position: index
      }));
      
      // Update each todo with its new position
      for (const update of updates) {
        const { error } = await supabase
          .from('todos')
          .update({ position: update.position })
          .eq('id', update.id);
        
        if (error) throw error;
      }
      
      set({ loading: false });
    } catch (error: any) {
      // Revert to original order on error
      await get().fetchTodos();
      set({ error: error.message, loading: false });
    }
  }
}));