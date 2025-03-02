import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TodoList from '../../components/TodoList';
import { useTodoStore } from '../../store/todoStore';

// Mock the todo store
vi.mock('../../store/todoStore', () => ({
  useTodoStore: vi.fn()
}));

// Mock the TodoItem component
vi.mock('../../components/TodoItem', () => ({
  default: ({ todo }: any) => <div data-testid={`todo-item-${todo.id}`}>{todo.title}</div>
}));

// Mock the dnd-kit components
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
  closestCenter: vi.fn(),
  KeyboardSensor: vi.fn(),
  PointerSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => ({}))
}));

vi.mock('@dnd-kit/sortable', () => ({
  arrayMove: vi.fn((items, oldIndex, newIndex) => {
    const result = [...items];
    const [removed] = result.splice(oldIndex, 1);
    result.splice(newIndex, 0, removed);
    return result;
  }),
  SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
  sortableKeyboardCoordinates: vi.fn(),
  verticalListSortingStrategy: {}
}));

describe('TodoList Component', () => {
  const mockFetchTodos = vi.fn();
  const mockReorderTodos = vi.fn();
  const mockTodos = [
    {
      id: '1',
      title: 'Test Todo 1',
      completed: false,
      created_at: '2023-01-01',
      user_id: 'user-123',
      position: 0
    },
    {
      id: '2',
      title: 'Test Todo 2',
      completed: true,
      created_at: '2023-01-02',
      user_id: 'user-123',
      position: 1
    }
  ];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('shows loading state when loading and no todos', () => {
    (useTodoStore as any).mockReturnValue({
      todos: [],
      loading: true,
      error: null,
      fetchTodos: mockFetchTodos
    });
    
    render(<TodoList />);
    
    expect(screen.getByText('Loading todos...')).toBeInTheDocument();
    expect(mockFetchTodos).toHaveBeenCalled();
  });
  
  it('shows error message when there is an error', () => {
    (useTodoStore as any).mockReturnValue({
      todos: [],
      loading: false,
      error: 'Failed to fetch todos',
      fetchTodos: mockFetchTodos
    });
    
    render(<TodoList />);
    
    expect(screen.getByText('Error: Failed to fetch todos')).toBeInTheDocument();
    expect(mockFetchTodos).toHaveBeenCalled();
  });
  
  it('shows empty state when there are no todos', () => {
    (useTodoStore as any).mockReturnValue({
      todos: [],
      loading: false,
      error: null,
      fetchTodos: mockFetchTodos
    });
    
    render(<TodoList />);
    
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    expect(mockFetchTodos).toHaveBeenCalled();
  });
  
  it('renders todos when they exist', () => {
    (useTodoStore as any).mockReturnValue({
      todos: mockTodos,
      loading: false,
      error: null,
      fetchTodos: mockFetchTodos,
      reorderTodos: mockReorderTodos
    });
    
    render(<TodoList />);
    
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-context')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(mockFetchTodos).toHaveBeenCalled();
  });
});