// Local storage utility for managing application data
// Replaces Supabase functionality with browser local storage

export interface LocalStorageData {
  stories: GeneratedStoryData[];
  weatherEvents: WeatherEventData[];
  userPreferences: UserPreferences;
  lastUpdated: string;
}

export interface GeneratedStoryData {
  id: string;
  title: string;
  story: string;
  character: string;
  age_group: '8-10' | '11-13' | '14-17';
  educational_facts: string[];
  space_weather_event: {
    type: string;
    intensity: string;
    description: string;
    impacts: string[];
  };
  generated_at: string;
  is_active: boolean;
  story_type?: 'user_generated' | 'background_generated';
  space_weather_context?: string;
}

export interface WeatherEventData {
  id: string;
  created_at: string;
  event_type: 'solar_flare' | 'geomagnetic_storm' | 'coronal_mass_ejection' | 'radiation_storm' | 'aurora';
  intensity: 'low' | 'moderate' | 'high' | 'severe' | 'extreme';
  start_time: string;
  end_time?: string;
  description: string;
  impacts: string[];
  source: string;
  is_active: boolean;
}

export interface UserPreferences {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  language: string;
  character?: string;
  theme?: 'light' | 'dark';
}

class LocalStorageManager {
  private readonly STORAGE_KEY = 'solartales_data';
  private readonly DEFAULT_DATA: LocalStorageData = {
    stories: [],
    weatherEvents: [],
    userPreferences: {
      difficulty: 'beginner',
      interests: [],
      language: 'en',
    },
    lastUpdated: new Date().toISOString(),
  };

  // Initialize local storage if not exists
  private initializeStorage(): void {
    if (typeof window === 'undefined') return;
    
    const existingData = localStorage.getItem(this.STORAGE_KEY);
    if (!existingData) {
      this.saveData(this.DEFAULT_DATA);
    }
  }

  // Get all data from local storage
  getData(): LocalStorageData {
    if (typeof window === 'undefined') return this.DEFAULT_DATA;
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.DEFAULT_DATA;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return this.DEFAULT_DATA;
    }
  }

  // Save all data to local storage
  saveData(data: LocalStorageData): void {
    if (typeof window === 'undefined') return;
    
    try {
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Story management methods
  async getStories(filters?: {
    character?: string;
    eventType?: string;
    limit?: number;
    isActive?: boolean;
  }): Promise<GeneratedStoryData[]> {
    const data = this.getData();
    let stories = data.stories;

    if (filters) {
      if (filters.character && filters.character !== 'all') {
        stories = stories.filter(story => story.character === filters.character);
      }
      if (filters.eventType) {
        stories = stories.filter(story => story.space_weather_event.type === filters.eventType);
      }
      if (filters.isActive !== undefined) {
        stories = stories.filter(story => story.is_active === filters.isActive);
      }
      if (filters.limit) {
        stories = stories.slice(0, filters.limit);
      }
    }

    // Sort by generated_at descending
    return stories.sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime());
  }

  async saveStory(story: GeneratedStoryData): Promise<void> {
    const data = this.getData();
    
    // Remove existing story with same ID if exists
    data.stories = data.stories.filter(s => s.id !== story.id);
    
    // Add new story
    data.stories.push(story);
    
    // Keep only last 100 stories to prevent storage bloat
    if (data.stories.length > 100) {
      data.stories = data.stories
        .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())
        .slice(0, 100);
    }
    
    this.saveData(data);
  }

  async updateStory(id: string, updates: Partial<GeneratedStoryData>): Promise<void> {
    const data = this.getData();
    const storyIndex = data.stories.findIndex(s => s.id === id);
    
    if (storyIndex !== -1) {
      data.stories[storyIndex] = { ...data.stories[storyIndex], ...updates };
      this.saveData(data);
    }
  }

  async deleteStory(id: string): Promise<void> {
    const data = this.getData();
    data.stories = data.stories.filter(s => s.id !== id);
    this.saveData(data);
  }

  // Weather events management
  async getWeatherEvents(filters?: {
    isActive?: boolean;
    eventType?: string;
    limit?: number;
  }): Promise<WeatherEventData[]> {
    const data = this.getData();
    let events = data.weatherEvents;

    if (filters) {
      if (filters.isActive !== undefined) {
        events = events.filter(event => event.is_active === filters.isActive);
      }
      if (filters.eventType) {
        events = events.filter(event => event.event_type === filters.eventType);
      }
      if (filters.limit) {
        events = events.slice(0, filters.limit);
      }
    }

    return events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async saveWeatherEvent(event: WeatherEventData): Promise<void> {
    const data = this.getData();
    
    // Remove existing event with same ID if exists
    data.weatherEvents = data.weatherEvents.filter(e => e.id !== event.id);
    
    // Add new event
    data.weatherEvents.push(event);
    
    // Keep only last 50 events
    if (data.weatherEvents.length > 50) {
      data.weatherEvents = data.weatherEvents
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 50);
    }
    
    this.saveData(data);
  }

  // User preferences management
  getUserPreferences(): UserPreferences {
    const data = this.getData();
    return data.userPreferences;
  }

  saveUserPreferences(preferences: Partial<UserPreferences>): void {
    const data = this.getData();
    data.userPreferences = { ...data.userPreferences, ...preferences };
    this.saveData(data);
  }

  // Utility methods
  clearAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeStorage();
  }

  exportData(): string {
    return JSON.stringify(this.getData(), null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as LocalStorageData;
      this.saveData(data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Statistics
  getStorageStats() {
    const data = this.getData();
    return {
      totalStories: data.stories.length,
      activeStories: data.stories.filter(s => s.is_active).length,
      totalWeatherEvents: data.weatherEvents.length,
      activeWeatherEvents: data.weatherEvents.filter(e => e.is_active).length,
      lastUpdated: data.lastUpdated,
      storageSize: JSON.stringify(data).length,
    };
  }
}

// Export singleton instance
export const localStorageManager = new LocalStorageManager();

// Initialize on import if in browser
if (typeof window !== 'undefined') {
  localStorageManager['initializeStorage']();
}

// Mock functions to replace Supabase queries
export const mockSupabaseQuery = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: { ascending?: boolean }) => ({
          limit: (count: number) => ({
            then: async (callback: (result: { data: any[], error: null }) => void) => {
              // Mock implementation for stories table
              if (table === 'generated_stories') {
                const stories = await localStorageManager.getStories({ limit: count });
                callback({ data: stories, error: null });
              }
              // Mock implementation for weather events
              else if (table === 'weather_events') {
                const events = await localStorageManager.getWeatherEvents({ limit: count });
                callback({ data: events, error: null });
              }
              else {
                callback({ data: [], error: null });
              }
            }
          })
        })
      })
    }),
    insert: (data: any) => ({
      then: async (callback: (result: { data: any, error: null }) => void) => {
        if (table === 'generated_stories') {
          await localStorageManager.saveStory(data);
        } else if (table === 'weather_events') {
          await localStorageManager.saveWeatherEvent(data);
        }
        callback({ data: data, error: null });
      }
    })
  })
};
