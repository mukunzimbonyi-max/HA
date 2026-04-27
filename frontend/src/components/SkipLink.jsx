import React from 'react';

const SkipLink = () => {
  return (
    <a 
      href="#main-content" 
      style={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        background: 'var(--primary-blue)',
        color: 'white',
        padding: '8px',
        zIndex: 2000,
        transition: 'top 0.2s ease',
        textDecoration: 'none',
        borderRadius: '0 0 8px 0'
      }}
      onFocus={(e) => e.target.style.top = '0'}
      onBlur={(e) => e.target.style.top = '-40px'}
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
