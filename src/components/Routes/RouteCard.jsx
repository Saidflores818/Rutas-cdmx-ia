// frontend/src/components/Routes/RouteCard.jsx

import React from 'react';
import RouteDetails from './RouteDetails';

const RouteCard = ({ 
  route, 
  index, 
  isSelected, 
  isBest,
  onClick 
}) => {
  return (
    <div 
      className={`route-list-item ${isSelected ? 'is-selected' : ''}`}
      onClick={onClick}
    >
      <div className="route-main-data">
        {/* 1. Métricas Principales en línea */}
        <div className="route-metrics-inline">
          <span className="metric-time">{route.predicted_duration_text}</span>
          <span className="metric-dot">•</span>
          <span className="metric-cost">{route.fare_text}</span>
        </div>
        
        {/* 2. Etiquetas de prioridad (Badges) */}
        <div className="route-badges">
          {isBest && <span className="badge-premium">BEST MATCH</span>}
          <span className="badge-outline">
            {route.transfers === 0 ? 'DIRECT' : `${route.transfers} TRANSFERS`}
          </span>
        </div>
      </div>

      {/* 3. Indicadores Secundarios (IA, Hora Pico, Accesibilidad) */}
      <div className="route-indicators-minimal">
        {route.distance && <span className="indicator-text">{route.distance}</span>}
        {route.rush_hour && <span className="indicator-text warning">RUSH HOUR</span>}
        {route.accessible && <span className="indicator-text">ACCESSIBLE</span>}
        <span className="indicator-text ai-score">SCORE: {route.score}</span>
      </div>

      {/* 4. Componente Expandible al hacer clic */}
      {isSelected && (
        <div className="route-details-container">
          <RouteDetails steps={route.steps} />
        </div>
      )}
    </div>
  );
};

export default RouteCard;