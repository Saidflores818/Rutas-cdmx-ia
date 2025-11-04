// frontend/src/components/Routes/RouteDetails.jsx

import React from 'react';

const RouteDetails = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="selected-route-details">
      <h4>🗺️ Pasos Detallados</h4>
      <ol className="steps-list">
        {steps.map((step, stepIndex) => (
          <li key={stepIndex} className="step-item">
            <div 
              className="step-instruction"
              dangerouslySetInnerHTML={{ __html: step.instruction }} 
            />
            <span className="step-duration">
              ⏱️ {step.duration}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RouteDetails;