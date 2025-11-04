import React, { useState, useEffect, useRef } from 'react';

const SearchBox = ({ placeholder, onPlaceSelect }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obtener sugerencias de Google Places
  useEffect(() => {
    if (!inputValue || inputValue.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    if (!window.google || !window.google.maps) {
      console.warn('Google Maps no está cargado todavía');
      return;
    }

    setIsLoading(true);

    const service = new window.google.maps.places.AutocompleteService();
    const searchBounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(19.0, -99.5), // Suroeste CDMX
      new window.google.maps.LatLng(19.8, -98.8)  // Noreste CDMX
    );

    service.getPlacePredictions(
      {
        input: inputValue,
        componentRestrictions: { country: 'mx' },
        bounds: searchBounds,
        types: ['geocode', 'establishment'] // Incluir direcciones y lugares
      },
      (predictions, status) => {
        setIsLoading(false);

        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setSuggestions([]);
        } else {
          console.warn('Error en autocompletado:', status);
          setSuggestions([]);
        }
      }
    );
  }, [inputValue]);

  // Manejar selección de sugerencia
  const handleSelect = (description) => {
    setInputValue(description);
    setShowSuggestions(false);
    setSuggestions([]);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: description }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        onPlaceSelect(results[0]);
        console.log('✅ Lugar seleccionado:', results[0].formatted_address);
      } else {
        console.error('Error al geocodificar:', status);
        alert('❌ No se pudo encontrar la ubicación exacta');
      }
    });
  };

  // Manejar Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0].description);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Limpiar input
  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    onPlaceSelect(null);
  };

  return (
    <div className="search-input-container">
      <div className="input-wrapper">
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
          type="text"
          autoComplete="off"
        />
        
        {/* Botón de limpiar */}
        {inputValue && (
          <button 
            className="clear-input-btn"
            onClick={handleClear}
            type="button"
            title="Limpiar"
          >
            ✕
          </button>
        )}

        {/* Indicador de carga */}
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {/* Lista de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <ul ref={suggestionsRef} className="suggestions-list">
          {suggestions.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item.description)}
              className="suggestion-item"
            >
              <span className="suggestion-icon">📍</span>
              <div className="suggestion-content">
                <div className="suggestion-main">
                  {item.structured_formatting?.main_text || item.description}
                </div>
                {item.structured_formatting?.secondary_text && (
                  <div className="suggestion-secondary">
                    {item.structured_formatting.secondary_text}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Mensaje cuando no hay resultados */}
      {showSuggestions && inputValue.length >= 3 && suggestions.length === 0 && !isLoading && (
        <div className="no-results">
          <span>🔍</span>
          <p>No se encontraron resultados</p>
        </div>
      )}
    </div>
  );
};

export default SearchBox;