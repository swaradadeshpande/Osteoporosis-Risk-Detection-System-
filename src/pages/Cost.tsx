import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  DollarSign, 
  CreditCard, 
  Stethoscope, 
  Pill, 
  Activity, 
  Calendar,
  AlertCircle
} from 'lucide-react';

const Cost: React.FC = () => {
  const location = useLocation();
  const [risk, setRisk] = useState<string>(location.state?.risk || 'Normal');

  const costData: any = {
    Normal: {
      consultation: 50,
      medication: 0,
      therapy: 0,
      monitoring: 20,
      total: 70,
      notes: 'Routine checkup and preventive advice.'
    },
    Osteopenia: {
      consultation: 100,
      medication: 150,
      therapy: 200,
      monitoring: 50,
      total: 500,
      notes: 'Focus on lifestyle changes and calcium supplements.'
    },
    Osteoporosis: {
      consultation: 150,
      medication: 400,
      therapy: 600,
      monitoring: 100,
      total: 1250,
      notes: 'Intensive treatment including bisphosphonates and physical therapy.'
    }
  };

  const currentCost = costData[risk];

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-blue-900">Treatment Cost Estimation</h2>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Disease Type:</label>
              <select 
                className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
              >
                <option>Normal</option>
                <option>Osteopenia</option>
                <option>Osteoporosis</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <Stethoscope className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium">Consultation</span>
                </div>
                <span className="font-bold">${currentCost.consultation}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <Pill className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium">Medication</span>
                </div>
                <span className="font-bold">${currentCost.medication}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium">Therapy</span>
                </div>
                <span className="font-bold">${currentCost.therapy}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium">Monitoring</span>
                </div>
                <span className="font-bold">${currentCost.monitoring}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">Total Estimated Cost</span>
                <span className="text-3xl font-extrabold text-blue-600">${currentCost.total}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-2xl flex flex-col justify-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-sm">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Cost Breakdown Info</h3>
              <p className="text-blue-800 leading-relaxed mb-6">
                {currentCost.notes}
              </p>
              <div className="bg-blue-100 p-4 rounded-xl flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <p className="text-xs text-blue-700 italic">
                  *This is an estimation based on standard healthcare rates. Actual costs may vary by region and provider.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => window.print()}
            className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center"
          >
            Print Estimate
          </button>
          <Link 
            to="/chatbot" 
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-100"
          >
            Discuss with AI
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cost;
