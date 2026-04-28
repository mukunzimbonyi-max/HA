import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  UserCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Users,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Auth = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
    profilePicture: null
  });
  const [preview, setPreview] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      let response;
      
      if (isLogin) {
        response = await fetch(`${apiUrl}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
      } else {
        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('role', formData.role);
        if (formData.profilePicture) {
          data.append('profile_picture', formData.profilePicture);
        }
        
        response = await fetch(`${apiUrl}${endpoint}`, {
          method: 'POST',
          body: data
        });
      }
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        alert(isLogin ? 'Welcome back!' : 'Account created successfully!');
        
        // Redirect based on user role
        if (data.role === 'admin') {
          navigate('/admin');
        } else if (data.role === 'mentor') {
          navigate('/mental-health-dashboard');
        } else if (data.role === 'client') {
          navigate('/client-dashboard');
        } else {
          navigate('/home');
        }
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      alert('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const roles = [
    { id: 'client', label: 'Client', icon: <Users size={20} /> },
    { id: 'mentor', label: 'Mentor', icon: <GraduationCap size={20} /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck size={20} /> }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f0f4f8', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <motion.div 
        className="responsive-auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--card-bg)',
          width: '100%',
          maxWidth: '500px',
          borderRadius: '32px',
          padding: '3rem',
          boxShadow: '0 20px 40px rgba(0, 82, 204, 0.1)',
          border: '2px solid var(--primary-blue)', // Blue border
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            position: 'absolute', top: '2rem', left: '2rem', 
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
          }}
        >
          <ArrowLeft size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', fontWeight: '800', marginBottom: '0.5rem' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Login to access your dashboard' : 'Join our safe space today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div 
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  background: '#f0f4f8', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px dashed var(--primary-blue)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => document.getElementById('profile-upload').click()}
              >
                {preview ? (
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserCircle size={40} style={{ color: 'var(--text-muted)' }} />
                )}
                <div style={{ 
                  position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0, 82, 204, 0.7)',
                  color: 'white', fontSize: '0.7rem', padding: '4px', textAlign: 'center', fontWeight: '700'
                }}>
                  UPLOAD
                </div>
              </div>
              <input 
                id="profile-upload"
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }} 
              />
            </div>
          )}

          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)' }}>Select Your Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({...formData, role: r.id})}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: '2px solid',
                      borderColor: formData.role === r.id ? 'var(--primary-blue)' : '#f0f2f5',
                      background: formData.role === r.id ? '#eef6ff' : 'var(--card-bg)',
                      color: formData.role === r.id ? 'var(--primary-blue)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      transition: '0.3s'
                    }}
                  >
                    {r.icon}
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                style={{ 
                  width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '16px', 
                  border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem'
                }} 
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ 
                width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '16px', 
                border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem'
              }} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ 
                width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '16px', 
                border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem'
              }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: 'var(--primary-blue)', color: 'white', border: 'none', 
              padding: '1.2rem', borderRadius: '16px', fontWeight: '800', fontSize: '1.1rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              marginTop: '1rem', boxShadow: '0 10px 20px rgba(0, 82, 204, 0.2)'
            }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ 
                background: 'none', border: 'none', color: 'var(--primary-blue)', 
                fontWeight: '700', marginLeft: '8px', cursor: 'pointer' 
              }}
            >
              {isLogin ? 'Create one' : 'Login'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
