import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { History as HistoryIcon, FileSpreadsheet } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export default function History() {
  const { data } = useData();

  const handleDownloadCSV = () => {
    if (data.length === 0) return;

    // Headers
    const headers = ['Timestamp', 'Soil Moisture (%)', 'Soil Temp (°C)', 'Air Temp (°C)', 'Humidity (%)', 'pH Level', 'Wind Speed (km/h)', 'Solar Radiation (W/m²)', 'Leaf Wetness (%)'];
    
    // Rows
    const rows = data.map(d => [
      d.timestamp.toISOString(),
      d.soilMoisture.toFixed(2),
      d.soilTemp.toFixed(2),
      d.airTemp.toFixed(2),
      d.humidity.toFixed(2),
      d.pH.toFixed(2),
      d.windSpeed.toFixed(2),
      d.solarRadiation.toFixed(2),
      d.leafWetness.toFixed(2)
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `farm_telemetry_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8 h-full flex flex-col"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <HistoryIcon className="text-blue-600 h-8 w-8" />
            Historical Data
          </h1>
          <p className="text-gray-500 mt-2 text-lg">View and export past telemetry logs</p>
        </div>
        
        <button 
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
          <FileSpreadsheet className="h-5 w-5" />
          Download CSV
        </button>
      </div>

      <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 sticky top-0 backdrop-blur-md text-xs uppercase font-bold text-gray-700 z-10 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Soil Moisture</th>
                <th className="px-6 py-4">Soil Temp</th>
                <th className="px-6 py-4">Air Temp</th>
                <th className="px-6 py-4">Humidity</th>
                <th className="px-6 py-4">pH</th>
                <th className="px-6 py-4">Wind</th>
                <th className="px-6 py-4">Solar Rad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.slice().reverse().map((row, index) => (
                <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {row.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">{row.soilMoisture.toFixed(1)}%</td>
                  <td className="px-6 py-4">{row.soilTemp.toFixed(1)}°C</td>
                  <td className="px-6 py-4">{row.airTemp.toFixed(1)}°C</td>
                  <td className="px-6 py-4">{row.humidity.toFixed(1)}%</td>
                  <td className="px-6 py-4">{row.pH.toFixed(2)}</td>
                  <td className="px-6 py-4">{row.windSpeed.toFixed(1)} km/h</td>
                  <td className="px-6 py-4">{row.solarRadiation.toFixed(0)} W/m²</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No historical data available yet. Waiting for telemetry...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
