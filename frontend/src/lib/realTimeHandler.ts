// Real-time updates handling for space weather data
import { localStorageManager } from './localStorage';
import { WeatherDataProcessor } from './weatherDataProcessor';

export interface RealTimeUpdate {
  type: 'weather_event' | 'story_generated' | 'user_activity';
  data: any;
  timestamp: string;
}

export class RealTimeHandler {
  private weatherProcessor: WeatherDataProcessor;
  private updateInterval: NodeJS.Timeout | null = null;
  private subscribers: ((update: RealTimeUpdate) => void)[] = [];

  constructor() {
    this.weatherProcessor = new WeatherDataProcessor();
  }

  // Start real-time monitoring
  startRealTimeUpdates(intervalMinutes: number = 15) {
    // Stop existing interval if running
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Set up periodic data refresh
    this.updateInterval = setInterval(async () => {
      await this.checkForUpdates();
    }, intervalMinutes * 60 * 1000);

    // Set up local storage change detection
    this.setupLocalStorageSubscriptions();

    console.log(`Real-time updates started with ${intervalMinutes} minute intervals`);
  }

  // Stop real-time monitoring
  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Subscribe to real-time updates
  subscribe(callback: (update: RealTimeUpdate) => void) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Notify all subscribers
  private notifySubscribers(update: RealTimeUpdate) {
    this.subscribers.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  // Check for new space weather data
  private async checkForUpdates() {
    try {
      console.log('Checking for space weather updates...');
      
      // Get latest weather data
      const processedEvents = await this.weatherProcessor.processAllCurrentData();
      
      if (processedEvents.length > 0) {
        // Check for significant events
        const significantEvents = processedEvents.filter(event => 
          event.intensity >= 30 || // High intensity events
          ['severe', 'extreme'].includes(event.severityLevel)
        );

        if (significantEvents.length > 0) {
          this.notifySubscribers({
            type: 'weather_event',
            data: {
              events: significantEvents,
              count: significantEvents.length,
              maxIntensity: Math.max(...significantEvents.map(e => e.intensity))
            },
            timestamp: new Date().toISOString()
          });

          // Trigger story generation for significant events
          await this.triggerStoryGeneration(significantEvents[0]);
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }

  // Set up local storage change detection (replaces Supabase real-time)
  private setupLocalStorageSubscriptions() {
    // Listen for localStorage changes in other tabs/windows
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'solartales_data' && event.newValue) {
          try {
            const newData = JSON.parse(event.newValue);
            const oldData = event.oldValue ? JSON.parse(event.oldValue) : null;
            
            // Check for new stories
            if (oldData && newData.stories.length > oldData.stories.length) {
              const newStories = newData.stories.slice(oldData.stories.length);
              newStories.forEach((story: any) => {
                this.notifySubscribers({
                  type: 'story_generated',
                  data: story,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            // Check for new weather events
            if (oldData && newData.weatherEvents.length > oldData.weatherEvents.length) {
              const newEvents = newData.weatherEvents.slice(oldData.weatherEvents.length);
              newEvents.forEach((event: any) => {
                this.notifySubscribers({
                  type: 'weather_event',
                  data: event,
                  timestamp: new Date().toISOString()
                });
              });
            }
          } catch (error) {
            console.error('Error parsing localStorage change:', error);
          }
        }
      });
    }
  }

  // Trigger story generation for significant events
  private async triggerStoryGeneration(event: any) {
    try {
      // This would normally call the AI story generation service
      console.log('Triggering story generation for event:', event.id);
      
      // For now, we'll create a placeholder notification and store it locally
      const notification = {
        id: `notification-${Date.now()}`,
        weather_event_id: event.id,
        notification_type: 'space_weather_alert',
        title: `${event.eventType.replace('_', ' ').toUpperCase()} Alert!`,
        message: `A ${event.severityLevel} ${event.eventType.replace('_', ' ')} is happening right now! Want to see its story?`,
        severity: event.severityLevel === 'extreme' ? 'critical' : 
                 ['severe', 'strong'].includes(event.severityLevel) ? 'warning' : 'info',
        target_audience: { age_min: 8, age_max: 17 },
        created_at: new Date().toISOString(),
        is_active: true
      };
      
      // In a real implementation, we might store notifications locally or trigger story generation
      console.log('Generated notification:', notification);
      
    } catch (error) {
      console.error('Error triggering story generation:', error);
    }
  }

  // Get current space weather status
  async getCurrentStatus() {
    const recentEvents = await this.weatherProcessor.getRecentStoryEvents();
    const mostSignificant = await this.weatherProcessor.getMostSignificantEvent();

    const currentKIndex = await this.getCurrentKIndex();

    return {
      totalEvents: recentEvents.length,
      mostSignificantEvent: mostSignificant,
      currentKIndex,
      activityLevel: this.calculateActivityLevel(recentEvents),
      lastUpdated: new Date().toISOString()
    };
  }

  // Get current K-index from NOAA
  private async getCurrentKIndex(): Promise<number> {
    try {
      const response = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
      const data = await response.json();
      
      if (data.length > 0) {
        return parseFloat(data[data.length - 1][1]) || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching K-index:', error);
      return 0;
    }
  }

  // Calculate overall activity level
  private calculateActivityLevel(events: any[]): 'quiet' | 'unsettled' | 'active' | 'storm' {
    if (events.length === 0) return 'quiet';

    const averageIntensity = events.reduce((sum, event) => sum + event.intensity, 0) / events.length;
    const hasExtremeEvents = events.some(event => event.severityLevel === 'extreme');
    const hasSevereEvents = events.some(event => ['severe', 'strong'].includes(event.severityLevel));

    if (hasExtremeEvents || averageIntensity > 70) return 'storm';
    if (hasSevereEvents || averageIntensity > 40) return 'active';
    if (averageIntensity > 20) return 'unsettled';
    return 'quiet';
  }

  // Manual data refresh
  async refreshData() {
    await this.checkForUpdates();
  }
}
