import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Target, Zap, ShieldCheck } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-2xl">
          <Zap className="w-8 h-8 text-accent-600" />
          AI Tracker
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2.5 text-slate-600 font-bold hover:text-primary-600 transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-200">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-50 text-accent-700 font-bold text-sm mb-8 animate-fade-in-up">
          <ShieldCheck className="w-4 h-4" />
          The Ultimate Productivity OS
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight max-w-4xl mb-6 leading-tight">
          Master Your Time. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
            Achieve Your Goals.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
          A smart web app that tracks daily activities, habits, learning, and provides AI-based insights for self-improvement. Build the perfect routine today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/register" className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 hover:-translate-y-1">
            Get Started for Free
          </Link>
          <Link to="/login" className="px-8 py-4 bg-white text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 border border-slate-200 transition-all shadow-sm">
            Sign In to Dashboard
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-left">
          <FeatureCard icon={Activity} title="Habit Tracking" desc="Build consistency with daily streaks and visual progress." color="text-emerald-500" bg="bg-emerald-50" />
          <FeatureCard icon={Target} title="Task Management" desc="Organize priorities and hit your daily milestones." color="text-amber-500" bg="bg-amber-50" />
          <FeatureCard icon={Zap} title="AI Insights" desc="Get rule-based suggestions to optimize your workflow." color="text-blue-500" bg="bg-blue-50" />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color, bg }) => (
  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
