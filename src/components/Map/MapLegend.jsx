// frontend/src/components/Map/MapLegend.jsx

import React from 'react';
import { ROUTE_COLORS } from '../../utils/constants';

const MapLegend = ({ darkMode }) => {
  const legendItems = [
    { color: ROUTE_COLORS.WALKING, label: 'Caminata' },
    { color: ROUTE_COLORS.SUBWAY, label: 'Metro' },
    { color: ROUTE_COLORS.BUS, label: 'Bus/Metrobús' },
    { color: ROUTE_COLORS.TROLLEYBUS, label: 'Trolebús' },
    { color: ROUTE_COLORS.TRAM, label: 'Tren Ligero' },
    { color: ROUTE_COLORS.TRAIN, label: 'Tren Suburbano' },
    { color: ROUTE_COLORS.TAXI, label: 'Taxi' },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      background: darkMode ? 'rgba(45, 53, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      color: darkMode ? '#e5e7eb' : '#1f2937',
      padding: '12px 16px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontSize: '12px',
      fontWeight: '600',
      zIndex: 1000,
      border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb'
    }}>
      <div style={{ marginBottom: '8px', fontWeight: '700', fontSize: '13px' }}>
        🗺️ Leyenda
      </div>
      {legendItems.map((item, index) => (
        <div 
          key={index}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: index < legendItems.length - 1 ? '4px' : '0' 
          }}
        >
          <div style={{ 
            width: '20px', 
            height: '3px', 
            background: item.color, 
            borderRadius: '2px' 
          }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default MapLegend;