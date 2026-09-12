import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Droplet, ThermometerSun, Thermometer, Wind, Beaker, AlertTriangle, Sun, CloudRain } from 'lucide-react';

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
  const { currentData, moistureThreshold, dbConnected } = useData();

  if (!currentData) return <div className="p-8">Loading...</div>;

  const isAlert = currentData.soilMoisture < moistureThreshold;
  const isTempAlert = currentData.airTemp > 35;
  const isHumidityAlert = currentData.humidity < 30;
  const isPhLowAlert = currentData.pH < 5.5;
  const isPhHighAlert = currentData.pH > 7.5;
  const isSolarAlert = currentData.solarRadiation > 1000;

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8"
    >
      <motion.div variants={itemVariants} className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Farm Overview</h1>
          <p className="text-gray-500 mt-1">Real-time LoRaWAN sensor data</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${dbConnected ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dbConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${dbConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          </span>
          {dbConnected ? 'Supabase Live Sync' : 'Local Simulation'}
        </div>
      </motion.div>

      <AnimatePresence>
        {(isAlert || isTempAlert || isHumidityAlert || isPhLowAlert || isPhHighAlert || isSolarAlert) && (
          <motion.div 
            initial={{ opacity: 0, height: 0, mb: 0 }}
            animate={{ opacity: 1, height: 'auto', mb: 24 }}
            exit={{ opacity: 0, height: 0, mb: 0 }}
            className="overflow-hidden space-y-4"
          >
            {isAlert && (
              <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl shadow-xl shadow-red-500/20 p-6 flex items-center text-white">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <AlertTriangle className="mr-4 h-8 w-8" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold">Critical Alert: Low Soil Moisture</h3>
                  <p className="opacity-90">Current moisture is {currentData.soilMoisture.toFixed(1)}%, which is below the {moistureThreshold}% threshold.</p>
                </div>
              </div>
            )}
            {isTempAlert && (
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-xl shadow-orange-500/20 p-6 flex items-center text-white">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <ThermometerSun className="mr-4 h-8 w-8" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold">Warning: High Temperature</h3>
                  <p className="opacity-90">Air temperature has exceeded 35°C ({currentData.airTemp.toFixed(1)}°C). Risk of crop heat stress.</p>
                </div>
              </div>
            )}
            {isHumidityAlert && (
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl shadow-xl shadow-yellow-500/20 p-6 flex items-center text-white">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Wind className="mr-4 h-8 w-8" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold">Warning: Low Humidity</h3>
                  <p className="opacity-90">Relative humidity has dropped to {currentData.humidity.toFixed(1)}%.</p>
                </div>
              </div>
            )}
            {(isPhLowAlert || isPhHighAlert) && (
              <div className="bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-2xl shadow-xl shadow-purple-500/20 p-6 flex items-center text-white">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Beaker className="mr-4 h-8 w-8" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold">Alert: Abnormal Soil pH</h3>
                  <p className="opacity-90">Current pH is {currentData.pH.toFixed(2)}. Optimal range is 5.5 - 7.5. Adjust fertilization.</p>
                </div>
              </div>
            )}
            {isSolarAlert && (
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-xl shadow-amber-500/20 p-6 flex items-center text-white">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Sun className="mr-4 h-8 w-8" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold">Warning: Extreme UV/Solar Radiation</h3>
                  <p className="opacity-90">Solar radiation is very high ({currentData.solarRadiation.toFixed(0)} W/m²). Ensure crops have adequate hydration.</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Soil Moisture" value={`${currentData.soilMoisture.toFixed(1)}%`} icon={<Droplet size={32} />} color="from-blue-400 to-blue-600" alert={isAlert} />
        <StatCard title="Soil Temp" value={`${currentData.soilTemp.toFixed(1)}°C`} icon={<Thermometer size={32} />} color="from-orange-400 to-orange-600" />
        <StatCard title="Air Temp" value={`${currentData.airTemp.toFixed(1)}°C`} icon={<ThermometerSun size={32} />} color="from-red-400 to-red-600" alert={isTempAlert} />
        <StatCard title="Humidity" value={`${currentData.humidity.toFixed(1)}%`} icon={<Wind size={32} />} color="from-cyan-400 to-cyan-600" alert={isHumidityAlert} />
        <StatCard title="Soil pH" value={`${currentData.pH.toFixed(2)}`} icon={<Beaker size={32} />} color="from-purple-400 to-purple-600" alert={isPhLowAlert || isPhHighAlert} />
        <StatCard title="Solar Rad" value={`${currentData.solarRadiation.toFixed(0)} W/m²`} icon={<Sun size={32} />} color="from-yellow-400 to-amber-500" alert={isSolarAlert} />
        <StatCard title="Leaf Wetness" value={`${currentData.leafWetness.toFixed(0)}%`} icon={<CloudRain size={32} />} color="from-indigo-400 to-indigo-600" />
        
        
        {/* Placeholder for camera or drone view */}
        <motion.div variants={itemVariants} className="bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl group lg:col-span-2">
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

        {/* Weather Forecast Widget */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-xl shadow-cyan-200/50 p-6 text-white lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg opacity-90">Forecast</h3>
              <p className="text-3xl font-extrabold mt-1">24°C</p>
              <p className="text-sm opacity-80 mt-1">Partly Cloudy</p>
            </div>
            <CloudRain size={40} className="text-white opacity-90" />
          </div>
          <div className="mt-6 flex justify-between items-end border-t border-white/20 pt-4">
            <div className="text-center">
              <p className="text-xs opacity-70">Tomorrow</p>
              <Sun size={20} className="mx-auto my-1" />
              <p className="font-bold text-sm">26°</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-70">Wed</p>
              <Sun size={20} className="mx-auto my-1" />
              <p className="font-bold text-sm">28°</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-70">Thu</p>
              <CloudRain size={20} className="mx-auto my-1" />
              <p className="font-bold text-sm">22°</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-70">Fri</p>
              <Wind size={20} className="mx-auto my-1" />
              <p className="font-bold text-sm">23°</p>
            </div>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}

function StatCard({ title, value, icon, color, alert }: { title: string, value: string, icon: React.ReactNode, color: string, alert?: boolean }) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.03, y: -5 }}
      className={`group relative overflow-hidden bg-white/80 backdrop-blur-2xl rounded-3xl p-6 border transition-all duration-300 ${alert ? 'border-red-400 shadow-red-500/20 shadow-2xl' : 'border-white/50 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-indigo-500/10'}`}
    >
      {alert && (
        <motion.div 
          animate={{ opacity: [0, 0.2, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-red-500 pointer-events-none"
        />
      )}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl group-hover:opacity-30 transition-opacity duration-500`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
          {icon}
        </div>
        {alert && (
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>
      <h3 className="text-gray-500 font-medium text-sm tracking-wide relative z-10">{title}</h3>
      <p className={`text-3xl font-extrabold mt-1 relative z-10 ${alert ? 'text-red-500' : 'text-gray-900'}`}>{value}</p>
    </motion.div>
  );
}
