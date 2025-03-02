import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

type AuthMode = 'signin' | 'signup';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  
  const { signIn, signUp, loading, error } = useAuthStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signin') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
      // Switch to sign in mode after registration
      setMode('signin');
      alert('Registration successful! Please sign in.');
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === 'signin' ? 'Sign In' : 'Create Account'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-blue-500 hover:text-blue-700"
        >
          {mode === 'signin' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}