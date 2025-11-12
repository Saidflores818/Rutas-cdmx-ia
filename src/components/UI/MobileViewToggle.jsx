// frontend/src/components/UI/MobileViewToggle.jsx
import React from 'react';

/**
 * Toggle simplificado para móvil
 * Solo se muestra en móvil cuando hay rutas
 * Opción principal: Solo Mapa (para ocultar el drawer)
 */
const MobileViewToggle = ({ viewMode, onViewChange, routesCount }) => {
  // No mostrar si no hay rutas
  if (routesCount === 0) return null;

  return null; // Deshabilitado por ahora, el drawer es automático
  
  // Si quieres mantener el toggle, descomenta esto:
  /*
  return (
    <div className="mobile-view-toggle">
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
      
      <button
        className={`toggle-btn ${viewMode === 'vertical' ? 'active' : ''}`}
        onClick={() => onViewChange('vertical')}
        title="Ver rutas"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="7" rx="1" />
          <rect x="4" y="13" width="16" height="7" rx="1" />
        </svg>
        <span>Rutas</span>
      </button>
    </div>
  );
  */
};

export default MobileViewToggle;