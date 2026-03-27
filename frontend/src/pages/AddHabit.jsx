import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const AddHabit = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await api.post('/habits', { title, description });
      navigate('/habits');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <header>
        <button onClick={() => navigate('/habits')} className="text-slate-400 hover:text-primary-600 flex items-center gap-2 mb-4 font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Habits
        </button>
        <h1 className="text-3xl font-bold text-slate-800">Add New Habit</h1>
        <p className="text-slate-500 mt-1">Define an objective to build into your routine.</p>
      </header>

      <form onSubmit={handleAdd} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-2">Habit Name</label>
          <input
            type="text"
            placeholder="e.g. Read 20 pages"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-2">Description (Optional)</label>
          <textarea
            placeholder="Why is this habit important?"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-md shadow-primary-200 text-lg">
          <CheckCircle2 className="w-6 h-6" />
          Create Habit
        </button>
      </form>
    </div>
  );
};

export default AddHabit;
