import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LineChart, Settings, Droplet, Menu, Brain, History as HistoryIcon, Map as MapIcon, Camera } from 'lucide-react';
import { useState } from 'react';
import { DataProvider } from './context/DataContext';

// Pages
import Dashboard from './pages/Dashboard';
import FarmMap from './pages/FarmMap';
import Cameras from './pages/Cameras';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import Irrigation from './pages/Irrigation';
import AIInsights from './pages/AIInsights';
import Login from './pages/Login';
import History from './pages/History';
import AIChat from './components/AIChat';
import { supabase } from './lib/supabase';

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/cameras', label: 'Live Surveillance', icon: Camera },
    { path: '/map', label: 'Farm Map (GIS)', icon: MapIcon },
    { path: '/history', label: 'History & Export', icon: HistoryIcon },
    { path: '/analytics', label: 'Analytics', icon: LineChart },
    { path: '/irrigation', label: 'Irrigation Control', icon: Droplet },
    { path: '/ai-insights', label: 'AI Insights', icon: Brain },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-900 shadow-2xl relative z-20 h-screen">
      <div className="flex items-center justify-center h-20 border-b border-gray-800 space-x-3">
        <div className="bg-green-500 p-2 rounded-xl">
          <Droplet className="text-white h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-wider">SmartAgri</h1>
      </div>
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-400 border border-green-500/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span className="font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-semibold transition-colors"
        >
          Logout
        </button>
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
        <Route path="/cameras" element={<Cameras />} />
        <Route path="/map" element={<FarmMap />} />
        <Route path="/history" element={<History />} />
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 overflow-hidden font-sans relative">
        {/* Animated Background Graphics */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-green-400/20 blur-[120px] animate-pulse"></div>
          <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-400/20 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[20%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-400/10 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <Sidebar onLogout={handleLogout} />
        
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
        
        <AIChat />
      </div>
    </Router>
  );
}
