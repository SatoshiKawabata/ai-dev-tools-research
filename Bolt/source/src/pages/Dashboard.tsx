import React from 'react';
import { useAuthStore } from '../store/authStore';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuthStore();
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Todo App</h1>
        
        <div className="flex items-center">
          <span className="mr-4 text-gray-600">
            {user?.email}
          </span>
          <button
            onClick={signOut}
            className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            <LogOut size={18} className="mr-1" />
            Sign Out
          </button>
        </div>
      </header>
      
      <main>
        <AddTodo />
        <TodoList />
      </main>
    </div>
  );
}