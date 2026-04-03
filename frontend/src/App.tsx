import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Result from './pages/Result';
import History from './pages/History';
import Cost from './pages/Cost';
import SideEffects from './pages/SideEffects';
import Chatbot from './pages/Chatbot';
import Doctors from './pages/Doctors';
import Settings from './pages/Settings';

import PatientDashboard from './pages/PatientDashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, role, sidebarOpen } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      {isAuthenticated && !isLandingPage && <Sidebar />}
      <main className={`transition-all duration-300 min-h-screen pt-20 ${
        isAuthenticated && !isLandingPage ? 'md:pl-64' : ''
      }`}>
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {role === 'doctor' ? <Dashboard /> : <Navigate to="/patient-dashboard" />}
            </ProtectedRoute>
          } />
          <Route path="/patient-dashboard" element={
            <ProtectedRoute>
              {role === 'patient' ? <PatientDashboard /> : <Navigate to="/dashboard" />}
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          } />
          <Route path="/result/:patientId" element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          <Route path="/cost" element={
            <ProtectedRoute>
              <Cost />
            </ProtectedRoute>
          } />
          <Route path="/side-effects" element={
            <ProtectedRoute>
              <SideEffects />
            </ProtectedRoute>
          } />
          <Route path="/chatbot" element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
