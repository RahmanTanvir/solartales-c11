'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Zap, Activity, Wind, X, Bell, Clock, MapPin } from 'lucide-react';
import { useRealTimeSpaceWeather } from '../hooks/useRealTimeSpaceWeather';
import { ProcessedWeatherEvent } from '../lib/weatherDataProcessor';

interface SpaceWeatherAlert {
  id: string;
  type: 'solar-flare' | 'geomagnetic-storm' | 'radiation-storm' | 'cme' | 'aurora';
  severity: 'minor' | 'moderate' | 'strong' | 'severe' | 'extreme';
  title: string;
  message: string;
  timestamp: Date;
  estimatedImpact: Date;
  affectedRegions: string[];
  isActive: boolean;
  source: 'NASA DONKI' | 'NOAA SWPC' | 'GOES Satellite';
}

interface AlertSystemProps {
  className?: string;
}

export function AlertSystem({ className = '' }: AlertSystemProps) {
  const { 
    events, 
    currentActivity, 
    mostSignificantEvent, 
    lastUpdated, 
    isLoading, 
    error,
    recentEvents 
  } = useRealTimeSpaceWeather();
  
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // Helper function to generate alert message
  const generateAlertMessage = (type: string, severity: string): string => {
    const messages: Record<string, Record<string, string>> = {
      'solar_flare': {
        minor: 'Minor solar flare activity detected. No significant impacts expected.',
        moderate: 'Moderate solar flare may cause brief radio blackouts in polar regions.',
        strong: 'Strong solar flare detected. HF radio communications may be disrupted.',
        severe: 'Severe solar flare event. Widespread radio blackouts possible.'
      },
      'geomagnetic_storm': {
        minor: 'Minor geomagnetic activity. Aurora may be visible at high latitudes.',
        moderate: 'Moderate geomagnetic storm. Aurora visible at mid-latitudes.',
        strong: 'Strong geomagnetic storm. Power grid fluctuations possible.',
        severe: 'Severe geomagnetic storm. Significant infrastructure impacts expected.'
      },
      'cme': {
        moderate: 'Coronal Mass Ejection detected. Earth impact expected in 1-3 days.',
        strong: 'Fast-moving CME approaching Earth. Enhanced aurora activity likely.',
        severe: 'Major CME event. Significant space weather impacts anticipated.'
      },
      'aurora': {
        minor: 'Aurora activity expected at high latitudes tonight.',
        moderate: 'Enhanced aurora displays possible across northern regions.',
        strong: 'Spectacular aurora shows expected. Visible as far south as northern USA.'
      }
    };

    return messages[type]?.[severity] || 'Space weather event detected. Monitor for updates.';
  };

  const generateAlertTitle = (event: ProcessedWeatherEvent): string => {
    switch (event.eventType) {
      case 'solar_flare':
        return `Solar Flare ${event.sourceData?.classType || 'Detected'}`;
      case 'cme':
        return 'Coronal Mass Ejection';
      case 'geomagnetic_storm':
        return 'Geomagnetic Storm Alert';
      case 'radio_blackout':
        return 'Radio Blackout Event';
      case 'aurora':
        return 'Aurora Activity';
      default:
        return 'Space Weather Event';
    }
  };

  const generateAffectedRegions = (event: ProcessedWeatherEvent): string[] => {
    const regions = ['High Latitude Regions', 'Arctic Circle'];
    
    if (event.intensity > 50) {
      regions.push('Northern Canada', 'Scandinavia', 'Siberia');
    }
    
    if (event.intensity > 70) {
      regions.push('Alaska', 'Northern USA', 'Northern Europe');
    }
    
    return regions;
  };

  // Convert ProcessedWeatherEvent to SpaceWeatherAlert format
  const convertToAlert = (event: ProcessedWeatherEvent): SpaceWeatherAlert => {
    return {
      id: event.id,
      type: event.eventType === 'solar_flare' ? 'solar-flare' : 
            event.eventType === 'cme' ? 'cme' :
            event.eventType === 'geomagnetic_storm' ? 'geomagnetic-storm' :
            event.eventType === 'radio_blackout' ? 'radiation-storm' : 'aurora',
      severity: event.severityLevel,
      title: generateAlertTitle(event),
      message: generateAlertMessage(event.eventType, event.severityLevel),
      timestamp: new Date(event.eventTime),
      estimatedImpact: new Date(Date.now() + 2 * 60 * 60 * 1000), // Estimate 2 hours from now
      affectedRegions: generateAffectedRegions(event),
      isActive: true,
      source: 'NASA DONKI'
    };
  };

  // Convert events to alerts
  const alerts = recentEvents.map(convertToAlert);
  const activeAlerts = alerts.filter(alert => alert.isActive);
  const displayAlerts = showAllAlerts ? alerts : activeAlerts.slice(0, 3);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'strong': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'severe': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'extreme': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'solar-flare': return <Zap className="w-4 h-4" />;
      case 'geomagnetic-storm': return <Activity className="w-4 h-4" />;
      case 'cme': return <Wind className="w-4 h-4" />;
      case 'aurora': return <MapPin className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Alert Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold">Space Weather Alerts</h3>
          {activeAlerts.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              {activeAlerts.length}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-400">
          Last update: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
          {isLoading && <span className="ml-2 text-blue-400">Updating...</span>}
          {error && <span className="ml-2 text-red-400">Error: {error}</span>}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        <AnimatePresence>
          {displayAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`glass p-4 rounded-lg border ${getSeverityColor(alert.severity)} ${
                alert.isActive ? 'ring-1 ring-current' : 'opacity-70'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(alert.type)}
                  <h4 className="font-semibold">{alert.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {alert.source}
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-3">{alert.message}</p>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Detected: {alert.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Impact: {alert.estimatedImpact.toLocaleTimeString()}</span>
                </div>
              </div>

              {alert.affectedRegions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="flex items-center space-x-1 text-xs text-gray-400 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>Affected Regions:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {alert.affectedRegions.slice(0, 3).map((region, i) => (
                      <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded">
                        {region}
                      </span>
                    ))}
                    {alert.affectedRegions.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{alert.affectedRegions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More/Less Button */}
      {alerts.length > 3 && (
        <button
          onClick={() => setShowAllAlerts(!showAllAlerts)}
          className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showAllAlerts ? 'Show Less' : `Show All ${alerts.length} Alerts`}
        </button>
      )}

      {/* No Alerts State */}
      {alerts.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No active space weather alerts</p>
          <p className="text-sm">All systems nominal</p>
        </div>
      )}
    </div>
  );
}
