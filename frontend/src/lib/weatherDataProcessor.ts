// Data processing pipeline for space weather events
import { spaceWeatherAPI } from './spaceWeatherAPI';
import { MockSpaceWeatherProvider } from './mockSpaceWeatherProvider';
import { supabase } from './supabase';

export interface ProcessedWeatherEvent {
  id: string;
  eventType: 'solar_flare' | 'cme' | 'geomagnetic_storm' | 'radio_blackout' | 'aurora';
  eventTime: string;
  intensity: number;
  severityLevel: 'minor' | 'moderate' | 'strong' | 'severe' | 'extreme';
  storyContext: {
    characters: string[];
    educationalTopics: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    impactLevel: string;
  };
  sourceData: any;
}

export class WeatherDataProcessor {
  constructor() {
    // Using the imported spaceWeatherAPI instance
  }

  // Process solar flare data for story generation
  processSolarFlare(flareData: any): ProcessedWeatherEvent {
    const classChar = flareData.classType.charAt(0);
    const classNum = parseFloat(flareData.classType.substring(1));
    
    // Calculate intensity (0-100 scale)
    let intensity = 0;
    switch (classChar) {
      case 'A': intensity = classNum; break;
      case 'B': intensity = 10 + classNum; break;
      case 'C': intensity = 20 + classNum; break;
      case 'M': intensity = 30 + classNum; break;
      case 'X': intensity = 40 + Math.min(classNum, 60); break;
    }

    // Determine severity level
    const severityLevel = intensity < 15 ? 'minor' : 
                         intensity < 25 ? 'moderate' : 
                         intensity < 35 ? 'strong' : 
                         intensity < 45 ? 'severe' : 'extreme';

    // Determine story context
    const characters = ['solar_flare'];
    const educationalTopics = ['solar_physics', 'electromagnetic_radiation'];
    
    if (intensity >= 25) {
      characters.push('astronaut', 'satellite_operator');
      educationalTopics.push('space_technology', 'radiation_effects');
    }
    
    if (intensity >= 35) {
      characters.push('pilot', 'radio_operator');
      educationalTopics.push('ionosphere', 'communication_disruption');
    }

    return {
      id: `FLR-${flareData.flrID}`,
      eventType: 'solar_flare',
      eventTime: flareData.beginTime,
      intensity,
      severityLevel,
      storyContext: {
        characters,
        educationalTopics,
        difficulty: intensity < 20 ? 'beginner' : intensity < 40 ? 'intermediate' : 'advanced',
        impactLevel: severityLevel
      },
      sourceData: flareData
    };
  }

  // Process CME data
  processCME(cmeData: any): ProcessedWeatherEvent {
    const speed = cmeData.speed ? parseInt(cmeData.speed) : 300;
    const intensity = Math.min(speed / 10, 100); // Normalize to 0-100

    const severityLevel = intensity < 30 ? 'minor' : 
                         intensity < 50 ? 'moderate' : 
                         intensity < 70 ? 'strong' : 
                         intensity < 90 ? 'severe' : 'extreme';

    const characters = ['cme', 'astronaut'];
    const educationalTopics = ['plasma_physics', 'magnetic_fields'];

    if (speed > 500) {
      characters.push('power_grid_operator', 'satellite_operator');
      educationalTopics.push('geomagnetic_effects', 'technology_impacts');
    }

    return {
      id: `CME-${cmeData.activityID}`,
      eventType: 'cme',
      eventTime: cmeData.startTime,
      intensity,
      severityLevel,
      storyContext: {
        characters,
        educationalTopics,
        difficulty: intensity < 40 ? 'beginner' : intensity < 70 ? 'intermediate' : 'advanced',
        impactLevel: severityLevel
      },
      sourceData: cmeData
    };
  }

  // Process geomagnetic storm data
  processGeomagneticStorm(stormData: any): ProcessedWeatherEvent {
    let maxKp = 0;
    if (stormData.allKpIndex && stormData.allKpIndex.length > 0) {
      maxKp = Math.max(...stormData.allKpIndex.map((kp: any) => parseFloat(kp.kpIndex)));
    }

    const intensity = maxKp * 10; // Scale to 0-90+
    const severityLevel = maxKp < 4 ? 'minor' : 
                         maxKp < 6 ? 'moderate' : 
                         maxKp < 7 ? 'strong' : 
                         maxKp < 8 ? 'severe' : 'extreme';

    const characters = ['aurora_hunter', 'astronaut'];
    const educationalTopics = ['magnetosphere', 'aurora_formation'];

    if (maxKp >= 6) {
      characters.push('pilot', 'power_grid_operator');
      educationalTopics.push('navigation_effects', 'power_systems');
    }

    return {
      id: `GMS-${stormData.gstID}`,
      eventType: 'geomagnetic_storm',
      eventTime: stormData.startTime,
      intensity,
      severityLevel,
      storyContext: {
        characters,
        educationalTopics,
        difficulty: maxKp < 5 ? 'beginner' : maxKp < 7 ? 'intermediate' : 'advanced',
        impactLevel: severityLevel
      },
      sourceData: stormData
    };
  }

  // Main processing function with fallback
  async processAllCurrentData(): Promise<ProcessedWeatherEvent[]> {
    try {
      const currentData = await spaceWeatherAPI.getCompleteSpaceWeatherData();
      const processedEvents: ProcessedWeatherEvent[] = [];

      // Process solar flares
      if (currentData.events?.solarFlares?.length > 0) {
        for (const flare of currentData.events.solarFlares) {
          processedEvents.push(this.processSolarFlare(flare));
        }
      }

      // Process CMEs
      if (currentData.events?.coronalMassEjections?.length > 0) {
        for (const cme of currentData.events.coronalMassEjections) {
          processedEvents.push(this.processCME(cme));
        }
      }

      // Process geomagnetic storms
      if (currentData.events?.geomagneticStorms?.length > 0) {
        for (const storm of currentData.events.geomagneticStorms) {
          processedEvents.push(this.processGeomagneticStorm(storm));
        }
      }

      // If no events were processed, use fallback data
      if (processedEvents.length === 0) {
        return this.processMockData();
      }

      // Try to store processed events in Supabase (non-blocking)
      try {
        await this.storeProcessedEvents(processedEvents);
      } catch (dbError) {
        // Continue execution even if database storage fails
      }

      return processedEvents;
    } catch (error) {
      return this.processMockData();
    }
  }

  // Process mock data when APIs fail
  private processMockData(): ProcessedWeatherEvent[] {
    try {
      const mockData = MockSpaceWeatherProvider.getAllSpaceWeatherData();
      const processedEvents: ProcessedWeatherEvent[] = [];

      // Process mock solar flares
      if (mockData.solarFlares && mockData.solarFlares.length > 0) {
        for (const flare of mockData.solarFlares) {
          processedEvents.push(this.processSolarFlare(flare));
        }
      }

      // Process mock CMEs
      if (mockData.cmes && mockData.cmes.length > 0) {
        for (const cme of mockData.cmes) {
          processedEvents.push(this.processCME(cme));
        }
      }

      // Process mock geomagnetic storms
      if (mockData.geomagneticStorms && mockData.geomagneticStorms.length > 0) {
        for (const storm of mockData.geomagneticStorms) {
          processedEvents.push(this.processGeomagneticStorm(storm));
        }
      }

      return processedEvents.length > 0 ? processedEvents : this.getFallbackEvent();
    } catch (error) {
      // Return minimal fallback event
      return this.getFallbackEvent();
    }
  }

  // Get a guaranteed fallback event
  private getFallbackEvent(): ProcessedWeatherEvent[] {
    return [{
      id: `fallback-${Date.now()}`,
      eventType: 'solar_flare',
      eventTime: new Date().toISOString(),
      intensity: 25,
      severityLevel: 'moderate',
      storyContext: {
        characters: ['astronaut', 'scientist'],
        educationalTopics: ['solar_physics', 'space_weather'],
        difficulty: 'intermediate',
        impactLevel: 'moderate'
      },
      sourceData: { classType: 'M2.1', note: 'Fallback event for demo' }
    }];
  }

  // Store processed events in database
  private async storeProcessedEvents(events: ProcessedWeatherEvent[]) {
    if (!events || events.length === 0) {
      return;
    }

    // Test database connection first
    try {
      const { data: testData, error: testError } = await supabase
        .from('weather_events')
        .select('count')
        .limit(1);
      
      if (testError) {
        return; // Skip storage if database is not accessible
      }
    } catch (connectionError) {
      return; // Skip storage if connection fails
    }

    for (const event of events) {
      try {
        const weatherEvent = {
          id: event.id,
          event_type: event.eventType,
          event_time: event.eventTime,
          intensity: event.intensity,
          severity_level: event.severityLevel,
          source_data: event.sourceData || {},
          processed_data: event.storyContext || {},
          is_active: true
        };

        const { data, error } = await supabase
          .from('weather_events')
          .upsert(weatherEvent, { onConflict: 'id' });

        if (error) {
          // Continue processing even if database storage fails
          // The application can still function with in-memory data
          continue;
        }
      } catch (err) {
        // Continue silently if storage fails
        continue;
      }
    }
  }

  // Get story-ready events from the last 24 hours
  async getRecentStoryEvents(): Promise<ProcessedWeatherEvent[]> {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('weather_events')
      .select('*')
      .gte('event_time', dayAgo)
      .eq('is_active', true)
      .order('event_time', { ascending: false });

    if (error) {
      return [];
    }

    return data.map(event => ({
      id: event.id,
      eventType: event.event_type,
      eventTime: event.event_time,
      intensity: event.intensity,
      severityLevel: event.severity_level,
      storyContext: event.processed_data,
      sourceData: event.source_data
    }));
  }

  // Get the most significant current event for story generation
  async getMostSignificantEvent(): Promise<ProcessedWeatherEvent | null> {
    const recentEvents = await this.getRecentStoryEvents();
    
    if (recentEvents.length === 0) {
      return null;
    }

    // Sort by intensity and recency
    return recentEvents.sort((a, b) => {
      const scoreA = a.intensity + (new Date(a.eventTime).getTime() / 1000000000);
      const scoreB = b.intensity + (new Date(b.eventTime).getTime() / 1000000000);
      return scoreB - scoreA;
    })[0];
  }
}
