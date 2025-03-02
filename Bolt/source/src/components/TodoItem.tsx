import React, { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';
import { Database } from '../types/supabase';

type Todo = Database['public']['Tables']['todos']['Row'];

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  
  const { updateTodo, deleteTodo } = useTodoStore();
  
  const handleToggleComplete = () => {
    updateTodo(todo.id, { completed: !todo.completed });
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(todo.title);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      updateTodo(todo.id, { title: editedTitle });
      setIsEditing(false);
    }
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(todo.id);
    }
  };
  
  return (
    <div className={`flex items-center p-4 border-b ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggleComplete}
        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
      />
      
      {isEditing ? (
        <div className="flex-1 flex items-center ml-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button 
            onClick={handleSaveEdit}
            className="ml-2 p-1 text-green-600 hover:text-green-800"
          >
            <Check size={18} />
          </button>
          <button 
            onClick={handleCancelEdit}
            className="ml-1 p-1 text-red-600 hover:text-red-800"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          <span className={`flex-1 ml-3 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </span>
          
          <div className="flex items-center">
            <button 
              onClick={handleEdit}
              className="p-1 text-gray-600 hover:text-blue-600"
              disabled={todo.completed}
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={handleDelete}
              className="ml-1 p-1 text-gray-600 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}