import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  History as HistoryIcon, 
  Calendar, 
  ImageIcon, 
  Activity,
  Loader2,
  ChevronRight,
  User,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'motion/react';

const History: React.FC = () => {
  const { role } = useAuth();
  const [patientId, setPatientId] = useState('');
  const [history, setHistory] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    if (role === 'doctor') {
      fetchPatients();
    }
  }, [role]);

  const fetchPatients = async () => {
    setPatientsLoading(true);
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Failed to fetch patients');
    } finally {
      setPatientsLoading(false);
    }
  };

  const fetchHistory = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/history/${id}`);
      setHistory(response.data);
      const patient = patients.find(p => p.patientId === id);
      if (patient) setSelectedPatient(patient);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch history');
      setHistory(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;
    fetchHistory(patientId);
  };

  if (role === 'doctor' && !history) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Patient Records</h1>
          <p className="text-slate-500">Access and manage comprehensive medical histories of all patients.</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-10">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Patient ID (e.g., P001)..."
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Search className="w-5 h-5 mr-2" />}
              Search
            </button>
          </form>
        </div>

        {patientsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((p, i) => (
              <motion.div
                key={p.patientId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => fetchHistory(p.patientId)}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{p.patientId}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Age</span>
                    <span className="text-slate-700 font-bold">{p.age} Yrs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Gender</span>
                    <span className="text-slate-700 font-bold">{p.gender}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 flex items-center text-blue-600 font-bold text-sm">
                  View Full History
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {role === 'doctor' && (
        <button 
          onClick={() => { setHistory(null); setSelectedPatient(null); }}
          className="mb-8 flex items-center text-slate-500 hover:text-blue-600 font-bold transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Patient List
        </button>
      )}

      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2">
          {role === 'doctor' ? `History: ${selectedPatient?.name}` : 'My Medical Reports'}
        </h1>
        <p className="text-slate-500">
          {role === 'doctor' ? `Comprehensive clinical history for ${selectedPatient?.patientId}.` : 'Track your bone health progress over time.'}
        </p>
      </div>

      {role === 'patient' && !history && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-10">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter your Patient ID to view reports..."
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Search className="w-5 h-5 mr-2" />}
              View Reports
            </button>
          </form>
          {error && <p className="mt-4 text-rose-500 text-sm font-bold">{error}</p>}
        </div>
      )}

      {history && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
              <HistoryIcon className="w-8 h-8 mr-3 text-blue-600" />
              Screening Timeline
            </h3>
            {history.predictions.length === 0 ? (
              <div className="bg-slate-50 p-12 rounded-[2.5rem] text-center border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No screening records found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {history.predictions.map((p: any, i: number) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6"
                  >
                    <div className="flex items-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-6 ${
                        p.result === 'Normal' ? 'bg-emerald-50 text-emerald-600' :
                        p.result === 'Osteopenia' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        <Activity className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-slate-900">{p.result}</h4>
                        <p className="text-sm text-slate-400 font-bold flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(p.timestamp).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Confidence</p>
                      <p className="text-2xl font-black text-slate-900">{(p.probability * 100).toFixed(1)}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
              <ImageIcon className="w-8 h-8 mr-3 text-blue-600" />
              X-ray Archive
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {history.xrays.map((x: any, i: number) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05 }}
                  className="relative group aspect-square rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
                >
                  <img src={x.imagePath} alt="X-ray" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="text-white bg-blue-600 p-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
