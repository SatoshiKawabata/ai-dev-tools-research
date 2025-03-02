import React, { useEffect } from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { todos, loading, error, fetchTodos } = useTodoStore();
  
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);
  
  if (loading && todos.length === 0) {
    return <div className="text-center py-4">Loading todos...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error: {error}
      </div>
    );
  }
  
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No todos yet. Add one above!
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}