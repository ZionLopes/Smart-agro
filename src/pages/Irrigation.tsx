import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Power, Droplet, Sparkles, Settings2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
};

export default function Irrigation() {
  const { valveOpen, setValveOpen, irrigationMode, setIrrigationMode } = useData();

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8 h-full flex flex-col items-center justify-center"
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Actuation Control</h1>
        <p className="text-gray-500 mt-2 text-lg">Send downlink commands to the LoRaWAN Node</p>
      </div>

      <div className="flex bg-white/70 backdrop-blur-xl p-1 rounded-2xl shadow-lg border border-white/50 mb-12 relative overflow-hidden">
        <button 
          onClick={() => setIrrigationMode('manual')}
          className={`relative z-10 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-colors ${irrigationMode === 'manual' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Settings2 size={20} />
          <span>Manual Mode</span>
        </button>
        <button 
          onClick={() => setIrrigationMode('auto')}
          className={`relative z-10 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-colors ${irrigationMode === 'auto' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Sparkles size={20} />
          <span>AI Auto Mode</span>
        </button>
        {/* Background slide indicator */}
        <div 
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl transition-all duration-300 z-0 ${irrigationMode === 'auto' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
        ></div>
      </div>

      <div className="relative">
        {/* Animated rings when valve is open */}
        {valveOpen && (
          <>
            <motion.div 
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-blue-400 rounded-full"
            />
            <motion.div 
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              className="absolute inset-0 bg-blue-300 rounded-full"
            />
          </>
        )}

        <motion.button 
          whileHover={irrigationMode === 'manual' ? { scale: 1.05 } : {}}
          whileTap={irrigationMode === 'manual' ? { scale: 0.95 } : {}}
          onClick={() => {
            if (irrigationMode === 'manual') setValveOpen(!valveOpen);
          }}
          disabled={irrigationMode === 'auto'}
          className={`relative z-10 flex flex-col items-center justify-center w-64 h-64 rounded-full text-white font-bold text-2xl transition-all duration-500 shadow-2xl ${
            valveOpen 
              ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/50' 
              : 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-gray-500/50'
          } ${irrigationMode === 'auto' ? 'cursor-not-allowed opacity-90' : ''}`}
        >
          <Power className="mb-4 h-16 w-16" />
          {valveOpen ? 'VALVE OPEN' : 'VALVE CLOSED'}
        </motion.button>
      </div>

      <div className="mt-16 flex items-center space-x-3 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/50">
        <div className={`p-3 rounded-full ${valveOpen ? 'bg-blue-100/50 text-blue-500' : 'bg-gray-100/50 text-gray-400'}`}>
           <Droplet className={valveOpen ? 'animate-bounce' : ''} />
        </div>
        <div>
          <h4 className="font-bold text-gray-800">Water Flow Status</h4>
          <p className="text-gray-500">{valveOpen ? 'Irrigation is currently running.' : 'Irrigation is idle.'}</p>
        </div>
      </div>
    </motion.div>
  );
}
