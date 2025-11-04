// frontend/src/components/UI/SearchBar.jsx

import React from 'react';
import SearchBox from '../SearchBox';

const SearchBar = ({ 
  origin, 
  destination, 
  onOriginSelect, 
  onDestinationSelect,
  onGetLocation,
  onSearch,
  onClear,
  loading,
  disabled
}) => {
  return (
    <div className="search-overlay">
      <SearchBox 
        placeholder="📍 Origen (Punto de Partida)"
        onPlaceSelect={onOriginSelect} 
      />
      <SearchBox 
        placeholder="🏁 Destino (Punto de Llegada)"
        onPlaceSelect={onDestinationSelect} 
      />
      
      <button 
        className="location-button"
        onClick={onGetLocation}
        disabled={loading}
        title="Usar mi ubicación actual"
      >
        📍 Mi ubicación
      </button>
      
      <button 
        className="search-button"
        disabled={disabled || loading} 
        onClick={onSearch} 
      >
        {loading ? '⏳ Buscando...' : '🔍 Buscar Ruta'}
      </button>

      {(origin || destination) && (
        <button 
          className="clear-button"
          onClick={onClear}
          title="Limpiar búsqueda"
        >
          🗑️ Limpiar
        </button>
      )}
    </div>
  );
};

export default SearchBar;