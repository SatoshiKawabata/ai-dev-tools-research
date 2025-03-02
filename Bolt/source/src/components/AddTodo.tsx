import React, { useState } from 'react';
import { useTodoStore } from '../store/todoStore';

export default function AddTodo() {
  const [title, setTitle] = useState('');
  const { addTodo, loading } = useTodoStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      await addTodo(title);
      setTitle('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={!title.trim() || loading}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
}