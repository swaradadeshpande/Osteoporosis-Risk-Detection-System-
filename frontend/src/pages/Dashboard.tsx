import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { 
  Users, 
  AlertTriangle, 
  Activity, 
  Plus, 
  Search,
  Loader2,
  MessageSquare,
  ShieldCheck,
  User,
  Calendar,
  Clock,
  Video,
  MapPin
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Yesterday' | 'Today' | 'Tomorrow'>('Today');

  const riskData = [
    { name: 'Normal', value: 45, color: '#10b981' },
    { name: 'Osteopenia', value: 30, color: '#f59e0b' },
    { name: 'Osteoporosis', value: 25, color: '#f43f5e' },
  ];

  const monthlyTrend = [
    { month: 'Jan', screenings: 45, risk: 12 },
    { month: 'Feb', screenings: 52, risk: 15 },
    { month: 'Mar', screenings: 48, risk: 10 },
    { month: 'Apr', screenings: 70, risk: 22 },
    { month: 'May', screenings: 65, risk: 18 },
    { month: 'Jun', screenings: 85, risk: 25 },
  ];

  const ageDistribution = [
    { range: '40-50', count: 15 },
    { range: '50-60', count: 35 },
    { range: '60-70', count: 45 },
    { range: '70-80', count: 25 },
    { range: '80+', count: 10 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appRes] = await Promise.all([
          api.get('/stats'),
          api.get('/appointments/doctor/D-ADMIN')
        ]);
        setStats(statsRes.data);
        setAppointments(appRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const targetDate = activeTab === 'Today' ? today : activeTab === 'Yesterday' ? yesterday : tomorrow;
    return appointments.filter(a => a.date === targetDate);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;

  return (
    <div className="p-6 md:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Doctor Dashboard</h2>
          <p className="text-slate-500 font-medium">Welcome back, Dr. Rajesh Kumar. Here's your clinical overview.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none w-64 shadow-sm transition-all"
            />
          </div>
          <Link 
            to="/upload" 
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Screening
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Patients', value: stats?.totalPatients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Screenings Done', value: stats?.totalPredictions, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'High Risk Cases', value: stats?.osteoporosisCases, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'AI Accuracy', value: '94.2%', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className={`${s.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
              <s.icon className={`w-8 h-8 ${s.color}`} />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{s.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Appointment Schedule Section */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Appointment Schedule</h3>
            <p className="text-slate-500">Track your consultations for the selected period.</p>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {(['Yesterday', 'Today', 'Tomorrow'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredAppointments().length === 0 ? (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No appointments scheduled for {activeTab.toLowerCase()}.</p>
            </div>
          ) : (
            getFilteredAppointments().map((app, i) => (
              <motion.div 
                key={app.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mr-4 shadow-sm">
                      <User className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{app.patientName}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.patientId}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    app.type === 'Online' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {app.type}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-slate-600">
                    <Clock className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="text-sm font-bold">{app.time}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    {app.type === 'Online' ? (
                      <>
                        <Video className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="text-sm font-bold">Video Consultation</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="text-sm font-bold">In-Clinic Visit</span>
                      </>
                    )}
                  </div>
                </div>

                <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                  View Details
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Screening Trends</h3>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorScreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="screenings" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorScreen)" />
                <Area type="monotone" dataKey="risk" stroke="#f43f5e" strokeWidth={4} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10">Risk Distribution</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-3xl font-black text-slate-900">100</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {riskData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: d.color }}></div>
                  <span className="text-sm font-bold text-slate-600">{d.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Age Distribution */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10">Patient Age Demographics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient History Section */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Patient Histories</h3>
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {stats?.patients?.map((patient: any, i: number) => (
              <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900">{patient.name}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{patient.id}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 bg-white border border-slate-200 rounded-full uppercase tracking-widest text-slate-500">
                    {patient.age} Yrs
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    <span className="font-bold text-slate-900">Medical History:</span> {patient.notes}
                  </p>
                  <div className="flex gap-2 pt-2">
                    {patient.history?.slice(0, 2).map((h: any, j: number) => (
                      <span key={j} className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        h.risk === 'Normal' ? 'bg-emerald-100 text-emerald-600' : 
                        h.risk === 'Osteopenia' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {h.risk} ({new Date(h.date).toLocaleDateString()})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
