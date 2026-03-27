import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Search, StickyNote, Palette } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Red', value: '#fecaca' },
  { name: 'Yellow', value: '#fef3c7' },
  { name: 'Green', value: '#d1fae5' },
  { name: 'Blue', value: '#dbeafe' },
  { name: 'Purple', value: '#f3e8ff' },
];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#ffffff' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes/');
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notes/', newNote);
      setNewNote({ title: '', content: '', color: '#ffffff' });
      setShowAdd(false);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <StickyNote className="w-10 h-10 text-primary-600" />
             My Thoughts
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Capture ideas, snippets, and important reminders.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-95"
        >
          <Plus className="w-6 h-6" />
          Create Note
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your notes..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-primary-100 transition-all font-medium text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAddNote} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Note Title"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-bold outline-none focus:ring-4 focus:ring-primary-50 text-slate-800"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Write your content here..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl min-h-[150px] outline-none focus:ring-4 focus:ring-primary-50 text-slate-700 font-medium leading-relaxed"
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                required
              />
            </div>
            <div className="space-y-4">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-4 h-4" /> Pick a Theme
              </p>
              <div className="grid grid-cols-3 gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setNewNote({...newNote, color: c.value})}
                    className={`h-16 rounded-2xl border-4 transition-all ${newNote.color === c.value ? 'border-primary-500 scale-105 shadow-md' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all">Save Note</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className="break-inside-avoid bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              style={{ backgroundColor: note.color !== '#ffffff' ? `${note.color}40` : '#ffffff' }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: note.color }} />
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black text-slate-800 leading-tight">{note.title}</h3>
                <button 
                  onClick={() => deleteNote(note.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap mb-6">
                {note.content}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {format(new Date(note.created_at), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredNotes.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
           <StickyNote className="w-20 h-20 text-slate-200 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-slate-400">No notes found</h2>
           <p className="text-slate-400 mt-1">Start by clicking "Create Note" above.</p>
        </div>
      )}
    </div>
  );
};

export default Notes;
