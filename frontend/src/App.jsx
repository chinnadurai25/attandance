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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceSummary, setAttendanceSummary] = useState({});
  const [attendanceList, setAttendanceList] = useState([]);
  const [formData, setFormData] = useState({ name: '', dob: '', gender: '', studentClass: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');

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

  const fetchAttendanceSummary = async (month) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/attendance/summary?month=${month}`);
      setAttendanceSummary(res.data);
    } catch (err) {
      console.error('Error fetching attendance summary');
    }
  };

  const fetchAttendanceForDate = async (date, studentClass) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/attendance?date=${date}&studentClass=${studentClass}`);
      const records = res.data;

      // Merge with students list to ensure everyone is listed
      const classStudents = students.filter(s => s.class === studentClass);
      const list = classStudents.map(student => {
        const record = records.find(r => r.studentId === student._id);
        return {
          studentId: student._id,
          name: student.name,
          status: record ? record.status : 'Present' // Default to present if no record
        };
      });
      setAttendanceList(list);
    } catch (err) {
      console.error('Error fetching attendance for date');
    }
  };

  const saveAttendance = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/attendance', {
        date: selectedDate,
        studentClass: selectedClass,
        attendanceData: attendanceList
      });
      setMsg({ type: 'success', text: 'Attendance saved successfully!' });
      fetchAttendanceSummary(selectedDate.substring(0, 7));
      setTimeout(() => setView('attendance-calendar'), 1500);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save attendance.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'attendance-calendar') {
      fetchAttendanceSummary(selectedDate.substring(0, 7));
    }
    if (view === 'attendance-sheet') {
      fetchAttendanceForDate(selectedDate, selectedClass);
    }
  }, [view, selectedDate, selectedClass]);

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

  const getCalendarDays = () => {
    const [year, month] = selectedDate.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    // Previous month padding
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: null, date: null });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, date: dateStr, isSunday: new Date(year, month - 1, i).getDay() === 0 });
    }
    return days;
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
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm p-2">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tighter leading-none mb-1">Academy Console</h1>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active Admin: {user?.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {view === 'list' ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('attendance-calendar')}
                  className="flex items-center gap-2 px-6 py-3.5 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-all"
                  style={{ flex: 1 }}
                >
                  <Calendar size={18} />
                  <span>Mark Attendance</span>
                </motion.button>
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
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setView('list'); setMsg({ type: '', text: '' }); }}
                className="flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm"
                style={{ flex: 1 }}
              >
                <ArrowLeft size={18} />
                <span>Back to Roster</span>
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
              className="glass-card p-10 flex items-center gap-8 group hover:bg-amber-500 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-[20px] flex items-center justify-center text-amber-600 group-hover:bg-white group-hover:text-amber-600 transition-all">
                <Calendar size={32} />
              </div>
              <div>
                <span className="text-slate-400 group-hover:text-white/80 text-[10px] font-black uppercase tracking-[0.25em] mb-1 block">Session Days</span>
                <div className="text-5xl font-black text-slate-800 group-hover:text-white tracking-tighter leading-none transition-colors">184</div>
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
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-base font-black text-slate-800 tracking-tight">Student Roster</h2>
                  <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100">Academic Year 2024</span>
                </div>

                <div className="flex items-center gap-3 w-full md:w-96">
                  <div className="relative flex-1">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search students or classes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 pl-14 pr-5 py-3.5 rounded-2xl text-base font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <button className="p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-500 hover:bg-slate-100 hover:border-indigo-200 shadow-sm transition-all">
                    <Filter size={22} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.class.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                  <div className="col-span-full text-center py-32 bg-slate-50/30 rounded-[64px] border-3 border-dashed border-slate-200">
                    <Users className="text-slate-200 mx-auto mb-8" size={96} />
                    <div className="text-3xl font-black text-slate-400 uppercase tracking-tighter mb-4">No Records Discovered</div>
                    <button onClick={() => {setSearchTerm(''); setView('register');}} className="text-indigo-600 font-black hover:underline uppercase text-[11px] tracking-[0.2em]">Enroll New Student →</button>
                  </div>
                ) : (
                  students
                    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.class.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((student, idx) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white border-2 border-slate-50 p-6 rounded-3xl flex flex-col gap-5 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all cursor-default relative group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl border border-indigo-100 shadow-sm">
                          {student.name.charAt(0)}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50/50 px-3 py-1.5 rounded-xl border border-indigo-100/50">
                          {student.class}
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-slate-800 text-xl tracking-tight leading-tight mb-2">{student.name}</div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-bold">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><User size={13} className="text-indigo-400" /> {student.gender}</span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><Calendar size={13} className="text-indigo-400" /> {student.dob}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ) : view === 'register' ? (
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
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Student Registry</h2>
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
          ) : view === 'attendance-calendar' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="glass-card p-12"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Attendance Calendar</h2>
                  <p className="text-slate-500 font-bold">Select a class and date to manage student records</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <Calendar size={18} className="text-indigo-500" />
                    <input
                      type="month"
                      className="bg-transparent border-none font-black text-slate-700 focus:outline-none"
                      value={selectedDate.substring(0, 7)}
                      onChange={(e) => setSelectedDate(`${e.target.value}-01`)}
                    />
                  </div>
                  <select
                    className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl font-black text-slate-700 appearance-none min-w-[200px] shadow-sm"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {[...new Set(students.map(s => s.class))].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-6">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                  <div key={d} className="text-center text-[11px] font-black tracking-[0.2em] text-slate-400 mb-6">{d}</div>
                ))}
                {getCalendarDays().map((day, idx) => (
                  <div
                    key={idx}
                    className={`cal-day p-5 rounded-[32px] border-2 transition-all relative group ${
                      !day.day ? 'opacity-0 pointer-events-none' :
                      day.isSunday ? 'bg-rose-50/30 border-rose-100/50' :
                      'bg-white border-slate-100 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10'
                    }`}
                  >
                    {day.day && (
                      <>
                        <div className="flex justify-between items-center mb-3">
                          <span className={`text-2xl font-black ${day.isSunday ? 'text-rose-500' : 'text-slate-800'}`}>{day.day}</span>
                          {day.isSunday && (
                            <span className="holiday-badge">Holiday</span>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-end">
                          {attendanceSummary[day.date] ? (() => {
                            const data = attendanceSummary[day.date];
                            const present = data.present || data.Present || 0;
                            const absent = data.absent || data.Absent || 0;
                            const leave = data.leave || data.Leave || 0;
                            const hasData = present > 0 || absent > 0 || leave > 0;

                            return (
                              <div className="bg-white/90 p-1 rounded-xl border border-slate-100 shadow-sm space-y-0">
                                {present > 0 && (
                                  <div className="flex justify-between items-center px-1">
                                    <span className="text-[6.5px] font-black text-emerald-600 uppercase tracking-tighter">Present</span>
                                    <span className="text-[8px] font-black text-emerald-700">{present}</span>
                                  </div>
                                )}
                                {absent > 0 && (
                                  <div className="flex justify-between items-center px-1">
                                    <span className="text-[6.5px] font-black text-rose-600 uppercase tracking-tighter">Absent</span>
                                    <span className="text-[8px] font-black text-rose-700">{absent}</span>
                                  </div>
                                )}
                                {leave > 0 && (
                                  <div className="flex justify-between items-center px-1">
                                    <span className="text-[6.5px] font-black text-amber-600 uppercase tracking-tighter">Leave</span>
                                    <span className="text-[8px] font-black text-amber-700">{leave}</span>
                                  </div>
                                )}
                                {!hasData && (
                                  <div className="text-center py-0.5">
                                    <span className="text-[6.5px] font-black text-slate-400 uppercase tracking-tighter">Marked</span>
                                  </div>
                                )}
                              </div>
                            );
                          })() : !day.isSunday && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedDate(day.date);
                                setView('attendance-sheet');
                              }}
                              className="w-full py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              Mark Day
                            </motion.button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : view === 'attendance-sheet' ? (
            <motion.div
              key="sheet"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="glass-card p-12"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                    <Clock size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Mark Attendance</h2>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    className="bg-slate-50 border border-slate-100 px-6 py-3.5 rounded-2xl font-bold text-slate-600 appearance-none min-w-[200px]"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {[...new Set(students.map(s => s.class))].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!selectedClass ? (
                <div className="text-center py-32 bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-200">
                  <BookOpen className="text-slate-200 mx-auto mb-6" size={64} />
                  <p className="text-xl font-black text-slate-400 uppercase tracking-tighter">Please Select Academic Section</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar mb-10">
                  {attendanceList.map((record, idx) => (
                    <div key={record.studentId} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-200 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-indigo-600 border border-slate-100">{idx + 1}</div>
                        <span className="text-lg font-black text-slate-700">{record.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {['Present', 'Absent', 'Leave'].map(status => (
                          <button
                            key={status}
                            onClick={() => {
                              const newList = [...attendanceList];
                              newList[idx].status = status;
                              setAttendanceList(newList);
                            }}
                            className={`px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
                              record.status === status
                                ? status === 'Present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                : status === 'Absent' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedClass && (
                <div className="flex justify-end gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveAttendance}
                    disabled={loading}
                    className="btn-primary px-12 py-5 text-lg"
                  >
                    {loading ? 'Submitting Data...' : 'Finalize Attendance'}
                  </motion.button>
                </div>
              )}
            </motion.div>
          ) : null}
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
