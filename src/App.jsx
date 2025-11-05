// frontend/src/App.jsx

import React, { useState, useMemo, useEffect } from 'react'; 
import { LoadScript } from '@react-google-maps/api'; 

// Componentes
import Header from './components/UI/Header';
import SearchBar from './components/UI/SearchBar';
import ErrorMessage from './components/UI/ErrorMessage';
import SavingsBanner from './components/UI/SavingsBanner';
import SearchHistory from './components/History/SearchHistory';
import Map from './components/Map/Map';
import RoutesList from './components/Routes/RoutesList';
// Después de los otros imports de componentes UI
import MobileViewToggle from './components/UI/MobileViewToggle';
// Hooks personalizados
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGeolocation } from './hooks/useGeoLocation';  // ✅ BIEN


// Services
import { searchRoutes, checkBackendHealth } from './services/api';
import { geocodeAddress } from './services/maps';

// Utilidades
import { 
  CENTER_CDMX, 
  GOOGLE_MAPS_LIBRARIES, 
  TAXI_COST_ESTIMATE,
  HISTORY_MAX_ITEMS 
} from './utils/constants';
import { 
  getCoords, 
  decodePolyline, 
  fitBoundsToRoute,
  calculateSavings 
} from './utils/helpers';

// Estilos
import './App.css'; 

// Estilos del mapa oscuro
// Estilos del mapa oscuro
const DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Estados principales
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]); 
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0); 
  const [mapInstance, setMapInstance] = useState(null); 
  const [mapCenter, setMapCenter] = useState(CENTER_CDMX); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  
  // Estados para vista móvil (MOVIDOS AQUÍ DENTRO)
  const [mobileViewMode, setMobileViewMode] = useState('vertical');
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Hooks personalizados
  const { getCurrentLocation, loading: geoLoading } = useGeolocation();
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', []);
  // Coordenadas memoizadas
  const originCoords = useMemo(() => getCoords(origin), [origin]);
  const destinationCoords = useMemo(() => getCoords(destination), [destination]);

  // Ruta seleccionada y ahorro
  const selectedRoute = routes[selectedRouteIndex];
  const savings = useMemo(() => 
    selectedRoute ? calculateSavings(selectedRoute.fare_text, TAXI_COST_ESTIMATE) : 0
  , [selectedRoute]);

  // Verificar salud del backend al iniciar
  useEffect(() => {
    checkBackendHealth().then(isHealthy => {
      if (isHealthy) {
        console.log('✅ Backend funcionando correctamente');
      }
    });
  }, []);

  // Validación de API Key
  if (!apiKey) {
    return (
      <div style={{padding: '20px', textAlign: 'center', color: '#ef4444'}}>
        ⚠️ <b>Error:</b> La clave de la API no está configurada. 
        <br/>Verifica el archivo <b>.env.local</b> y agrega: <code>VITE_GOOGLE_MAPS_API_KEY=tu_api_key</code>
      </div>
    );
  }

  // ========== HANDLERS ==========

  const handleGetLocation = async () => {
    try {
      const { place, coords } = await getCurrentLocation();
      setOrigin(place);
      setMapCenter(coords);
      console.log('✅ Ubicación obtenida:', place.formatted_address);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      setError('Debes seleccionar origen y destino');
      return;
    }
    
    const originAddress = origin.formatted_address;
    const destinationAddress = destination.formatted_address;

    setRoutes([]);
    setSelectedRouteIndex(0); 
    setMapKey(0);
    setLoading(true);
    setError(null);
    setShowStats(false);
    
    try {
      const data = await searchRoutes(originAddress, destinationAddress);
      
      const processedRoutes = data.map(route => ({
        ...route,
        path: decodePolyline(route.polyline)
      }));
        
      setRoutes(processedRoutes); 
      
      if (processedRoutes.length > 0) {
        setMapCenter(originCoords); 
        
        setTimeout(() => {
          fitBoundsToRoute(mapInstance, processedRoutes[0].path);
        }, 200);
        
        setShowStats(true);
        
        // Guardar en historial
        const newSearch = {
          origin: originAddress,
          destination: destinationAddress,
          date: new Date().toISOString(),
          bestRoute: processedRoutes[0].summary
        };
        
        const updatedHistory = [
          newSearch, 
          ...searchHistory.filter(
            item => !(item.origin === originAddress && item.destination === destinationAddress)
          )
        ].slice(0, HISTORY_MAX_ITEMS);
        
        setSearchHistory(updatedHistory);
      } else {
        setError('No se encontraron rutas disponibles');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setOrigin(null);
    setDestination(null);
    setRoutes([]);
    setSelectedRouteIndex(0);
    setMapKey(0);
    setError(null);
    setShowStats(false);
    setMapCenter(CENTER_CDMX);
  };

  const handleRouteCardClick = (index, routePath) => {
    if (index === selectedRouteIndex) return;
    
    setSelectedRouteIndex(index);
    setMapKey(prev => prev + 1);
    
    setTimeout(() => {
      fitBoundsToRoute(mapInstance, routePath);
    }, 500);
  };

  const handleShareWhatsApp = () => {
    if (!origin || !destination || routes.length === 0) return;
    
    const text = `🚇 *Ruta CDMX Inteligente*\n\n📍 De: ${origin.formatted_address}\n🏁 A: ${destination.formatted_address}\n\n⏱️ Tiempo: ${selectedRoute.predicted_duration_text}\n💰 Costo: ${selectedRoute.fare_text}\n🔄 Transbordos: ${selectedRoute.transfers}\n\n✨ Optimizada con IA`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleExportToGoogleMaps = () => {
    if (!origin || !destination) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.formatted_address)}&destination=${encodeURIComponent(destination.formatted_address)}&travelmode=transit`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('✅ Enlace copiado al portapapeles'))
      .catch(() => alert('❌ No se pudo copiar el enlace'));
  };

  const handleUseHistorySearch = async (historyItem) => {
    try {
      const originPlace = await geocodeAddress(historyItem.origin);
      const destinationPlace = await geocodeAddress(historyItem.destination);
      
      setOrigin(originPlace);
      setDestination(destinationPlace);
    } catch (err) {
      setError('Error al cargar búsqueda del historial');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Seguro que quieres borrar el historial de búsquedas?')) {
      setSearchHistory([]);
    }
  };

  const handleMapLoad = (map) => {
    setMapInstance(map);
    
    if (routes.length > 0 && selectedRouteIndex >= 0) {
      const route = routes[selectedRouteIndex];
      if (route?.path && route.path.length > 0) {
        setTimeout(() => {
          fitBoundsToRoute(map, route.path);
        }, 200);
      }
    }
  };
  

  // ========== RENDER ==========

  return (
    <div className={`main-content-wrapper ${darkMode ? 'dark-mode' : ''}`}> 
      <LoadScript googleMapsApiKey={apiKey} libraries={GOOGLE_MAPS_LIBRARIES}>
        
        {/* Header */}
        <Header 
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
        
        {/* Barra de búsqueda */}
        <SearchBar
          origin={origin}
          destination={destination}
          onOriginSelect={setOrigin}
          onDestinationSelect={setDestination}
          onGetLocation={handleGetLocation}
          onSearch={handleSearch}
          onClear={handleClear}
          loading={loading || geoLoading}
          disabled={!origin || !destination}
        />

        {/* Mensaje de error */}
        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)}
        />

        {/* Banner de ahorro */}
        {showStats && (
          <SavingsBanner savings={savings} />
        )}

        {/* Historial de búsquedas */}
        {searchHistory.length > 0 && routes.length === 0 && !loading && (
          <SearchHistory
            history={searchHistory}
            onSelectItem={handleUseHistorySearch}
            onClear={handleClearHistory}
          />
        )}

        {/* Layout principal: Mapa + Resultados */}
        <div className={`map-results-layout ${
          routes.length > 0 ? `mobile-${mobileViewMode}` : ''
        }`}>
          
          {/* Mapa */}
          <div className="map-container-fixed">
            <Map
              mapKey={mapKey}
              center={mapCenter}
              originCoords={originCoords}
              destinationCoords={destinationCoords}
              selectedRoute={selectedRoute}
              darkMode={darkMode}
              darkMapStyles={DARK_MAP_STYLES}
              onLoad={handleMapLoad}
              hasRoutes={routes.length > 0}
            />
          </div>

      {/* Lista de rutas */}
          <RoutesList
            routes={routes}
            selectedIndex={selectedRouteIndex}
            onRouteSelect={handleRouteCardClick}
            onShare={handleShareWhatsApp}
            onExport={handleExportToGoogleMaps}
            onCopyLink={handleCopyLink}
          />
        </div>

        {/* Toggle de vista móvil */}
        <MobileViewToggle
          viewMode={mobileViewMode}
          onViewChange={setMobileViewMode}
          routesCount={routes.length}
        />

        {/* Botón flotante para ver rutas (solo en modo map-only) */}
        {mobileViewMode === 'map-only' && routes.length > 0 && (
          <button
            className="floating-routes-btn"
            onClick={() => setShowMobileModal(true)}
          >
            📋
          </button>
        )}

        {/* Modal de rutas para móvil */}
        {showMobileModal && (
          <div className="mobile-routes-modal show">
            <div className="mobile-routes-header">
              <h2>📊 Rutas ({routes.length})</h2>
              <button
                className="close-modal-btn"
                onClick={() => setShowMobileModal(false)}
              >
                ✕ Cerrar
              </button>
            </div>
            <RoutesList
              routes={routes}
              selectedIndex={selectedRouteIndex}
              onRouteSelect={(index, path) => {
                handleRouteCardClick(index, path);
                setShowMobileModal(false);
              }}
              onShare={handleShareWhatsApp}
              onExport={handleExportToGoogleMaps}
              onCopyLink={handleCopyLink}
            />
          </div>
        )}

      </LoadScript>
    </div>
  );
}


export default App;