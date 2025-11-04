// frontend/src/components/Routes/RoutesList.jsx

import React from 'react';
import RouteCard from './RouteCard';

const RoutesList = ({ 
  routes, 
  selectedIndex, 
  onRouteSelect,
  onShare,
  onExport,
  onCopyLink
}) => {
  if (!routes || routes.length === 0) return null;

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>📊 Rutas Clasificadas ({routes.length})</h2>
        
        <div className="results-actions">
          <button 
            className="action-btn whatsapp-btn"
            onClick={onShare}
            title="Compartir por WhatsApp"
          >
            📱 WhatsApp
          </button>
          <button 
            className="action-btn export-btn"
            onClick={onExport}
            title="Abrir en Google Maps"
          >
            🗺️ Exportar
          </button>
          <button 
            className="action-btn copy-btn"
            onClick={onCopyLink}
            title="Copiar enlace"
          >
            🔗 Copiar
          </button>
        </div>
      </div>

      <div className="results-scroll">
        {routes.map((route, index) => (
          <RouteCard
            key={index}
            route={route}
            index={index}
            isSelected={index === selectedIndex}
            isBest={index === 0}
            onClick={() => onRouteSelect(index, route.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default RoutesList;