// React hook for background story service integration
import { useState, useEffect } from 'react';
import { backgroundStoryService } from '@/lib/backgroundStoryService';

export interface BackgroundStoryStatus {
  isGenerating: boolean;
  isRunning: boolean;
  lastGenerationTime: number;
  nextGenerationIn: number;
  todayStoriesCount: number;
}

export interface BackgroundStoryConfig {
  enabled: boolean;
  maxStoriesPerDay: number;
  generationInterval: number;
  minStoryGap: number;
}

export function useBackgroundStories() {
  const [status, setStatus] = useState<BackgroundStoryStatus>({
    isGenerating: false,
    isRunning: false,
    lastGenerationTime: 0,
    nextGenerationIn: 0,
    todayStoriesCount: 0
  });
  
  const [config, setConfig] = useState<BackgroundStoryConfig>({
    enabled: true,
    maxStoriesPerDay: 10,
    generationInterval: 30 * 60 * 1000,
    minStoryGap: 10 * 60 * 1000
  });

  // Update status periodically
  useEffect(() => {
    const updateStatus = async () => {
      const serviceStatus = backgroundStoryService.getStatus();
      const todayCount = await backgroundStoryService.getTodayStoriesCount();
      
      setStatus({
        ...serviceStatus,
        todayStoriesCount: todayCount
      });
    };

    const updateConfig = () => {
      setConfig(backgroundStoryService.getConfig());
    };

    // Initial update
    updateStatus();
    updateConfig();

    // Update every 10 seconds
    const interval = setInterval(updateStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  // Listen for background story events
  useEffect(() => {
    const handleBackgroundStory = async () => {
      // Update status when a new story is generated
      const serviceStatus = backgroundStoryService.getStatus();
      const todayCount = await backgroundStoryService.getTodayStoriesCount();
      
      setStatus({
        ...serviceStatus,
        todayStoriesCount: todayCount
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('backgroundStoryGenerated', handleBackgroundStory);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('backgroundStoryGenerated', handleBackgroundStory);
      }
    };
  }, []);

  const startGeneration = () => {
    backgroundStoryService.startBackgroundGeneration();
  };

  const stopGeneration = () => {
    backgroundStoryService.stopBackgroundGeneration();
  };

  const triggerGeneration = async () => {
    await backgroundStoryService.triggerGeneration();
  };

  const updateConfiguration = (newConfig: Partial<BackgroundStoryConfig>) => {
    backgroundStoryService.updateConfig(newConfig);
    setConfig(backgroundStoryService.getConfig());
  };

  const getTimeUntilNextGeneration = () => {
    if (!status.isRunning) return 0;
    
    const timeSinceLastGeneration = Date.now() - status.lastGenerationTime;
    const timeUntilNext = config.generationInterval - timeSinceLastGeneration;
    
    return Math.max(0, timeUntilNext);
  };

  const formatTimeRemaining = (milliseconds: number) => {
    if (milliseconds <= 0) return 'Soon';
    
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const canGenerateMore = () => {
    return status.todayStoriesCount < config.maxStoriesPerDay;
  };

  const getGenerationProgress = () => {
    return (status.todayStoriesCount / config.maxStoriesPerDay) * 100;
  };

  return {
    status,
    config,
    startGeneration,
    stopGeneration,
    triggerGeneration,
    updateConfiguration,
    getTimeUntilNextGeneration,
    formatTimeRemaining,
    canGenerateMore,
    getGenerationProgress,
    timeUntilNext: getTimeUntilNextGeneration()
  };
}

// Custom hook for listening to background story events
export function useBackgroundStoryEvents(callback: (story: any, context: string) => void) {
  useEffect(() => {
    const handleBackgroundStory = (event: CustomEvent) => {
      callback(event.detail.story, event.detail.context);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('backgroundStoryGenerated', handleBackgroundStory as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('backgroundStoryGenerated', handleBackgroundStory as EventListener);
      }
    };
  }, [callback]);
}
