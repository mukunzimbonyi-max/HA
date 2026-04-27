import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      style={{
        background: 'var(--bg-light)',
        border: 'none',
        color: 'var(--text-dark)',
        padding: '8px',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.3s'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </motion.button>
  );
};

export default ThemeToggle;
