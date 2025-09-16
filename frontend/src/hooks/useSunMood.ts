'use client';

import { useState, useEffect, useCallback } from 'react';
import { SunMood } from '@/components/SunCharacter';
import SunMoodService, { SunMoodAnalysis } from '@/lib/sunMoodService';

interface UseSunMoodReturn {
  mood: SunMood;
  analysis: SunMoodAnalysis | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  refreshMood: () => Promise<void>;
}

export function useSunMood(): UseSunMoodReturn {
  const [mood, setMood] = useState<SunMood>('calm');
  const [analysis, setAnalysis] = useState<SunMoodAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const sunMoodService = SunMoodService.getInstance();

  const updateMood = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const moodAnalysis = await sunMoodService.analyzeSunMood();
      
      setMood(moodAnalysis.mood);
      setAnalysis(moodAnalysis);
      setLastUpdate(new Date());
      
      console.log('Sun mood updated:', {
        mood: moodAnalysis.mood,
        confidence: moodAnalysis.confidence,
        reasons: moodAnalysis.reasons
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to update sun mood:', err);
      
      // Fall back to calm mood on error
      setMood('calm');
      setAnalysis({
        mood: 'calm',
        confidence: 0.5,
        reasons: ['Using fallback data due to API error'],
        nextUpdate: new Date(Date.now() + 5 * 60 * 1000)
      });
    } finally {
      setIsLoading(false);
    }
  }, [sunMoodService]);

  // Initial load
  useEffect(() => {
    updateMood();
  }, [updateMood]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      updateMood();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [updateMood]);

  // Refresh when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && lastUpdate) {
        const timeSinceUpdate = Date.now() - lastUpdate.getTime();
        // Refresh if it's been more than 3 minutes since last update
        if (timeSinceUpdate > 3 * 60 * 1000) {
          updateMood();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [lastUpdate, updateMood]);

  const refreshMood = useCallback(async () => {
    await updateMood();
  }, [updateMood]);

  return {
    mood,
    analysis,
    isLoading,
    error,
    lastUpdate,
    refreshMood
  };
}