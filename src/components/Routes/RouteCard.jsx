
// src/components/Routes/RouteCard.jsx
import React from 'react';
import RouteDetails from './RouteDetails';
const RouteCard = ({ route, isSelected, onSelect }) => {
  // Asumiendo que tu objeto 'route' tiene estas propiedades. 
  // Cámbialas según tu backend si es necesario.
  const { time, cost, transfers, isOptimal, stepsSummary } = route;

  return (
    <div 
      className={`route-list-item ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onSelect(route)}
    >
      <div className="route-main-data">
        <div className="route-metrics-inline">
          <span className="metric-time">{time}</span>
          <span className="metric-dot">•</span>
          <span className="metric-cost">${cost} MXN</span>
        </div>
        
        <div className="route-badges">
          {isOptimal && <span className="badge-premium">BEST ROUTE</span>}
          <span className="badge-outline">
            {transfers === 0 ? 'DIRECT' : `${transfers} TRANSFERS`}
          </span>
        </div>
      </div>

      {/* Un resumen visual rápido de los transportes (Ej: Metro -> Caminar -> Bus) */}
      {stepsSummary && (
        <div className="route-steps-summary">
          {stepsSummary}
        </div>
      )}
    </div>
  );
};

export default RouteCard;