import { GoogleGenAI } from "@google/genai";

// Mock data storage for the session
const generateDoctors = () => {
  const regions = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Lucknow'];
  const specialties = ['Orthopedic Surgeon', 'Rheumatologist', 'Endocrinologist', 'Bone Health Specialist', 'Physical Therapist'];
  const firstNames = ['Rajesh', 'Anjali', 'Vikram', 'Priya', 'Amit', 'Meena', 'Arjun', 'Sunita', 'Rahul', 'Kavita', 'Sanjay', 'Meera', 'Suresh', 'Deepa', 'Vijay', 'Anita', 'Karan', 'Pooja', 'Rohan', 'Sneha'];
  const lastNames = ['Kumar', 'Sharma', 'Mehra', 'Iyer', 'Patel', 'Singh', 'Rao', 'Verma', 'Joshi', 'Gupta', 'Nair', 'Sethi', 'Reddy', 'Deshmukh', 'Chauhan', 'Pandey', 'Malhotra', 'Bose', 'Das', 'Mishra'];
  
  const docs = [];
  for (let i = 1; i <= 50; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const region = regions[i % regions.length];
    const specialty = specialties[i % specialties.length];
    const exp = (10 + (i % 15)) + '+ Years';
    const rating = parseFloat((4.5 + (Math.random() * 0.5)).toFixed(1));
    
    docs.push({
      id: `D${String(i).padStart(3, '0')}`,
      name: `Dr. ${firstName} ${lastName}`,
      specialty,
      region,
      experience: exp,
      rating,
      image: `https://picsum.photos/seed/doc${i}/400/400`,
      availability: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
    });
  }
  return docs;
};

const mockData = {
  patients: [
    { patientId: 'P001', name: 'Arjun Verma', age: 65, gender: 'Male', notes: 'Chronic back pain' },
    { patientId: 'P002', name: 'Sunita Devi', age: 72, gender: 'Female', notes: 'Previous hip fracture' },
    { patientId: 'P003', name: 'Rahul Sharma', age: 58, gender: 'Male', notes: 'Osteoporosis screening' },
    { patientId: 'P004', name: 'Priya Singh', age: 62, gender: 'Female', notes: 'Vitamin D deficiency' },
    { patientId: 'P005', name: 'Amit Patel', age: 70, gender: 'Male', notes: 'Low bone density' },
    { patientId: 'P006', name: 'Kavita Reddy', age: 68, gender: 'Female', notes: 'Menopausal bone health' },
    { patientId: 'P007', name: 'Sanjay Gupta', age: 75, gender: 'Male', notes: 'History of vertebral fracture' },
    { patientId: 'P008', name: 'Meera Iyer', age: 64, gender: 'Female', notes: 'Family history of osteoporosis' }
  ] as any[],
  predictions: [
    { patientId: 'P001', result: 'Osteopenia', probability: 0.82, timestamp: new Date(Date.now() - 86400000 * 30) },
    { patientId: 'P001', result: 'Normal', probability: 0.91, timestamp: new Date(Date.now() - 86400000 * 180) },
    { patientId: 'P002', result: 'Osteoporosis', probability: 0.94, timestamp: new Date(Date.now() - 86400000 * 10) },
    { patientId: 'P002', result: 'Osteopenia', probability: 0.88, timestamp: new Date(Date.now() - 86400000 * 365) },
    { patientId: 'P003', result: 'Normal', probability: 0.95, timestamp: new Date(Date.now() - 86400000 * 5) },
    { patientId: 'P004', result: 'Osteopenia', probability: 0.78, timestamp: new Date(Date.now() - 86400000 * 15) },
    { patientId: 'P005', result: 'Osteoporosis', probability: 0.92, timestamp: new Date(Date.now() - 86400000 * 20) },
    { patientId: 'P006', result: 'Normal', probability: 0.89, timestamp: new Date(Date.now() - 86400000 * 25) },
    { patientId: 'P007', result: 'Osteoporosis', probability: 0.96, timestamp: new Date(Date.now() - 86400000 * 2) },
    { patientId: 'P008', result: 'Osteopenia', probability: 0.84, timestamp: new Date(Date.now() - 86400000 * 8) }
  ] as any[],
  xrays: [
    { patientId: 'P001', imagePath: 'https://picsum.photos/seed/xray1/400/400', uploadDate: new Date(Date.now() - 86400000 * 30) },
    { patientId: 'P002', imagePath: 'https://picsum.photos/seed/xray2/400/400', uploadDate: new Date(Date.now() - 86400000 * 10) }
  ] as any[],
  stats: {
    totalPatients: 8,
    osteoporosisCases: 3,
    totalPredictions: 10,
    distribution: [
      { _id: 'Normal', count: 3 },
      { _id: 'Osteopenia', count: 4 },
      { _id: 'Osteoporosis', count: 3 }
    ]
  },
  doctors: generateDoctors(),
  appointments: [
    { id: 'A001', doctorId: 'D-ADMIN', patientId: 'P001', patientName: 'Arjun Verma', time: '09:00', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], type: 'Online' },
    { id: 'A002', doctorId: 'D-ADMIN', patientId: 'P002', patientName: 'Sunita Devi', time: '10:30', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], type: 'Offline' },
    { id: 'A003', doctorId: 'D-ADMIN', patientId: 'P003', patientName: 'Rahul Sharma', time: '11:00', date: new Date().toISOString().split('T')[0], type: 'Online' },
    { id: 'A004', doctorId: 'D-ADMIN', patientId: 'P004', patientName: 'Priya Singh', time: '14:30', date: new Date().toISOString().split('T')[0], type: 'Offline' },
    { id: 'A005', doctorId: 'D-ADMIN', patientId: 'P005', patientName: 'Amit Patel', time: '16:00', date: new Date().toISOString().split('T')[0], type: 'Online' },
    { id: 'A006', doctorId: 'D-ADMIN', patientId: 'P006', patientName: 'Kavita Reddy', time: '09:30', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], type: 'Online' },
    { id: 'A007', doctorId: 'D-ADMIN', patientId: 'P007', patientName: 'Sanjay Gupta', time: '11:30', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], type: 'Offline' },
  ] as any[]
};

const api = {
  post: async (url: string, data: any, config?: any) => {
    console.log(`[Mock API] POST ${url}`, data, config);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (url === '/auth/login' || url === '/auth/signup') {
      const role = data.role || (data.email.toLowerCase().includes('patient') ? 'patient' : 'doctor');
      const user = role === 'patient' 
        ? { id: 'P002', name: 'Sunita Devi', email: data.email }
        : { id: 'D-ADMIN', name: 'Dr. Rajesh Kumar', email: data.email };
      
      return { data: { 
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2), 
        role,
        user
      } };
    }

    if (url === '/appointments/book') {
      const { doctorId, time, date, patientId } = data;
      const alreadyBooked = mockData.appointments.find(a => a.doctorId === doctorId && a.time === time && a.date === date);
      if (alreadyBooked) throw { response: { data: { error: 'This slot is already booked' } } };
      
      const appointment = { id: 'APP-' + Math.random().toString(36).substr(2), ...data };
      mockData.appointments.push(appointment);
      return { data: appointment };
    }

    if (url === '/patients/add') {
      const index = mockData.patients.findIndex(p => p.patientId === data.patientId);
      if (index !== -1) {
        mockData.patients[index] = { ...mockData.patients[index], ...data };
      } else {
        mockData.patients.push(data);
        mockData.stats.totalPatients++;
      }
      return { data };
    }

    if (url === '/upload-xray') {
      // In frontend-only, we just store the object URLs
      const patientId = data.get('patientId');
      const files = data.getAll('xrays');
      const xrayDocs = files.map((file: File) => ({
        patientId,
        imagePath: URL.createObjectURL(file),
        uploadDate: new Date()
      }));
      mockData.xrays.push(...xrayDocs);
      return { data: { message: 'Files uploaded', files: xrayDocs } };
    }

    if (url === '/predict') {
      const { patientId } = data;
      const results = ['Normal', 'Osteopenia', 'Osteoporosis'];
      const result = results[Math.floor(Math.random() * results.length)];
      const probability = parseFloat((Math.random() * (0.99 - 0.7) + 0.7).toFixed(2));
      
      const prediction = { patientId, result, probability, timestamp: new Date() };
      mockData.predictions.push(prediction);
      mockData.stats.totalPredictions++;
      if (result === 'Osteoporosis') mockData.stats.osteoporosisCases++;
      
      const distItem = mockData.stats.distribution.find(d => d._id === result);
      if (distItem) distItem.count++;

      return { data: prediction };
    }

    return { data: {} };
  },

  get: async (url: string) => {
    console.log(`Mock GET ${url}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (url === '/stats') {
      return { data: mockData.stats };
    }

    if (url === '/doctors') {
      return { data: mockData.doctors };
    }

    if (url === '/patients') {
      return { data: mockData.patients };
    }

    if (url === '/appointments') {
      return { data: mockData.appointments };
    }

    if (url.startsWith('/appointments/doctor/')) {
      const doctorId = url.split('/').pop();
      const appointments = mockData.appointments.filter(a => a.doctorId === doctorId);
      return { data: appointments };
    }

    if (url.startsWith('/patients/')) {
      const id = url.split('/').pop();
      const patient = mockData.patients.find(p => p.patientId === id);
      if (!patient) throw { response: { data: { error: 'Patient not found' } } };
      return { data: patient };
    }

    if (url.startsWith('/history/')) {
      const id = url.split('/').pop();
      const xrays = mockData.xrays.filter(x => x.patientId === id);
      const predictions = mockData.predictions.filter(p => p.patientId === id);
      return { data: { xrays, predictions } };
    }

    return { data: {} };
  }
};

export default api;

// Direct Gemini helper for Chatbot
export const getGeminiResponse = async (patientId: string, message: string) => {
  const patient = mockData.patients.find(p => p.patientId === patientId);
  const lastPrediction = mockData.predictions.filter(p => p.patientId === patientId).pop();

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `You are a medical assistant specializing in bone health. 
  Context: Patient ID: ${patientId}, Name: ${patient?.name || 'Unknown'}, Age: ${patient?.age || 'N/A'}, Gender: ${patient?.gender || 'N/A'}.
  Latest Prediction: ${lastPrediction?.result || 'No prediction yet'} with confidence ${lastPrediction?.probability || 'N/A'}.
  Provide helpful, empathetic, and accurate bone-health guidance. Always advise consulting a human doctor for final medical decisions.`;

  const response = await ai.models.generateContent({
    model,
    contents: message,
    config: { systemInstruction }
  });

  return response.text || "I'm sorry, I couldn't process that.";
};
