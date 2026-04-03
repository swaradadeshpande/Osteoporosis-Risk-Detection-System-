import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { 
  User, 
  MapPin, 
  Star, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Search, 
  Filter,
  Video,
  Users,
  X,
  CheckCircle,
  Loader2,
  ArrowRight,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Maximize2,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  region: string;
  experience: string;
  rating: number;
  image: string;
  availability: string[];
}

interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor';
  text: string;
  timestamp: Date;
}

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingType, setBookingType] = useState<'Online' | 'Offline'>('Online');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    let timer: any;
    if (showCall && !isConnecting) {
      timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [showCall, isConnecting]);

  const handleStartCall = () => {
    setShowCall(true);
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get('/doctors');
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    let result = doctors;
    if (search) {
      result = result.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase()) || 
        d.specialty.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (regionFilter !== 'All') {
      result = result.filter(d => d.region === regionFilter);
    }
    setFilteredDoctors(result);
  }, [search, regionFilter, doctors]);

  const regions = ['All', ...new Set(doctors.map(d => d.region))];

  const handleBook = async () => {
    if (!bookingDate || !bookingTime) {
      alert('Please select date and time');
      return;
    }
    setBookingStatus('loading');
    try {
      await api.post('/appointments/book', {
        doctorId: selectedDoc?.id,
        date: bookingDate,
        time: bookingTime,
        type: bookingType,
        patientId: 'P002'
      });
      setBookingStatus('success');
      setTimeout(() => {
        setShowBooking(false);
        setBookingStatus('idle');
        setBookingDate('');
        setBookingTime('');
      }, 2000);
    } catch (err: any) {
      setBookingStatus('error');
      setErrorMessage(err.response?.data?.error || 'Booking failed');
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedDoc) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'patient',
      text: messageText,
      timestamp: new Date()
    };

    setChatHistory(prev => ({
      ...prev,
      [selectedDoc.id]: [...(prev[selectedDoc.id] || []), newMessage]
    }));
    
    setMessageText('');

    // Simulate doctor reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'doctor',
        text: "Thank you for your message. I'll review your report and get back to you shortly.",
        timestamp: new Date()
      };
      setChatHistory(prev => ({
        ...prev,
        [selectedDoc.id]: [...(prev[selectedDoc.id] || []), reply]
      }));
    }, 1500);
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Expert Consultancy</h2>
            <p className="text-slate-500 font-medium mt-1">Connect with India's top bone health specialists</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search doctors or specialty..." 
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 shadow-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select 
                className="pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm appearance-none cursor-pointer font-bold text-slate-700"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <motion.div 
                key={doc.id}
                layoutId={doc.id}
                className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative">
                      <img src={doc.image} alt={doc.name} className="w-20 h-20 rounded-3xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-xl">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1.5" />
                      <span className="text-sm font-black text-amber-700">{doc.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-1">{doc.name}</h3>
                  <p className="text-blue-600 font-bold text-sm mb-4">{doc.specialty}</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-slate-500 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {doc.region}, India
                    </div>
                    <div className="flex items-center text-slate-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      {doc.experience} Experience
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => { setSelectedDoc(doc); setShowBooking(true); }}
                      className="col-span-2 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center"
                    >
                      Book Appointment
                    </button>
                    <button 
                      onClick={() => { setSelectedDoc(doc); handleStartCall(); }}
                      className="py-3 bg-slate-50 text-slate-700 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center border border-slate-100"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </button>
                    <button 
                      onClick={() => { setSelectedDoc(doc); setShowMessage(true); }}
                      className="py-3 bg-slate-50 text-slate-700 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center border border-slate-100"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        <AnimatePresence>
          {showBooking && selectedDoc && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowBooking(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden"
              >
                <div className="p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Book Appointment</h3>
                      <p className="text-slate-500 font-medium">with {selectedDoc.name}</p>
                    </div>
                    <button onClick={() => setShowBooking(false)} className="p-2 hover:bg-slate-100 rounded-2xl transition-all">
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                  </div>

                  {bookingStatus === 'success' ? (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h4>
                      <p className="text-slate-500">Your appointment has been scheduled successfully.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setBookingType('Online')}
                          className={`py-4 rounded-2xl font-bold flex items-center justify-center border-2 transition-all ${
                            bookingType === 'Online' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500'
                          }`}
                        >
                          <Video className="w-5 h-5 mr-2" />
                          Online
                        </button>
                        <button 
                          onClick={() => setBookingType('Offline')}
                          className={`py-4 rounded-2xl font-bold flex items-center justify-center border-2 transition-all ${
                            bookingType === 'Offline' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500'
                          }`}
                        >
                          <Users className="w-5 h-5 mr-2" />
                          In-Person
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Date</label>
                        <input 
                          type="date" 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Time Slot</label>
                        <div className="grid grid-cols-4 gap-2">
                          {selectedDoc.availability.map(time => (
                            <button 
                              key={time}
                              onClick={() => setBookingTime(time)}
                              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                                bookingTime === time ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {bookingStatus === 'error' && (
                        <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold flex items-center">
                          <X className="w-4 h-4 mr-2" />
                          {errorMessage}
                        </div>
                      )}

                      <button 
                        onClick={handleBook}
                        disabled={bookingStatus === 'loading'}
                        className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-50"
                      >
                        {bookingStatus === 'loading' ? <Loader2 className="animate-spin w-6 h-6" /> : 'Confirm Booking'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dummy Call Modal - Phone UI */}
        <AnimatePresence>
          {showCall && selectedDoc && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className="relative w-[320px] h-[580px] bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-8 border-4 border-blue-500/30 p-1 relative">
                    <img src={selectedDoc.image} alt={selectedDoc.name} className="w-full h-full object-cover rounded-full" />
                    {isConnecting && <div className="absolute inset-0 bg-blue-500/20 animate-pulse rounded-full"></div>}
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-2">{selectedDoc.name}</h3>
                  <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-4">
                    {isConnecting ? 'Connecting...' : 'Secure Audio Call'}
                  </p>
                  {!isConnecting && <p className="text-white/60 font-mono text-xl">{formatTime(callDuration)}</p>}
                </div>

                {!isConnecting && (
                  <div className="p-10 bg-white/5 backdrop-blur-xl rounded-t-[3rem] grid grid-cols-3 gap-6">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>
                    <button 
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                    </button>
                    <button className="w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                      <Maximize2 className="w-6 h-6" />
                    </button>
                    
                    <div className="col-span-3 flex justify-center pt-4">
                      <button 
                        onClick={() => setShowCall(false)} 
                        className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/40 hover:bg-rose-600 transition-all group"
                      >
                        <PhoneOff className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}

                {isConnecting && (
                  <div className="p-10 flex justify-center">
                    <button 
                      onClick={() => setShowCall(false)} 
                      className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/40 hover:bg-rose-600 transition-all"
                    >
                      <PhoneOff className="w-8 h-8 text-white" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Message Modal - Chat UI */}
        <AnimatePresence>
          {showMessage && selectedDoc && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMessage(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-lg h-[650px] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Chat Header */}
                <div className="p-8 bg-white border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="relative">
                      <img src={selectedDoc.image} alt={selectedDoc.name} className="w-12 h-12 rounded-2xl object-cover mr-4" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{selectedDoc.name}</h3>
                      <p className="text-emerald-500 text-xs font-bold">Online</p>
                    </div>
                  </div>
                  <button onClick={() => setShowMessage(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-50/50">
                  <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm max-w-[80%] self-start text-sm text-slate-600 border border-slate-100">
                    Hello! I've received your screening report. How can I help you today?
                  </div>
                  
                  {chatHistory[selectedDoc.id]?.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm ${
                        msg.sender === 'patient' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-slate-600 rounded-bl-none border border-slate-100'
                      }`}>
                        {msg.text}
                        <p className={`text-[10px] mt-1 opacity-60 ${msg.sender === 'patient' ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-8 bg-white border-t border-slate-100">
                  <div className="relative flex items-center gap-3">
                    <input 
                      type="text"
                      placeholder="Type your message..." 
                      className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:shadow-none"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Doctors;
