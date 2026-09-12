import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, Bell, Shield, Smartphone, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useData } from '../context/DataContext';

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
  visible: { y: 0, opacity: 1 }
};

export default function Settings() {
  const { selectedCrop, setSelectedCrop, moistureThreshold, setMoistureThreshold, isDarkMode, setIsDarkMode } = useData();
  const [notifications, setNotifications] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const crop = e.target.value;
    setSelectedCrop(crop);
    
    // Auto-adjust threshold based on crop
    if (crop === 'Tomatoes') setMoistureThreshold(60);
    if (crop === 'Wheat') setMoistureThreshold(45);
    if (crop === 'Corn') setMoistureThreshold(55);
    if (crop === 'Lettuce') setMoistureThreshold(70);
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8 max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-indigo-600 h-8 w-8" />
          System Settings
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Configure your autonomous farming parameters</p>
      </div>

      <div className="space-y-6">
        
        {/* Appearance Settings */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <h3 className="font-bold text-xl mb-4 text-gray-800 flex items-center gap-2">
            <Moon className="text-indigo-500" size={20} />
            Appearance
          </h3>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-800">Dark Mode</p>
              <p className="text-sm text-gray-500">Enable dark theme for night-time monitoring</p>
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-14 h-7 rounded-full transition-colors relative ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${isDarkMode ? 'left-8' : 'left-1'}`}></div>
            </button>
          </div>
        </motion.div>

        {/* Agricultural Parameters */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <h3 className="font-bold text-xl mb-4 text-gray-800 border-b border-gray-100 pb-2">Agronomic Baseline</h3>
          
          <div className="mb-6">
            <label className="block font-bold text-gray-700 mb-2">Active Crop Profile</label>
            <select 
              value={selectedCrop} 
              onChange={handleCropChange}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Tomatoes">Tomatoes (High Moisture Demand)</option>
              <option value="Wheat">Wheat (Drought Tolerant)</option>
              <option value="Corn">Corn (Moderate Moisture)</option>
              <option value="Lettuce">Lettuce (Frequent Shallow Watering)</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">Changing the crop profile automatically updates AI watering logic.</p>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-2">Irrigation Threshold: {moistureThreshold}%</label>
            <input 
              type="range" 
              min="0" max="100" 
              value={moistureThreshold} 
              onChange={(e) => setMoistureThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold">
              <span>0% (Dry)</span>
              <span>100% (Saturated)</span>
            </div>
          </div>
        </motion.div>

        {/* System Preferences */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <h3 className="font-bold text-xl mb-4 text-gray-800 border-b border-gray-100 pb-2">System Preferences</h3>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Bell className="text-gray-400" size={20} />
              <div>
                <p className="font-bold text-gray-800">Push Notifications</p>
                <p className="text-sm text-gray-500">Alerts for critical soil moisture drops</p>
              </div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${notifications ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Shield className="text-gray-400" size={20} />
              <div>
                <p className="font-bold text-gray-800">Auto-Update Firmware</p>
                <p className="text-sm text-gray-500">Keep LoRaWAN nodes updated automatically</p>
              </div>
            </div>
            <button 
              onClick={() => setAutoUpdate(!autoUpdate)}
              className={`w-12 h-6 rounded-full transition-colors relative ${autoUpdate ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${autoUpdate ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Save size={20} />
            {saved ? 'Saved!' : 'Save Configuration'}
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}
