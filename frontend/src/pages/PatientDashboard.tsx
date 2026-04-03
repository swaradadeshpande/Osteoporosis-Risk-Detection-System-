import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { 
  FileText, 
  Activity, 
  Calendar, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Loader2,
  Upload,
  History,
  DollarSign,
  AlertCircle,
  Zap,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';

const PatientDashboard: React.FC = () => {
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const patientId = 'P002'; // Mocked for demo

  const healthTrend = [
    { date: 'Jan', density: 0.85, risk: 0.2 },
    { date: 'Feb', density: 0.84, risk: 0.22 },
    { date: 'Mar', density: 0.86, risk: 0.18 },
    { date: 'Apr', density: 0.83, risk: 0.25 },
    { date: 'May', density: 0.82, risk: 0.28 },
    { date: 'Jun', density: 0.81, risk: 0.32 },
  ];

  const activityData = [
    { name: 'Calcium', value: 85, fill: '#3b82f6' },
    { name: 'Vitamin D', value: 65, fill: '#10b981' },
    { name: 'Exercise', value: 45, fill: '#f59e0b' },
    { name: 'Sleep', value: 90, fill: '#6366f1' },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/history/${patientId}`);
        setHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;

  const lastPrediction = history?.predictions[0];

  return (
    <div className="p-6 md:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">My Health Dashboard</h2>
          <p className="text-slate-500 font-medium">Hello, Alice. Here's your bone health summary.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/upload" 
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:-translate-y-1"
          >
            <Upload className="w-5 h-5 mr-2" />
            New Screening
          </Link>
        </div>
      </div>

      {/* Main Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-200"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left">
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-4">Current Status</p>
              <h3 className="text-6xl font-black mb-6 tracking-tighter">{lastPrediction?.result || 'No Data'}</h3>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Risk Level</p>
                  <p className="text-lg font-black">Moderate</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Last Scan</p>
                  <p className="text-lg font-black">{lastPrediction ? new Date(lastPrediction.timestamp).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="w-48 h-48 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
              <div className="text-center">
                <p className="text-4xl font-black">{(lastPrediction?.probability * 100).toFixed(0)}%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">Confidence</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-center">
          <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center">
            <Zap className="w-6 h-6 mr-3 text-amber-500" />
            Daily Goals
          </h4>
          <div className="space-y-6">
            {[
              { label: 'Calcium Intake', progress: 80, color: 'bg-blue-500' },
              { label: 'Vitamin D', progress: 45, color: 'bg-emerald-500' },
              { label: 'Weight Exercises', progress: 60, color: 'bg-indigo-500' },
            ].map((goal, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-600">{goal.label}</span>
                  <span className="text-slate-900">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`${goal.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bone Health Trend */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Bone Health Trend</h3>
            <div className="flex gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs font-bold text-slate-400">Density</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
                <span className="text-xs font-bold text-slate-400">Risk</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrend}>
                <defs>
                  <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="density" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorDensity)" />
                <Area type="monotone" dataKey="risk" stroke="#f43f5e" strokeWidth={4} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nutrient Balance */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10">Nutrient Balance</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="30%" 
                outerRadius="100%" 
                barSize={20} 
                data={activityData}
              >
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'AI Assistant', icon: MessageSquare, path: '/chatbot', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Consultancy', icon: Users, path: '/doctors', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'My Reports', icon: History, path: '/history', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Cost Estimate', icon: DollarSign, path: '/cost', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Health Advice', icon: AlertCircle, path: '/side-effects', color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((link, i) => (
          <Link 
            key={i} 
            to={link.path}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className={`${link.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <link.icon className={`w-8 h-8 ${link.color}`} />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-1">{link.label}</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Access Now</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
