import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../../store/authStore';
import { mockSupabase } from '../mocks/supabaseMock';
import { act } from '@testing-library/react';

// Reset the store before each test
beforeEach(() => {
  act(() => {
    useAuthStore.setState({
      user: null,
      session: null,
      loading: false,
      error: null
    });
  });
  vi.clearAllMocks();
});

describe('Auth Store', () => {
  it('should initialize with no user', () => {
    const { user, session, loading, error } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(session).toBeNull();
    expect(loading).toBe(false);
    expect(error).toBeNull();
  });

  it('should sign up a user', async () => {
    await act(async () => {
      await useAuthStore.getState().signUp('test@example.com', 'password123');
    });
    
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should sign in a user', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: mockUser, session: { token: 'fake-token' } },
      error: null
    });
    
    await act(async () => {
      await useAuthStore.getState().signIn('test@example.com', 'password123');
    });
    
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().session).toEqual({ token: 'fake-token' });
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should sign out a user', async () => {
    // First set a user
    act(() => {
      useAuthStore.setState({
        user: { id: 'user-123', email: 'test@example.com' },
        session: { token: 'fake-token' }
      });
    });
    
    await act(async () => {
      await useAuthStore.getState().signOut();
    });
    
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should get the current user', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: { user: mockUser, session: { token: 'fake-token' } },
      error: null
    });
    
    await act(async () => {
      await useAuthStore.getState().getUser();
    });
    
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().session).toEqual({ token: 'fake-token' });
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should handle sign in error', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' }
    });
    
    await act(async () => {
      await useAuthStore.getState().signIn('test@example.com', 'wrong-password');
    });
    
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().error).toBe('Invalid credentials');
  });
});