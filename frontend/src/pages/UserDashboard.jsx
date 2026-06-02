import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchMyTasks = async () => {
    try {
      const res = await api.get('/tasks/mine');
      setTasks(res.data);
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchMyTasks();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
          <p className="text-slate-500">View and update your assignments</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            You don't have any tasks assigned yet.
          </div>
        )}
        {tasks.map(task => (
          <div key={task.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-slate-800 line-clamp-1">{task.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                        ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                          'bg-amber-100 text-amber-700'}`}>
                {task.status}
              </span>
            </div>
            
            <p className="text-slate-600 text-sm mb-6 flex-grow">{task.description}</p>
            
            <div className="mt-auto">
              <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Update Status</label>
              <select 
                className="input-field py-1.5 text-sm font-medium text-slate-700 bg-slate-50 focus:bg-white"
                value={task.status}
                onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
