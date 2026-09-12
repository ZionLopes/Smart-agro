import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Tractor, Battery, Activity, AlertTriangle, Navigation } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export default function EquipmentPage() {
  const { equipment } = useData();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Equipment Telemetry</h1>
        <p className="text-gray-500 mt-1">Live tracking of tractors, harvesters, and drones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {equipment.map(eq => (
          <motion.div key={eq.id} className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${eq.type === 'Drone' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'}`}>
                  <Tractor size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{eq.name}</h3>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{eq.type}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                eq.status === 'Active' ? 'bg-green-100 text-green-700' : 
                eq.status === 'Maintenance' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {eq.status === 'Active' && <Activity size={12} />}
                {eq.status === 'Maintenance' && <AlertTriangle size={12} />}
                {eq.status}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
               <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Battery size={14}/> Fuel / Battery</p>
                 <div className="flex items-end gap-2">
                   <p className="text-2xl font-bold text-gray-800">{eq.fuel}%</p>
                 </div>
                 <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                   <div className={`h-1.5 rounded-full ${eq.fuel > 50 ? 'bg-green-500' : eq.fuel > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${eq.fuel}%` }}></div>
                 </div>
               </div>
               
               <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col justify-center">
                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Navigation size={14}/> Location</p>
                 <p className="text-sm font-mono text-gray-700">{eq.location.lat.toFixed(4)}</p>
                 <p className="text-sm font-mono text-gray-700">{eq.location.lng.toFixed(4)}</p>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
