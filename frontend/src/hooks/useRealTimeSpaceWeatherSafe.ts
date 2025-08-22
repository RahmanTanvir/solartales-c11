'use client';

import { useState, useEffect } from 'react';
import { ProcessedWeatherEvent } from '@/lib/weatherDataProcessor';

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

export function useRealTimeSpaceWeatherSafe() {
  const [state, setState] = useState<SpaceWeatherState>({
    events: [],
    currentActivity: { solarFlares: 0, cmes: 0, storms: 0 },
    mostSignificantEvent: null,
    lastUpdated: null,
    isLoading: false,
    error: null
  });

  useEffect(() => {
    // Mock some space weather data for demo
    const mockEvent: ProcessedWeatherEvent = {
      id: 'mock-solar-flare',
      eventType: 'solar_flare',
      eventTime: new Date().toISOString(),
      intensity: 2.5,
      severityLevel: 'moderate',
      storyContext: {
        characters: ['astronaut', 'scientist'],
        educationalTopics: ['solar_physics', 'space_weather'],
        difficulty: 'intermediate',
        impactLevel: 'moderate'
      },
      sourceData: { classType: 'M2.1', note: 'Demo solar flare' }
    };

    setState({
      events: [mockEvent],
      currentActivity: { solarFlares: 1, cmes: 0, storms: 0 },
      mostSignificantEvent: mockEvent,
      lastUpdated: new Date(),
      isLoading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    recentEvents: state.events,
    highSeverityEvents: state.events.filter(e => e.severityLevel === 'strong' || e.severityLevel === 'severe' || e.severityLevel === 'extreme')
  };
}
