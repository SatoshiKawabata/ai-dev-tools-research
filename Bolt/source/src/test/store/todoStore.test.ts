import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTodoStore } from '../../store/todoStore';
import { mockSupabase } from '../mocks/supabaseMock';
import { act } from '@testing-library/react';

// Reset the store before each test
beforeEach(() => {
  const store = useTodoStore.getState();
  act(() => {
    useTodoStore.setState({
      todos: [],
      loading: false,
      error: null
    });
  });
  vi.clearAllMocks();
});

describe('Todo Store', () => {
  it('should initialize with empty todos', () => {
    const { todos, loading, error } = useTodoStore.getState();
    expect(todos).toEqual([]);
    expect(loading).toBe(false);
    expect(error).toBe(null);
  });

  it('should fetch todos', async () => {
    const mockTodos = [
      { id: '1', title: 'Test Todo', completed: false, user_id: 'user-123', created_at: '2023-01-01', position: 0 }
    ];
    
    mockSupabase.from().select().order().data = mockTodos;
    
    await act(async () => {
      await useTodoStore.getState().fetchTodos();
    });
    
    expect(mockSupabase.from).toHaveBeenCalledWith('todos');
    expect(useTodoStore.getState().todos).toEqual(mockTodos);
    expect(useTodoStore.getState().loading).toBe(false);
  });

  it('should add a todo', async () => {
    const newTodo = { id: '1', title: 'New Todo', completed: false, user_id: 'user-123', created_at: '2023-01-01', position: 0 };
    mockSupabase.from().insert().select().data = [newTodo];
    
    await act(async () => {
      await useTodoStore.getState().addTodo('New Todo');
    });
    
    expect(mockSupabase.from).toHaveBeenCalledWith('todos');
    expect(mockSupabase.from().insert).toHaveBeenCalled();
    expect(useTodoStore.getState().todos).toContainEqual(newTodo);
  });

  it('should update a todo', async () => {
    // First add a todo
    const todo = { id: '1', title: 'Test Todo', completed: false, user_id: 'user-123', created_at: '2023-01-01', position: 0 };
    act(() => {
      useTodoStore.setState({ todos: [todo] });
    });
    
    // Then update it
    await act(async () => {
      await useTodoStore.getState().updateTodo('1', { completed: true });
    });
    
    expect(mockSupabase.from).toHaveBeenCalledWith('todos');
    expect(mockSupabase.from().update).toHaveBeenCalledWith({ completed: true });
    expect(mockSupabase.from().update().eq).toHaveBeenCalledWith('id', '1');
    
    const updatedTodo = useTodoStore.getState().todos.find(t => t.id === '1');
    expect(updatedTodo?.completed).toBe(true);
  });

  it('should delete a todo', async () => {
    // First add a todo
    const todo = { id: '1', title: 'Test Todo', completed: false, user_id: 'user-123', created_at: '2023-01-01', position: 0 };
    act(() => {
      useTodoStore.setState({ todos: [todo] });
    });
    
    // Then delete it
    await act(async () => {
      await useTodoStore.getState().deleteTodo('1');
    });
    
    expect(mockSupabase.from).toHaveBeenCalledWith('todos');
    expect(mockSupabase.from().delete).toHaveBeenCalled();
    expect(mockSupabase.from().delete().eq).toHaveBeenCalledWith('id', '1');
    expect(useTodoStore.getState().todos).toHaveLength(0);
  });

  it('should reorder todos', async () => {
    // Setup initial todos
    const todos = [
      { id: '1', title: 'First Todo', completed: false, user_id: 'user-123', created_at: '2023-01-01', position: 0 },
      { id: '2', title: 'Second Todo', completed: false, user_id: 'user-123', created_at: '2023-01-02', position: 1 },
      { id: '3', title: 'Third Todo', completed: false, user_id: 'user-123', created_at: '2023-01-03', position: 2 }
    ];
    
    act(() => {
      useTodoStore.setState({ todos });
    });
    
    // Reorder todos (move third to first position)
    const reorderedTodos = [
      todos[2], // Third becomes first
      todos[0], // First becomes second
      todos[1]  // Second becomes third
    ];
    
    await act(async () => {
      await useTodoStore.getState().reorderTodos(reorderedTodos);
    });
    
    // Check that update was called for each todo with the new position
    expect(mockSupabase.from).toHaveBeenCalledWith('todos');
    expect(mockSupabase.from().update).toHaveBeenCalledTimes(3);
    
    // Check the first call updated the third todo to position 0
    expect(mockSupabase.from().update).toHaveBeenNthCalledWith(1, { position: 0 });
    expect(mockSupabase.from().update().eq).toHaveBeenNthCalledWith(1, 'id', '3');
    
    // Check the second call updated the first todo to position 1
    expect(mockSupabase.from().update).toHaveBeenNthCalledWith(2, { position: 1 });
    expect(mockSupabase.from().update().eq).toHaveBeenNthCalledWith(2, 'id', '1');
    
    // Check the third call updated the second todo to position 2
    expect(mockSupabase.from().update).toHaveBeenNthCalledWith(3, { position: 2 });
    expect(mockSupabase.from().update().eq).toHaveBeenNthCalledWith(3, 'id', '2');
    
    // Check that the store state was updated
    expect(useTodoStore.getState().todos).toEqual(reorderedTodos);
  });
});