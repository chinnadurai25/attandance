import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, Users, Calendar, User, BookOpen, LogOut,
  CheckCircle, AlertCircle, ArrowLeft, LayoutDashboard,
  GraduationCap, TrendingUp, Clock, Search, Filter,
  Edit2, Trash2, Mail
} from 'lucide-react';
import axios from 'axios';
import Login from './pages/Login';

const API_URL = `http://${window.location.hostname}:5004`;

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [view, setView] = useState('list');
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'staff'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceSummary, setAttendanceSummary] = useState({});
  const [attendanceList, setAttendanceList] = useState([]);
  const [formData, setFormData] = useState({
    name: '', dob: '', gender: '', studentClass: '',
    fatherName: '', motherName: '', fatherOccupation: '', motherOccupation: '',
    address: '', phoneNumber: '', age: ''
  });
  const [staffFormData, setStaffFormData] = useState({
    name: '', age: '', phoneNumber: '', address: '', qualification: '', experience: '', mailId: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/staff`);
      setStaff(res.data);
    } catch (err) {
      console.error('Error fetching staff');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/students`);
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students');
    }
  };

  const fetchAttendanceSummary = async (month, studentClass) => {
    try {
      let url = activeTab === 'students'
        ? `${API_URL}/api/attendance/summary?month=${month}`
        : `${API_URL}/api/staff-attendance/summary?month=${month}`;

      if (activeTab === 'students' && studentClass) url += `&studentClass=${studentClass}`;
      const res = await axios.get(url);
      setAttendanceSummary(res.data);
    } catch (err) {
      console.error('Error fetching attendance summary');
    }
  };

  const fetchAttendanceForDate = async (date, studentClass) => {
    try {
      if (activeTab === 'students') {
        const res = await axios.get(`${API_URL}/api/attendance?date=${date}&studentClass=${studentClass}`);
        const records = res.data;
        const classStudents = students.filter(s => s.class === studentClass);
        const list = classStudents.map(student => {
          const record = records.find(r => r.studentId === student._id);
          return {
            studentId: student._id,
            name: student.name,
            status: record ? record.status : 'Present'
          };
        });
        setAttendanceList(list);
      } else {
        const res = await axios.get(`${API_URL}/api/staff-attendance?date=${date}`);
        const records = res.data;
        const list = staff.map(s => {
          const record = records.find(r => r.staffId === s._id);
          return {
            staffId: s._id,
            name: s.name,
            status: record ? record.status : 'Present'
          };
        });
        setAttendanceList(list);
      }
    } catch (err) {
      console.error('Error fetching attendance for date');
    }
  };

  const saveAttendance = async () => {
    const now = new Date();
    if (activeTab === 'staff') {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      if ((currentHour > 9) || (currentHour === 9 && currentMinute > 30)) {
        setMsg({ type: 'error', text: 'Staff attendance can only be marked before 9:30 AM!' });
        return;
      }
    }

    setLoading(true);
    try {
      if (activeTab === 'students') {
        await axios.post(`${API_URL}/api/attendance`, {
          date: selectedDate,
          studentClass: selectedClass,
          attendanceData: attendanceList
        });
      } else {
        await axios.post(`${API_URL}/api/staff-attendance`, {
          date: selectedDate,
          attendanceData: attendanceList
        });
      }
      setMsg({ type: 'success', text: 'Attendance saved successfully!' });
      fetchAttendanceSummary(selectedDate.substring(0, 7), selectedClass);
      setTimeout(() => setView('attendance-calendar'), 1500);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save attendance.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'attendance-calendar') {
      fetchAttendanceSummary(selectedDate.substring(0, 7), selectedClass);
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
      if (activeTab === 'students') {
        if (editingStudent) {
          await axios.put(`${API_URL}/api/students/${editingStudent._id}`, formData);
          setMsg({ type: 'success', text: 'Student details updated successfully!' });
        } else {
          await axios.post(`${API_URL}/api/students`, formData);
          setMsg({ type: 'success', text: 'Student successfully enrolled!' });
        }
        setFormData({
          name: '', dob: '', gender: '', studentClass: '',
          fatherName: '', motherName: '', fatherOccupation: '', motherOccupation: '',
          address: '', phoneNumber: '', age: ''
        });
        setEditingStudent(null);
        fetchStudents();
      } else {
        if (editingStaff) {
          await axios.put(`${API_URL}/api/staff/${editingStaff._id}`, staffFormData);
          setMsg({ type: 'success', text: 'Staff details updated successfully!' });
        } else {
          await axios.post(`${API_URL}/api/staff`, staffFormData);
          setMsg({ type: 'success', text: 'Staff successfully enrolled!' });
        }
        setStaffFormData({ name: '', age: '', phoneNumber: '', address: '', qualification: '', experience: '', mailId: '' });
        setEditingStaff(null);
        fetchStaff();
      }
      setTimeout(() => setView('list'), 1500);
    } catch (err) {
      setMsg({ type: 'error', text: 'Operation failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (activeTab === 'students') {
      setEditingStudent(item);
      setFormData({
        name: item.name,
        dob: item.dob,
        gender: item.gender,
        studentClass: item.class,
        fatherName: item.fatherName || '',
        motherName: item.motherName || '',
        fatherOccupation: item.fatherOccupation || '',
        motherOccupation: item.motherOccupation || '',
        address: item.address || '',
        phoneNumber: item.phoneNumber || '',
        age: item.age || ''
      });
    } else {
      setEditingStaff(item);
      setStaffFormData({
        name: item.name,
        age: item.age || '',
        phoneNumber: item.phoneNumber || '',
        address: item.address || '',
        qualification: item.qualification || '',
        experience: item.experience || '',
        mailId: item.mailId || ''
      });
    }
    setView('register');
  };

  const handleDelete = async (id) => {
    const type = activeTab === 'students' ? 'student' : 'staff';
    if (!window.confirm(`Are you sure you want to delete this ${type}? All attendance records will also be removed.`)) return;
    try {
      if (activeTab === 'students') {
        await axios.delete(`${API_URL}/api/students/${id}`);
        fetchStudents();
      } else {
        await axios.delete(`${API_URL}/api/staff/${id}`);
        fetchStaff();
      }
      setMsg({ type: 'success', text: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!` });
    } catch (err) {
      setMsg({ type: 'error', text: `Failed to delete ${type}.` });
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
    <div className="min-h-screen bg-slate-100 relative overflow-hidden font-sans">
      <div className="bg-pattern" style={{ opacity: 0.4 }} />

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
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 glass-card p-8 md:p-12 shadow-2xl border-none rainbow-border"
        >
          <div className="flex items-center gap-8">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
              className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center overflow-hidden border-4 border-accent shadow-2xl relative"
            >
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-2" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-black text-slate-800 tracking-tighter leading-none mb-3 rainbow-text">Little Explorers</h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-8 py-2.5 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all duration-500 ${activeTab === 'students' ? 'text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 border-2 border-slate-100 hover:bg-slate-100'}`}
                  style={{ backgroundColor: activeTab === 'students' ? 'var(--primary)' : '' }}
                >
                  Stars
                </button>
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`px-8 py-2.5 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all duration-500 ${activeTab === 'staff' ? 'text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 border-2 border-slate-100 hover:bg-slate-100'}`}
                  style={{ backgroundColor: activeTab === 'staff' ? 'var(--secondary)' : '' }}
                >
                  Guides
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {view === 'list' ? (
              <div className="flex flex-row gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('attendance-calendar')}
                  className="flex items-center justify-center gap-2 px-4 md:px-8 py-4 bg-gradient-to-r from-secondary to-success text-white rounded-3xl font-black hover:brightness-110 transition-all shadow-xl shadow-secondary/30 border-b-4 border-secondary-hover text-sm md:text-base flex-1 sm:flex-none"
                  style={{ background: 'linear-gradient(135deg, var(--secondary), var(--success))' }}
                >
                  <Calendar size={20} />
                  <span className="hidden sm:inline">Mark Attendance</span>
                  <span className="sm:hidden text-xs">Attendance</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('register')}
                  className="btn-premium flex items-center justify-center gap-2 px-4 md:px-8 py-4 text-white rounded-3xl font-black transition-all text-sm md:text-base flex-1 sm:flex-none"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
                >
                  <UserPlus size={20} />
                  <span className="hidden sm:inline">{activeTab === 'students' ? 'Add Little Star' : 'Add Staff Member'}</span>
                  <span className="sm:hidden text-xs">Add</span>
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setView('list');
                  setMsg({ type: '', text: '' });
                  setEditingStudent(null);
                  setEditingStaff(null);
                  setFormData({
                    name: '', dob: '', gender: '', studentClass: '',
                    fatherName: '', motherName: '', fatherOccupation: '', motherOccupation: '',
                    address: '', phoneNumber: '', age: ''
                  });
                  setStaffFormData({ name: '', age: '', phoneNumber: '', address: '', qualification: '', experience: '', mailId: '' });
                }}
                className="btn-premium flex items-center justify-center gap-3 px-10 py-4 text-white rounded-3xl font-black shadow-2xl transition-all w-full sm:w-auto"
                style={{ backgroundColor: '#1e293b', border: '3px solid #334155' }}
              >
                <ArrowLeft size={22} className="text-secondary" />
                <span className="text-lg">Back to Roster</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90, filter: 'brightness(1.2)' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-5 rounded-3xl text-white border-2 border-white/50 transition-all shadow-xl shadow-danger/20 ml-auto sm:ml-0"
              style={{ background: 'linear-gradient(135deg, var(--danger), #ff8b3d)' }}
            >
              <LogOut size={28} />
            </motion.button>
          </div>
        </motion.header>

        {/* Dynamic Insights Grid */}
        {view === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card p-10 flex items-center gap-8 group hover:bg-primary transition-all duration-500 border-l-8 border-primary"
              style={{ '--hover-bg': 'var(--primary)' }}
            >
              <div className="w-20 h-20 bg-red-50 rounded-[28px] flex items-center justify-center text-primary group-hover:bg-white/20 group-hover:text-white transition-all shadow-inner">
                <Users size={40} />
              </div>
              <div>
                <span className="text-primary group-hover:text-white font-black uppercase tracking-[0.2em] mb-1 block font-heading transition-colors">{activeTab === 'students' ? 'Our Buddies' : 'Our Team'}</span>
                <div className="text-6xl font-black text-slate-800 group-hover:text-white tracking-tighter leading-none transition-colors">{activeTab === 'students' ? students.length : staff.length}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-card p-10 flex items-center gap-8 group hover:bg-secondary transition-all duration-500 border-l-8 border-secondary"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center text-secondary group-hover:bg-white/20 group-hover:text-white transition-all shadow-inner">
                <TrendingUp size={40} />
              </div>
              <div>
                <span className="text-secondary group-hover:text-white font-black uppercase tracking-[0.2em] mb-1 block font-heading transition-colors">Happy Score</span>
                <div className="text-6xl font-black text-slate-800 group-hover:text-white tracking-tighter leading-none transition-colors">94.2%</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass-card p-10 flex items-center gap-8 group hover:bg-accent transition-all duration-500 border-l-8 border-accent"
            >
              <div className="w-20 h-20 bg-yellow-50 rounded-[28px] flex items-center justify-center text-yellow-600 group-hover:bg-white/20 group-hover:text-white transition-all shadow-inner">
                <Calendar size={40} />
              </div>
              <div>
                <span className="text-yellow-600 group-hover:text-white font-black uppercase tracking-[0.2em] mb-1 block font-heading transition-colors">Adventure Days</span>
                <div className="text-6xl font-black text-slate-800 group-hover:text-white tracking-tighter leading-none transition-colors">184</div>
              </div>
            </motion.div>
          </div>
        )}

        {msg.text && view !== 'register' && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`mb-8 p-6 rounded-2xl flex items-center gap-4 text-sm font-bold border ${msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}
          >
            {msg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{msg.text}</span>
            <button
              onClick={() => setMsg({ type: '', text: '' })}
              className="ml-auto p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <LogOut size={14} className="rotate-45" />
            </button>
          </motion.div>
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
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-8">
                <div className="flex items-center gap-6">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Current Roster</h2>
                  <span className="px-6 py-2.5 bg-accent/10 text-accent text-[12px] font-black uppercase tracking-widest rounded-2xl border-2 border-accent/20">
                    {activeTab === 'students' ? 'Little Explorers' : 'Master Guides'}
                  </span>
                </div>

                <div className="flex items-center gap-4 w-full md:w-96">
                  <div className="relative flex-1 group">
                    <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" />
                    <input
                      type="text"
                      placeholder={activeTab === 'students' ? "Find a star..." : "Find a guide..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-50/50 border-2 border-slate-100 pl-16 pr-6 py-4 rounded-[24px] text-base font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-secondary focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar">
                {activeTab === 'students' ? (
                  students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.class.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                    <div className="col-span-full text-center py-32 bg-slate-50/30 rounded-[64px] border-3 border-dashed border-slate-200">
                      <Users className="text-slate-200 mx-auto mb-8" size={96} />
                      <div className="text-3xl font-black text-slate-400 uppercase tracking-tighter mb-4">No Students Discovered</div>
                      <button
                        onClick={() => { setSearchTerm(''); setView('register'); }}
                        className="btn-premium px-10 py-5 text-white rounded-[24px] font-black uppercase text-sm tracking-[0.1em] shadow-2xl transition-all"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        Enroll New Students →
                      </button>
                    </div>
                  ) : (
                    students
                      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.class.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((student, idx) => (
                        <motion.div
                          key={student._id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08, type: "spring", stiffness: 100 }}
                          className="bg-white/50 border-2 border-slate-50 p-8 rounded-[36px] flex flex-col gap-6 hover:border-secondary/30 hover:bg-white transition-all cursor-default relative group shadow-sm hover:shadow-2xl hover:shadow-secondary/10 overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full pointer-events-none" />
                          
                          <div className="flex justify-between items-start relative z-10">
                            <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-2xl border-2 border-secondary/20 shadow-inner">
                              {student.name.charAt(0)}
                            </div>
                            <div className="text-[11px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-2 rounded-2xl border border-secondary/10">
                              {student.class}
                            </div>
                          </div>

                          <div className="relative z-10">
                            <div className="font-bold text-slate-800 text-2xl tracking-tighter leading-tight mb-3">{student.name}</div>
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3 text-[12px] text-slate-500 font-bold">
                                <span className="flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded-xl border border-slate-100"><User size={14} className="text-secondary" /> {student.gender}</span>
                                <span className="flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded-xl border border-slate-100"><Calendar size={14} className="text-secondary" /> {student.dob}</span>
                              </div>

                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                  onClick={() => handleEdit(student)}
                                  className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                  title="Edit Student"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(student._id)}
                                  className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                  title="Delete Student"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                  )
                ) : (
                  staff.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                    <div className="col-span-full text-center py-32 bg-slate-50/30 rounded-[64px] border-3 border-dashed border-slate-200">
                      <Users className="text-slate-200 mx-auto mb-8" size={96} />
                      <div className="text-3xl font-black text-slate-400 uppercase tracking-tighter mb-4">No Staff Discovered</div>
                      <button
                        onClick={() => { setSearchTerm(''); setView('register'); }}
                        className="btn-premium px-10 py-5 text-white rounded-[24px] font-black uppercase text-sm tracking-[0.1em] shadow-2xl transition-all"
                        style={{ backgroundColor: 'var(--secondary)' }}
                      >
                        Add New Staff Members →
                      </button>
                    </div>
                  ) : (
                    staff
                      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((member, idx) => (
                        <motion.div
                          key={member._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white border-2 border-slate-50 p-6 rounded-3xl flex flex-col gap-5 hover:border-secondary/20 hover:shadow-2xl hover:shadow-secondary/5 transition-all cursor-default relative group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl border border-blue-100 shadow-sm">
                              {member.name.charAt(0)}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100/50">
                              {member.qualification || 'Staff'}
                            </div>
                          </div>

                          <div>
                            <div className="font-bold text-slate-800 text-xl tracking-tight leading-tight mb-2">{member.name}</div>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-bold">
                                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><User size={13} className="text-blue-400" /> {member.age} yrs</span>
                                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><TrendingUp size={13} className="text-blue-400" /> {member.experience} exp</span>
                              </div>

                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                  onClick={() => handleEdit(member)}
                                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                  title="Edit Staff"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(member._id)}
                                  className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                  title="Delete Staff"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                  )
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
                <img src="/logo.png" alt="" className="absolute top-8 right-8 w-24 h-24 opacity-10 pointer-events-none grayscale" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-[100px] -mr-40 -mt-40" />

                <div className="flex items-center gap-10 mb-16 relative z-10">
                  <div className={`p-8 ${activeTab === 'students' ? 'bg-primary' : 'bg-secondary'} rounded-[32px] text-white shadow-2xl animate-bounce`}>
                    <UserPlus size={44} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-3">
                      {activeTab === 'students'
                        ? (editingStudent ? 'Update Star Details' : 'New Little Star')
                        : (editingStaff ? 'Update Staff Details' : 'New Staff Member')}
                    </h2>
                    <p className="text-slate-400 font-bold text-xl">
                      {activeTab === 'students'
                        ? (editingStudent ? `Updating records for ${editingStudent.name}` : 'Welcome to the Playground!')
                        : (editingStaff ? `Updating records for ${editingStaff.name}` : 'Join our Elite Team!')}
                    </p>
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

                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 relative z-10">
                  {activeTab === 'students' ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Full Name</label>
                        <div className="input-container">
                          <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                          <input className="input-field py-4 pl-14 pr-6 text-base" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Jonathan Henderson" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Date of Birth</label>
                        <div className="input-container">
                          <Calendar size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                          <input type="date" className="input-field py-4 pl-14 pr-6 text-base" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Gender</label>
                        <div className="input-container">
                          <Users size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                          <select className="input-field py-4 pl-14 pr-6 text-base appearance-none" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} required>
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male Scholar</option>
                            <option value="Female">Female Scholar</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Class</label>
                        <div className="input-container">
                          <BookOpen size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                          <input className="input-field py-4 pl-14 pr-6 text-base" value={formData.studentClass} onChange={e => setFormData({ ...formData, studentClass: e.target.value })} placeholder="e.g. Class 12-B" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Father's Name</label>
                        <div className="input-container">
                          <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                          <input className="input-field py-4 pl-14 pr-6 text-base" value={formData.fatherName} onChange={e => setFormData({ ...formData, fatherName: e.target.value })} placeholder="Father's Name" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Mother's Name</label>
                        <div className="input-container">
                          <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                          <input className="input-field py-4 pl-14 pr-6 text-base" value={formData.motherName} onChange={e => setFormData({ ...formData, motherName: e.target.value })} placeholder="Mother's Name" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Father's Occupation</label>
                        <div className="input-container">
                          <TrendingUp size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                          <input className="input-field py-4 pl-14 pr-6 text-base" value={formData.fatherOccupation} onChange={e => setFormData({ ...formData, fatherOccupation: e.target.value })} placeholder="Father's Occupation" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Mother's Occupation</label>
                        <div className="input-container">
                          <TrendingUp size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                          <input className="input-field py-4 pl-14 pr-6 text-base" value={formData.motherOccupation} onChange={e => setFormData({ ...formData, motherOccupation: e.target.value })} placeholder="Mother's Occupation" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Age</label>
                        <div className="input-container">
                          <TrendingUp size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                          <input type="number" className="input-field py-4 pl-14 pr-6 text-base" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} placeholder="Age" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Phone Number</label>
                        <div className="input-container">
                          <TrendingUp size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                          <input className="input-field py-4 pl-14 pr-6 text-base" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="Phone Number" />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Address</label>
                        <div className="input-container">
                          <BookOpen size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                          <textarea className="input-field py-4 pl-14 pr-6 text-base min-h-[100px]" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Full Address" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Staff Name</label>
                        <div className="input-container">
                          <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" />
                          <input className="input-field py-4 pl-14 pr-6 text-base" value={staffFormData.name} onChange={e => setStaffFormData({ ...staffFormData, name: e.target.value })} placeholder="Staff Full Name" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Age</label>
                        <div className="input-container">
                          <TrendingUp size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" />
                          <input type="number" className="input-field py-4 pl-14 pr-6 text-base" value={staffFormData.age} onChange={e => setStaffFormData({ ...staffFormData, age: e.target.value })} placeholder="Age" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Phone Number</label>
                        <div className="input-container">
                          <TrendingUp size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" />
                          <input className="input-field py-4 pl-14 pr-6 text-base" value={staffFormData.phoneNumber} onChange={e => setStaffFormData({ ...staffFormData, phoneNumber: e.target.value })} placeholder="Phone Number" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Mail ID</label>
                        <div className="input-container">
                          <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" />
                          <input type="email" className="input-field py-4 pl-14 pr-6 text-base" value={staffFormData.mailId} onChange={e => setStaffFormData({ ...staffFormData, mailId: e.target.value })} placeholder="email@example.com" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Qualification</label>
                        <div className="input-container">
                          <GraduationCap size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" />
                          <input className="input-field py-4 pl-14 pr-6 text-base" value={staffFormData.qualification} onChange={e => setStaffFormData({ ...staffFormData, qualification: e.target.value })} placeholder="e.g. M.Ed, PhD" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Experience</label>
                        <div className="input-container">
                          <TrendingUp size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" />
                          <input className="input-field py-4 pl-14 pr-6 text-base" value={staffFormData.experience} onChange={e => setStaffFormData({ ...staffFormData, experience: e.target.value })} placeholder="e.g. 5 Years" />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Address</label>
                        <div className="input-container">
                          <BookOpen size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" />
                          <textarea className="input-field py-4 pl-14 pr-6 text-base min-h-[80px]" value={staffFormData.address} onChange={e => setStaffFormData({ ...staffFormData, address: e.target.value })} placeholder="Full Address" />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2 pt-6">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="btn-premium w-full py-6 text-2xl text-white tracking-tight rounded-[24px] font-black transition-all shadow-2xl"
                      style={{ backgroundColor: activeTab === 'students' ? 'var(--primary)' : 'var(--secondary)' }}
                    >
                      {loading
                        ? (activeTab === 'students' ? 'Saving Star...' : 'Saving Staff...')
                        : (activeTab === 'students'
                          ? (editingStudent ? 'Update Little Star' : 'Add to Playground!')
                          : (editingStaff ? 'Update Staff Member' : 'Add to Team!'))}
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
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{activeTab === 'students' ? 'Student Attendance' : 'Staff Attendance'}</h2>
                  <p className="text-slate-500 font-bold">{activeTab === 'students' ? 'Select a class and date' : 'Select a date'} to manage records</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                  <div className="bg-white p-3 rounded-2xl border-2 border-slate-100 shadow-sm flex items-center gap-3 w-full sm:w-auto">
                    <Calendar size={18} className="text-secondary" />
                    <input
                      type="month"
                      className="bg-transparent border-none font-black text-slate-700 focus:outline-none w-full"
                      value={selectedDate.substring(0, 7)}
                      onChange={(e) => setSelectedDate(`${e.target.value}-01`)}
                    />
                  </div>
                  {activeTab === 'students' && (
                    <select
                      className="bg-white border-2 border-slate-100 p-3.5 rounded-2xl font-black text-slate-700 appearance-none w-full sm:min-w-[200px] shadow-sm"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      <option value="">Select Class</option>
                      {[...new Set(students.map(s => s.class))].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 md:gap-6">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                  <div key={d} className="text-center text-[9px] md:text-[11px] font-black tracking-widest text-slate-400 mb-2 md:mb-6">{d}</div>
                ))}
                {getCalendarDays().map((day, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!day.day || day.isSunday) return;
                      if (activeTab === 'students' && !selectedClass) {
                        setMsg({ type: 'error', text: 'Select a star class first! ✨' });
                        return;
                      }
                      setSelectedDate(day.date);
                      setView('attendance-sheet');
                    }}
                    className={`cal-day p-6 rounded-[40px] border-2 transition-all relative group overflow-hidden ${!day.day ? 'opacity-0 pointer-events-none' :
                      day.isSunday ? 'bg-rose-50/20 border-rose-100/30 cursor-not-allowed' :
                        'bg-white/80 border-slate-100 hover:border-secondary hover:bg-white hover:shadow-premium cursor-pointer'
                      }`}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full opacity-50 group-hover:from-secondary/10" />
                    {day.day && (
                      <>
                        <div className="flex justify-between items-center mb-4 relative z-10">
                          <span className={`text-3xl font-black ${day.isSunday ? 'text-rose-300' : 'text-slate-800'}`}>{day.day}</span>
                          {day.isSunday && (
                            <span className="holiday-badge scale-90">Off</span>
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
                              <div className="bg-white/90 p-0.5 md:p-1 rounded-xl border border-slate-100 shadow-sm space-y-0.5">
                                {present > 0 && (
                                  <div className="flex justify-between items-center px-1">
                                    <span className="hidden md:block text-[6.5px] font-black text-green-600 uppercase tracking-tighter">Present</span>
                                    <span className="md:hidden w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    <span className="text-[7px] md:text-[8px] font-black text-green-700">{present}</span>
                                  </div>
                                )}
                                {absent > 0 && (
                                  <div className="flex justify-between items-center px-1">
                                    <span className="hidden md:block text-[6.5px] font-black text-red-600 uppercase tracking-tighter">Absent</span>
                                    <span className="md:hidden w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    <span className="text-[7px] md:text-[8px] font-black text-red-700">{absent}</span>
                                  </div>
                                )}
                                {leave > 0 && (
                                  <div className="flex justify-between items-center px-1">
                                    <span className="hidden md:block text-[6.5px] font-black text-orange-600 uppercase tracking-tighter">Leave</span>
                                    <span className="md:hidden w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                    <span className="text-[7px] md:text-[8px] font-black text-orange-700">{leave}</span>
                                  </div>
                                )}
                              </div>
                            );
                          })() : !day.isSunday && (
                            <div className="w-full py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[7px] md:text-[9px] font-black uppercase tracking-widest text-center opacity-0 group-hover:opacity-100 transition-all">
                              Mark
                            </div>
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
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
                      {activeTab === 'students' && (
                        <>
                          <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                          <span className="text-indigo-600 font-black uppercase text-[10px] tracking-widest">{selectedClass}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  {activeTab === 'students' && (
                    <select
                      className="bg-white border-2 border-slate-100 px-6 py-3.5 rounded-2xl font-bold text-slate-600 appearance-none w-full md:min-w-[200px] shadow-sm"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      <option value="">Select Class</option>
                      {[...new Set(students.map(s => s.class))].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {activeTab === 'students' && !selectedClass ? (
                <div className="text-center py-32 bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-200">
                  <BookOpen className="text-slate-200 mx-auto mb-6" size={64} />
                  <p className="text-xl font-black text-slate-400 uppercase tracking-tighter">Please Select Academic Section</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar mb-10">
                  {attendanceList.map((record, idx) => (
                    <div key={activeTab === 'students' ? record.studentId : record.staffId} className={`flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-${activeTab === 'students' ? 'indigo' : 'blue'}-200 transition-all`}>
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-${activeTab === 'students' ? 'indigo' : 'blue'}-600 border border-slate-100`}>{idx + 1}</div>
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
                            className={`px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${record.status === status
                              ? status === 'Present' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                : status === 'Absent' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                  : 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
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

              {(activeTab === 'staff' || selectedClass) && (
                <div className="flex justify-end gap-4 mt-8">
                  {activeTab === 'staff' && (
                    <div className="mr-auto flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
                      <Clock size={18} className="text-blue-500" />
                      <span className="text-blue-700 font-black text-sm uppercase tracking-widest">Limit: 9:30 AM</span>
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveAttendance}
                    disabled={loading}
                    className={`flex items-center justify-center gap-3 px-12 py-5 bg-success text-white rounded-3xl font-black text-xl shadow-2xl shadow-success/30 border-b-8 border-emerald-700 hover:bg-emerald-600 transition-all`}
                  >
                    <CheckCircle size={24} />
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
