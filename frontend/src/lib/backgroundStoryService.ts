// Background story generation service
import { supabase } from './supabase';
import { spaceWeatherAPI } from './spaceWeatherAPI';

// Lazy import AI story generator to avoid server-side issues
let aiStoryGenerator: any = null;

const getAIStoryGenerator = async () => {
  if (!aiStoryGenerator && typeof window !== 'undefined') {
    try {
      const module = await import('./aiStoryGenerator');
      aiStoryGenerator = module.aiStoryGenerator;
    } catch (error) {
      console.warn('AI Story Generator not available:', error);
      return null;
    }
  }
  return aiStoryGenerator;
};

interface BackgroundGenerationConfig {
  enabled: boolean;
  maxStoriesPerDay: number;
  generationInterval: number; // in milliseconds
  minStoryGap: number; // minimum time between stories in milliseconds
}

export class BackgroundStoryService {
  private config: BackgroundGenerationConfig = {
    enabled: true,
    maxStoriesPerDay: 10,
    generationInterval: 60 * 60 * 1000, // 60 minutes - increased to reduce API calls
    minStoryGap: 30 * 60 * 1000 // 30 minutes minimum between stories - increased
  };

  private isGenerating = false;
  private generationTimer: NodeJS.Timeout | null = null;
  private lastGenerationTime = 0;

  constructor() {
    this.bindVisibilityEvents();
  }

  // Start background generation when the page becomes visible
  private bindVisibilityEvents() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.startBackgroundGeneration();
        } else {
          this.stopBackgroundGeneration();
        }
      });
    }
  }

  // Check if we can generate a new story based on limits and timing
  private async canGenerateStory(): Promise<boolean> {
    if (!this.config.enabled || this.isGenerating) {
      return false;
    }

    // Check time since last generation
    const now = Date.now();
    if (now - this.lastGenerationTime < this.config.minStoryGap) {
      return false;
    }

    // Check daily story count
    const today = new Date().toISOString().split('T')[0];
    const { data: todayStories, error } = await supabase
      .from('generated_stories')
      .select('id')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    if (error) {
      console.error('Error checking daily story count:', error);
      return false;
    }

    return (todayStories?.length || 0) < this.config.maxStoriesPerDay;
  }

  // Generate a story in the background using current space weather data
  private async generateBackgroundStory(): Promise<void> {
    if (!(await this.canGenerateStory())) {
      return;
    }

    this.isGenerating = true;
    this.lastGenerationTime = Date.now();

    try {
      console.log('🌟 Generating background story based on real space weather data...');
      
      // Get AI story generator
      const generator = await getAIStoryGenerator();
      if (!generator) {
        console.warn('AI Story Generator not available, skipping background generation');
        return;
      }
      
      // Get real space weather data from NASA/NOAA APIs
      const spaceWeatherData = await spaceWeatherAPI.getCompleteSpaceWeatherData();
      
      // Create a context from the real space weather data
      const context = this.createStoryContextFromRealData(spaceWeatherData);
      
      // Generate story using AI
      const story = await generator.generateStory(context);
      
      // Store in database
      const { error } = await supabase
        .from('generated_stories')
        .insert({
          title: story.title,
          content: story.content,
          space_weather_context: context,
          generated_at: new Date().toISOString(),
          story_type: 'background_generated'
        });

      if (error) {
        console.error('Error storing background story:', error);
      } else {
        console.log('✨ Background story generated and stored:', story.title);
        
        // Emit custom event for UI updates
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('backgroundStoryGenerated', {
            detail: { story, context }
          }));
        }
      }
    } catch (error) {
      console.error('Error generating background story:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  // Create story context from real space weather data
  private createStoryContextFromRealData(spaceWeatherData: any): string {
    console.log('🌡️ Creating story context from real space weather data:', spaceWeatherData);
    
    const { solarWind, geomagneticActivity, flareActivity, auroralActivity } = spaceWeatherData;
    
    return `REAL-TIME SPACE WEATHER CONTEXT:
Solar Wind Conditions: Speed ${solarWind.speed} km/s, Density ${solarWind.density} particles/cm³, Interplanetary Magnetic Field strength ${solarWind.magneticField} nT
Geomagnetic Activity: Current Kp index ${geomagneticActivity.kpIndex}, Activity level ${geomagneticActivity.activity}, Storm probability ${geomagneticActivity.stormProbability}%
Solar Flare Activity: Activity level ${flareActivity.activity}, Recent ${flareActivity.classification} class flare, Probability of X-class flare ${flareActivity.xClassProbability}%
Auroral Activity: ${auroralActivity.visibility}, Oval position ${auroralActivity.ovalPosition}

Generate a compelling space weather-related story that incorporates these current real-world conditions. The story should be engaging and make the space weather data accessible to general audiences.`;
  }

  // Create story context from space weather data (legacy method - kept for compatibility)
  private createStoryContext(data: any): string {
    const contexts = [];
    
    // Solar activity context
    if (data.solarFlares.length > 0) {
      const flare = data.solarFlares[0];
      contexts.push(`A ${flare.classType} solar flare occurred at ${flare.sourceLocation}, affecting space communications`);
    }
    
    // Geomagnetic activity
    if (data.kIndex > 4) {
      contexts.push(`Geomagnetic conditions are active (K-index: ${data.kIndex}), creating potential for aurora displays`);
    }
    
    // Solar wind conditions
    if (data.solarWind.speed > 500) {
      contexts.push(`High-speed solar wind streams (${data.solarWind.speed} km/s) are impacting Earth's magnetosphere`);
    }
    
    // Default context if no specific events
    if (contexts.length === 0) {
      contexts.push('Current space weather conditions are relatively quiet, perfect for space exploration');
    }
    
    return contexts.join('. ') + '.';
  }

  // Start the background generation service
  startBackgroundGeneration(): void {
    if (this.generationTimer) {
      return; // Already running
    }

    console.log('🚀 Starting background story generation service...');
    
    // Generate first story after a short delay
    setTimeout(() => {
      this.generateBackgroundStory();
    }, 5000); // 5 seconds after start

    // Set up recurring generation
    this.generationTimer = setInterval(() => {
      this.generateBackgroundStory();
    }, this.config.generationInterval);
  }

  // Stop the background generation service
  stopBackgroundGeneration(): void {
    if (this.generationTimer) {
      clearInterval(this.generationTimer);
      this.generationTimer = null;
      console.log('⏹️ Background story generation service stopped');
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<BackgroundGenerationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart with new config if running
    if (this.generationTimer) {
      this.stopBackgroundGeneration();
      this.startBackgroundGeneration();
    }
  }

  // Get current configuration
  getConfig(): BackgroundGenerationConfig {
    return { ...this.config };
  }

  // Get generation status
  getStatus() {
    return {
      isGenerating: this.isGenerating,
      isRunning: this.generationTimer !== null,
      lastGenerationTime: this.lastGenerationTime,
      nextGenerationIn: this.generationTimer ? 
        Math.max(0, this.config.generationInterval - (Date.now() - this.lastGenerationTime)) : 0
    };
  }

  // Manually trigger a background story generation
  async triggerGeneration(): Promise<void> {
    const generator = await getAIStoryGenerator();
    if (!generator) {
      console.warn('AI Story Generator not available for manual trigger');
      return;
    }
    await this.generateBackgroundStory();
  }

  // Get today's generated stories count
  async getTodayStoriesCount(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('generated_stories')
      .select('id')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    if (error) {
      console.error('Error checking today stories count:', error);
      return 0;
    }

    return data?.length || 0;
  }
}

// Export singleton instance
export const backgroundStoryService = new BackgroundStoryService();

// Auto-start when module loads in browser
if (typeof window !== 'undefined') {
  // Start background generation when the page loads
  window.addEventListener('load', () => {
    backgroundStoryService.startBackgroundGeneration();
  });
  
  // Also start if document is already loaded
  if (document.readyState === 'complete') {
    setTimeout(() => {
      backgroundStoryService.startBackgroundGeneration();
    }, 1000);
  }
}
