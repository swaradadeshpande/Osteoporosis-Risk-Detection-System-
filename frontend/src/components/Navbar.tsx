import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Activity, Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, role, sidebarOpen, setSidebarOpen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 fixed left-0 right-0 top-0 z-50">
      <div className="flex flex-wrap justify-between items-center max-w-[1600px] mx-auto">
        <div className="flex justify-start items-center">
          {isAuthenticated && !isLandingPage && (
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 mr-4 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors md:hidden"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
          <Link to="/" className="flex items-center justify-between mr-4 group">
            <div className="bg-blue-600 p-1.5 rounded-xl mr-3 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="self-center text-2xl font-black tracking-tighter text-slate-900">OsteoAI</span>
          </Link>
        </div>
        <div className="flex items-center lg:order-2">
          {isAuthenticated && !isLandingPage ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logged in as</span>
                <span className="text-sm font-bold text-slate-900 capitalize">{role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:bg-slate-100 font-bold rounded-xl text-sm px-5 py-2.5 transition-all flex items-center border border-slate-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link to="/login" className="text-slate-600 hover:bg-slate-100 font-bold rounded-xl text-sm px-6 py-2.5 transition-all">Log in</Link>
              <Link to="/signup" className="text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 font-bold rounded-xl text-sm px-6 py-2.5 transition-all">Get started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
