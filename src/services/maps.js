// frontend/src/services/maps.js

/**
 * Geocodifica una dirección usando Google Maps
 */
export const geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Maps no está cargado'));
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        resolve(results[0]);
      } else {
        reject(new Error('No se pudo geocodificar la dirección'));
      }
    });
  });
};

/**
 * Geocodifica coordenadas a dirección
 */
export const reverseGeocode = (coords) => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Maps no está cargado'));
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        resolve(results[0]);
      } else {
        reject(new Error('No se pudo geocodificar las coordenadas'));
      }
    });
  });
};