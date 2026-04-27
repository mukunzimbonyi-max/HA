import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Menu, Settings, Globe, Sun, Moon, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, t, theme, toggleTheme } = useLanguage();
  const [showSettings, setShowSettings] = React.useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const user = JSON.parse(localStorage.getItem('user'));
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'rw', label: 'Kinyarwanda' },
    { code: 'fr', label: 'Français' },
    { code: 'sw', label: 'Kiswahili' }
  ];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'var(--white)',
      boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div 
        onClick={() => navigate('/home')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/home')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          cursor: 'pointer'
        }}
      >
        <ShieldCheck size={32} color="var(--primary-blue)" />
        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-blue)', letterSpacing: '-0.5px' }}>
          {t.brandName}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button 
          onClick={() => navigate('/admin')}
          style={{ 
            background: '#f1f5f9', border: 'none', padding: '0.6rem 1rem', 
            borderRadius: '12px', cursor: 'pointer', color: 'var(--text-muted)',
            fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.5px'
          }}
        >
          ADMIN
        </button>

        {user ? (
          <div 
            onClick={() => navigate('/profile')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
              background: '#f0f4f8', padding: '0.3rem 0.8rem 0.3rem 0.3rem',
              borderRadius: '50px', border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ 
              width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden',
              background: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {user.profile_picture ? (
                <img 
                  src={`${apiUrl.replace('/api', '')}${user.profile_picture}`} 
                  alt={user.username} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <User size={16} color="white" />
              )}
            </div>
            <span style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '0.8rem' }}>
              {user.username.split(' ')[0]}
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); handleLogout(); }}
              title="Logout"
              style={{ 
                background: 'none', border: 'none', cursor: 'pointer', padding: '5px',
                display: 'flex', alignItems: 'center', color: '#ff5630', marginLeft: '5px'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/auth')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', 
              background: 'var(--primary-blue)', color: 'white', padding: '0.6rem 1.2rem', 
              borderRadius: '12px', fontWeight: '700', fontSize: '0.85rem',
              boxShadow: '0 4px 12px rgba(0, 82, 204, 0.2)', border: 'none'
            }}
          >
            <User size={16} /> Login
          </button>
        )}

        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            style={{ 
              background: showSettings ? 'var(--primary-blue)' : '#f1f5f9', 
              color: showSettings ? 'white' : 'var(--text-dark)',
              border: 'none', width: '42px', height: '42px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            <Settings size={20} className={showSettings ? 'rotate-90' : ''} style={{ transition: '0.5s' }} />
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{
                  position: 'absolute', top: '55px', right: 0, width: '220px',
                  background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  padding: '1.2rem', border: '1px solid #f1f5f9', zIndex: 1001
                }}
              >
                <div style={{ marginBottom: '1.2rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Appearance</p>
                  <button 
                    onClick={toggleTheme}
                    style={{ 
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px', 
                      background: '#f8fafc', border: 'none', padding: '10px', borderRadius: '10px',
                      cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600'
                    }}
                  >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Language</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {languages.map(lang => (
                      <button 
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setShowSettings(false);
                        }}
                        style={{ 
                          width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px',
                          border: 'none', background: language === lang.code ? 'var(--primary-blue)' : 'transparent',
                          color: language === lang.code ? 'white' : 'var(--text-dark)',
                          fontSize: '0.85rem', fontWeight: language === lang.code ? '700' : '500',
                          cursor: 'pointer', transition: '0.2s'
                        }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
