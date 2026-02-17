// frontend/src/components/UI/Header.jsx

import React from 'react';


const Header = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header className="app-header">
      <div className="brand-container">
        <h1 className="brand-name">CDMX TRANSIT <span className="brand-dot">.</span></h1>
        <p className="brand-tagline">AI-DRIVEN ROUTE OPTIMIZATION</p>
      </div>
      
      <div className="header-actions">
        <button 
          className="theme-switcher"
          onClick={onToggleDarkMode}
          aria-label="Toggle visual theme"
        >
          <span className="theme-label">{darkMode ? 'LIGHT' : 'DARK'}</span>
          <div className={`theme-indicator ${darkMode ? 'is-light' : 'is-dark'}`} />
        </button>
      </div>
    </header>
  );
};

export default Header;