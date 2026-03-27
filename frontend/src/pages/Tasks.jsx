import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { useDate } from '../context/DateContext';
import { format } from 'date-fns';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const { selectedDate, isSelectedDate } = useDate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask) return;
    try {
      await api.post('/tasks/', { 
        title: newTask,
        due_date: format(selectedDate, "yyyy-MM-dd'T'12:00:00")
      });
      setNewTask('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (task) => {
    try {
      const isCompleted = task.logs && task.logs.some(log => isSelectedDate(log.date) && log.status === 'Completed');
      const newStatus = isCompleted ? 'Not Completed' : 'Completed';
      const dateString = format(selectedDate, 'yyyy-MM-dd');

      await api.post('/tracking/', {
        item_type: 'Task',
        item_id: task.id,
        date: dateString,
        status: newStatus
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(t => isSelectedDate(t.created_at) || isSelectedDate(t.due_date));

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>
        <p className="text-slate-500">Tasks for {format(selectedDate, 'MMM dd, yyyy')}</p>
      </header>

      <form onSubmit={addTask} className="flex gap-4">
        <input
          type="text"
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all">
          <Plus className="w-5 h-5" />
          Add
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredTasks.map((task) => {
          const isCompleted = task.logs && task.logs.some(log => isSelectedDate(log.date) && log.status === 'Completed');
          
          return (
            <div key={task.id} className="p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(task)} className="text-slate-400 hover:text-emerald-500">
                  {isCompleted ? <CheckCircle className="text-emerald-500" /> : <Circle />}
                </button>
                <div className="flex flex-col">
                  <span className={`text-lg font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {task.title}
                  </span>
                  {task.description && <span className="text-sm text-slate-400">{task.description}</span>}
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}
        {filteredTasks.length === 0 && (
          <div className="p-12 text-center text-slate-400 font-medium">
            No tasks found for this date. Chill or add some!
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
