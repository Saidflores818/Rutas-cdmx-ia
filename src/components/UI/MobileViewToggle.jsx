// frontend/src/components/UI/MobileViewToggle.jsx

import React from 'react';

const MobileViewToggle = ({ viewMode, onViewChange, routesCount }) => {
  if (routesCount === 0) return null;

  return (
    <div className="mobile-view-toggle">
      <button
        className={`toggle-btn ${viewMode === 'vertical' ? 'active' : ''}`}
        onClick={() => onViewChange('vertical')}
        title="Vista vertical"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="7" rx="1" />
          <rect x="4" y="13" width="16" height="7" rx="1" />
        </svg>
        <span>Vertical</span>
      </button>

      <button
        className={`toggle-btn ${viewMode === 'horizontal' ? 'active' : ''}`}
        onClick={() => onViewChange('horizontal')}
        title="Vista horizontal"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="7" height="16" rx="1" />
          <rect x="13" y="4" width="7" height="16" rx="1" />
        </svg>
        <span>Horizontal</span>
      </button>

      <button
        className={`toggle-btn ${viewMode === 'map-only' ? 'active' : ''}`}
        onClick={() => onViewChange('map-only')}
        title="Solo mapa"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
        <span>Mapa</span>
      </button>
    </div>
  );
};

export default MobileViewToggle;