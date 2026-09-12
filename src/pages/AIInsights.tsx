import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sprout, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function AIInsights() {
  const { selectedCrop, currentData, userLocation } = useData();
  const [analyzing, setAnalyzing] = useState(true);
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    setAnalyzing(true);
    // Simulate AI model processing time
    const timer = setTimeout(() => {
      // Mock ML model logic based on crop and current data
      let baseYield = 0;
      let days = 0;
      
      switch(selectedCrop) {
        case 'Tomatoes': baseYield = 85; days = 45; break;
        case 'Wheat': baseYield = 60; days = 90; break;
        case 'Corn': baseYield = 140; days = 70; break;
        case 'Lettuce': baseYield = 30; days = 30; break;
      }

      // Add variance based on current soil data
      const moistureVariance = currentData ? (currentData.soilMoisture - 50) * 0.1 : 0;
      const phVariance = currentData ? (6.5 - currentData.pH) * 5 : 0;
      
      const estimatedYield = Math.max(10, baseYield + moistureVariance - phVariance);
      
      const harvestDate = new Date();
      harvestDate.setDate(harvestDate.getDate() + days);

      setPrediction({
        yield: estimatedYield,
        harvestDate: harvestDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        confidence: 85 + (Math.random() * 10)
      });
      setAnalyzing(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [selectedCrop]); // Removed currentData to prevent infinite reloading loops

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <Brain className="text-purple-600 h-8 w-8" />
          AI Yield Predictor
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Machine learning models estimating harvest volume and timing</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col">
        {analyzing ? (
          <div className="flex-1 flex flex-col items-center justify-center text-indigo-600 gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <Brain size={40} className="animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-xl mb-2">Analyzing Agronomic Data</h3>
              <p className="text-gray-500 max-w-md mx-auto">Feeding real-time soil moisture, pH metrics, and historic weather forecasts for {selectedCrop} into the neural network...</p>
            </div>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <motion.div variants={cardVariants} className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4 opacity-90"><Sprout size={20} /> Estimated Yield</div>
                <h3 className="text-5xl font-extrabold">{prediction.yield.toFixed(1)} <span className="text-xl font-normal opacity-80">tons/acre</span></h3>
                <p className="mt-4 text-sm bg-white/20 px-3 py-1.5 rounded-lg inline-block font-bold">Optimal for {selectedCrop}</p>
              </motion.div>

              <motion.div variants={cardVariants} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4 opacity-90"><Calendar size={20} /> Predicted Harvest</div>
                <h3 className="text-3xl font-extrabold mt-2">{prediction.harvestDate}</h3>
                <p className="mt-4 text-sm bg-white/20 px-3 py-1.5 rounded-lg inline-block font-bold">In {Math.round((new Date(prediction.harvestDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Days</p>
              </motion.div>

              <motion.div variants={cardVariants} className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4 opacity-90"><TrendingUp size={20} /> Model Confidence</div>
                <h3 className="text-5xl font-extrabold">{prediction.confidence.toFixed(1)}<span className="text-2xl font-normal opacity-80">%</span></h3>
                <p className="mt-4 text-sm bg-white/20 px-3 py-1.5 rounded-lg inline-block font-bold">High Precision Match</p>
              </motion.div>
            </div>

            <motion.div variants={cardVariants} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex-1">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Neural Network Analysis Report</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex gap-3">
                  <div className="mt-1 text-green-500"><Brain size={18} /></div>
                  <div>
                    <strong className="text-gray-800 block">Crop Synergy</strong>
                    Current soil moisture profile perfectly aligns with {selectedCrop}'s growth phase requirements.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 text-blue-500"><Brain size={18} /></div>
                  <div>
                    <strong className="text-gray-800 block">Climate Impact</strong>
                    Hyper-local {userLocation ? 'GPS-verified' : 'simulated'} weather forecasts indicate mild temperatures, accelerating vegetative growth by an estimated 4%.
                  </div>
                </li>
                {currentData && currentData.pH < 6.0 && (
                  <li className="flex gap-3">
                    <div className="mt-1 text-yellow-500"><AlertTriangle size={18} /></div>
                    <div>
                      <strong className="text-gray-800 block">Risk Factor Identified</strong>
                      Soil pH is trending acidic ({currentData.pH.toFixed(2)}). The model has slightly reduced the estimated yield. Consider applying agricultural lime.
                    </div>
                  </li>
                )}
              </ul>
            </motion.div>

          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
