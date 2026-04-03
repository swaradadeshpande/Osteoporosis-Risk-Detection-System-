import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  Utensils, 
  Dumbbell, 
  Heart, 
  ShieldAlert,
  Info,
  Loader2
} from 'lucide-react';
import api from '../lib/api';

const SideEffects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [risk, setRisk] = useState<string>('Normal');
  const patientId = 'P002'; // Mocked for demo

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/history/${patientId}`);
        if (response.data?.predictions?.length > 0) {
          setRisk(response.data.predictions[0].result);
        }
      } catch (error) {
        console.error('Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getAdvice = () => {
    const baseAdvice = [
      {
        title: 'Medication Side Effects',
        icon: ShieldAlert,
        color: 'text-red-600',
        bg: 'bg-red-50',
        items: [
          'Bisphosphonates may cause stomach upset or heartburn.',
          'Injectable medications might cause mild flu-like symptoms.',
          'Hormone-related therapy can increase risk of blood clots.',
          'Rarely, jaw bone issues (osteonecrosis) may occur with long-term use.'
        ]
      },
      {
        title: 'Dietary Recommendations',
        icon: Utensils,
        color: 'text-green-600',
        bg: 'bg-green-50',
        items: [
          'Increase Calcium intake (Dairy, leafy greens, fortified foods).',
          'Ensure adequate Vitamin D (Sunlight, fatty fish, supplements).',
          'Limit caffeine and alcohol consumption.',
          'Maintain a balanced protein intake for muscle support.'
        ]
      },
      {
        title: 'Exercise & Lifestyle',
        icon: Dumbbell,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        items: [
          'Weight-bearing exercises (Walking, jogging, dancing).',
          'Resistance training to strengthen muscles and bones.',
          'Balance exercises (Tai Chi, Yoga) to prevent falls.',
          'Stop smoking as it accelerates bone loss.'
        ]
      },
      {
        title: 'Safety Precautions',
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        items: [
          'Remove tripping hazards at home (rugs, clutter).',
          'Ensure adequate lighting in all rooms.',
          'Use assistive devices if balance is impaired.',
          'Regular vision checkups to avoid falls.'
        ]
      }
    ];

    if (risk === 'Osteoporosis') {
      baseAdvice[1].items.push('Strict adherence to Calcium (1200mg+) and Vit D (800IU+) daily.');
      baseAdvice[2].items = [
        'Focus on low-impact weight-bearing exercises to avoid fractures.',
        'Avoid heavy lifting or sudden twisting of the spine.',
        'Daily balance training is CRITICAL to prevent falls.',
        'Consult a physical therapist for a safe exercise plan.'
      ];
      baseAdvice[3].items.unshift('Install grab bars in bathrooms and near stairs immediately.');
    } else if (risk === 'Osteopenia') {
      baseAdvice[1].items.push('Consider calcium supplements if dietary intake is low.');
      baseAdvice[2].items.push('Increase intensity of weight-bearing exercises to build bone mass.');
    }

    return baseAdvice;
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;

  const sections = getAdvice();

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Personalized Health Advice</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Current Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
              risk === 'Normal' ? 'bg-emerald-100 text-emerald-600' : 
              risk === 'Osteopenia' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
            }`}>
              {risk}
            </span>
          </div>
          <p className="text-gray-600">Tailored recommendations based on your latest bone density analysis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`p-6 ${section.bg} flex items-center border-b border-gray-100`}>
                <section.icon className={`w-8 h-8 ${section.color} mr-4`} />
                <h3 className={`text-xl font-bold ${section.color}`}>{section.title}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className={`w-2 h-2 rounded-full ${section.color} mt-2 mr-3 flex-shrink-0`}></div>
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-900 text-white p-8 rounded-2xl flex items-center">
          <Info className="w-12 h-12 mr-6 text-blue-300" />
          <div>
            <h4 className="text-xl font-bold mb-2">Important Medical Disclaimer</h4>
            <p className="text-blue-100 italic">
              The information provided here is for educational purposes only. Always consult with your 
              healthcare provider before starting any new medication, supplement, or exercise regimen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideEffects;
