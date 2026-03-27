import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Clock, Briefcase, GraduationCap, Heart, User } from 'lucide-react';
import { useDate } from '../context/DateContext';
import { format } from 'date-fns';

const Schedule = () => {
  const { selectedDate } = useDate();
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ 
    title: '', 
    start_time: '09:00', 
    end_time: '10:00', 
    category: 'Work',
    schedule_date: format(selectedDate, 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchSchedule();
  }, [selectedDate]); // Re-fetch or re-evaluate when date changes

  const fetchSchedule = async () => {
    try {
      const res = await api.get('/schedule/');
      // Ideally backend returns schedules for the selectedDate's day_of_week
      // For MVP, we show the user's universal schedule blocks
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const dateString = newItem.schedule_date || format(selectedDate, 'yyyy-MM-dd');
      await api.post(`/schedule/?target_date=${dateString}`, newItem);
      setShowAdd(false);
      fetchSchedule();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (item) => {
    try {
      const isCompleted = item.logs && item.logs.some(log => log.date === format(selectedDate, 'yyyy-MM-dd') && log.status === 'Completed');
      const newStatus = isCompleted ? 'Not Completed' : 'Completed';
      
      await api.post('/tracking/', {
        item_type: 'Schedule',
        item_id: item.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        status: newStatus
      });
      fetchSchedule();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (cat) => {
    switch (cat) {
      case 'Work': return Briefcase;
      case 'Learning': return GraduationCap;
      case 'Health': return Heart;
      default: return User;
    }
  };

  return (
    <div className="space-y-8 p-4">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Daily Planner</h1>
          <p className="text-slate-500">Schedule for {format(selectedDate, 'MMMM do, yyyy')}</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Plan Time
        </button>
      </header>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-4">
          <input
            type="text"
            placeholder="Title"
            className="px-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 md:col-span-2"
            value={newItem.title}
            onChange={(e) => setNewItem({...newItem, title: e.target.value})}
            required
          />
          <input
            type="date"
            className="px-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
            value={newItem.schedule_date}
            onChange={(e) => setNewItem({...newItem, schedule_date: e.target.value})}
            required
          />
          <input
            type="time"
            className="px-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
            value={newItem.start_time}
            onChange={(e) => setNewItem({...newItem, start_time: e.target.value})}
            required
          />
          <input
            type="time"
            className="px-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
            value={newItem.end_time}
            onChange={(e) => setNewItem({...newItem, end_time: e.target.value})}
            required
          />
          <button type="submit" className="bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 md:col-span-5 py-3">Add Schedule Item</button>
        </form>
      )}

      <div className="grid gap-4">
        {items.filter((item) => item.schedule_date === format(selectedDate, 'yyyy-MM-dd')).sort((a,b) => a.start_time.localeCompare(b.start_time)).map((item) => {
          const Icon = getIcon(item.category);
          const isCompleted = item.logs && item.logs.some(log => log.date === format(selectedDate, 'yyyy-MM-dd') && log.status === 'Completed');

          return (
            <div key={item.id} className={`bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-6 group transition-all duration-300 ${isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100 hover:shadow-md hover:border-primary-100'}`}>
              <button 
                onClick={() => toggleComplete(item)}
                className={`p-1 rounded-full transition-transform hover:scale-110 ${isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isCompleted ? 'border-emerald-500 bg-emerald-500' : 'border-current'}`}>
                  {isCompleted && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
              
              <div className={`text-slate-500 font-bold w-24 flex flex-col border-r border-slate-100 pr-4 transition-colors ${isCompleted ? 'text-emerald-600/70 border-emerald-100' : 'group-hover:text-primary-600'}`}>
                <span className="text-lg">{item.start_time.slice(0,5)}</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">to {item.end_time.slice(0,5)}</span>
              </div>
              <div className={`p-4 rounded-2xl transition-all ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-xl font-bold transition-colors ${isCompleted ? 'text-emerald-800 line-through opacity-70' : 'text-slate-800 group-hover:text-primary-700'}`}>{item.title}</h3>
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
              </div>
            </div>
          );
        })}
        {items.filter((item) => item.schedule_date === format(selectedDate, 'yyyy-MM-dd')).length === 0 && (
          <div className="p-12 text-center text-slate-400 font-medium bg-white rounded-3xl border border-slate-100">
            No schedule blocks created for this specific date. Plan your time!
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
