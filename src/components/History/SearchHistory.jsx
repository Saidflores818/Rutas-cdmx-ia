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
    <div className="search-history">
      <header className="history-header">
        <h3 className="section-title">RECENT SEARCHES</h3>
        <button className="text-action-btn" onClick={onClear}>
          CLEAR ALL
        </button>
      </header>
      
      <ul className="history-list">
        {history.map((item, index) => (
          <li 
            key={index} 
            className="history-row"
            onClick={() => onSelectItem(item)}
          >
            <div className="route-main">
              <span className="location-name">
                {truncateText(item.origin.split(',')[0], 35)}
              </span>
              <span className="route-divider">—</span>
              <span className="location-name">
                {truncateText(item.destination.split(',')[0], 35)}
              </span>
            </div>

            <div className="route-details">
              {item.bestRoute && (
                <span className="route-tag">
                  {truncateText(item.bestRoute, 30)}
                </span>
              )}
              <time className="route-timestamp">
                {formatDate(item.date)}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;