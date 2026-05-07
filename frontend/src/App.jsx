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
    <div className="min-h-screen bg-[#fcfdfe] relative overflow-hidden font-sans">
      <div className="bg-pattern" />

      {/* Dynamic Aura System - Replaces Static Imagery with Movement */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="bg-aura"
        style={{ top: '5%', right: '15%', background: 'var(--primary)' }}
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="bg-aura"
        style={{ bottom: '5%', left: '15%', background: 'var(--secondary)' }}
      />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Elite Master Console */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 glass-card p-10 shadow-2xl shadow-indigo-900/5"
        >
          <div className="flex items-center gap-8">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-sky-500 rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20"
            >
              <GraduationCap size={44} />
            </motion.div>
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none mb-2">Academy Console</h1>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active Admin: {user?.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {view === 'list' ? (
              <motion.button
                whileHover={{ y: -4, boxShadow: '0 15px 30px -10px rgba(79, 70, 229, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('register')}
                className="btn-primary px-10 py-4"
              >
                <UserPlus size={22} />
                <span>New Enrollment</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ y: -4, backgroundColor: 'white' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setView('list'); setMsg({ type: '', text: '' }); }}
                className="flex items-center gap-3 px-10 py-4 bg-white/60 backdrop-blur-md border border-white rounded-2xl text-slate-600 font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/5 flex-1 md:flex-none"
              >
                <ArrowLeft size={20} />
                <span>Return to Console</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#fee2e2' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-5 rounded-2xl bg-rose-50/50 text-rose-500 border border-rose-100 transition-all shadow-lg shadow-rose-100"
            >
              <LogOut size={26} />
            </motion.button>
          </div>
        </motion.header>

        {/* Dynamic Insights Grid */}
        {view === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card p-10 flex items-center gap-8 group hover:bg-indigo-600 transition-colors duration-500"
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-[20px] flex items-center justify-center text-indigo-600 group-hover:bg-white/20 group-hover:text-white transition-all">
                <Users size={32} />
              </div>
              <div>
                <span className="text-slate-400 group-hover:text-indigo-100 text-[10px] font-black uppercase tracking-[0.25em] mb-1 block">Population</span>
                <div className="text-5xl font-black text-slate-800 group-hover:text-white tracking-tighter leading-none">{students.length}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-card p-10 flex items-center gap-8 group hover:bg-emerald-600 transition-colors duration-500"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-[20px] flex items-center justify-center text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-all">
                <TrendingUp size={32} />
              </div>
              <div>
                <span className="text-slate-400 group-hover:text-emerald-100 text-[10px] font-black uppercase tracking-[0.25em] mb-1 block">Avg Rate</span>
                <div className="text-5xl font-black text-slate-800 group-hover:text-white tracking-tighter leading-none">94.2%</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass-card p-10 flex items-center gap-8 group hover:bg-amber-600 transition-colors duration-500"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-[20px] flex items-center justify-center text-amber-600 group-hover:bg-white/20 group-hover:text-white transition-all">
                <Calendar size={32} />
              </div>
              <div>
                <span className="text-slate-400 group-hover:text-amber-100 text-[10px] font-black uppercase tracking-[0.25em] mb-1 block">Session Days</span>
                <div className="text-5xl font-black text-slate-800 group-hover:text-white tracking-tighter leading-none">184</div>
              </div>
            </motion.div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-12"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-16 gap-10">
                <div className="flex items-center gap-6">
                  <div className="w-1.5 h-14 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/40" />
                  <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">Academic Registry</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Comprehensive Directory 2024</p>
                  </div>
                </div>

                <div className="relative w-full lg:w-[450px]">
                  <Search size={22} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    placeholder="Search academy records..."
                    className="w-full bg-slate-50/50 border-2 border-slate-100 pl-16 pr-8 py-5 rounded-[24px] text-sm font-bold focus:outline-none focus:border-indigo-200 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {students.length === 0 ? (
                  <div className="col-span-full text-center py-32 bg-slate-50/30 rounded-[64px] border-3 border-dashed border-slate-200">
                    <Users className="text-slate-200 mx-auto mb-8" size={96} />
                    <div className="text-3xl font-black text-slate-400 uppercase tracking-tighter mb-4">No Records Discovered</div>
                    <button onClick={() => setView('register')} className="text-indigo-600 font-black hover:underline uppercase text-[11px] tracking-[0.2em]">Enroll New Student →</button>
                  </div>
                ) : (
                  students.map((student, idx) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -12, scale: 1.02 }}
                      className="bg-white/40 backdrop-blur-xl border border-white p-10 rounded-[48px] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-default group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-indigo-50 to-indigo-100/50 flex items-center justify-center text-indigo-600 font-black text-2xl border-2 border-white shadow-xl shadow-indigo-500/5">
                          {student.name.charAt(0)}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500 bg-indigo-50/50 px-5 py-2.5 rounded-full border border-indigo-100">
                          {student.class}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-5 group-hover:text-indigo-600 transition-colors">{student.name}</h3>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="flex items-center gap-2.5 text-[11px] text-slate-500 font-black bg-slate-100/50 px-4 py-2.5 rounded-2xl border border-slate-200/50 shadow-sm">
                            <User size={16} className="text-indigo-300" /> {student.gender}
                          </span>
                          <span className="flex items-center gap-2.5 text-[11px] text-slate-500 font-black bg-slate-100/50 px-4 py-2.5 rounded-2xl border border-slate-200/50 shadow-sm">
                            <Calendar size={16} className="text-indigo-300" /> {student.dob}
                          </span>
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
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center"
            >
              <div className="glass-card p-12 md:p-16 w-full max-w-4xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-[100px] -mr-40 -mt-40" />

                <div className="flex items-center gap-10 mb-16 relative z-10">
                  <div className="p-7 bg-indigo-600 rounded-[32px] text-white shadow-2xl shadow-indigo-500/20">
                    <UserPlus size={44} />
                  </div>
                  <div>
                    <h2 className="text-5xl font-black text-slate-800 tracking-tight leading-none mb-2">Student Registry</h2>
                    <p className="text-slate-400 font-bold text-lg">Entry Terminal Academic Session 24/25</p>
                  </div>
                </div>

                {msg.text && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center gap-5 p-7 rounded-[32px] mb-14 text-sm font-black relative z-10 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xl shadow-emerald-500/5' : 'bg-rose-50 text-rose-600 border border-rose-100 shadow-xl shadow-rose-500/5'}`}
                  >
                    {msg.type === 'success' ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
                    <span>{msg.text}</span>
                  </motion.div>
                )}

                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Official Full Name</label>
                    <div className="input-container">
                      <User size={24} className="absolute left-7 top-1/2 -translate-y-1/2 text-indigo-200" />
                      <input className="input-field py-6 pl-16 pr-8 text-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Jonathan Henderson" required />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Date of Birth</label>
                    <div className="input-container">
                      <Calendar size={24} className="absolute left-7 top-1/2 -translate-y-1/2 text-indigo-300" />
                      <input type="date" className="input-field py-6 pl-16 pr-8 text-lg" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} required />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Gender Category</label>
                    <div className="input-container">
                      <Users size={24} className="absolute left-7 top-1/2 -translate-y-1/2 text-indigo-200" />
                      <select className="input-field py-6 pl-16 pr-8 text-lg appearance-none" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} required>
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male Scholar</option>
                        <option value="Female">Female Scholar</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Academic Section</label>
                    <div className="input-container">
                      <BookOpen size={24} className="absolute left-7 top-1/2 -translate-y-1/2 text-indigo-200" />
                      <input className="input-field py-6 pl-16 pr-8 text-lg" value={formData.studentClass} onChange={e => setFormData({ ...formData, studentClass: e.target.value })} placeholder="e.g. Class 12-B" required />
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-12">
                    <motion.button whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn-primary w-full py-8 text-2xl tracking-tight shadow-indigo-500/30">
                      {loading ? 'Processing Registry...' : 'Enroll into Academy Roster'}
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
