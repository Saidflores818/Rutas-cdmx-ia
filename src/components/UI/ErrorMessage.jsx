// frontend/src/components/UI/ErrorMessage.jsx

import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <strong>❌ Error:</strong> {message}
      {onClose && (
        <button 
          onClick={onClose}
          style={{
            marginLeft: '10px',
            background: 'transparent',
            border: 'none',
            color: '#991b1b',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;