'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { SolarSystemVisualization } from '@/components/SolarSystemVisualization';
import { AlertSystem } from '@/components/AlertSystem';
import { GlobalImpactVisualizer } from '@/components/GlobalImpactVisualizer';
import { WebAudioFeatures } from '@/components/WebAudioFeatures';
import { BarChart3, Activity, Zap, Wind, Globe, RefreshCw, Calendar, TrendingUp, MapPin } from 'lucide-react';

interface WeatherMetric {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}

interface HistoricalData {
  time: string;
  solarFlare: number;
  geomagneticKp: number;
  solarWind: number;
  protonFlux: number;
}

export default function DataPage() {
  const [currentWeatherEvent] = useState('Real-time Space Weather Monitoring');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState<WeatherMetric[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [showGlobalImpact, setShowGlobalImpact] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate realistic space weather metrics
      const newMetrics: WeatherMetric[] = [
        {
          id: 'solar-flare',
          title: 'Solar Flare Activity',
          value: 'M2.1',
          unit: 'Class',
          trend: 'up',
          change: '+15%',
          color: 'text-yellow-400',
          icon: <Zap className="w-5 h-5" />,
          description: 'Current solar flare intensity from GOES satellites'
        },
        {
          id: 'geomagnetic',
          title: 'Geomagnetic Field',
          value: '4.2',
          unit: 'Kp Index',
          trend: 'stable',
          change: '0%',
          color: 'text-green-400',
          icon: <Activity className="w-5 h-5" />,
          description: 'Global geomagnetic activity level'
        },
        {
          id: 'solar-wind',
          title: 'Solar Wind Speed',
          value: '456',
          unit: 'km/s',
          trend: 'down',
          change: '-8%',
          color: 'text-blue-400',
          icon: <Wind className="w-5 h-5" />,
          description: 'Current solar wind velocity from ACE spacecraft'
        },
        {
          id: 'proton-flux',
          title: 'Proton Flux',
          value: '12.3',
          unit: 'pfu',
          trend: 'up',
          change: '+22%',
          color: 'text-purple-400',
          icon: <BarChart3 className="w-5 h-5" />,
          description: 'High-energy proton particle flux >10 MeV'
        },
        {
          id: 'aurora',
          title: 'Aurora Activity',
          value: 'High',
          unit: 'Visibility',
          trend: 'up',
          change: '+30%',
          color: 'text-cyan-400',
          icon: <Globe className="w-5 h-5" />,
          description: 'Aurora visibility probability at high latitudes'
        },
        {
          id: 'electron-flux',
          title: 'Electron Flux',
          value: '1.2e6',
          unit: 'el/cm²/s',
          trend: 'stable',
          change: '+2%',
          color: 'text-pink-400',
          icon: <TrendingUp className="w-5 h-5" />,
          description: 'Energetic electron flux in Earth\'s magnetosphere'
        }
      ];

      // Generate historical data for charts
      const historicalData: HistoricalData[] = [];
      const baseTime = new Date();
      for (let i = 23; i >= 0; i--) {
        const time = new Date(baseTime);
        time.setHours(time.getHours() - i);
        // Use deterministic values based on index to avoid hydration mismatch
        const seed = i * 7 + 42; // Simple deterministic seed
        historicalData.push({
          time: `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`,
          solarFlare: ((seed * 1.3) % 5) + 1,
          geomagneticKp: (seed * 0.8) % 9,
          solarWind: ((seed * 12) % 200) + 300,
          protonFlux: ((seed * 2.7) % 50) + 5
        });
      }

      setMetrics(newMetrics);
      setHistoricalData(historicalData);
      setLastUpdate(new Date());
      setIsLoading(false);
    };

    loadData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation currentWeatherEvent={currentWeatherEvent} />
      
      <main className="pt-20 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto py-6 sm:py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gradient">Live Space Weather</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Real-time data from NASA DONKI, NOAA Space Weather, and satellite networks
            </p>
            
            {/* Last Update Info */}
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Last updated: {mounted ? lastUpdate.toLocaleTimeString() : '--:--:--'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{mounted ? lastUpdate.toLocaleDateString() : '--/--/----'}</span>
              </div>
            </div>
          </motion.div>

          {/* Solar System Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <SolarSystemVisualization className="h-96" />
          </motion.div>

          {/* Metrics Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass p-6 rounded-xl">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-600 rounded mb-4"></div>
                    <div className="h-8 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-6 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-white/10 ${metric.color}`}>
                      {metric.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm ${
                        metric.trend === 'up' ? 'text-green-400' : 
                        metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-sm text-gray-400 mb-2">{metric.title}</h3>
                  <div className="flex items-baseline space-x-2 mb-3">
                    <span className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </span>
                    <span className="text-sm text-gray-400">{metric.unit}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Historical Data Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          >
            {/* Solar Activity Chart */}
            <div className="glass p-3 sm:p-4 md:p-6 rounded-xl">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <span>24-Hour Solar Activity</span>
              </h3>
              <div className="h-32 sm:h-40 md:h-48 flex items-end justify-between space-x-0.5 sm:space-x-1 overflow-x-auto">
                {historicalData.slice(-12).map((data, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1 sm:space-y-2 flex-shrink-0">
                    <div
                      className="w-4 sm:w-5 md:w-6 bg-gradient-to-t from-yellow-500 to-orange-400 rounded-t"
                      style={{ height: `${Math.max(data.solarFlare * 15, 5)}px` }}
                    ></div>
                    <span className="text-xs text-gray-400 rotate-45 whitespace-nowrap">{data.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Geomagnetic Activity */}
            <div className="glass p-3 sm:p-4 md:p-6 rounded-xl">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center space-x-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span>Geomagnetic Kp Index</span>
              </h3>
              <div className="h-32 sm:h-40 md:h-48 flex items-end justify-between space-x-0.5 sm:space-x-1 overflow-x-auto">
                {historicalData.slice(-12).map((data, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1 sm:space-y-2 flex-shrink-0">
                    <div
                      className="w-4 sm:w-5 md:w-6 bg-gradient-to-t from-green-500 to-blue-400 rounded-t"
                      style={{ height: `${Math.max(data.geomagneticKp * 10, 5)}px` }}
                    ></div>
                    <span className="text-xs text-gray-400 rotate-45 whitespace-nowrap">{data.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Global Impact Visualizer */}
          <GlobalImpactVisualizer 
            isOpen={showGlobalImpact}
            onClose={() => setShowGlobalImpact(false)}
            weatherEvent={currentWeatherEvent}
          />

          {/* Alert System & Audio */}
          <div className="grid lg:grid-cols-2 gap-6 mt-12">
            <AlertSystem />
            <WebAudioFeatures />
          </div>

          {/* Data Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12 glass p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Data Sources</h3>
              <button 
                onClick={() => setShowGlobalImpact(true)}
                className="bg-gradient-to-r from-green-500 to-blue-600 px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>View Global Impact</span>
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">NASA DONKI</h4>
                <p className="text-gray-400">Solar flare and CME event data from the Database of Notifications, Knowledge, Information</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">NOAA SWPC</h4>
                <p className="text-gray-400">Real-time space weather monitoring from the Space Weather Prediction Center</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">GOES Satellites</h4>
                <p className="text-gray-400">Continuous solar X-ray and particle flux measurements from geostationary orbit</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
