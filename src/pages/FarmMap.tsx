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
  const { currentData, moistureThreshold } = useData();

  // Simulated farm center coordinates
  const position: [number, number] = [36.7783, -119.4179]; // Central Valley, CA

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

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8 h-full flex flex-col"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <MapIcon className="text-green-600 h-8 w-8" />
          Interactive GIS Map
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Real-time geospatial monitoring of your LoRaWAN sensor nodes</p>
      </div>

      <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden relative min-h-[600px]">
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-2">
          <h3 className="font-bold text-sm text-gray-800 border-b pb-2 mb-1">Node Status</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 rounded-full bg-green-500"></div> Optimal
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div> Critical Needs
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
          <Marker position={[36.7750, -119.4140]} icon={createCustomIcon(false)}>
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
        </MapContainer>
      </div>
    </motion.div>
  );
}
