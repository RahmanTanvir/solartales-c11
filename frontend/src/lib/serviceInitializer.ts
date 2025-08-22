// Service initialization for the pre-generator
// This ensures stories are ready immediately when users visit

import { initializeStoryPreGenerator } from './storyPreGenerator';

let initializationPromise: Promise<void> | null = null;

export async function initializeServices() {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('🚀 Starting service initialization...');
      
      // Initialize the story pre-generator
      await initializeStoryPreGenerator();
      
      console.log('✅ All services initialized successfully');
    } catch (error) {
      console.error('❌ Service initialization failed:', error);
      // Don't let initialization failure break the app
    }
  })();

  return initializationPromise;
}

// Auto-initialize when module is imported
if (typeof window === 'undefined') {
  // Only initialize on server-side
  initializeServices().catch(console.error);
}
