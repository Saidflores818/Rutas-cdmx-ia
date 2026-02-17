// frontend/src/components/UI/LoadingSpinner.jsx

import React from 'react';


const LoadingSpinner = ({ message = 'PROCESSING DATA' }) => {
  return (
    <div className="loading-wrapper">
      <div className="loading-track">
        <div className="loading-bar" />
      </div>
      {message && <span className="loading-text">{message.toUpperCase()}</span>}
    </div>
  );
};

export default LoadingSpinner;