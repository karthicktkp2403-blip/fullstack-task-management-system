import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Eye, EyeOff } from 'lucide-react';

export default function Login({ setToken, setUserRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      
      const { access_token } = res.data;
      if (access_token) {
        let role = '';
        try {
          const payload = JSON.parse(atob(access_token.split('.')[1]));
          role = payload.role;
        } catch (e) {
          console.error("Token parse error", e);
        }
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('role', role);
        setToken(access_token);
        setUserRole(role);
        
        if (role === 'Admin') navigate('/admin');
        else navigate('/user');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl ring-1 ring-gray-900/5">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-sm text-gray-500 mt-2">Log in to your account to continue</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              className="input-field" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field w-full pr-16" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 select-none cursor-pointer block h-full z-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button type="submit" className="w-full btn-primary bg-indigo-600 hover:bg-indigo-700 shadow-md flex justify-center py-2.5">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
