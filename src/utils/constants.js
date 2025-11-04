// frontend/src/utils/constants.js

export const CENTER_CDMX = { lat: 19.4326, lng: -99.1332 };

export const GOOGLE_MAPS_LIBRARIES = ["places", "geometry"];

export const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1/ruta_transporte';

export const BACKEND_HEALTH_URL = 'http://localhost:5001/api/v1/health';

export const TAXI_COST_ESTIMATE = 90;

export const MAP_CONTAINER_STYLE = { 
  width: '100%', 
  height: '100%' 
};

export const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
};

export const DEFAULT_ZOOM = 12;

export const HISTORY_MAX_ITEMS = 5;

// Colores de rutas
export const ROUTE_COLORS = {
  WALKING: '#007BFF',      // Azul
  SUBWAY: '#E8823F',       // Rojo
  BUS: '#28A745',          // Verde
  TROLLEYBUS: '#17A2B8',   // Cyan
  TRAM: '#E83FC3',         // Naranja
  TRAIN: '#6610F2',        // Morado
  TAXI: '#FFC107',         // Amarillo
  DEFAULT: '#6C757D',      // Gris
};

// Configuración de polylines
export const POLYLINE_CONFIG = {
  WALKING: { weight: 4, zIndex: 5 },
  TRANSIT: { weight: 6, zIndex: 10 },
  SUBWAY: { weight: 7, zIndex: 10 },
  TRAIN: { weight: 7, zIndex: 10 },
  DRIVING: { weight: 6, zIndex: 8 },
  DEFAULT: { weight: 6, zIndex: 10 },
};