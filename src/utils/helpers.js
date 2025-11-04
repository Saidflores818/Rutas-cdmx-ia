// frontend/src/utils/helpers.js

/**
 * Obtiene las coordenadas de un lugar de Google Maps
 */
export const getCoords = (place) => {
  if (place && place.geometry) {
    return {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
  }
  return null;
};

/**
 * Decodifica un polyline de Google Maps
 */
export const decodePolyline = (encoded) => {
  if (window.google && window.google.maps.geometry && encoded) {
    return window.google.maps.geometry.encoding.decodePath(encoded);
  }
  return [];
};

/**
 * Ajusta los bounds del mapa para mostrar una ruta completa
 */
export const fitBoundsToRoute = (mapInstance, routePath) => {
  if (!mapInstance || !routePath || routePath.length === 0) return;
  
  const bounds = new window.google.maps.LatLngBounds();
  routePath.forEach(point => bounds.extend(point));
  
  setTimeout(() => mapInstance.fitBounds(bounds), 100);
};

/**
 * Formatea una fecha para mostrar en el historial
 */
export const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calcula el ahorro vs taxi
 */
export const calculateSavings = (routeCost, taxiCost) => {
  const cost = parseFloat(routeCost.match(/[\d.]+/)?.[0] || 0);
  return taxiCost - cost;
};

/**
 * Trunca texto largo
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};