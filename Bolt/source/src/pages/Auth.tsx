import React from 'react';
import AuthForm from '../components/AuthForm';

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Todo App</h1>
          <p className="text-gray-600 mt-2">Manage your tasks efficiently</p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
}