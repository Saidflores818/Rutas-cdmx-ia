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
        {/* Cambiamos el h2 genérico por una clase técnica */}
        <div className="results-title">
          RUTAS CLASIFICADAS ({routes.length})
        </div>
        
        <div className="results-actions">
          <button 
            className="action-ghost-btn"
            onClick={onShare}
            title="Compartir por WhatsApp"
          >
            WHATSAPP
          </button>
          <button 
            className="action-ghost-btn"
            onClick={onExport}
            title="Abrir en Google Maps"
          >
            EXPORTAR
          </button>
          <button 
            className="action-ghost-btn"
            onClick={onCopyLink}
            title="Copiar enlace"
          >
            COPIAR
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