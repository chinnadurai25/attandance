import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, GraduationCap, School, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://31.97.237.122:5004/api/auth/login', { 
        email: email.trim(), 
        password: password.trim() 
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="bg-pattern" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-primary opacity-10 animate-float hidden lg:block" style={{ zIndex: -1 }}>
        <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <School size={160} />
        </motion.div>
      </div>
      <div className="absolute bottom-10 right-10 text-secondary opacity-10 animate-float hidden lg:block" style={{ zIndex: -1, animationDelay: '2s' }}>
        <motion.div animate={{ rotate: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <GraduationCap size={160} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-[40px] mb-8 shadow-2xl border-8 border-accent overflow-hidden p-3 animate-wiggle"
            >
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </motion.div>
            <h1 className="text-5xl font-black text-slate-800 tracking-tight mb-3">Sunny Days</h1>
            <p className="text-secondary font-black text-2xl">Teacher's Playground</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {error && (
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-semibold"
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="input-container">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="input-field"
                  placeholder="admin@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="input-container">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="w-full py-6 text-2xl text-white rounded-[32px] shadow-2xl shadow-primary/40 border-b-8 border-primary-hover font-black flex items-center justify-center gap-3 transition-all hover:brightness-110" 
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              disabled={loading}
            >
              {loading ? 'Opening Gates...' : (
                <>
                  <span>Enter Playground</span>
                  <LogIn size={28} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-2 font-medium">
              <School size={14} />
              <span>Secure Administrator Access Only</span>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;
