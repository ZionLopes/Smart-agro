import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useData } from '../context/DataContext';
import { Map as MapIcon, Signal } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet marker icons issue in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export default function FarmMap() {
  const { currentData, moistureThreshold, userLocation, equipment } = useData();

  if (!userLocation) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-gray-500">
        <MapIcon className="h-12 w-12 mb-4 animate-pulse" />
        <p>Acquiring GPS coordinates for your farm...</p>
      </div>
    );
  }

  const position: [number, number] = [userLocation.lat, userLocation.lng];

  const isAlert = currentData ? currentData.soilMoisture < moistureThreshold : false;
  
  // Custom marker for nodes
  const createCustomIcon = (alert: boolean) => new L.Icon({
    iconUrl: alert 
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' 
      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const equipmentIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8 h-full flex flex-col"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Farm Map (GIS)</h1>
        <p className="text-gray-500 mt-1">Geospatial overview of your autonomous nodes and equipment</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative">
        {/* Map Legend */}
        <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-100">
          <h4 className="font-bold text-sm mb-2">Legend</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div> Optimal Node
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div> Critical Needs
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div> Equipment
          </div>
        </div>

        <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Esri'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          
          {/* Main Sensor Node */}
          <Marker position={position} icon={createCustomIcon(isAlert)}>
            <Popup className="rounded-xl overflow-hidden">
              <div className="p-2">
                <h3 className="font-bold text-lg border-b pb-1 mb-2 flex items-center gap-2">
                  <Signal className="h-4 w-4 text-blue-500" />
                  Node Alpha
                </h3>
                {currentData && (
                  <div className="space-y-1 text-sm">
                    <p><strong>Moisture:</strong> <span className={isAlert ? 'text-red-600 font-bold' : ''}>{currentData.soilMoisture.toFixed(1)}%</span></p>
                    <p><strong>Temp:</strong> {currentData.soilTemp.toFixed(1)}°C</p>
                    <p><strong>pH:</strong> {currentData.pH.toFixed(2)}</p>
                    <p><strong>Signal:</strong> -85 dBm (Good)</p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>

          {/* Draw a coverage circle */}
          <Circle 
            center={position} 
            pathOptions={{ color: isAlert ? 'red' : 'green', fillColor: isAlert ? 'red' : 'green', fillOpacity: 0.2 }} 
            radius={250} 
          />

          {/* Secondary Simulated Node (Always Optimal) */}
          <Marker position={[position[0] - 0.0033, position[1] + 0.0039]} icon={createCustomIcon(false)}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg border-b pb-1 mb-2 flex items-center gap-2">
                  <Signal className="h-4 w-4 text-blue-500" />
                  Node Beta
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Moisture:</strong> 65.2%</p>
                  <p><strong>Temp:</strong> 18.4°C</p>
                  <p><strong>pH:</strong> 6.8</p>
                  <p><strong>Signal:</strong> -92 dBm (Fair)</p>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Equipment Markers */}
          {equipment.map(eq => (
            <Marker key={eq.id} position={[eq.location.lat, eq.location.lng]} icon={equipmentIcon}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg border-b pb-1 mb-2">{eq.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Type:</strong> {eq.type}</p>
                    <p><strong>Status:</strong> {eq.status}</p>
                    <p><strong>Fuel/Battery:</strong> {eq.fuel}%</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </motion.div>
  );
}
