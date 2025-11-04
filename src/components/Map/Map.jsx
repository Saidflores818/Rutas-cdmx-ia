// frontend/src/components/Map/Map.jsx

import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { MAP_CONTAINER_STYLE, MAP_OPTIONS, DEFAULT_ZOOM } from '../../utils/constants';
import RoutePolylines from './RoutePolylines';
import MapLegend from './MapLegend';

const Map = ({ 
  mapKey,
  center, 
  originCoords, 
  destinationCoords,
  selectedRoute,
  darkMode,
  darkMapStyles,
  onLoad,
  hasRoutes
}) => {
  return (
    <GoogleMap
      key={`map-${mapKey}`}
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={center} 
      zoom={DEFAULT_ZOOM}
      options={{ 
        ...MAP_OPTIONS,
        styles: darkMode ? darkMapStyles : []
      }}
      onLoad={onLoad} 
    >
      {/* Marcadores */}
      {originCoords && (
        <Marker 
          position={originCoords} 
          label={{ text: "📍", fontSize: "24px", fontWeight: "bold" }}
          title="Origen"
        />
      )}
      {destinationCoords && (
        <Marker 
          position={destinationCoords} 
          label={{ text: "🏁", fontSize: "24px", fontWeight: "bold" }}
          title="Destino"
        />
      )}

      {/* Polylines de la ruta seleccionada */}
      {selectedRoute && <RoutePolylines route={selectedRoute} />}

      {/* Leyenda */}
      {hasRoutes && <MapLegend darkMode={darkMode} />}
    </GoogleMap>
  );
};

export default Map;