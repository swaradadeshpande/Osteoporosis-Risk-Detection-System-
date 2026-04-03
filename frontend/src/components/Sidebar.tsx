import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Upload, 
  History, 
  DollarSign, 
  AlertCircle, 
  MessageSquare,
  Users,
  Settings
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { role, sidebarOpen, setSidebarOpen } = useAuth();
  
  const doctorItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Upload X-ray', icon: Upload, path: '/upload' },
    { name: 'Patient History', icon: History, path: '/history' },
    { name: 'AI Chatbot', icon: MessageSquare, path: '/chatbot' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const patientItems = [
    { name: 'My Dashboard', icon: LayoutDashboard, path: '/patient-dashboard' },
    { name: 'Upload X-ray', icon: Upload, path: '/upload' },
    { name: 'Consultancy', icon: Users, path: '/doctors' },
    { name: 'My Reports', icon: History, path: '/history' },
    { name: 'Treatment Cost', icon: DollarSign, path: '/cost' },
    { name: 'Health Advice', icon: AlertCircle, path: '/side-effects' },
    { name: 'AI Assistant', icon: MessageSquare, path: '/chatbot' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const menuItems = role === 'doctor' ? doctorItems : patientItems;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-300 bg-white border-r border-slate-200 shadow-sm ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`} aria-label="Sidenav">
        <div className="overflow-y-auto py-5 px-4 h-full bg-white">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center p-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                      isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 transition duration-75" />
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
