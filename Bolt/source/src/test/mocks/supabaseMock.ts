import { vi } from 'vitest';
import { Database } from '../../types/supabase';

type Todo = Database['public']['Tables']['todos']['Row'];

// Mock data
const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Learn React',
    completed: false,
    created_at: new Date().toISOString(),
    user_id: 'user-123',
    position: 0
  },
  {
    id: '2',
    title: 'Build a Todo App',
    completed: true,
    created_at: new Date().toISOString(),
    user_id: 'user-123',
    position: 1
  },
  {
    id: '3',
    title: 'Write tests',
    completed: false,
    created_at: new Date().toISOString(),
    user_id: 'user-123',
    position: 2
  }
];

const mockUser = {
  id: 'user-123',
  email: 'test@example.com'
};

// Create a mock Supabase client
export const mockSupabase = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({
        then: vi.fn(),
        data: mockTodos,
        error: null
      })
    }),
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        then: vi.fn(),
        data: [(mockTodos[0])],
        error: null
      })
    }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        then: vi.fn(),
        data: null,
        error: null
      })
    }),
    delete: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        then: vi.fn(),
        data: null,
        error: null
      })
    }),
    eq: vi.fn().mockReturnValue({
      then: vi.fn(),
      data: null,
      error: null
    })
  }),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: mockUser, session: {} },
      error: null
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: mockUser, session: {} },
      error: null
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null
    }),
    signOut: vi.fn().mockResolvedValue({
      error: null
    })
  }
};