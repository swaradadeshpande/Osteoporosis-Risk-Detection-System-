import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Download, 
  ArrowRight,
  FileText,
  Activity,
  User,
  Calendar,
  ShieldCheck,
  Stethoscope,
  Info,
  Zap
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import api from '../lib/api';

const Result: React.FC = () => {
  const { patientId } = useParams();
  const location = useLocation();
  const [prediction, setPrediction] = useState<any>(location.state?.prediction);
  const [patient, setPatient] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await api.get(`/patients/${patientId}`);
        setPatient(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatient();
  }, [patientId]);

  const getRiskInfo = (result: string) => {
    switch (result) {
      case 'Normal':
        return { color: 'bg-emerald-500', text: 'text-emerald-600', icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'Osteopenia':
        return { color: 'bg-amber-500', text: 'text-amber-600', icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'Osteoporosis':
        return { color: 'bg-rose-500', text: 'text-rose-600', icon: AlertCircle, bg: 'bg-rose-50', border: 'border-rose-100' };
      default:
        return { color: 'bg-slate-500', text: 'text-slate-600', icon: AlertCircle, bg: 'bg-slate-50', border: 'border-slate-100' };
    }
  };

  const risk = getRiskInfo(prediction?.result);

  const exportPDF = async () => {
    if (!reportRef.current) return;
    
    const btn = document.activeElement as HTMLButtonElement;
    if (btn) btn.disabled = true;

    try {
      // Small delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Reduced scale for better compatibility
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('report-content');
          if (el) el.style.borderRadius = '0';
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG for smaller size
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`OsteoAI_Report_${patientId}_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('Failed to generate PDF. Please try printing the page (Ctrl+P) as a fallback.');
    } finally {
      if (btn) btn.disabled = false;
    }
  };

  return (
    <div className="p-6 md:p-10 pt-24 min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Screening Result</h2>
            <p className="text-slate-500">Comprehensive AI analysis for Patient {patientId}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="flex items-center px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              Print
            </button>
            <button 
              onClick={exportPDF}
              className="flex items-center px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </button>
            <Link 
              to="/chatbot" 
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Consult AI
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* Report Template */}
        <div ref={reportRef} id="report-content" className="bg-white p-12 rounded-[2rem] shadow-2xl border border-slate-100 mb-12 relative overflow-hidden">
          {/* Watermark/Logo */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] -mr-10 -mt-10">
            <Activity className="w-64 h-64 text-blue-600" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
              <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-xl mr-4">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tighter">OsteoAI</h1>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Diagnostic Report</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Report ID: #OAI-{Math.floor(Math.random() * 1000000)}</p>
                <p className="text-xs text-slate-500">{new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center text-slate-400 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Patient Details</span>
                </div>
                <p className="text-lg font-black text-slate-900">{patient?.name || 'Loading...'}</p>
                <p className="text-sm text-slate-500">{patient?.age} Years • {patient?.gender}</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center text-slate-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Screening Date</span>
                </div>
                <p className="text-lg font-black text-slate-900">{new Date(prediction?.timestamp).toLocaleDateString()}</p>
                <p className="text-sm text-slate-500">Routine X-ray Analysis</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center text-slate-400 mb-2">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">AI Confidence</span>
                </div>
                <p className="text-lg font-black text-slate-900">{(prediction?.probability * 100).toFixed(1)}%</p>
                <p className="text-sm text-slate-500">Deep Learning Model v2.4</p>
              </div>
            </div>

            <div className={`p-10 rounded-[2.5rem] ${risk.bg} ${risk.border} border-2 flex flex-col items-center text-center mb-12`}>
              <div className={`p-5 rounded-3xl bg-white shadow-sm mb-6`}>
                <risk.icon className={`w-16 h-16 ${risk.text}`} />
              </div>
              <h3 className={`text-5xl font-black ${risk.text} mb-3 tracking-tight`}>{prediction?.result}</h3>
              <p className="text-slate-600 text-lg max-w-xl mx-auto">
                Our AI model has detected structural patterns in the X-ray imaging that suggest a 
                <strong> {prediction?.result.toLowerCase()}</strong> risk level for osteoporosis.
              </p>
              
              <div className="w-full max-w-lg bg-white/50 rounded-full h-4 mt-8 overflow-hidden border border-white/50">
                <div 
                  className={`${risk.color} h-full transition-all duration-1000 shadow-lg`} 
                  style={{ width: `${prediction?.probability * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <h4 className="text-xl font-black text-slate-900 flex items-center">
                  <Stethoscope className="w-6 h-6 mr-3 text-blue-600" />
                  Clinical Observations
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3"></div>
                    <p className="text-sm text-slate-600">Reduced trabecular bone density observed in the femoral neck region.</p>
                  </div>
                  <div className="flex items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3"></div>
                    <p className="text-sm text-slate-600">Cortical thinning detected in the proximal femur shaft.</p>
                  </div>
                  <div className="flex items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3"></div>
                    <p className="text-sm text-slate-600">No acute fractures identified in the current imaging set.</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                  <Activity className="w-6 h-6 mr-3 text-blue-600" />
                  AI Heatmap Analysis
                </h4>
                <div className="aspect-[4/3] bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 relative overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/xray_heatmap/800/600" 
                    alt="Heatmap" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
                  />
                  <div className="relative z-10 text-center p-6">
                    <Zap className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest opacity-40">Grad-CAM Visualization</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-3xl text-white flex items-center">
              <Info className="w-10 h-10 mr-6 text-blue-400" />
              <div>
                <h5 className="font-bold text-lg mb-1">Medical Disclaimer</h5>
                <p className="text-slate-400 text-sm leading-relaxed">
                  This report is generated by an AI system and should be used as a screening tool only. 
                  Final diagnosis must be confirmed by a qualified radiologist or physician.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
