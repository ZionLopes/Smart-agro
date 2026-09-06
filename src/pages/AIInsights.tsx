import { motion } from 'framer-motion';
import { Brain, Cpu, Search, CloudRain, Sprout, ShieldAlert } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } }
};

export default function AIInsights() {
  const insights = [
    {
      title: "Smart Irrigation & Water Management",
      description: "AI-driven algorithms process soil moisture, weather forecasts, and historical crop data to optimize watering schedules, saving resources while maximizing yield.",
      image: "https://d3twecw9qvot3u.cloudfront.net/wp-content/uploads/2021/12/smart-irrigation-in-agriculture-how-iot-takes-agtech-to-the-next-level_optimized_optimized-770x550.jpeg",
      icon: <CloudRain className="text-blue-500" size={24} />
    },
    {
      title: "Weather & Climate Predictive Analytics",
      description: "Machine learning models analyze thousands of data points to predict weather events, helping farmers prepare for frosts, droughts, or heavy rainfall to protect their crops.",
      image: "https://d3twecw9qvot3u.cloudfront.net/wp-content/uploads/2020/02/weather-monitoring-technologies-to-save-crops-from-mother-nature_optimized_optimized-770x550.jpg",
      icon: <Brain className="text-purple-500" size={24} />
    },
    {
      title: "Vertical & Precision Farming",
      description: "Computer vision and robotics automate planting, harvesting, and crop monitoring in highly controlled vertical environments, ensuring year-round production.",
      image: "https://d3twecw9qvot3u.cloudfront.net/wp-content/uploads/2021/12/vertical-agriculture-roadmap-from-concept-to-profit_optimized_optimized-770x550.jpeg",
      icon: <Sprout className="text-green-500" size={24} />
    },
    {
      title: "Disease & Pest Detection",
      description: "Deep learning models analyze drone and satellite imagery to identify early signs of plant disease or pest infestations, allowing for targeted interventions.",
      image: "https://d3twecw9qvot3u.cloudfront.net/wp-content/uploads/2022/02/AI-in-Agriculture-A-2026-Guide-for-Agricultural-Executives-body-image-2-300x134.jpg",
      icon: <ShieldAlert className="text-red-500" size={24} />
    }
  ];

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="p-8 max-w-7xl mx-auto"
    >
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">AI in Agriculture</h1>
        <p className="text-gray-600 mt-2 text-lg">Next-generation insights powered by Artificial Intelligence (Data sourced from Intellias)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {insights.map((insight, idx) => (
          <motion.div 
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/60 border border-gray-100 flex flex-col cursor-pointer"
          >
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img 
                src={insight.image} 
                alt={insight.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="absolute -top-6 right-6 bg-white p-3 rounded-2xl shadow-lg border border-gray-100 z-20">
                {insight.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3 pr-12">{insight.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {insight.description}
              </p>
              
              <a 
                href="https://intellias.com/artificial-intelligence-in-agriculture/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-6 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-blue-800"
              >
                <Search size={16} className="mr-2" />
                Explore AI Capability ↗
              </a>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div variants={cardVariants} className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-2xl flex items-center justify-between overflow-hidden relative">
        <div className="absolute -right-20 -top-20 opacity-10">
          <Cpu size={250} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-2 text-emerald-400">Intellias Architecture Model</h2>
          <p className="text-gray-300">
            This dashboard uses principles from the 2026 Guide for Agricultural Executives, blending real-time IoT metrics (LoRaWAN) with advanced AI analytics for a sustainable farming ecosystem.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
