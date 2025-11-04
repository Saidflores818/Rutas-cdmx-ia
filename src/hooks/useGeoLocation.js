// frontend/src/hooks/useGeolocation.js

import { useState } from 'react';
import { reverseGeocode } from '../services/maps';

export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      const err = 'Tu navegador no soporta geolocalización';
      setError(err);
      throw new Error(err);
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
        });
      });

      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const place = await reverseGeocode(coords);
      
      setLoading(false);
      return { place, coords };
    } catch (err) {
      const errorMessage = 'No se pudo obtener tu ubicación. Verifica los permisos del navegador.';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return { getCurrentLocation, loading, error };
};