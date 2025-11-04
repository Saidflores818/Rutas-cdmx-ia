// frontend/src/components/Map/RoutePolylines.jsx

import React from 'react';
import { Polyline } from '@react-google-maps/api';
import { decodePolyline } from '../../utils/helpers';
import { ROUTE_COLORS, POLYLINE_CONFIG } from '../../utils/constants';

const RoutePolylines = ({ route }) => {
  if (!route?.steps) return null;

  return (
    <>
      {route.steps.map((step, i) => {
        const stepPath = decodePolyline(step.polyline || "");
        
        if (!stepPath || stepPath.length === 0) {
          return null;
        }
        
        const mode = step.mode?.toUpperCase() || "";
        const transitType = step.transit_type?.toLowerCase() || "";

        // Determinar color y peso
        let color = ROUTE_COLORS.DEFAULT;
        let config = POLYLINE_CONFIG.DEFAULT;
        
        if (mode === "WALKING") {
          color = ROUTE_COLORS.WALKING;
          config = POLYLINE_CONFIG.WALKING;
        } 
        else if (mode === "TRANSIT") {
          config = POLYLINE_CONFIG.TRANSIT;
          
          if (transitType === "subway") {
            color = ROUTE_COLORS.SUBWAY;
            config = POLYLINE_CONFIG.SUBWAY;
          } else if (transitType === "bus") {
            color = ROUTE_COLORS.BUS;
          } else if (transitType === "trolleybus") {
            color = ROUTE_COLORS.TROLLEYBUS;
          } else if (transitType === "tram") {
            color = ROUTE_COLORS.TRAM;
          } else if (transitType === "train") {
            color = ROUTE_COLORS.TRAIN;
            config = POLYLINE_CONFIG.TRAIN;
          } else {
            color = ROUTE_COLORS.BUS;
          }
        }
        else if (mode === "DRIVING") {
          color = ROUTE_COLORS.TAXI;
          config = POLYLINE_CONFIG.DRIVING;
        }

        return (
          <Polyline
            key={`polyline-${i}`}
            path={stepPath}
            options={{
              strokeColor: color,
              strokeOpacity: 0.85,
              strokeWeight: config.weight,
              zIndex: config.zIndex,
              clickable: false
            }}
          />
        );
      })}
    </>
  );
};

export default RoutePolylines;