import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, BookOpen, Clock, Activity } from 'lucide-react';
import { useDate } from '../context/DateContext';
import { format } from 'date-fns';

const Learning = () => {
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState({ topic: '', duration: 30, category: 'Tech' });
  const { selectedDate, isSelectedDate } = useDate();

  useEffect(() => {
    fetchLogs();
  }, [selectedDate]);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/learning/');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      await api.post(`/learning/?target_date=${dateString}`, newLog);
      setNewLog({ topic: '', duration: 30, category: 'Tech' });
      fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (logItem) => {
    try {
      const isCompleted = logItem.logs && logItem.logs.some(l => isSelectedDate(l.date) && l.status === 'Completed');
      const newStatus = isCompleted ? 'Not Completed' : 'Completed';
      
      await api.post('/tracking/', {
        item_type: 'Learning',
        item_id: logItem.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        status: newStatus
      });
      fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLogs = logs.filter(log => isSelectedDate(log.created_at));
  const totalMinutes = filteredLogs.reduce((acc, log) => acc + log.duration, 0);

  return (
    <div className="space-y-8 p-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Learning Hub</h1>
          <p className="text-slate-500">Learning progress for {format(selectedDate, 'MMM dd, yyyy')}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center min-w-32">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time Logged</p>
            <p className="text-2xl font-black text-blue-600 font-mono">{(totalMinutes / 60).toFixed(1)}h</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <form onSubmit={handleAdd} className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Log Session</h2>
          <div>
            <label className="block text-sm text-slate-500 font-bold mb-1">Topic</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              value={newLog.topic}
              onChange={(e) => setNewLog({...newLog, topic: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-500 font-bold mb-1">Duration (min)</label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              value={newLog.duration}
              onChange={(e) => setNewLog({...newLog, duration: parseInt(e.target.value)})}
              required
            />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all">
            Add Session
          </button>
        </form>

        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Sessions on {format(selectedDate, 'MMM dd')}</h2>
          <div className="grid gap-4">
            {filteredLogs.slice().reverse().map((log) => {
              const isCompleted = log.logs && log.logs.some(l => isSelectedDate(l.date) && l.status === 'Completed');
              
              return (
              <div key={log.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all flex items-center justify-between ${isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleComplete(log)}
                    className={`transition-all hover:scale-110 ${isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isCompleted ? 'border-emerald-500 bg-emerald-500' : 'border-current'}`}>
                      {isCompleted && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                  <div className={`p-3 rounded-xl transition-colors ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-500'}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold transition-colors ${isCompleted ? 'text-emerald-800 line-through opacity-70' : 'text-slate-800'}`}>{log.topic}</h3>
                    <p className="text-sm text-slate-400">{log.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-bold bg-slate-50 px-3 py-1 rounded-lg">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {log.duration}m
                </div>
              </div>
            )})}
            {filteredLogs.length === 0 && (
              <div className="p-12 text-center font-medium text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
                No learning logged for this date. Start your session!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
