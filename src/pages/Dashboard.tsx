import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Droplet, ThermometerSun, Thermometer, Wind, Beaker, AlertTriangle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

export default function Dashboard() {
  const { currentData, moistureThreshold } = useData();

  if (!currentData) return <div className="p-8">Loading...</div>;

  const isAlert = currentData.soilMoisture < moistureThreshold;

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Farm Overview</h1>
        <p className="text-gray-500 mt-1">Real-time node telemetry</p>
      </motion.div>

      <AnimatePresence>
        {isAlert && (
          <motion.div 
            initial={{ opacity: 0, height: 0, mb: 0 }}
            animate={{ opacity: 1, height: 'auto', mb: 24 }}
            exit={{ opacity: 0, height: 0, mb: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl shadow-xl shadow-red-500/20 p-6 flex items-center text-white">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                <AlertTriangle className="mr-4 h-8 w-8" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold">Critical Alert: Low Soil Moisture</h3>
                <p className="opacity-90">Current moisture is {currentData.soilMoisture.toFixed(1)}%, which is below the {moistureThreshold}% threshold.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Soil Moisture" value={`${currentData.soilMoisture.toFixed(1)}%`} icon={<Droplet size={32} />} color="from-blue-400 to-blue-600" alert={isAlert} />
        <StatCard title="Soil Temp" value={`${currentData.soilTemp.toFixed(1)}°C`} icon={<Thermometer size={32} />} color="from-orange-400 to-orange-600" />
        <StatCard title="Air Temp" value={`${currentData.airTemp.toFixed(1)}°C`} icon={<ThermometerSun size={32} />} color="from-red-400 to-red-600" />
        <StatCard title="Humidity" value={`${currentData.humidity.toFixed(1)}%`} icon={<Wind size={32} />} color="from-cyan-400 to-cyan-600" />
        <StatCard title="Soil pH" value={`${currentData.pH.toFixed(2)}`} icon={<Beaker size={32} />} color="from-purple-400 to-purple-600" />
        
        {/* Placeholder for camera or drone view */}
        <motion.div variants={itemVariants} className="bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl group">
           <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop" alt="Farm field" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
           <div className="absolute inset-0 p-6 flex flex-col justify-between">
             <div className="flex justify-between items-center">
               <span className="bg-green-500/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Live Camera</span>
               <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
             </div>
             <div>
               <h3 className="text-white font-bold text-xl">Sector 4</h3>
               <p className="text-gray-300 text-sm">Last motion detected 5m ago</p>
             </div>
           </div>
        </motion.div>
      </div>

    </motion.div>
  );
}

import { AnimatePresence } from 'framer-motion';

function StatCard({ title, value, icon, color, alert }: { title: string, value: string, icon: React.ReactNode, color: string, alert?: boolean }) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.03, y: -5 }}
      className={`relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 p-6 border ${alert ? 'border-red-400' : 'border-white/50'}`}
    >
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl`}></div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
          {icon}
        </div>
        {alert && (
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>
      <div>
        <h3 className="text-gray-500 font-medium">{title}</h3>
        <p className="text-4xl font-extrabold text-gray-800 mt-1">{value}</p>
      </div>
    </motion.div>
  );
}
