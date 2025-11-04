// frontend/src/components/UI/LoadingSpinner.jsx

import React from 'react';

const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '16px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #f3f4f6',
        borderTopColor: '#2563EB',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#6b7280'
      }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;