import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, GraduationCap, School, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = `http://${window.location.hostname}:5004`;

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
      const res = await axios.post(`${API_URL}/api/auth/login`, {
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
        <div className="glass-card p-12 md:p-16 border-none rainbow-border">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-36 h-36 bg-white rounded-[44px] mb-8 shadow-2xl border-8 border-accent overflow-hidden p-4 relative group"
            >
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
            </motion.div>
            <h1 className="text-6xl font-black text-slate-800 tracking-tighter mb-2 rainbow-text">Little Explorers</h1>
            <p className="text-secondary font-black text-2xl tracking-widest uppercase opacity-70">Guide's Portal</p>
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
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn-premium w-full py-6 text-2xl text-white rounded-[32px] shadow-2xl font-black flex items-center justify-center gap-4 transition-all"
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
