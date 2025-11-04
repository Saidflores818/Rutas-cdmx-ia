// frontend/src/components/UI/SavingsBanner.jsx

import React, { useState } from 'react';

const SavingsBanner = ({ savings }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (savings <= 0) return null;

  if (isMinimized) {
    return (
      <div 
        className="savings-banner minimized"
        onClick={() => setIsMinimized(false)}
      >
        <span>💰 ${savings.toFixed(0)} ahorro</span>
      </div>
    );
  }

  return (
    <div className="savings-banner">
      <button 
        className="minimize-btn"
        onClick={() => setIsMinimized(true)}
        title="Minimizar"
      >
        ✕
      </button>
      <div className="savings-content">
        <span className="savings-icon">💰</span>
        <div className="savings-text">
          <strong>Ahorras ${savings.toFixed(0)} MXN vs taxi</strong>
          <small>Más ecológico 🌱</small>
        </div>
      </div>
    </div>
  );
};

export default SavingsBanner;