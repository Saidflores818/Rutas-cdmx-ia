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
      className={`route-card ${isSelected ? 'selected' : ''} ${isBest ? 'best' : ''}`}
      onClick={onClick}
    >
      <div className="route-header">
        
        {route.distance && (
          <span className="route-distance">{route.distance}</span>
        )}
      </div>

      <div className="route-metrics">
        <div className="metric">
          <div className="metric-value time">{route.predicted_duration_text}</div>
          <div className="metric-label">Tiempo</div>
        </div>
        <div className="metric">
          <div className="metric-value cost">{route.fare_text}</div>
          <div className="metric-label">Costo</div>
        </div>
        <div className="metric">
          <div className="metric-value transfers">{route.transfers}</div>
          <div className="metric-label">Transbordos</div>
        </div>
      </div>

      <div className="route-indicators">
        {route.rush_hour && (
          <span className="indicator rush-hour" title="Esta ruta puede tener más tráfico en hora pico">
            Hora pico
          </span>
        )}
        {route.accessible && (
          <span className="indicator accessible" title="Ruta con pocos transbordos, más accesible">
            Accesible
          </span>
        )}
        <span className="indicator score" title={`Score de conveniencia calculado por IA: ${route.score}/1.0`}>
          📊 Score: {route.score}
        </span>
      </div>

      {isSelected && <RouteDetails steps={route.steps} />}
    </div>
  );
};

export default RouteCard;