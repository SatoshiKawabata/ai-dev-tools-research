import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddTodo from '../../components/AddTodo';
import { useTodoStore } from '../../store/todoStore';

// Mock the todo store
vi.mock('../../store/todoStore', () => ({
  useTodoStore: vi.fn()
}));

describe('AddTodo Component', () => {
  const mockAddTodo = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useTodoStore as any).mockReturnValue({
      addTodo: mockAddTodo,
      loading: false
    });
  });
  
  it('renders the input and button', () => {
    render(<AddTodo />);
    
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });
  
  it('updates input value when typing', () => {
    render(<AddTodo />);
    
    const input = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(input, { target: { value: 'New Todo Item' } });
    
    expect(input).toHaveValue('New Todo Item');
  });
  
  it('calls addTodo when form is submitted', () => {
    render(<AddTodo />);
    
    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: 'Add' });
    
    fireEvent.change(input, { target: { value: 'New Todo Item' } });
    fireEvent.click(button);
    
    expect(mockAddTodo).toHaveBeenCalledWith('New Todo Item');
    expect(input).toHaveValue(''); // Input should be cleared
  });
  
  it('does not call addTodo when input is empty', () => {
    render(<AddTodo />);
    
    const button = screen.getByRole('button', { name: 'Add' });
    fireEvent.click(button);
    
    expect(mockAddTodo).not.toHaveBeenCalled();
  });
  
  it('disables button when loading', () => {
    (useTodoStore as any).mockReturnValue({
      addTodo: mockAddTodo,
      loading: true
    });
    
    render(<AddTodo />);
    
    const button = screen.getByRole('button', { name: 'Adding...' });
    expect(button).toBeDisabled();
  });
  
  it('disables input when loading', () => {
    (useTodoStore as any).mockReturnValue({
      addTodo: mockAddTodo,
      loading: true
    });
    
    render(<AddTodo />);
    
    const input = screen.getByPlaceholderText('Add a new todo...');
    expect(input).toBeDisabled();
  });
});