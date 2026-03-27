import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
      try {
        await api.delete('/auth/account');
        logout();
      } catch (err) {
        alert("Failed to delete account");
      }
    }
  };

  return (
    <PageWrapper>
      <div className="p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">User Profile</h1>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{user?.full_name || 'Anonymous User'}</h2>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" /> {user?.email}
              </p>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-8 mt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-400" /> Account Security
            </h3>
            <p className="text-slate-500 mb-6">Manage your account security and data.</p>
            
            <button 
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
            >
              <AlertTriangle className="w-5 h-5" />
              Delete Account Permanently
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;
