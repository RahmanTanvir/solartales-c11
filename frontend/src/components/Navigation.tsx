'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Rocket, BarChart3, BookOpen, AlertTriangle, Clock, MessageCircle, Info } from 'lucide-react';
import { useRealTimeSpaceWeatherSafe } from '../hooks/useRealTimeSpaceWeatherSafe';

interface NavigationProps {
  currentWeatherEvent?: string;
}

export function Navigation({ currentWeatherEvent }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { mostSignificantEvent, recentEvents, highSeverityEvents, isLoading } = useRealTimeSpaceWeatherSafe();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current weather status
  const getCurrentWeatherStatus = () => {
    if (!mounted) return "Loading...";
    if (isLoading) return "Loading...";
    if (highSeverityEvents.length > 0) {
      const event = highSeverityEvents[0];
      return `${event.eventType.replace('_', ' ').toUpperCase()} - ${event.severityLevel.toUpperCase()}`;
    }
    if (mostSignificantEvent) {
      return `${mostSignificantEvent.eventType.replace('_', ' ').toUpperCase()} - ${mostSignificantEvent.severityLevel}`;
    }
    if (recentEvents.length > 0) {
      return `${recentEvents.length} Active Events`;
    }
    return currentWeatherEvent || "All Quiet";
  };

  const getWeatherStatusColor = () => {
    if (!mounted) return "text-gray-400";
    if (highSeverityEvents.length > 0) return "text-red-400";
    if (mostSignificantEvent?.severityLevel === 'strong') return "text-orange-400";
    if (recentEvents.length > 0) return "text-yellow-400";
    return "text-green-400";
  };

  const getIndicatorColor = () => {
    if (!mounted) return "bg-gray-400";
    if (highSeverityEvents.length > 0) return "bg-red-400";
    if (mostSignificantEvent?.severityLevel === 'strong') return "bg-orange-400";
    if (recentEvents.length > 0) return "bg-yellow-400";
    return "bg-green-400";
  };

  const navItems = [
    { icon: <Rocket className="w-4 h-4" />, label: "Stories", href: "/stories" },
    { icon: <BarChart3 className="w-4 h-4" />, label: "Live Data", href: "/data" },
    { icon: <BookOpen className="w-4 h-4" />, label: "Learn", href: "/learn" },
    { icon: <Clock className="w-4 h-4" />, label: "Time Travel", href: "/time-travel" },
    { icon: <MessageCircle className="w-4 h-4" />, label: "Ask AI", href: "/ask" },
    { icon: <Info className="w-4 h-4" />, label: "About", href: "/about" }
  ];

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img 
            src="/logo.png" 
            alt="Solar Tales Logo" 
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-xl font-bold text-solar-gradient">Solar Tales</h1>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
            >
              {item.icon}
              <span>{item.label}</span>
            </motion.a>
          ))}
        </div>
        
        {/* Weather Status & CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          {/* Live Weather Indicator - Only show when mounted to prevent hydration mismatch */}
          {mounted ? (
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <div className={`w-3 h-3 rounded-full animate-pulse ${getIndicatorColor()}`}></div>
              <span className={getWeatherStatusColor()}>
                {getCurrentWeatherStatus()}
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full animate-pulse bg-gray-400"></div>
              <span className="text-gray-400">
                Loading...
              </span>
            </div>
          )}

          {/* Emergency Alerts */}
          {mounted && highSeverityEvents.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-900/30 border border-red-500/50 rounded-lg px-3 py-1 flex items-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">Alert</span>
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.a
            href="/stories"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hidden sm:block"
          >
            Start Journey
          </motion.a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white hover:text-blue-400 transition-colors p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden mt-4 glass rounded-xl p-4"
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
            
            {/* Mobile Weather Status */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-3 h-3 rounded-full animate-pulse ${getIndicatorColor()}`}></div>
                <span className={getWeatherStatusColor()}>
                  {getCurrentWeatherStatus()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navigation;
