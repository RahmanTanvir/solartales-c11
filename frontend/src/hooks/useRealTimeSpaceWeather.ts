'use client';

import { useState, useEffect, useCallback } from 'react';
import { spaceWeatherAPI } from '../lib/spaceWeatherAPI';
import { WeatherDataProcessor, ProcessedWeatherEvent } from '../lib/weatherDataProcessor';
import { RealTimeHandler, RealTimeUpdate } from '../lib/realTimeHandler';
import { apiOptimizer } from '../lib/apiOptimizer';

interface SpaceWeatherState {
  events: ProcessedWeatherEvent[];
  currentActivity: {
    solarFlares: number;
    cmes: number;
    storms: number;
  };
  mostSignificantEvent: ProcessedWeatherEvent | null;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

export function useRealTimeSpaceWeather() {
  const [state, setState] = useState<SpaceWeatherState>({
    events: [],
    currentActivity: { solarFlares: 0, cmes: 0, storms: 0 },
    mostSignificantEvent: null,
    lastUpdated: null,
    isLoading: true,
    error: null
  });

  const [realTimeHandler] = useState(() => new RealTimeHandler());
  const [weatherProcessor] = useState(() => new WeatherDataProcessor());

  // Fetch latest space weather data
  const fetchSpaceWeatherData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Use optimized API calls with caching and error handling
      const completeData = await apiOptimizer.monitorAPIPerformance(
        'getCompleteSpaceWeatherData',
        () => apiOptimizer.getOptimizedSpaceWeatherData()
      );

      // Get processed events from our data processor
      const processedEvents = await weatherProcessor.processAllCurrentData();
      
      // Get most significant current event
      const significantEvent = await weatherProcessor.getMostSignificantEvent();
      
      const currentActivity = {
        solarFlares: completeData.events.solarFlares.length,
        cmes: completeData.events.coronalMassEjections.length,
        storms: completeData.events.geomagneticStorms.length
      };

      setState({
        events: processedEvents,
        currentActivity,
        mostSignificantEvent: significantEvent,
        lastUpdated: new Date(),
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching space weather data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch space weather data'
      }));
    }
  }, [weatherProcessor]);

  // Handle real-time updates
  const handleRealTimeUpdate = useCallback((update: RealTimeUpdate) => {
    if (update.type === 'weather_event') {
      // Refresh data when new weather events are detected
      fetchSpaceWeatherData();
    }
  }, [fetchSpaceWeatherData]);

  // Initialize and start real-time monitoring
  useEffect(() => {
    // Initial data fetch
    fetchSpaceWeatherData();

    // Subscribe to real-time updates
    const unsubscribe = realTimeHandler.subscribe(handleRealTimeUpdate);

    // Start real-time monitoring (check every 15 minutes)
    realTimeHandler.startRealTimeUpdates(15);

    return () => {
      unsubscribe();
      realTimeHandler.stopRealTimeUpdates();
    };
  }, [fetchSpaceWeatherData, handleRealTimeUpdate, realTimeHandler]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchSpaceWeatherData();
  }, [fetchSpaceWeatherData]);

  // Get events by type
  const getEventsByType = useCallback((eventType: ProcessedWeatherEvent['eventType']) => {
    return state.events.filter(event => event.eventType === eventType);
  }, [state.events]);

  // Get events by severity
  const getEventsBySeverity = useCallback((severity: ProcessedWeatherEvent['severityLevel']) => {
    return state.events.filter(event => event.severityLevel === severity);
  }, [state.events]);

  // Get recent events (last 24 hours)
  const getRecentEvents = useCallback((hours: number = 24) => {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return state.events.filter(event => new Date(event.eventTime) > cutoffTime);
  }, [state.events]);

  return {
    // State
    ...state,
    
    // Actions
    refresh,
    
    // Helpers
    getEventsByType,
    getEventsBySeverity,
    getRecentEvents,
    
    // Computed values
    hasActiveEvents: state.events.length > 0,
    highSeverityEvents: state.events.filter(e => ['severe', 'extreme'].includes(e.severityLevel)),
    recentEvents: getRecentEvents(24)
  };
}
