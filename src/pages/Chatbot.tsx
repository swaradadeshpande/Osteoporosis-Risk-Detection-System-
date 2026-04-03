import React, { useState, useEffect, useRef } from 'react';
import api, { getGeminiResponse } from '../lib/api';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageSquare,
  Search,
  AlertCircle
} from 'lucide-react';

const Chatbot: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isContextSet, setIsContextSet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const setContext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;
    setLoading(true);
    try {
      // Just verify patient exists
      await api.get(`/patients/${patientId}`);
      setIsContextSet(true);
      setMessages([{ role: 'assistant', content: `Hello! I have loaded the context for Patient ID: ${patientId}. How can I assist you with their bone health today?` }]);
    } catch (error) {
      alert('Patient not found. Please check the ID.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await getGeminiResponse(patientId, input);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="w-8 h-8 mr-3" />
            <div>
              <h2 className="font-bold">OsteoAI Assistant</h2>
              <p className="text-xs text-blue-100">Context-Aware Bone Health Support</p>
            </div>
          </div>
          {isContextSet && (
            <div className="bg-blue-500 px-3 py-1 rounded-full text-xs font-medium">
              Patient: {patientId}
            </div>
          )}
        </div>

        {!isContextSet ? (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="max-w-sm">
              <MessageSquare className="w-16 h-16 text-blue-100 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Set Patient Context</h3>
              <p className="text-gray-500 mb-8">Please enter a Patient ID to start a context-aware consultation session.</p>
              <form onSubmit={setContext} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Patient ID"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Start Session'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    <div className="flex items-center mb-1">
                      {msg.role === 'user' ? <User className="w-3 h-3 mr-1" /> : <Bot className="w-3 h-3 mr-1" />}
                      <span className="text-[10px] uppercase font-bold opacity-70">
                        {msg.role === 'user' ? 'Doctor' : 'AI Assistant'}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                    <Loader2 className="animate-spin w-5 h-5 text-blue-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Ask about precautions, diet, or treatment..."
                className="flex-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </>
        )}
      </div>
      <div className="max-w-4xl mx-auto w-full mt-4 flex items-center text-gray-400 text-xs px-4">
        <AlertCircle className="w-3 h-3 mr-1" />
        AI-generated content should be verified by a medical professional.
      </div>
    </div>
  );
};

export default Chatbot;
