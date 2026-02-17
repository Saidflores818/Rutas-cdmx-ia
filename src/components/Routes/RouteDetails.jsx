// frontend/src/components/Routes/RouteDetails.jsx

import React from 'react';

const RouteDetails = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="route-timeline-container">
      <h4 className="timeline-header">DETAILED ITINERARY</h4>
      
      <div className="timeline-list">
        {steps.map((step, stepIndex) => (
          <div key={stepIndex} className="timeline-node">
            
            {/* La parte gráfica: El punto y la línea de conexión */}
            <div className="timeline-visual">
              <div className="timeline-dot"></div>
              {/* Solo dibujamos la línea si NO es el último paso */}
              {stepIndex !== steps.length - 1 && <div className="timeline-line"></div>}
            </div>
            
            {/* La información del paso */}
            <div className="timeline-content">
              <div 
                className="timeline-instruction"
                dangerouslySetInnerHTML={{ __html: step.instruction }} 
              />
              <div className="timeline-duration">
                {step.duration}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteDetails;