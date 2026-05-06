import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Users, Calendar, User, BookOpen, LogOut, 
  CheckCircle, AlertCircle, ArrowLeft, LayoutDashboard,
  GraduationCap, TrendingUp, Clock, Search, Filter
} from 'lucide-react';
import axios from 'axios';
import Login from './pages/Login';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [students, setStudents] = useState([]);
  const [view, setView] = useState('list');
  const [formData, setFormData] = useState({ name: '', dob: '', gender: '', studentClass: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      await axios.post('http://localhost:5000/api/students', formData);
      setMsg({ type: 'success', text: 'Student successfully enrolled!' });
      setFormData({ name: '', dob: '', gender: '', studentClass: '' });
      fetchStudents();
      setTimeout(() => setView('list'), 1500);
    } catch (err) {
      setMsg({ type: 'error', text: 'Enrollment failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--bg-main)', position: 'relative' }}>
      <div className="bg-pattern" />
      
      <div className="max-w-6xl mx-auto">
        {/* Top Navbar */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-[24px] border border-[#e2e8f0] shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Attendance Pro</h1>
              <p className="text-gray-500 text-sm font-medium">Administrator: {user?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {view === 'list' ? (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('register')}
                className="btn-primary" 
                style={{ borderRadius: '16px', flex: 1 }}
              >
                <UserPlus size={18} />
                <span>New Enrollment</span>
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setView('list'); setMsg({type:'', text:''}); }}
                className="flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm"
                style={{ flex: 1 }}
              >
                <ArrowLeft size={18} />
                <span>Back to Roster</span>
              </motion.button>
            )}
            
            <button 
              onClick={handleLogout} 
              className="p-3.5 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100 transition-all"
            >
              <LogOut size={22} />
            </button>
          </div>
        </motion.header>

        {/* Stats Section */}
        {view === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card shadow-sm border-l-4 border-l-indigo-500">
              <div className="flex justify-between items-start">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Students</span>
                <Users className="text-indigo-500 opacity-20" size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-800">{students.length}</div>
              <div className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full inline-block self-start">Active Roster</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card shadow-sm border-l-4 border-l-emerald-500">
              <div className="flex justify-between items-start">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Attendance Avg</span>
                <TrendingUp className="text-emerald-500 opacity-20" size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-800">94.2%</div>
              <div className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block self-start">+2.4% from last week</div>
            </motion.div>


          </div>
        )}

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-card p-8"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-800">Student Roster</h2>
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[11px] font-bold rounded-full">Academic Year 2024</span>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search students..." 
                      className="w-full bg-gray-50 border border-gray-100 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-300"
                    />
                  </div>
                  <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-100">
                    <Filter size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                {students.length === 0 ? (
                  <div className="col-span-full text-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                    <Users className="mx-auto text-gray-300 mb-4" size={48} />
                    <div className="text-gray-400 font-medium">No student records found in this roster.</div>
                    <button onClick={() => setView('register')} className="mt-4 text-indigo-600 font-bold hover:underline">Enroll your first student</button>
                  </div>
                ) : (
                  students.map((student, idx) => (
                    <motion.div 
                      key={student._id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col gap-4 hover:border-indigo-200 hover:shadow-md transition-all cursor-default relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                      
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                          {student.name.charAt(0)}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-tighter text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                          {student.class}
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-gray-800 text-lg leading-tight">{student.name}</div>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5"><User size={12} className="text-gray-400" /> {student.gender}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-gray-400" /> {student.dob}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex justify-center"
            >
              <div className="glass-card p-8 md:p-10 w-full max-w-2xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Student Enrollment</h2>
                    <p className="text-gray-500 text-sm">Add a new student to the academic roster</p>
                  </div>
                </div>

                {msg.text && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center gap-3 p-4 rounded-2xl mb-8 text-sm font-semibold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}
                  >
                    {msg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{msg.text}</span>
                  </motion.div>
                )}

                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Student Name</label>
                    <div className="input-container">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        className="input-field"
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Michael Chen" required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Date of Birth</label>
                    <div className="input-container">
                      <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="date" className="input-field"
                        value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Gender Identification</label>
                    <div className="input-container">
                      <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select 
                        className="input-field" style={{ appearance: 'none' }}
                        value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                        required
                      >
                        <option value="" disabled>Select Option</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Class / Section</label>
                    <div className="input-container">
                      <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        className="input-field"
                        value={formData.studentClass} onChange={e => setFormData({...formData, studentClass: e.target.value})}
                        placeholder="e.g. Class 10-A" required 
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-6">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      disabled={loading} 
                      className="btn-primary w-full py-5 text-lg"
                    >
                      {loading ? 'Processing Enrollment...' : 'Register to School Roster'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={localStorage.getItem('token') ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
