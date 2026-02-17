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
    <div className="search-interface">
      <div className="inputs-group">
        <div className="input-field">
          <SearchBox 
            placeholder="STARTING POINT"
            onPlaceSelect={onOriginSelect} 
          />
          <button 
            className="action-link"
            onClick={onGetLocation}
            disabled={loading}
          >
            USE CURRENT LOCATION
          </button>
        </div>

        <div className="input-divider" />

        <div className="input-field">
          <SearchBox 
            placeholder="FINAL DESTINATION"
            onPlaceSelect={onDestinationSelect} 
          />
        </div>
      </div>
      
      <div className="search-actions">
        <button 
          className="primary-action"
          disabled={disabled || loading} 
          onClick={onSearch} 
        >
          {loading ? 'CALCULATING...' : 'FIND OPTIMAL ROUTE'}
        </button>

        {(origin || destination) && (
          <button 
            className="secondary-action"
            onClick={onClear}
          >
            RESET
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;