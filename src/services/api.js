// frontend/src/services/api.js

import axios from 'axios';
import { BACKEND_URL, BACKEND_HEALTH_URL } from '../utils/constants';

const API_TIMEOUT = 30000;

const apiClient = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Busca rutas en el backend
 */
export const searchRoutes = async (origin, destination) => {
  try {
    const response = await apiClient.post(BACKEND_URL, {
      origen: origin,
      destino: destination,
    });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('La búsqueda tardó demasiado. Intenta de nuevo.');
    } else if (error.response) {
      throw new Error(error.response.data?.error || 'Error del servidor. Verifica que Flask esté corriendo.');
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor. Asegúrate de que Flask esté corriendo en puerto 5001.');
    } else {
      throw new Error('Error inesperado. Por favor intenta de nuevo.');
    }
  }
};

/**
 * Verifica la salud del backend
 */
export const checkBackendHealth = async () => {
  try {
    await apiClient.get(BACKEND_HEALTH_URL, { timeout: 5000 });
    return true;
  } catch (error) {
    console.warn('⚠️ Backend no responde');
    return false;
  }
};