// Pre-generation system for space weather stories
// This system creates and manages a pool of pre-generated stories

import { aiStoryGenerator } from './aiStoryGenerator';

interface PreGeneratedStory {
  id: string;
  characterId: string;
  story: string;
  timestamp: number;
  used: boolean;
}

interface CharacterPool {
  [characterId: string]: PreGeneratedStory[];
}

class StoryPreGenerator {
  private storyPool: CharacterPool = {};
  private isGenerating = false;
  private lastGenerationTime = 0;
  private generationInterval = 30000; // 30 seconds between generations
  
  // Legendary space-related character names
  private characters = [
    { id: 'armstrong', name: 'Neil Armstrong' },
    { id: 'gagarin', name: 'Yuri Gagarin' },
    { id: 'lovell', name: 'Jim Lovell' },
    { id: 'ride', name: 'Sally Ride' }
  ];

  // Mock space weather data that doesn't require API calls
  private getMockSpaceWeatherData() {
    const conditions = [
      'solar minimum', 'solar maximum', 'moderate solar activity', 
      'high solar activity', 'geomagnetic storm', 'aurora activity',
      'solar flare detected', 'coronal mass ejection', 'quiet solar conditions'
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      condition: randomCondition,
      kIndex: Math.floor(Math.random() * 9),
      solarWindSpeed: 300 + Math.random() * 400,
      timestamp: Date.now(),
      description: `Current space weather shows ${randomCondition} with varying magnetic field conditions.`
    };
  }

  // Initialize the story pool
  async initialize() {
    // Pre-generate 3 stories per character
    for (const character of this.characters) {
      this.storyPool[character.id] = [];
      await this.generateStoriesForCharacter(character.id, 3);
    }
    
    // Start background generation
    this.startBackgroundGeneration();
  }

  // Generate stories for a specific character
  private async generateStoriesForCharacter(characterId: string, count: number) {
    const character = this.characters.find(c => c.id === characterId);
    if (!character) return;

    for (let i = 0; i < count; i++) {
      try {
        const mockData = this.getMockSpaceWeatherData();
        
        // Generate story using mock data instead of real API calls
        const story = await this.generateStoryWithMockData(character, mockData);
        
        const preGenStory: PreGeneratedStory = {
          id: `${characterId}-${Date.now()}-${i}`,
          characterId,
          story,
          timestamp: Date.now(),
          used: false
        };

        this.storyPool[characterId].push(preGenStory);
        
        // Small delay to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        // Add fallback story if generation fails
        const fallbackStory = this.createFallbackStory(character, this.getMockSpaceWeatherData());
        const preGenStory: PreGeneratedStory = {
          id: `${characterId}-fallback-${Date.now()}-${i}`,
          characterId,
          story: fallbackStory,
          timestamp: Date.now(),
          used: false
        };
        
        this.storyPool[characterId].push(preGenStory);
      }
    }
  }

  // Generate story with mock data (no API calls)
  private async generateStoryWithMockData(character: any, spaceWeatherData: any): Promise<string> {
    const prompt = `Create a short space weather story from the perspective of ${character.name}. 
    Current conditions: ${spaceWeatherData.description}
    K-index: ${spaceWeatherData.kIndex}
    Solar wind speed: ${spaceWeatherData.solarWindSpeed} km/s
    
    Make it engaging and educational, about 100-150 words.`;

    try {
      // Convert to the format expected by aiStoryGenerator
      const spaceWeatherEvent = {
        type: 'solar_flare' as const,
        intensity: 'moderate' as const,
        timestamp: new Date(),
        description: spaceWeatherData.description,
        impacts: ['Technology effects', 'Aurora visibility']
      };

      const config = {
        character: 'astronaut' as const,
        ageGroup: '11-13' as const,
        length: 'short' as const,
        educationalLevel: 'beginner' as const,
        includeScientificFacts: true
      };

      const result = await aiStoryGenerator.generateStory(spaceWeatherEvent, config);
      return result.story;
    } catch (error) {
      // If AI generation fails, return fallback
      return this.createFallbackStory(character, spaceWeatherData);
    }
  }

  // Create fallback story when AI generation fails
  private createFallbackStory(character: any, data: any): string {
    const stories = [
      `${character.name} here, observing today's space weather conditions. We're seeing ${data.condition} with a K-index of ${data.kIndex}. The solar wind is moving at ${Math.round(data.solarWindSpeed)} km/s. These conditions remind me of my time in space, where we constantly monitored such phenomena. Understanding space weather is crucial for both astronauts and life on Earth. Current magnetic field variations could affect satellite communications and navigation systems. As we continue to explore the cosmos, monitoring these invisible forces becomes ever more important for mission planning and crew safety.`,
      
      `This is ${character.name} with a space weather update. Today's conditions show ${data.condition}, which brings back memories of my space missions. The K-index reading of ${data.kIndex} indicates the level of geomagnetic disturbance we're experiencing. Solar wind particles traveling at ${Math.round(data.solarWindSpeed)} km/s are interacting with Earth's magnetosphere. During my time as an astronaut, we learned to respect these cosmic forces. They can create beautiful auroras but also pose challenges for space operations. Every space mission must account for these dynamic conditions that constantly change around our planet.`,
      
      `${character.name} reporting on current space weather. We're experiencing ${data.condition} today, with geomagnetic activity indicated by a K-index of ${data.kIndex}. The solar wind streams are flowing at ${Math.round(data.solarWindSpeed)} km/s, carrying charged particles from our Sun. This reminds me of the preparation required for space missions - we always had to consider space weather forecasts. These conditions affect everything from radio communications to the International Space Station's orbit. Understanding and predicting space weather helps protect both astronauts and the technology we depend on here on Earth.`
    ];
    
    return stories[Math.floor(Math.random() * stories.length)];
  }

  // Get the next available story for a character
  getStoryForCharacter(characterId: string): string | null {
    const stories = this.storyPool[characterId] || [];
    const availableStory = stories.find(story => !story.used);
    
    if (availableStory) {
      availableStory.used = true;
      
      // Trigger background generation if running low
      this.checkAndRefillPool(characterId);
      
      return availableStory.story;
    }
    
    return null;
  }

  // Get multiple stories for a character
  getStoriesForCharacter(characterId: string, count: number): string[] {
    const stories: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const story = this.getStoryForCharacter(characterId);
      if (story) {
        stories.push(story);
      }
    }
    
    return stories;
  }

  // Get current situation stories for all characters
  getCurrentSituationStories(): { [characterId: string]: string } {
    const result: { [characterId: string]: string } = {};
    
    for (const character of this.characters) {
      const story = this.getStoryForCharacter(character.id);
      if (story) {
        result[character.id] = story;
      }
    }
    
    return result;
  }

  // Check if pool needs refilling and trigger generation
  private checkAndRefillPool(characterId: string) {
    const stories = this.storyPool[characterId] || [];
    const availableCount = stories.filter(story => !story.used).length;
    
    if (availableCount < 2) {
      this.generateStoriesForCharacter(characterId, 3);
    }
  }

  // Background generation to keep pool filled
  private startBackgroundGeneration() {
    setInterval(() => {
      if (this.isGenerating) return;
      
      const now = Date.now();
      if (now - this.lastGenerationTime < this.generationInterval) return;
      
      this.backgroundRefill();
    }, 10000); // Check every 10 seconds
  }

  // Background refill process
  private async backgroundRefill() {
    this.isGenerating = true;
    this.lastGenerationTime = Date.now();
    
    try {
      for (const character of this.characters) {
        const stories = this.storyPool[character.id] || [];
        const availableCount = stories.filter(story => !story.used).length;
        
        if (availableCount < 3) {
          await this.generateStoriesForCharacter(character.id, 1);
        }
      }
      
      // Clean up old used stories
      this.cleanupOldStories();
      
    } catch (error) {
      console.error('❌ Background generation error:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  // Clean up old used stories
  private cleanupOldStories() {
    const maxAge = 300000; // 5 minutes
    const now = Date.now();
    
    for (const characterId in this.storyPool) {
      this.storyPool[characterId] = this.storyPool[characterId].filter(
        story => !story.used || (now - story.timestamp) < maxAge
      );
    }
  }

  // Get statistics
  getStats() {
    const stats: any = {
      totalStories: this.getTotalStoryCount(),
      availableStories: this.getAvailableStoryCount(),
      usedStories: this.getUsedStoryCount(),
      isGenerating: this.isGenerating,
      lastGeneration: new Date(this.lastGenerationTime).toLocaleTimeString()
    };
    
    for (const character of this.characters) {
      const stories = this.storyPool[character.id] || [];
      stats[character.id] = {
        total: stories.length,
        available: stories.filter(s => !s.used).length,
        used: stories.filter(s => s.used).length
      };
    }
    
    return stats;
  }

  private getTotalStoryCount(): number {
    return Object.values(this.storyPool).reduce((total, stories) => total + stories.length, 0);
  }

  private getAvailableStoryCount(): number {
    return Object.values(this.storyPool).reduce(
      (total, stories) => total + stories.filter(s => !s.used).length, 0
    );
  }

  private getUsedStoryCount(): number {
    return Object.values(this.storyPool).reduce(
      (total, stories) => total + stories.filter(s => s.used).length, 0
    );
  }

  // Force regenerate all stories
  async forceRegenerate() {
    console.log('🔄 Force regenerating all stories...');
    this.storyPool = {};
    await this.initialize();
  }

  // Get character info
  getCharacters() {
    return this.characters;
  }
}

// Create singleton instance
export const storyPreGenerator = new StoryPreGenerator();

// Auto-initialize when module loads
let initialized = false;
export const initializeStoryPreGenerator = async () => {
  if (!initialized) {
    await storyPreGenerator.initialize();
    initialized = true;
  }
  return storyPreGenerator;
};

export default storyPreGenerator;
