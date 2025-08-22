// Automatic Story Generation Service for Real-Time Space Weather Events
import { aiStoryGenerator, type Character, type SpaceWeatherEvent, type StoryConfig } from './aiStoryGenerator';
import { RealTimeHandler, type RealTimeUpdate } from './realTimeHandler';
import { supabase } from './supabase';

export interface GeneratedStory {
  id: string;
  title: string;
  story: string;
  character: Character;
  ageGroup: string;
  educationalFacts: string[];
  spaceWeatherEvent: SpaceWeatherEvent;
  generatedAt: Date;
  isActive: boolean;
}

export interface StoryGenerationTrigger {
  eventType: 'solar_flare' | 'cme' | 'geomagnetic_storm' | 'radio_blackout';
  minimumIntensity: 'minor' | 'moderate' | 'strong' | 'severe' | 'extreme';
  characters: Character[];
  ageGroups: Array<'8-10' | '11-13' | '14-17'>;
  autoGenerate: boolean;
}

export class AutoStoryGenerator {
  private realTimeHandler: RealTimeHandler;
  private generationTriggers: StoryGenerationTrigger[] = [];
  private isActive: boolean = false;
  private storyCache: Map<string, GeneratedStory[]> = new Map();

  constructor() {
    this.realTimeHandler = new RealTimeHandler();
    this.setupDefaultTriggers();
  }

  // Set up default story generation triggers
  private setupDefaultTriggers() {
    this.generationTriggers = [
      {
        eventType: 'solar_flare',
        minimumIntensity: 'moderate',
        characters: ['solar_flare', 'astronaut', 'pilot', 'radio_operator'],
        ageGroups: ['8-10', '11-13', '14-17'],
        autoGenerate: true
      },
      {
        eventType: 'cme',
        minimumIntensity: 'moderate',
        characters: ['astronaut', 'aurora_hunter', 'power_grid_operator'],
        ageGroups: ['8-10', '11-13', '14-17'],
        autoGenerate: true
      },
      {
        eventType: 'geomagnetic_storm',
        minimumIntensity: 'minor',
        characters: ['aurora_hunter', 'power_grid_operator', 'farmer'],
        ageGroups: ['8-10', '11-13', '14-17'],
        autoGenerate: true
      },
      {
        eventType: 'radio_blackout',
        minimumIntensity: 'moderate',
        characters: ['pilot', 'radio_operator', 'astronaut'],
        ageGroups: ['11-13', '14-17'],
        autoGenerate: true
      }
    ];
  }

  // Start automatic story generation
  async startAutoGeneration() {
    this.isActive = true;
    
    // Subscribe to real-time space weather updates
    this.realTimeHandler.subscribe(this.handleRealTimeUpdate.bind(this));
    this.realTimeHandler.startRealTimeUpdates(10); // Check every 10 minutes

    console.log('Automatic story generation started');
  }

  // Stop automatic story generation
  stopAutoGeneration() {
    this.isActive = false;
    this.realTimeHandler.stopRealTimeUpdates();
    console.log('Automatic story generation stopped');
  }

  // Handle real-time updates and trigger story generation
  private async handleRealTimeUpdate(update: RealTimeUpdate) {
    if (!this.isActive || update.type !== 'weather_event') {
      return;
    }

    try {
      const spaceWeatherEvent = this.convertToSpaceWeatherEvent(update.data);
      
      if (this.shouldGenerateStory(spaceWeatherEvent)) {
        await this.generateStoriesForEvent(spaceWeatherEvent);
      }
    } catch (error) {
      console.error('Error handling real-time update for story generation:', error);
    }
  }

  // Convert raw weather data to SpaceWeatherEvent
  private convertToSpaceWeatherEvent(data: any): SpaceWeatherEvent {
    // Determine event type based on data
    let eventType: SpaceWeatherEvent['type'] = 'solar_flare';
    let intensity: SpaceWeatherEvent['intensity'] = 'minor';
    let description = '';
    let impacts: string[] = [];

    if (data.classType) {
      // Solar flare data
      eventType = 'solar_flare';
      intensity = this.mapFlareClassToIntensity(data.classType);
      description = `${data.classType} class solar flare detected`;
      impacts = this.getFlareImpacts(data.classType);
    } else if (data.speed) {
      // CME data
      eventType = 'cme';
      intensity = this.mapCMESpeedToIntensity(parseInt(data.speed) || 0);
      description = `Coronal Mass Ejection with speed ${data.speed} km/s`;
      impacts = this.getCMEImpacts(parseInt(data.speed) || 0);
    } else if (data.kp_index || data.kpIndex) {
      // Geomagnetic storm data
      eventType = 'geomagnetic_storm';
      const kp = parseFloat(data.kp_index || data.kpIndex);
      intensity = this.mapKpToIntensity(kp);
      description = `Geomagnetic storm with Kp index ${kp}`;
      impacts = this.getGeomagneticImpacts(kp);
    }

    return {
      type: eventType,
      intensity,
      timestamp: new Date(data.beginTime || data.startTime || data.time_tag || new Date()),
      location: data.sourceLocation || undefined,
      duration: this.calculateDuration(data),
      description,
      impacts
    };
  }

  // Map solar flare class to intensity
  private mapFlareClassToIntensity(classType: string): SpaceWeatherEvent['intensity'] {
    const type = classType.charAt(0).toUpperCase();
    const magnitude = parseFloat(classType.substring(1)) || 1;

    if (type === 'X') {
      if (magnitude >= 10) return 'extreme';
      if (magnitude >= 5) return 'severe';
      return 'strong';
    } else if (type === 'M') {
      if (magnitude >= 5) return 'moderate';
      return 'minor';
    } else if (type === 'C') {
      return 'minor';
    }
    
    return 'minor';
  }

  // Map CME speed to intensity
  private mapCMESpeedToIntensity(speed: number): SpaceWeatherEvent['intensity'] {
    if (speed >= 2000) return 'extreme';
    if (speed >= 1500) return 'severe';
    if (speed >= 1000) return 'strong';
    if (speed >= 500) return 'moderate';
    return 'minor';
  }

  // Map Kp index to intensity
  private mapKpToIntensity(kp: number): SpaceWeatherEvent['intensity'] {
    if (kp >= 9) return 'extreme';
    if (kp >= 8) return 'severe';
    if (kp >= 6) return 'strong';
    if (kp >= 5) return 'moderate';
    return 'minor';
  }

  // Get impact descriptions for solar flares
  private getFlareImpacts(classType: string): string[] {
    const impacts = ['Radio communication disruptions'];
    
    if (classType.startsWith('M') || classType.startsWith('X')) {
      impacts.push('Satellite navigation affected', 'Airline route modifications');
    }
    
    if (classType.startsWith('X')) {
      impacts.push('Power grid fluctuations', 'Enhanced aurora visibility');
    }
    
    return impacts;
  }

  // Get impact descriptions for CMEs
  private getCMEImpacts(speed: number): string[] {
    const impacts = ['Possible geomagnetic storm'];
    
    if (speed >= 1000) {
      impacts.push('Aurora visible at lower latitudes', 'Satellite operations affected');
    }
    
    if (speed >= 1500) {
      impacts.push('Power grid disruptions possible', 'GPS accuracy reduced');
    }
    
    return impacts;
  }

  // Get impact descriptions for geomagnetic storms
  private getGeomagneticImpacts(kp: number): string[] {
    const impacts = ['Aurora activity increased'];
    
    if (kp >= 5) {
      impacts.push('GPS accuracy affected', 'Radio communication issues');
    }
    
    if (kp >= 7) {
      impacts.push('Power grid fluctuations', 'Satellite drag increased');
    }
    
    return impacts;
  }

  // Calculate event duration
  private calculateDuration(data: any): number | undefined {
    if (data.endTime && data.beginTime) {
      const start = new Date(data.beginTime);
      const end = new Date(data.endTime);
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Hours
    }
    return undefined;
  }

  // Check if story should be generated for this event
  private shouldGenerateStory(event: SpaceWeatherEvent): boolean {
    const trigger = this.generationTriggers.find(t => 
      t.eventType === event.type && 
      t.autoGenerate &&
      this.isIntensityMet(event.intensity, t.minimumIntensity)
    );

    return !!trigger;
  }

  // Check if intensity threshold is met
  private isIntensityMet(current: string, minimum: string): boolean {
    const intensityLevels = ['minor', 'moderate', 'strong', 'severe', 'extreme'];
    const currentIndex = intensityLevels.indexOf(current);
    const minimumIndex = intensityLevels.indexOf(minimum);
    return currentIndex >= minimumIndex;
  }

  // Generate stories for a space weather event
  private async generateStoriesForEvent(event: SpaceWeatherEvent) {
    const trigger = this.generationTriggers.find(t => 
      t.eventType === event.type &&
      this.isIntensityMet(event.intensity, t.minimumIntensity)
    );

    if (!trigger) return;

    const stories: GeneratedStory[] = [];

    // Generate stories for each character and age group combination
    for (const character of trigger.characters) {
      for (const ageGroup of trigger.ageGroups) {
        try {
          const config: StoryConfig = {
            character,
            ageGroup,
            length: 'medium',
            educationalLevel: ageGroup === '8-10' ? 'beginner' : 
                           ageGroup === '11-13' ? 'intermediate' : 'advanced',
            includeScientificFacts: true
          };

          const result = await aiStoryGenerator.generateStory(event, config);

          const story: GeneratedStory = {
            id: `${Date.now()}-${character}-${ageGroup}`,
            title: result.title,
            story: result.story,
            character,
            ageGroup,
            educationalFacts: result.educationalFacts,
            spaceWeatherEvent: event,
            generatedAt: new Date(),
            isActive: true
          };

          stories.push(story);

          // Store in Supabase
          await this.saveStoryToDatabase(story);

        } catch (error) {
          console.error(`Error generating story for ${character} (${ageGroup}):`, error);
        }
      }
    }

    // Cache stories locally
    const eventKey = `${event.type}-${event.timestamp.getTime()}`;
    this.storyCache.set(eventKey, stories);

    console.log(`Generated ${stories.length} stories for ${event.type} event`);
  }

  // Save story to Supabase database
  private async saveStoryToDatabase(story: GeneratedStory) {
    try {
      const { error } = await supabase
        .from('generated_stories')
        .insert({
          id: story.id,
          title: story.title,
          story: story.story,
          character: story.character,
          age_group: story.ageGroup,
          educational_facts: story.educationalFacts,
          space_weather_event: story.spaceWeatherEvent,
          generated_at: story.generatedAt.toISOString(),
          is_active: story.isActive
        });

      if (error) {
        console.error('Error saving story to database:', error);
      }
    } catch (error) {
      console.error('Error saving story to database:', error);
    }
  }

  // Get active stories for a specific event type
  async getActiveStories(eventType?: SpaceWeatherEvent['type'], character?: Character): Promise<GeneratedStory[]> {
    try {
      let query = supabase
        .from('generated_stories')
        .select('*')
        .eq('is_active', true)
        .order('generated_at', { ascending: false });

      if (eventType) {
        query = query.eq('space_weather_event->type', eventType);
      }

      if (character) {
        query = query.eq('character', character);
      }

      const { data, error } = await query.limit(20);

      if (error) {
        console.error('Error fetching active stories:', error);
        return [];
      }

      return data?.map(row => ({
        id: row.id,
        title: row.title,
        story: row.story,
        character: row.character,
        ageGroup: row.age_group,
        educationalFacts: row.educational_facts,
        spaceWeatherEvent: row.space_weather_event,
        generatedAt: new Date(row.generated_at),
        isActive: row.is_active
      })) || [];

    } catch (error) {
      console.error('Error fetching active stories:', error);
      return [];
    }
  }

  // Generate story on demand for current space weather conditions
  async generateStoryForCurrentConditions(character: Character, ageGroup: '8-10' | '11-13' | '14-17'): Promise<GeneratedStory | null> {
    try {
      // Get current space weather data (this would need to be implemented)
      // For now, create a sample event
      const currentEvent: SpaceWeatherEvent = {
        type: 'solar_flare',
        intensity: 'moderate',
        timestamp: new Date(),
        description: 'Current space weather conditions',
        impacts: ['Ongoing space weather activity']
      };

      const config: StoryConfig = {
        character,
        ageGroup,
        length: 'medium',
        educationalLevel: ageGroup === '8-10' ? 'beginner' : 
                         ageGroup === '11-13' ? 'intermediate' : 'advanced',
        includeScientificFacts: true
      };

      const result = await aiStoryGenerator.generateStory(currentEvent, config);

      const story: GeneratedStory = {
        id: `current-${Date.now()}-${character}-${ageGroup}`,
        title: result.title,
        story: result.story,
        character,
        ageGroup,
        educationalFacts: result.educationalFacts,
        spaceWeatherEvent: currentEvent,
        generatedAt: new Date(),
        isActive: true
      };

      await this.saveStoryToDatabase(story);
      return story;

    } catch (error) {
      console.error('Error generating story for current conditions:', error);
      return null;
    }
  }

  // Update generation triggers
  updateTriggers(triggers: StoryGenerationTrigger[]) {
    this.generationTriggers = triggers;
  }

  // Get current triggers
  getTriggers(): StoryGenerationTrigger[] {
    return [...this.generationTriggers];
  }
}

// Export singleton instance
export const autoStoryGenerator = new AutoStoryGenerator();
export default autoStoryGenerator;
