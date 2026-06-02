import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'User' });
  const [newTask, setNewTask] = useState({ title: '', description: '', assigned_to: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        api.get('/users'),
        api.get('/tasks')
      ]);
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      setNewUser({ username: '', password: '', role: 'User' });
      fetchData();
    } catch (err) {
      alert("Error creating user");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newTask.title,
        description: newTask.description,
        assigned_to: newTask.assigned_to || null
      };
      await api.post('/tasks', payload);
      setNewTask({ title: '', description: '', assigned_to: '' });
      fetchData();
    } catch (err) {
      alert("Error creating task");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500">Manage users and oversee all tasks</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Create User</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <input 
              placeholder="Username" 
              className="input-field"
              value={newUser.username}
              onChange={e => setNewUser({...newUser, username: e.target.value})}
              required 
            />
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                className="input-field w-full pr-16"
                value={newUser.password}
                onChange={e => setNewUser({...newUser, password: e.target.value})}
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
            <select 
              className="input-field"
              value={newUser.role}
              onChange={e => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit" className="btn-primary w-full">Add User</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Create Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <input 
              placeholder="Title" 
              className="input-field"
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              required 
            />
            <textarea 
              placeholder="Description" 
              className="input-field"
              value={newTask.description}
              onChange={e => setNewTask({...newTask, description: e.target.value})}
            />
            <select 
              className="input-field"
              value={newTask.assigned_to}
              onChange={e => setNewTask({...newTask, assigned_to: e.target.value})}
            >
              <option value="">Unassigned</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
              ))}
            </select>
            <button type="submit" className="btn-primary w-full bg-indigo-600 hover:bg-indigo-700">Add Task</button>
          </form>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">All Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-medium">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-tr-lg">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && <tr><td colSpan="4" className="text-center py-4">No tasks found.</td></tr>}
              {tasks.map(task => {
                const assigneeName = users.find(u => u.id === task.assigned_to)?.username || 'Unassigned';
                return (
                  <tr key={task.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">#{task.id}</td>
                    <td className="px-4 py-3">{task.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                          'bg-amber-100 text-amber-700'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{assigneeName}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
