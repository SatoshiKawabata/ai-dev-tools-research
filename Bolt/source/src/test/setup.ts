import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { mockSupabase } from './mocks/supabaseMock';

// Mock the supabase client
vi.mock('../lib/supabase', () => ({
  supabase: mockSupabase,
}));