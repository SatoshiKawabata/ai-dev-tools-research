import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TodoList from '../../../src/components/todos/TodoList';

jest.mock('../../../src/utils/api', () => ({
  reorderTodos: jest.fn(),
}));

describe('TodoList Component', () => {
  it('renders todos correctly', () => {
    const { getByText } = render(
      <TodoList
        todos={[
          { id: '1', title: 'Test Todo 1', completed: false },
          { id: '2', title: 'Test Todo 2', completed: false },
        ]}
        onDelete={jest.fn()}
        onToggle={jest.fn()}
      />
    );
    expect(getByText('Test Todo 1')).toBeInTheDocument();
    expect(getByText('Test Todo 2')).toBeInTheDocument();
  });

  it('handles drag and drop correctly', () => {
    // This is a simple placeholder test. In a real application,
    // you can mock the DragDropContext and test reorder logic further.
    const { getByText } = render(
      <DragDropContext onDragEnd={jest.fn()}>
        <Droppable droppableId="test">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <TodoList
                todos={[{ id: '1', title: 'Item 1', completed: false }]}
                onDelete={jest.fn()}
                onToggle={jest.fn()}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
    expect(getByText('Item 1')).toBeInTheDocument();
  });
});
