'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'Pending',
    priority: 'Medium',
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskData, setEditingTaskData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  useEffect(() => {
    if (!token) {
      setError('Access token not found. Please login.');
      return;
    }
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTask.title.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newTask),
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Failed to create task');
      const createdTask = await res.json();
      setTasks(prev => [...prev, createdTask]);
      setNewTask({
        title: '',
        description: '',
        due_date: '',
        status: 'Pending',
        priority: 'Medium',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Failed to delete task');

      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editingTaskData),
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask = await res.json();

      setTasks(prev => prev.map(t => (t.id === id ? updatedTask : t)));
      setEditingTaskId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (task) => {
    const { status, priority } = filter;
    const matchesStatus = !status || task.status === status;
    const matchesPriority = !priority || task.priority === priority;
    const matchesSearch =
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {loading && <p className="mb-2 text-blue-600 font-semibold">Loading...</p>}
      {error && <p className="mb-2 text-red-600 font-semibold">{error}</p>}

      {/* Create Task Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3">Create Task</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            disabled={loading}
          />
          <textarea
            className="border p-2 rounded col-span-1 md:col-span-3"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            disabled={loading}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            disabled={loading}
            min={new Date().toISOString().split("T")[0]}
          />
          <select
            className="border p-2 rounded"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            disabled={loading}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            className="border p-2 rounded"
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            disabled={loading}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button
          className={`mt-4 px-4 py-2 rounded text-white ${
            newTask.title.trim() && !loading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-300 cursor-not-allowed'
          }`}
          onClick={handleCreate}
          disabled={!newTask.title.trim() || loading}
        >
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          disabled={loading}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          disabled={loading}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
          disabled={loading}
        />
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {tasks.length === 0 && !loading && <p>No tasks found.</p>}

        {tasks.filter(handleFilter).map((task) => (
          <div
            key={task.id}
            className="p-4 bg-gray-50 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
          >
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editingTaskData.title}
                  onChange={(e) =>
                    setEditingTaskData({ ...editingTaskData, title: e.target.value })
                  }
                  className="border p-1 rounded flex-1"
                />
                <textarea
                  value={editingTaskData.description || ''}
                  onChange={(e) =>
                    setEditingTaskData({ ...editingTaskData, description: e.target.value })
                  }
                  className="border p-1 rounded flex-1"
                  placeholder="Description"
                />
                <input
                  type="date"
                  value={editingTaskData.due_date ? editingTaskData.due_date.split('T')[0] : ''}
                  onChange={(e) =>
                    setEditingTaskData({ ...editingTaskData, due_date: e.target.value })
                  }
                  className="border p-1 rounded"
                />
                <select
                  value={editingTaskData.status}
                  onChange={(e) =>
                    setEditingTaskData({ ...editingTaskData, status: e.target.value })
                  }
                  className="border p-1 rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <select
                  value={editingTaskData.priority}
                  onChange={(e) =>
                    setEditingTaskData({ ...editingTaskData, priority: e.target.value })
                  }
                  className="border p-1 rounded"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(task.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTaskId(null)}
                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-700">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-sm min-w-[130px]">
                  <span>
                    <strong>Status:</strong> {task.status}
                  </span>
                  <span>
                    <strong>Priority:</strong> {task.priority}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditingTaskData({ ...task });
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
