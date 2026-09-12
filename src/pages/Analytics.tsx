import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

export default function Analytics() {
  const { data } = useData();
  const [view, setView] = useState<'live' | 'hourly'>('live');

  // Generate stable mock hourly data for the past 24 hours based on current trends
  const hourlyData = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      arr.push({
        time: `${time.getHours()}:00`,
        soilMoisture: 40 + Math.sin(i) * 15 + Math.random() * 5,
        soilTemp: 18 + Math.cos(i) * 5 + Math.random() * 2,
        airTemp: 22 + Math.cos(i) * 8 + Math.random() * 3,
        humidity: 60 - Math.cos(i) * 20 + Math.random() * 5,
        pH: 6.5 + Math.random() * 0.2,
      });
    }
    return arr;
  }, []);

  const chartData = view === 'live' ? data : hourlyData;

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8"
    >
      <motion.div variants={itemVariants} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Data Analytics</h1>
          <p className="text-gray-500 mt-1">Detailed visualization of farm metrics</p>
        </div>
        
        <div className="flex bg-white/70 backdrop-blur-xl p-1 rounded-2xl shadow-sm border border-gray-200">
          <button 
            onClick={() => setView('live')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${view === 'live' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Live Stream
          </button>
          <button 
            onClick={() => setView('hourly')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${view === 'hourly' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
          >
            24h Hourly Data
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard 
          title={`Soil Moisture Trend (${view === 'live' ? 'Live' : 'Hourly'})`} 
          data={chartData} 
          dataKey="soilMoisture" 
          color="#3b82f6" 
          yAxisDomain={[0, 100]} 
          type="area" 
        />
        <ChartCard 
          title={`Temperature Comparison (${view === 'live' ? 'Live' : 'Hourly'})`} 
          data={chartData} 
          lines={[{ key: 'soilTemp', color: '#f97316' }, { key: 'airTemp', color: '#ef4444' }]} 
          yAxisDomain={[0, 50]} 
          type="line" 
        />
        <ChartCard 
          title={`Relative Humidity (${view === 'live' ? 'Live' : 'Hourly'})`} 
          data={chartData} 
          dataKey="humidity" 
          color="#06b6d4" 
          yAxisDomain={[0, 100]} 
          type={view === 'hourly' ? 'bar' : 'area'} 
        />
        <ChartCard 
          title={`Soil pH Variations (${view === 'live' ? 'Live' : 'Hourly'})`} 
          data={chartData} 
          dataKey="pH" 
          color="#a855f7" 
          yAxisDomain={[4, 9]} 
          type="line" 
        />
      </div>
    </motion.div>
  );
}

function ChartCard({ title, data, dataKey, color, lines, yAxisDomain, type }: any) {
  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 p-6 border border-white/50"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} domain={yAxisDomain} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#color-${dataKey})`} />
            </AreaChart>
          ) : type === 'bar' ? (
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} domain={yAxisDomain} />
              <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} domain={yAxisDomain} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {lines ? (
                lines.map((line: any) => (
                  <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                ))
              ) : (
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
