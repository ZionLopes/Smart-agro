import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera as CameraIcon, AlertTriangle, Eye, Video, ZoomIn, Sun, Moon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const cameras = [
  { id: 1, name: 'Cam 01 - Field Sector A', type: 'image', url: 'https://harisharandevgan.wordpress.com/wp-content/uploads/2025/12/crop-farming.png', status: 'Online', alerts: 0 },
  { id: 2, name: 'Cam 02 - Crop Assessment', type: 'image', url: 'https://harisharandevgan.wordpress.com/wp-content/uploads/2025/12/crop-farming-1.png', status: 'Online', alerts: 1 },
  { id: 3, name: 'Cam 03 - Cultivation Zone', type: 'image', url: 'https://harisharandevgan.wordpress.com/wp-content/uploads/2025/12/crop-farming-in-india.png', status: 'Online', alerts: 0 },
  { id: 4, name: 'Cam 04 - Drone PTZ View', type: 'image', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop', status: 'Offline', alerts: 0 },
];

export default function Cameras() {
  const [activeCam, setActiveCam] = useState(cameras[0]);
  const [nightVision, setNightVision] = useState(false);

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8 h-full flex flex-col"
    >
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <CameraIcon className="text-indigo-600 h-8 w-8" />
            Live Surveillance
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Monitor your farm zones in real-time</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Main View */}
        <div className="flex-1 bg-black rounded-3xl overflow-hidden relative shadow-2xl flex flex-col border border-gray-800">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              REC
            </span>
            <span className="bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
              {activeCam.name}
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={() => setNightVision(!nightVision)}
              className="bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              title="Toggle Night Vision"
            >
              {nightVision ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-300" />}
            </button>
          </div>

          <div className="flex-1 relative overflow-hidden group">
            {activeCam.status === 'Offline' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <Video size={48} className="mb-4 opacity-50" />
                <p>Camera is currently offline.</p>
              </div>
            ) : (
              <motion.img 
                key={activeCam.url} // Forces remount on change to restart animation
                src={activeCam.url} 
                alt={activeCam.name} 
                initial={{ scale: 1.0 }}
                animate={{ scale: 1.1, x: [-10, 10, -10], y: [-5, 5, -5] }}
                transition={{ 
                  scale: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
                  x: { duration: 30, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
                  y: { duration: 25, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
                }}
                className={`w-[110%] h-[110%] -left-[5%] -top-[5%] absolute object-cover transition-all duration-700 ${nightVision ? 'grayscale sepia-[.3] hue-rotate-[70deg] contrast-150 brightness-75' : ''}`} 
              />
            )}
            
            {/* PTZ Controls overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-2xl">
              <button className="p-2 text-white hover:bg-white/20 rounded-xl"><ZoomIn size={20} /></button>
              <button className="p-2 text-white hover:bg-white/20 rounded-xl"><Eye size={20} /></button>
            </div>
          </div>
        </div>

        {/* Sidebar / Grid */}
        <div className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          {cameras.map(cam => (
            <div 
              key={cam.id}
              onClick={() => setActiveCam(cam)}
              className={`relative h-40 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${activeCam.id === cam.id ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]' : 'border-transparent hover:border-white/50 shadow-md'}`}
            >
              <img src={cam.url} className={`w-full h-full object-cover ${cam.status === 'Offline' ? 'grayscale opacity-50' : 'opacity-80'}`} alt={cam.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <h4 className="text-white font-bold text-sm truncate">{cam.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs font-bold ${cam.status === 'Offline' ? 'text-gray-400' : 'text-green-400'}`}>
                    {cam.status}
                  </span>
                  {cam.alerts > 0 && (
                    <span className="flex items-center gap-1 text-xs text-red-400 font-bold bg-red-400/20 px-2 py-0.5 rounded-full">
                      <AlertTriangle size={12} /> {cam.alerts} Motion
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}
