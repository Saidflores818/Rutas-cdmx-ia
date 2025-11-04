// frontend/src/components/UI/Header.jsx

import React from 'react';

const Header = ({ darkMode, onToggleDarkMode }) => {
  return (
    <div className="app-header">
      <div className="app-title">
        <h1>Rutas CDMX Inteligentes 🚌🚇</h1>
        <p>Optimización avanzada con IA experta: tiempo, costo y transbordos</p>
      </div>
      
      <button 
        className="dark-mode-toggle"
        onClick={onToggleDarkMode}
        title={darkMode ? 'Modo claro' : 'Modo oscuro'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default Header;