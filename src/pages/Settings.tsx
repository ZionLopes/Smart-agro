import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  exit: { opacity: 0, scale: 1.05, transition: { duration: 0.2 } }
};

export default function Settings() {
  const { moistureThreshold, setMoistureThreshold } = useData();

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8 max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Configuration</h1>
        <p className="text-gray-500 mt-1">Configure alerts and node parameters</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-white/50">
        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200/50 pb-4">Alert Thresholds</h3>
        
        <div className="space-y-8">
          <div>
            <label className="flex justify-between text-gray-700 font-medium mb-4">
              <span>Minimum Soil Moisture Threshold</span>
              <span className="text-blue-600 font-bold">{moistureThreshold}%</span>
            </label>
            <input 
              type="range" 
              min="0" max="100" 
              value={moistureThreshold}
              onChange={(e) => setMoistureThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-sm text-gray-500 mt-2">
              If the soil moisture drops below this percentage, a critical alert will be triggered on the dashboard.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-6 mt-12 border-b pb-4">LoRaWAN Network Config</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
             <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 block">Spreading Factor (SF)</label>
             <select className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>SF7 (High speed, short range)</option>
                <option>SF8</option>
                <option>SF9</option>
                <option>SF10</option>
                <option>SF11</option>
                <option>SF12 (Low speed, long range)</option>
             </select>
           </div>
           
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
             <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 block">Adaptive Data Rate (ADR)</label>
             <div className="flex items-center space-x-3 mt-2">
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-green-500 appearance-none cursor-pointer translate-x-6" checked readOnly/>
                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-green-500 cursor-pointer"></label>
                </div>
                <span className="font-medium text-gray-700">Enabled</span>
             </div>
           </div>
        </div>

      </div>
    </motion.div>
  );
}
