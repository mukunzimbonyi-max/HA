import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggle from '../components/ThemeToggle';

const languages = [
  { id: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', ariaLabel: 'Select Kinyarwanda language' },
  { id: 'en', name: 'English', nativeName: 'English', ariaLabel: 'Select English language' },
  { id: 'fr', name: 'French', nativeName: 'Français', ariaLabel: 'Select French language' },
  { id: 'sw', name: 'Kiswahili', nativeName: 'Kiswahili', ariaLabel: 'Select Kiswahili language' }
];

const LanguageSelection = () => {
  const { language, changeLanguage, t, speak } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Welcome message for blind users
    speak("Welcome to HealthConnect. Please select your language to continue. English, French, Kinyarwanda, or Swahili.");
  }, []);

  const handleContinue = () => {
    if (selectedLang) {
      changeLanguage(selectedLang);
      navigate('/home');
    }
  };

  return (
    <div className="language-page" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
        <ThemeToggle />
      </div>
      {/* Animated Nature Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        backgroundColor: '#0a2e1f' // Dark green fallback
      }}>
        {/* Main Background Image with Ken Burns Effect */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 1, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '-5%',
            left: '-5%',
            width: '110%',
            height: '110%',
            backgroundImage: 'url("/assets/doctor_youth_nature.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6) contrast(1.1)'
          }}
        />

        {/* Animated Nature Elements - Floating Leaves/Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + 'vw', 
              y: '110vh', 
              opacity: 0,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: '-10vh',
              opacity: [0, 0.5, 0],
              x: (Math.random() * 100 - 50) + 'vw',
              rotate: Math.random() * 720
            }}
            transition={{ 
              duration: 10 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              width: Math.random() * 15 + 5 + 'px',
              height: Math.random() * 15 + 5 + 'px',
              background: i % 2 === 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(144, 238, 144, 0.4)',
              borderRadius: '50%',
              filter: 'blur(2px)',
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Soft Sunlight Overlay */}
        <motion.div 
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 20%, rgba(255, 255, 200, 0.15) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="header-section" 
        style={{ textAlign: 'center', marginBottom: '3rem', zIndex: 1, padding: '0 1rem' }}
      >
        <div style={{ background: 'white', display: 'inline-flex', padding: '18px', borderRadius: '24px', marginBottom: '2rem', boxShadow: '0 15px 35px rgba(0,0,0,0.3)' }}>
          <Globe size={52} color="var(--primary-blue)" />
        </div>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
          fontWeight: '950', 
          color: 'white', 
          textShadow: '0 4px 15px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.3)', 
          letterSpacing: '-2px',
          lineHeight: 1.1
        }}>
          My Health My Friend
        </h1>
        <p style={{ 
          color: 'white', 
          fontSize: '1.4rem', 
          marginTop: '1rem', 
          fontWeight: '600',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          maxWidth: '600px',
          marginInline: 'auto'
        }}>
          Your digital safe space for health and wellbeing.
        </p>
      </motion.div>

      <div className="language-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '900px',
        zIndex: 1
      }}>
        {languages.map((lang, index) => (
          <motion.div
            key={lang.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedLang(lang.id)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              border: `2px solid ${selectedLang === lang.id ? 'white' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: '24px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: '0.3s'
            }}
            whileHover={{ y: -5, background: 'rgba(255, 255, 255, 0.25)' }}
            whileTap={{ scale: 0.95 }}
            role="button"
            aria-pressed={selectedLang === lang.id}
            tabIndex={0}
          >
            {selectedLang === lang.id && (
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'white',
                color: 'var(--primary-blue)',
                borderRadius: '50%',
                padding: '4px',
                display: 'flex'
              }}>
                <Check size={18} strokeWidth={3} />
              </div>
            )}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '900', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{lang.nativeName}</h2>
            <p style={{ opacity: 1, fontSize: '1.1rem', fontWeight: '700', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{lang.name}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedLang ? 1 : 0.5 }}
        disabled={!selectedLang}
        onClick={handleContinue}
        style={{
          marginTop: '4rem',
          padding: '1.2rem 4rem',
          backgroundColor: 'white',
          color: 'var(--primary-blue)',
          borderRadius: '50px',
          fontSize: '1.2rem',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          border: 'none',
          cursor: selectedLang ? 'pointer' : 'not-allowed',
          zIndex: 1
        }}
        whileHover={selectedLang ? { scale: 1.05 } : {}}
        whileTap={selectedLang ? { scale: 0.98 } : {}}
      >
        Continue <ArrowRight size={24} />
      </motion.button>
    </div>
  );
};

export default LanguageSelection;
