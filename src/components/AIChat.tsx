import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Sprout, Droplets, ThermometerSun } from 'lucide-react';
import { useData } from '../context/DataContext';
import ReactMarkdown from 'react-markdown';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am your **AI Farm Chat** Assistant. \n\nI can analyze your live sensor data, review historical trends, and provide expert agricultural advice tailored to your specific crops. How can I help you optimize your yield today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { currentData, moistureThreshold, data, selectedCrop, userLocation } = useData();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      
      const lowerInput = userMessage.toLowerCase();
      if (!currentData) {
        aiResponse = "I am currently unable to fetch the live telemetry data. Please ensure your LoRaWAN sensors are connected.";
      } else if (lowerInput.includes('status') || lowerInput.includes('report') || lowerInput.includes('farm') || lowerInput.includes('summary')) {
        aiResponse = `### 🌾 Live Farm Report for ${selectedCrop}\n\n` +
          `**Current Status:**\n` +
          `- **Soil Moisture**: ${currentData.soilMoisture.toFixed(1)}% (Threshold for ${selectedCrop} is ${moistureThreshold}%)\n` +
          `- **Air Temperature**: ${currentData.airTemp.toFixed(1)}°C\n` +
          `- **Soil pH**: ${currentData.pH.toFixed(2)}\n` +
          `- **Leaf Wetness**: ${currentData.leafWetness.toFixed(0)}%\n\n` +
          `**AI Assessment:**\n` +
          `${currentData.soilMoisture < moistureThreshold ? `🚨 **Critical Action Required**: Your ${selectedCrop} crop is currently below the optimal moisture threshold. Immediate irrigation is highly recommended to prevent yield loss.` : `✅ **Optimal**: Moisture levels are currently sufficient for ${selectedCrop}. No immediate irrigation is required.`} ` +
          `${currentData.pH < 6.0 ? "Additionally, your soil pH is slightly acidic, consider applying agricultural lime." : "Soil pH is within healthy ranges."}`;
      } else if (lowerInput.includes('history') || lowerInput.includes('trend') || lowerInput.includes('past')) {
        
        if (data.length < 5) {
            aiResponse = "I need more data points to establish a reliable historical trend. Please wait a few moments as data accumulates.";
        } else {
            const maxTemp = Math.max(...data.map(d => d.airTemp));
            const minMoist = Math.min(...data.map(d => d.soilMoisture));
            const avgPh = data.reduce((acc, curr) => acc + curr.pH, 0) / data.length;
            
            aiResponse = `### 📊 Historical Trend Analysis\n\nBased on the last ${data.length} telemetry readings for your ${selectedCrop} crop:\n\n` +
            `- **Peak Air Temp**: ${maxTemp.toFixed(1)}°C\n` +
            `- **Lowest Moisture Dip**: ${minMoist.toFixed(1)}%\n` +
            `- **Average Soil pH**: ${avgPh.toFixed(2)}\n\n` +
            `**AI Insight**: Over the recorded period, your soil pH has remained relatively stable at ${avgPh.toFixed(2)}. ` +
            `${minMoist < moistureThreshold ? `However, soil moisture dipped dangerously low (${minMoist.toFixed(1)}%) compared to the ${moistureThreshold}% threshold required for ${selectedCrop}. Ensure your automated irrigation triggers are functioning correctly.` : "Your moisture retention has been excellent, staying above critical thresholds!"}`;
        }
      } else if (lowerInput.includes('irrigate') || lowerInput.includes('water')) {
         if (currentData.soilMoisture < moistureThreshold) {
            aiResponse = `**Yes, you should irrigate immediately.**\n\nYour current soil moisture is **${currentData.soilMoisture.toFixed(1)}%**, which is below the ${moistureThreshold}% target for ${selectedCrop}. Leaving the crop in this state will cause drought stress.`;
         } else {
            aiResponse = `**No, irrigation is not currently required.**\n\nYour current soil moisture is **${currentData.soilMoisture.toFixed(1)}%**, which safely exceeds the ${moistureThreshold}% target for ${selectedCrop}. Overwatering could lead to root rot or fungal diseases.`;
         }
      } else if (lowerInput.includes('location') || lowerInput.includes('weather') || lowerInput.includes('gps')) {
         if (userLocation) {
             aiResponse = `Your farm is currently registered at GPS coordinates: **${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}**.\n\nI am actively using this location to pull hyper-local forecasting data from Open-Meteo to optimize your ${selectedCrop} irrigation schedules.`;
         } else {
             aiResponse = "I do not currently have access to your farm's GPS location. Please allow location services in your browser so I can fetch local weather patterns.";
         }
      } else {
        aiResponse = `As your AI Farm Chat Assistant, I specialize in analyzing your LoRaWAN telemetry and providing **${selectedCrop}**-specific advice.\n\nCould you clarify? Try asking:\n- "Give me a full farm report"\n- "Analyze historical trends"\n- "Should I water the ${selectedCrop}?"`;
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-indigo-500/50 z-50 flex items-center justify-center gap-2 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot size={28} className="group-hover:animate-pulse" />
        <span className="font-bold pr-2 hidden md:block">Farm Chat</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">AI Farm Chat</h3>
                  <p className="text-xs text-indigo-100 flex items-center gap-1">
                    <Sparkles size={10} /> Powered by Gemini
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'ai' ? (
                      <div className="prose prose-sm prose-p:leading-snug prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0 max-w-none text-gray-800">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex gap-2">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Chips */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 bg-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
                <button onClick={() => { setInput("Give me a full farm report"); }} className="shrink-0 bg-white border border-indigo-100 text-indigo-700 text-xs px-3 py-1.5 rounded-full hover:bg-indigo-50 flex items-center gap-1 transition-colors"><Sprout size={12}/> Farm Report</button>
                <button onClick={() => { setInput("Should I irrigate now?"); }} className="shrink-0 bg-white border border-indigo-100 text-indigo-700 text-xs px-3 py-1.5 rounded-full hover:bg-indigo-50 flex items-center gap-1 transition-colors"><Droplets size={12}/> Irrigate?</button>
                <button onClick={() => { setInput("What are the historical trends?"); }} className="shrink-0 bg-white border border-indigo-100 text-indigo-700 text-xs px-3 py-1.5 rounded-full hover:bg-indigo-50 flex items-center gap-1 transition-colors"><ThermometerSun size={12}/> Trends</button>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Farm Chat..."
                  className="flex-1 bg-transparent border-none focus:outline-none px-2 text-sm text-gray-800 placeholder-gray-400"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`p-2 rounded-xl transition-colors ${input.trim() ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-200 text-gray-400'}`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
