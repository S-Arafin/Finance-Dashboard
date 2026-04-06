import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../Context/AuthContext';
import { FaLock } from 'react-icons/fa';
import ThemeToggle from '../Components/ThemeToggle';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username.toLowerCase(), password);
    
    if (success) {
      navigate('/'); 
    } else {
      setError('Invalid credentials. Try admin/admin or user/user');
    }
  };

  const quickLogin = (role) => {
    setError('');
    setUsername(role);
    setPassword(role);
    
    const success = login(role, role);
    if (success) {
      navigate('/');
    } else {
      setError(`Authentication failed for role: ${role}. Please check AuthProvider.jsx`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4 relative transition-colors duration-300">
      
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="bg-base-200 p-8 rounded-3xl shadow-2xl border border-base-300 w-full max-w-md">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/20 p-4 rounded-full mb-4">
            <FaLock className="text-3xl text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-base-content">Finance Portal</h1>
          <p className="text-neutral mt-2 text-sm">Sign in to manage your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 text-accent focus:outline-none focus:border-primary transition-colors"
              placeholder="admin or user"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 text-accent focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-accent text-sm font-medium text-center bg-accent/10 p-2 rounded-lg">{error}</p>}

          <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3 rounded-xl transition-colors mt-4">
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-base-300 text-center">
          <p className="text-xs text-neutral mb-3">Assignment Demo Quick Access:</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => quickLogin('admin')} type="button" className="text-xs bg-base-300 hover:bg-base-300/80 text-base-content px-3 py-1 rounded-md cursor-pointer">
              Load Admin
            </button>
            <button onClick={() => quickLogin('user')} type="button" className="text-xs bg-base-300 hover:bg-base-300/80 text-base-content px-3 py-1 rounded-md cursor-pointer">
              Load User
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;