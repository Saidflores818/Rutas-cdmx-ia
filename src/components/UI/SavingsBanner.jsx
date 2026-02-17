// frontend/src/components/UI/SavingsBanner.jsx

import React, { useState } from 'react';

const SavingsBanner = ({ savings }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (savings <= 0) return null;

  return (
    <div 
      className={`value-indicator ${isMinimized ? 'minimized' : ''}`}
      onClick={() => setIsMinimized(!isMinimized)}
    >
      {!isMinimized ? (
        <div className="value-content">
          <span className="value-label">ECONOMY GAIN</span>
          <span className="value-amount">${savings.toFixed(0)} MXN</span>
          <span className="value-context">VS PRIVATE TRANSPORT</span>
        </div>
      ) : (
        <span className="value-amount-min">${savings.toFixed(0)}</span>
      )}
    </div>
  );
};

export default SavingsBanner;