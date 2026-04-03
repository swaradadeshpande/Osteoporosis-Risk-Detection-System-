import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Shield, Globe, LogOut, Save } from 'lucide-react';
import { motion } from 'motion/react';

const Settings: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Account Settings</h1>
        <p className="text-slate-500">Manage your profile and application preferences.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Personal Profile</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
              <input 
                type="text" 
                defaultValue={user?.name} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                defaultValue={user?.email} 
                disabled
                className="w-full px-4 py-3 bg-slate-100 border border-slate-100 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Account Type</label>
              <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-bold capitalize">
                {role}
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mr-4">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Preferences</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="font-bold text-slate-900">Push Notifications</p>
                <p className="text-sm text-slate-500">Receive alerts about reports and appointments.</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-full transition-all relative ${notifications ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="font-bold text-slate-900">Language</p>
                <p className="text-sm text-slate-500">Select your preferred display language.</p>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700 outline-none"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
                <option>Tamil</option>
              </select>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mr-4">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Security</h2>
          </div>
          
          <button className="px-6 py-3 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-all">
            Change Password
          </button>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center shadow-xl shadow-blue-100 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save All Changes
              </>
            )}
          </button>
          <button 
            onClick={logout}
            className="flex-1 py-4 bg-white text-rose-600 border border-rose-100 font-bold rounded-2xl hover:bg-rose-50 transition-all flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
