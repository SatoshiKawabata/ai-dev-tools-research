import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../../components/TodoItem';
import { useTodoStore } from '../../store/todoStore';

// Mock the todo store
vi.mock('../../store/todoStore', () => ({
  useTodoStore: vi.fn()
}));

// Mock the dnd-kit hooks
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null
  })
}));

describe('TodoItem Component', () => {
  const mockUpdateTodo = vi.fn();
  const mockDeleteTodo = vi.fn();
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    created_at: '2023-01-01',
    user_id: 'user-123',
    position: 0
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useTodoStore as any).mockReturnValue({
      updateTodo: mockUpdateTodo,
      deleteTodo: mockDeleteTodo
    });
    
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });
  
  it('renders the todo item', () => {
    render(<TodoItem todo={mockTodo} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
  
  it('renders a completed todo with strikethrough', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} />);
    
    expect(screen.getByText('Test Todo')).toHaveClass('line-through');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
  
  it('calls updateTodo when checkbox is toggled', () => {
    render(<TodoItem todo={mockTodo} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockUpdateTodo).toHaveBeenCalledWith('1', { completed: true });
  });
  
  it('enters edit mode when edit button is clicked', () => {
    render(<TodoItem todo={mockTodo} />);
    
    const editButton = screen.getByRole('button', { name: '' }); // Edit button has Pencil icon
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // Save button
    expect(screen.getAllByRole('button', { name: '' })[1]).toBeInTheDocument(); // Cancel button
  });
  
  it('updates todo when save button is clicked in edit mode', () => {
    render(<TodoItem todo={mockTodo} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: '' }); // Edit button
    fireEvent.click(editButton);
    
    // Change the input value
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    
    // Click save button
    const saveButton = screen.getByRole('button', { name: '' }); // Save button
    fireEvent.click(saveButton);
    
    expect(mockUpdateTodo).toHaveBeenCalledWith('1', { title: 'Updated Todo' });
  });
  
  it('cancels edit mode when cancel button is clicked', () => {
    render(<TodoItem todo={mockTodo} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: '' }); // Edit button
    fireEvent.click(editButton);
    
    // Change the input value
    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    
    // Click cancel button
    const cancelButton = screen.getAllByRole('button', { name: '' })[1]; // Cancel button
    fireEvent.click(cancelButton);
    
    // Should be back in view mode with original text
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(mockUpdateTodo).not.toHaveBeenCalled();
  });
  
  it('calls deleteTodo when delete button is clicked', () => {
    render(<TodoItem todo={mockTodo} />);
    
    const deleteButton = screen.getAllByRole('button', { name: '' })[1]; // Delete button
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteTodo).toHaveBeenCalledWith('1');
  });
  
  it('does not call deleteTodo when delete is canceled', () => {
    // Override the confirm mock to return false
    (window.confirm as any).mockImplementationOnce(() => false);
    
    render(<TodoItem todo={mockTodo} />);
    
    const deleteButton = screen.getAllByRole('button', { name: '' })[1]; // Delete button
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteTodo).not.toHaveBeenCalled();
  });
});