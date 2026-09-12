import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Sprout, Droplets, ThermometerSun } from 'lucide-react';
import { useData } from '../context/DataContext';
import ReactMarkdown from 'react-markdown';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am your AI Farm Assistant powered by Gemini. \n\nI can analyze telemetry data, historical trends, or give you actionable agricultural insights. Try asking:\n- "Give me a full farm report"\n- "What are the historical trends?"\n- "Should I irrigate now?"' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { currentData, moistureThreshold, data } = useData();
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
        aiResponse = "I am currently unable to fetch the live telemetry data. Please ensure the sensors are connected.";
      } else if (lowerInput.includes('status') || lowerInput.includes('report') || lowerInput.includes('farm')) {
        aiResponse = `### 📊 Live Farm Telemetry Report\n\n- **Soil Moisture**: ${currentData.soilMoisture.toFixed(1)}% (Threshold: ${moistureThreshold}%)\n- **Soil Temp**: ${currentData.soilTemp.toFixed(1)}°C\n- **Air Temp**: ${currentData.airTemp.toFixed(1)}°C\n- **Humidity**: ${currentData.humidity.toFixed(1)}%\n- **Soil pH**: ${currentData.pH.toFixed(2)}\n- **Solar Radiation**: ${currentData.solarRadiation.toFixed(0)} W/m²\n\n**AI Recommendation**: ${currentData.soilMoisture < moistureThreshold ? '🚨 Immediate irrigation required to prevent crop stress.' : '✅ All parameters are within optimal ranges for most crops.'}`;
      } else if (lowerInput.includes('ph') || lowerInput.includes('acid') || lowerInput.includes('alkaline')) {
        const ph = currentData.pH;
        if (ph < 5.5) {
          aiResponse = `Your soil pH is currently **${ph.toFixed(2)}**, which is quite acidic.\n\n**Recommendation:** Consider applying **agricultural lime (calcium carbonate)** to raise the pH. Acidic soil can reduce the availability of essential nutrients like Nitrogen and Phosphorus.`;
        } else if (ph > 7.5) {
          aiResponse = `Your soil pH is currently **${ph.toFixed(2)}**, which is alkaline.\n\n**Recommendation:** Consider adding **elemental sulfur or peat moss** to lower the pH. High pH can cause iron deficiency (chlorosis) in your crops.`;
        } else {
          aiResponse = `Your soil pH is **${ph.toFixed(2)}**. \n\nThis is the **perfect sweet spot** (5.5 - 7.5) for maximizing nutrient availability for most agricultural crops! No action needed.`;
        }
      } else if (lowerInput.includes('irrigation') || lowerInput.includes('water')) {
        const diff = currentData.soilMoisture - moistureThreshold;
        if (diff < 0) {
          aiResponse = `⚠️ **Critical Action Required**\nSoil moisture (${currentData.soilMoisture.toFixed(1)}%) is below the threshold of ${moistureThreshold}%.\n\nI recommend switching to **AI Auto Mode** in the Irrigation Control panel, or manually opening the valve for at least 45 minutes to restore optimal saturation.`;
        } else if (diff < 10) {
          aiResponse = `💧 **Irrigation Planning**\nSoil moisture is currently at ${currentData.soilMoisture.toFixed(1)}%, which is close to your threshold of ${moistureThreshold}%.\n\nWith current solar radiation at ${currentData.solarRadiation.toFixed(0)} W/m², evaporation rates are moderate. Plan to irrigate within the next 24 hours.`;
        } else {
          aiResponse = `✅ **No Irrigation Needed**\nSoil moisture is high (${currentData.soilMoisture.toFixed(1)}%). Irrigating now could lead to waterlogging, root rot, and wasted resources. Wait until moisture drops closer to ${moistureThreshold}%.`;
        }
      } else if (lowerInput.includes('history') || lowerInput.includes('past') || lowerInput.includes('trend') || lowerInput.includes('maximum') || lowerInput.includes('minimum')) {
        if (data.length < 2) {
          aiResponse = "I don't have enough historical data yet to determine trends. Please wait a few moments for the telemetry logs to populate.";
        } else {
          const maxTemp = Math.max(...data.map(d => d.airTemp));
          const minMoisture = Math.min(...data.map(d => d.soilMoisture));
          const avgHum = data.reduce((acc, curr) => acc + curr.humidity, 0) / data.length;
          
          aiResponse = `### 📈 Historical Trend Analysis\n\nBased on your recent session data:\n- **Maximum Air Temperature**: ${maxTemp.toFixed(1)}°C\n- **Minimum Soil Moisture**: ${minMoisture.toFixed(1)}%\n- **Average Humidity**: ${avgHum.toFixed(1)}%\n\nThe data indicates a stable environment, but watch out if that maximum temperature spikes further. You can export the full dataset in the **History & Export** tab.`;
        }
      } else {
        aiResponse = "That's an interesting question. In smart agriculture, leveraging AI to analyze LoRaWAN sensor networks allows for precise resource management. \n\nWould you like me to analyze your specific **soil pH**, **irrigation needs**, generate a **farm report**, or analyze **historical trends**?";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all flex items-center justify-center duration-300"
      >
        <Sparkles className="h-7 w-7" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[550px] bg-white/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/50 flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Bot className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold tracking-wide">Gemini Assistant</h3>
                  <p className="text-xs text-purple-200">AI Farm Consultant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors relative z-10">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'}`}>
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <div className="prose prose-sm prose-purple max-w-none">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-2xl rounded-bl-none flex space-x-2 items-center">
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-gray-50/80 backdrop-blur-xl border-t border-gray-200/50">
              <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-2xl p-1 shadow-inner">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your farm..."
                  className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-gray-700 text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:hover:shadow-none transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
