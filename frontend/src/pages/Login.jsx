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
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ position: 'relative' }}>
      <div className="bg-pattern" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-indigo-100 opacity-20 animate-float" style={{ zIndex: -1 }}>
        <GraduationCap size={120} />
      </div>
      <div className="absolute bottom-10 right-10 text-indigo-100 opacity-20 animate-float" style={{ zIndex: -1, animationDelay: '2s' }}>
        <School size={120} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '72px',
                height: '72px',
                background: 'var(--primary)',
                borderRadius: '20px',
                marginBottom: '20px',
                boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)'
              }}
            >
              <GraduationCap color="white" size={36} />
            </motion.div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>Attendance Pro</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Welcome back to your school portal</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px',
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.1)',
                  borderRadius: '14px',
                  color: 'var(--danger)',
                  fontSize: '14px'
                }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginLeft: '4px' }}>Email Address</label>
              <div className="input-container">
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginLeft: '4px' }}>Password</label>
              <div className="input-container">
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Authenticating...' : (
                <>
                  <span>Sign In to Portal</span>
                  <LogIn size={20} />
                </>
              )}
            </motion.button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <School size={14} />
              <span>Secure Administrator Access</span>
            </p>
          </div>
        </div>

        {/* Credentials Tooltip */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontWeight: '600' }}>Demo Credentials</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
            <div style={{ background: 'white', padding: '6px 12px', borderRadius: '100px', border: '1px solid var(--border)', display: 'inline-block', margin: '0 auto' }}>
              Admin: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>admin@gmail.com</span> / <span style={{ color: 'var(--primary)', fontWeight: '600' }}>admin123</span>
            </div>
            <div style={{ background: 'white', padding: '6px 12px', borderRadius: '100px', border: '1px solid var(--border)', display: 'inline-block', margin: '0 auto' }}>
              Super Admin: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>admin1@gmail.com</span> / <span style={{ color: 'var(--primary)', fontWeight: '600' }}>admin321</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
