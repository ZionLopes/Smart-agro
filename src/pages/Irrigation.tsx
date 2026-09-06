import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Power, Droplet } from 'lucide-react';

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
  const { valveOpen, setValveOpen } = useData();

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8 h-full flex flex-col items-center justify-center"
    >
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Actuation Control</h1>
        <p className="text-gray-500 mt-2 text-lg">Send downlink commands to the LoRaWAN Node</p>
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setValveOpen(!valveOpen)}
          className={`relative z-10 flex flex-col items-center justify-center w-64 h-64 rounded-full text-white font-bold text-2xl transition-all duration-500 shadow-2xl ${
            valveOpen 
              ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/50' 
              : 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-gray-500/50'
          }`}
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
