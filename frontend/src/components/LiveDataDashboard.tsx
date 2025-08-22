'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Wind, Globe, AlertTriangle, Clock, TrendingUp, Satellite } from 'lucide-react';
import { useRealTimeSpaceWeather } from '../hooks/useRealTimeSpaceWeather';

interface WeatherData {
  solarFlare: string;
  geomagneticActivity: string;
  solarWindSpeed: string;
  auroraActivity: string;
}

interface DataItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  delay?: number;
}

function DataItem({ icon, value, label, color, delay = 0 }: DataItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="text-center group cursor-pointer"
    >
      <div className="flex items-center justify-center mb-2">
        <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
          {icon}
        </div>
      </div>
      <div className={`text-2xl md:text-3xl font-bold ${color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
        {value}
      </div>
      <div className="text-sm text-gray-300">{label}</div>
    </motion.div>
  );
}

export function LiveDataDashboard() {
  const { 
    currentActivity, 
    mostSignificantEvent, 
    events,
    lastUpdated, 
    isLoading, 
    error,
    recentEvents 
  } = useRealTimeSpaceWeather();

  // Calculate display values from real data
  const getSolarFlareActivity = () => {
    const solarFlares = events.filter(e => e.eventType === 'solar_flare');
    if (solarFlares.length === 0) return 'Quiet';
    
    const latestFlare = solarFlares[0];
    return latestFlare.sourceData?.classType || `Level ${latestFlare.intensity}`;
  };

  const getGeomagneticActivity = () => {
    const storms = events.filter(e => e.eventType === 'geomagnetic_storm');
    if (storms.length === 0) return 'Quiet';
    
    const latestStorm = storms[0];
    return `Kp: ${Math.min(Math.round(latestStorm.intensity / 10), 9)}`;
  };

  const getSolarWindSpeed = () => {
    const cmes = events.filter(e => e.eventType === 'cme');
    if (cmes.length === 0) return '400 km/s';
    
    const latestCME = cmes[0];
    return latestCME.sourceData?.speed ? `${latestCME.sourceData.speed} km/s` : `${Math.round(latestCME.intensity * 10)} km/s`;
  };

  const getAuroraActivity = () => {
    const storms = events.filter(e => e.eventType === 'geomagnetic_storm');
    if (storms.length === 0) return 'Low';
    
    const maxIntensity = Math.max(...storms.map(s => s.intensity));
    if (maxIntensity > 70) return 'Very High';
    if (maxIntensity > 50) return 'High';
    if (maxIntensity > 30) return 'Moderate';
    return 'Low';
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="glass p-8 rounded-xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Live Space Weather Dashboard</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full mx-auto mb-4 loading-pulse"></div>
              <div className="h-8 bg-gray-600 rounded mb-2 loading-pulse"></div>
              <div className="h-4 bg-gray-600 rounded loading-pulse"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="glass p-8 rounded-xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Live Space Weather Dashboard</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          Error loading data: {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-4 gap-6">
        <DataItem
          icon={<Zap className="w-6 h-6 text-yellow-400" />}
          value={getSolarFlareActivity()}
          label="Solar Flare Activity"
          color="text-yellow-400"
          delay={0}
        />
        <DataItem
          icon={<Activity className="w-6 h-6 text-green-400" />}
          value={getGeomagneticActivity()}
          label="Geomagnetic Activity"
          color="text-green-400"
          delay={0.1}
        />
        <DataItem
          icon={<Wind className="w-6 h-6 text-blue-400" />}
          value={getSolarWindSpeed()}
          label="Solar Wind Speed"
          color="text-blue-400"
          delay={0.2}
        />
        <DataItem
          icon={<Globe className="w-6 h-6 text-purple-400" />}
          value={getAuroraActivity()}
          label="Aurora Activity"
          color="text-purple-400"
          delay={0.3}
        />
      </div>
      
      {/* Real-time status */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Satellite className="w-4 h-4 text-blue-400" />
            <span>Active Events: {recentEvents.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}</span>
          </div>
        </div>
        
        {mostSignificantEvent && (
          <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Most Significant Event:</span>
            </div>
            <div className="mt-1 text-gray-300">
              {mostSignificantEvent.eventType.replace('_', ' ').toUpperCase()} - 
              {mostSignificantEvent.severityLevel} intensity 
              ({new Date(mostSignificantEvent.eventTime).toLocaleString()})
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Data from NASA DONKI & NOAA SWPC • Updates every 15 minutes
        </p>
      </div>
    </motion.div>
  );
}
