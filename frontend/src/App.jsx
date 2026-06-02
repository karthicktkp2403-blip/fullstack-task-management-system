import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => {
      setUserRole(localStorage.getItem('role'));
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (allowedRole && userRole !== allowedRole) {
       return <Navigate to={userRole === 'Admin' ? "/admin" : "/user"} replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} setUserRole={setUserRole} />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/user" 
          element={
            <ProtectedRoute allowedRole="User">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to={token ? (userRole === 'Admin' ? '/admin' : '/user') : '/login'} replace />} />
      </Routes>
    </div>
  );
}

export default App;
