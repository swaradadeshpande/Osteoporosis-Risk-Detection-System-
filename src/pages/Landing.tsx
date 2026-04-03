import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Activity, DollarSign, MessageSquare, CheckCircle2, Globe, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';

const Landing: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-8 pb-8 lg:pt-12 lg:pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4 border border-blue-100"
          >
            <Zap className="w-4 h-4 mr-2" />
            Next-Gen Healthcare AI
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-[1.1]"
          >
            Detect Osteoporosis Risk <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              With Routine X-Rays
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-slate-500 mb-6 max-w-3xl mx-auto leading-relaxed"
          >
            Eliminate the need for expensive DEXA scans. Our AI-powered platform 
            provides instant, accurate bone health screening using standard clinical imaging.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/signup" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 hover:-translate-y-1"
            >
              Start Screening Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-xl"
          >
            {[
              { label: 'Accuracy', val: '92%+' },
              { label: 'Processing', val: '< 2s' },
              { label: 'Cost Saved', val: '85%' },
              { label: 'Patients', val: '10k+' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-blue-600 mb-1">{s.val}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-10 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">Why Choose OsteoAI</h2>
            <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Revolutionizing Bone Health Diagnostics</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Clinical Precision', 
                desc: 'Trained on over 50,000 verified clinical X-ray samples for maximum reliability.',
                icon: ShieldCheck,
                color: 'bg-blue-50 text-blue-600'
              },
              { 
                title: 'Global Accessibility', 
                desc: 'Works with any standard JPG/PNG X-ray, making screening available anywhere.',
                icon: Globe,
                color: 'bg-indigo-50 text-indigo-600'
              },
              { 
                title: 'Patient-Centric', 
                desc: 'Empowering patients with clear reports and AI-driven health guidance.',
                icon: HeartPulse,
                color: 'bg-rose-50 text-rose-600'
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[2rem] p-6 md:p-10 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 relative z-10">
            Ready to transform your <br /> clinical workflow?
          </h2>
          <p className="text-blue-100 text-base mb-6 max-w-2xl mx-auto relative z-10">
            Join thousands of healthcare professionals using AI to provide better, 
            more affordable care.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link to="/signup" className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl">
              Create Free Account
            </Link>
            <div className="flex items-center text-white/80 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 mr-2 text-blue-300" />
              No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-blue-600 mr-3" />
            <span className="text-xl font-black text-slate-900">OsteoAI</span>
          </div>
          <div className="text-slate-400 text-sm font-medium">
            © 2026 OsteoAI Technologies. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-600">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">Terms of Service</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
