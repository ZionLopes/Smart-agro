import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LineChart, Settings, Droplet, Menu, Brain } from 'lucide-react';
import { useState } from 'react';

// Pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import Irrigation from './pages/Irrigation';
import AIInsights from './pages/AIInsights';

function Sidebar() {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/analytics', label: 'Analytics', icon: LineChart },
    { path: '/irrigation', label: 'Irrigation Control', icon: Droplet },
    { path: '/ai-insights', label: 'AI Insights', icon: Brain },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white hidden md:flex flex-col shadow-2xl z-20 sticky top-0">
      <div className="p-6 flex items-center justify-center border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
            <Droplet size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
            SmartAgri
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/20 translate-x-2' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-gray-700">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <p className="text-xs text-gray-400 mb-1">LoRaWAN Gateway</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <p className="text-sm font-semibold text-green-400">Online & Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/irrigation" element={<Irrigation />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 overflow-hidden font-sans relative">
        {/* Animated Background Graphics */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-green-400/20 blur-[120px] animate-pulse"></div>
          <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-400/20 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[20%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-400/10 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <Sidebar />
        
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 flex items-center justify-between px-4 z-30 shadow-lg">
           <div className="flex items-center space-x-2">
             <Droplet className="text-green-500" />
             <h1 className="text-white font-bold">SmartAgri</h1>
           </div>
           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
             <Menu />
           </button>
        </div>

        <main className="flex-1 h-screen overflow-y-auto bg-transparent pt-16 md:pt-0 z-10 relative">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}
