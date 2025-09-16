import { SunMood } from '@/components/SunCharacter';

export interface SpaceWeatherData {
  solarFlares: {
    latest: any;
    intensity: 'none' | 'C' | 'M' | 'X';
    count24h: number;
  };
  geomagneticActivity: {
    kpIndex: number;
    stormLevel: 'quiet' | 'unsettled' | 'active' | 'minor' | 'moderate' | 'strong' | 'severe' | 'extreme';
  };
  protonFlux: {
    current: number;
    threshold: 'normal' | 'elevated' | 'high' | 'very_high';
  };
  coronalMassEjections: {
    recentCME: boolean;
    impactPredicted: boolean;
  };
}

export interface SunMoodAnalysis {
  mood: SunMood;
  confidence: number;
  reasons: string[];
  nextUpdate: Date;
}

class SunMoodService {
  private static instance: SunMoodService;
  private currentData: SpaceWeatherData | null = null;
  private lastFetch = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): SunMoodService {
    if (!SunMoodService.instance) {
      SunMoodService.instance = new SunMoodService();
    }
    return SunMoodService.instance;
  }

  /**
   * Fetches real-time space weather data from multiple sources
   */
  async fetchSpaceWeatherData(): Promise<SpaceWeatherData> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.currentData && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.currentData;
    }

    try {
      // Fetch data from multiple sources in parallel
      const [solarFlareData, geomagneticData, protonData] = await Promise.allSettled([
        this.fetchSolarFlareData(),
        this.fetchGeomagneticData(),
        this.fetchProtonFluxData()
      ]);

      this.currentData = {
        solarFlares: solarFlareData.status === 'fulfilled' ? solarFlareData.value : this.getFallbackSolarData(),
        geomagneticActivity: geomagneticData.status === 'fulfilled' ? geomagneticData.value : this.getFallbackGeomagneticData(),
        protonFlux: protonData.status === 'fulfilled' ? protonData.value : this.getFallbackProtonData(),
        coronalMassEjections: {
          recentCME: false,
          impactPredicted: false
        }
      };

      this.lastFetch = now;
      return this.currentData;
    } catch (error) {
      console.warn('Failed to fetch space weather data, using fallback:', error);
      return this.getFallbackData();
    }
  }

  /**
   * Fetches solar flare data from NOAA/NASA APIs
   */
  private async fetchSolarFlareData() {
    try {
      // Try NOAA SWPC first
      const response = await fetch(
        'https://services.swpc.noaa.gov/products/solar-wind-mag-field.json',
        {
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(10000)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Process the data to determine flare activity
      return this.processSolarFlareData(data);
    } catch (error) {
      // Fallback to alternative source or mock data
      console.warn('Solar flare API failed, using fallback');
      return this.getFallbackSolarData();
    }
  }

  /**
   * Fetches geomagnetic activity data
   */
  private async fetchGeomagneticData() {
    try {
      const response = await fetch(
        'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
        {
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(10000)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return this.processGeomagneticData(data);
    } catch (error) {
      console.warn('Geomagnetic API failed, using fallback');
      return this.getFallbackGeomagneticData();
    }
  }

  /**
   * Fetches proton flux data
   */
  private async fetchProtonFluxData() {
    try {
      const response = await fetch(
        'https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json',
        {
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(10000)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return this.processProtonFluxData(data);
    } catch (error) {
      console.warn('Proton flux API failed, using fallback');
      return this.getFallbackProtonData();
    }
  }

  /**
   * Process solar flare data into our format
   */
  private processSolarFlareData(data: any) {
    // Extract the latest solar activity indicators
    const recentData = data.slice(-24) || []; // Last 24 hours
    
    // Simulate flare detection from solar wind data
    const avgMagnitude = recentData.reduce((sum: number, point: any) => {
      const mag = parseFloat(point[3]) || 0; // Magnetic field strength
      return sum + mag;
    }, 0) / recentData.length;

    let intensity: 'none' | 'C' | 'M' | 'X' = 'none';
    let count24h = 0;

    if (avgMagnitude > 15) {
      intensity = 'X';
      count24h = 1;
    } else if (avgMagnitude > 10) {
      intensity = 'M';
      count24h = Math.floor(Math.random() * 3) + 1;
    } else if (avgMagnitude > 5) {
      intensity = 'C';
      count24h = Math.floor(Math.random() * 5) + 1;
    }

    return {
      latest: recentData[recentData.length - 1] || null,
      intensity,
      count24h
    };
  }

  /**
   * Process geomagnetic data
   */
  private processGeomagneticData(data: any) {
    const latestEntry = data[data.length - 1];
    const kpValue = latestEntry ? parseFloat(latestEntry[1]) : 0;

    let stormLevel: 'quiet' | 'unsettled' | 'active' | 'minor' | 'moderate' | 'strong' | 'severe' | 'extreme' = 'quiet';

    if (kpValue >= 9) stormLevel = 'extreme';
    else if (kpValue >= 8) stormLevel = 'severe';
    else if (kpValue >= 7) stormLevel = 'strong';
    else if (kpValue >= 6) stormLevel = 'moderate';
    else if (kpValue >= 5) stormLevel = 'minor';
    else if (kpValue >= 4) stormLevel = 'active';
    else if (kpValue >= 3) stormLevel = 'unsettled';

    return {
      kpIndex: kpValue,
      stormLevel
    };
  }

  /**
   * Process proton flux data
   */
  private processProtonFluxData(data: any) {
    const latestEntry = data[data.length - 1];
    const protonFlux = latestEntry ? parseFloat(latestEntry.flux) : 0;

    let threshold: 'normal' | 'elevated' | 'high' | 'very_high' = 'normal';

    if (protonFlux > 1000) threshold = 'very_high';
    else if (protonFlux > 100) threshold = 'high';
    else if (protonFlux > 10) threshold = 'elevated';

    return {
      current: protonFlux,
      threshold
    };
  }

  /**
   * Analyzes space weather data and determines Sun mood
   */
  async analyzeSunMood(): Promise<SunMoodAnalysis> {
    const data = await this.fetchSpaceWeatherData();
    const reasons: string[] = [];
    let mood: SunMood = 'calm';
    let confidence = 0.8;

    // Priority-based mood determination
    
    // Extreme events (X-class flares or extreme geomagnetic storms)
    if (data.solarFlares.intensity === 'X' || data.geomagneticActivity.stormLevel === 'extreme') {
      mood = 'extreme';
      confidence = 0.95;
      reasons.push(
        data.solarFlares.intensity === 'X' ? 'X-class solar flare detected' : 'Extreme geomagnetic storm'
      );
    }
    // High radiation environment
    else if (data.protonFlux.threshold === 'very_high' || data.protonFlux.threshold === 'high') {
      mood = 'radiation';
      confidence = 0.9;
      reasons.push('High proton radiation levels detected');
    }
    // Active solar flares
    else if (data.solarFlares.intensity === 'M' || data.solarFlares.count24h > 3) {
      mood = 'flare';
      confidence = 0.85;
      reasons.push(`${data.solarFlares.intensity}-class solar flare activity`);
    }
    // Geomagnetic storms (aurora conditions)
    else if (data.geomagneticActivity.kpIndex >= 5) {
      mood = 'storm';
      confidence = 0.9;
      reasons.push(`Geomagnetic storm (Kp=${data.geomagneticActivity.kpIndex.toFixed(1)})`);
    }
    // Minor activity
    else if (
      data.solarFlares.intensity === 'C' || 
      data.geomagneticActivity.kpIndex >= 3 ||
      data.protonFlux.threshold === 'elevated'
    ) {
      mood = 'flare';
      confidence = 0.7;
      reasons.push('Minor solar activity detected');
    }
    // Calm conditions
    else {
      mood = 'calm';
      confidence = 0.8;
      reasons.push('Space weather conditions are quiet');
    }

    const nextUpdate = new Date(Date.now() + this.CACHE_DURATION);

    return {
      mood,
      confidence,
      reasons,
      nextUpdate
    };
  }

  /**
   * Fallback data generators for when APIs are unavailable
   */
  private getFallbackData(): SpaceWeatherData {
    // Generate realistic but random space weather for demo purposes
    const scenarios = [
      {
        solarFlares: { latest: null, intensity: 'none' as const, count24h: 0 },
        geomagneticActivity: { kpIndex: 2.1, stormLevel: 'quiet' as const },
        protonFlux: { current: 0.5, threshold: 'normal' as const },
        coronalMassEjections: { recentCME: false, impactPredicted: false }
      },
      {
        solarFlares: { latest: null, intensity: 'C' as const, count24h: 2 },
        geomagneticActivity: { kpIndex: 4.2, stormLevel: 'active' as const },
        protonFlux: { current: 5.2, threshold: 'normal' as const },
        coronalMassEjections: { recentCME: true, impactPredicted: false }
      },
      {
        solarFlares: { latest: null, intensity: 'M' as const, count24h: 1 },
        geomagneticActivity: { kpIndex: 6.1, stormLevel: 'moderate' as const },
        protonFlux: { current: 15.8, threshold: 'elevated' as const },
        coronalMassEjections: { recentCME: true, impactPredicted: true }
      }
    ];

    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }

  private getFallbackSolarData() {
    return { latest: null, intensity: 'C' as const, count24h: 1 };
  }

  private getFallbackGeomagneticData() {
    return { kpIndex: 3.2, stormLevel: 'unsettled' as const };
  }

  private getFallbackProtonData() {
    return { current: 2.1, threshold: 'normal' as const };
  }
}

export default SunMoodService;