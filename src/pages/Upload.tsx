import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { 
  Upload as UploadIcon, 
  X, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

const Upload: React.FC = () => {
  const { user, role } = useAuth();
  const [patientData, setPatientData] = useState({
    patientId: '',
    name: '',
    age: '',
    gender: 'Male',
    notes: ''
  });

  useEffect(() => {
    if (role === 'patient' && user) {
      setPatientData(prev => ({
        ...prev,
        patientId: user.id || 'P002',
        name: user.name || 'Jane Smith',
      }));
    }
  }, [role, user]);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 30) {
        alert('Maximum 30 images allowed');
        return;
      }
      setFiles([...files, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file as Blob));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert('Please upload at least one X-ray image');
      return;
    }

    setLoading(true);
    try {
      // 1. Add Patient (always add to mock data for demo)
      await api.post('/patients/add', patientData);

      // 2. Upload X-rays
      const formData = new FormData();
      formData.append('patientId', patientData.patientId);
      files.forEach(file => formData.append('xrays', file));

      const uploadRes = await api.post('/upload-xray', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        }
      });

      // 3. Run Prediction on the first image for now
      const predictRes = await api.post('/predict', { 
        patientId: patientData.patientId, 
        imagePath: uploadRes.data.files[0].imagePath 
      });

      navigate(`/result/${patientData.patientId}`, { state: { prediction: predictRes.data } });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to complete screening');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {role === 'doctor' ? 'New Patient Screening' : 'Upload My X-ray'}
          </h2>
          <p className="text-slate-500 font-medium">
            {role === 'doctor' 
              ? 'Enter patient details and upload X-ray images for AI analysis.' 
              : 'Upload your routine X-ray images to get an instant osteoporosis risk assessment.'}
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Patient Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Patient ID</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                    value={patientData.patientId}
                    onChange={(e) => setPatientData({...patientData, patientId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                    value={patientData.name}
                    onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Age</label>
                    <input
                      type="number"
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={patientData.age}
                      onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                    <select
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={patientData.gender}
                      onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Medical Notes</label>
                  <textarea
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    rows={4}
                    placeholder="Any relevant history..."
                    value={patientData.notes}
                    onChange={(e) => setPatientData({...patientData, notes: e.target.value})}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center">
                <ImageIcon className="w-6 h-6 mr-3 text-blue-600" />
                X-ray Upload
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-80 border-4 border-slate-100 border-dashed rounded-[2rem] cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-blue-200 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <UploadIcon className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="mb-2 text-lg font-black text-slate-900">Drop your X-rays here</p>
                      <p className="text-sm text-slate-400 font-medium">or click to browse from your device</p>
                      <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPG, PNG (MAX. 30 images)</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-8">
                    {previews.map((src, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group aspect-square"
                      >
                        <img src={src} alt="preview" className="w-full h-full object-cover rounded-2xl shadow-sm border border-slate-100" />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {loading && (
              <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Loader2 className="animate-spin w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-bold text-blue-900">AI Analysis in Progress...</span>
                  </div>
                  <span className="font-black text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="bg-blue-600 h-full rounded-full"
                  ></motion.div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || files.length === 0}
              className="w-full py-6 px-8 text-white bg-blue-600 hover:bg-blue-700 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center hover:-translate-y-1 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-8 h-8 mr-3" />
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-8 h-8 mr-3" />
                  Run AI Prediction
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
