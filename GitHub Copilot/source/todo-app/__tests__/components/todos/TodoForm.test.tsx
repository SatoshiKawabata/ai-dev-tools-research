import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TodoForm from '../../../src/components/todos/TodoForm';

describe('TodoForm Component', () => {
  it('submits new todo', () => {
    const mockSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <TodoForm onSubmit={mockSubmit} />
    );
    fireEvent.change(getByPlaceholderText('Todo title'), {
      target: { value: 'New Todo' },
    });
    fireEvent.click(getByText('Add Todo'));
    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'New Todo',
      completed: false,
    });
  });

  it('loads existing todo for edit', () => {
    const existingTodo = { id: '1', title: 'Existing', completed: true };
    const { getByDisplayValue } = render(
      <TodoForm onSubmit={jest.fn()} existingTodo={existingTodo} />
    );
    expect(getByDisplayValue('Existing')).toBeInTheDocument();
  });
});
