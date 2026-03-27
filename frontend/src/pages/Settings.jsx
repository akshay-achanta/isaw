import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { Bell, Monitor, Lock, Globe } from 'lucide-react';

const Settings = () => {
  return (
    <PageWrapper>
      <div className="p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingsCard icon={Monitor} title="Appearance" desc="Theme preferences and layout styling." />
          <SettingsCard icon={Bell} title="Notifications" desc="Manage email and push notification preferences." />
          <SettingsCard icon={Globe} title="Language & Region" desc="Set your timezone and preferred language." />
          <SettingsCard icon={Lock} title="Privacy" desc="Data sharing and visibility settings." />
        </div>
      </div>
    </PageWrapper>
  );
};

const SettingsCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4">
    <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
      <p className="text-slate-500 text-sm mt-1">{desc}</p>
    </div>
  </div>
);

export default Settings;
