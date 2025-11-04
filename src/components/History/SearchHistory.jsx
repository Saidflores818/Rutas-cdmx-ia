// frontend/src/components/History/SearchHistory.jsx

import React from 'react';
import { formatDate, truncateText } from '../../utils/helpers';

const SearchHistory = ({ 
  history, 
  onSelectItem, 
  onClear 
}) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>📜 Búsquedas recientes</h3>
        <button className="clear-history-btn" onClick={onClear}>
          🗑️ Limpiar historial
        </button>
      </div>
      <div className="history-list">
        {history.map((item, index) => (
          <div 
            key={index} 
            className="history-item"
            onClick={() => onSelectItem(item)}
          >
            <div className="history-route">
              <span className="history-origin">
                📍 {truncateText(item.origin.split(',')[0], 30)}
              </span>
              <span className="history-arrow">→</span>
              <span className="history-destination">
                🏁 {truncateText(item.destination.split(',')[0], 30)}
              </span>
            </div>
            <div className="history-meta">
              <small>{formatDate(item.date)}</small>
              {item.bestRoute && (
                <small className="history-best">
                  ⭐ {truncateText(item.bestRoute, 25)}
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;