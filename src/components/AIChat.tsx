import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am your AI Farm Assistant. I can analyze your current telemetry data or give you agricultural insights. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { currentData } = useData();
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
      let aiResponse = "I'm analyzing that for you...";
      
      const lowerInput = userMessage.toLowerCase();
      if (lowerInput.includes('status') || lowerInput.includes('farm') || lowerInput.includes('data')) {
        if (currentData) {
          aiResponse = `Based on current telemetry: Soil moisture is at ${currentData.soilMoisture.toFixed(1)}%. Soil temperature is ${currentData.soilTemp.toFixed(1)}°C. Wind speed is ${currentData.windSpeed.toFixed(1)} km/h. Everything looks optimal, though you might want to turn on irrigation if moisture drops below 40%.`;
        } else {
          aiResponse = "I am currently unable to fetch the live data.";
        }
      } else if (lowerInput.includes('irrigation') || lowerInput.includes('water')) {
        aiResponse = "To optimize irrigation, AI models suggest waiting until soil moisture drops to 35% given the current low solar radiation and humidity levels. This prevents water waste and root rot.";
      } else {
        aiResponse = "That's a great question. According to the latest agricultural AI guidelines, precision monitoring combined with automated actuation can increase yield by up to 30%. Is there a specific metric you'd like me to analyze?";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        <Sparkles className="h-7 w-7" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] h-[500px] bg-white/80 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/50 flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center space-x-2">
                <Bot />
                <h3 className="font-bold">Gemini Farm Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-white shadow-sm border border-gray-100 text-gray-800 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm border border-gray-100 text-gray-800 p-4 rounded-2xl rounded-bl-none flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/50 border-t border-gray-200/50 flex items-center space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your farm..."
                className="flex-1 bg-white/70 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
