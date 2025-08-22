'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FeaturesSection } from '@/components/FeatureCard';
import { LiveDataDashboard } from '@/components/LiveDataDashboard';
import { backgroundStoryService } from '@/lib/backgroundStoryService';

export default function HomePage() {
  const [currentWeatherEvent, setCurrentWeatherEvent] = useState('Solar Activity Detected');
  const [backgroundStoryStatus, setBackgroundStoryStatus] = useState('Initializing...');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    // Initialize background story generation
    backgroundStoryService.startBackgroundGeneration();
    
    // Listen for background story events
    const handleBackgroundStory = (event: CustomEvent) => {
      setBackgroundStoryStatus(`New story: "${event.detail.story.title}"`);
      setTimeout(() => {
        setBackgroundStoryStatus('Stories generating in background...');
      }, 5000);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('backgroundStoryGenerated', handleBackgroundStory as EventListener);
    }
    
    // Simulate real-time weather updates
    const weatherEvents = [
      'Solar Flare Incoming',
      'Aurora Activity High', 
      'Geomagnetic Storm Active',
      'Coronal Mass Ejection Detected',
      'Solar Wind Fluctuations'
    ];
    
    const interval = setInterval(() => {
      setCurrentWeatherEvent(weatherEvents[Math.floor(Math.random() * weatherEvents.length)]);
    }, 5000);

    // Update background story status periodically
    const statusInterval = setInterval(() => {
      // const status = backgroundStoryService.getStatus();
      // if (status.isRunning && !status.isGenerating) {
      //   setBackgroundStoryStatus('Stories generating in background...');
      // } else if (status.isGenerating) {
      //   setBackgroundStoryStatus('Generating new story...');
      // }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('backgroundStoryGenerated', handleBackgroundStory as EventListener);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navigation currentWeatherEvent={currentWeatherEvent} />

      {/* Hero Section */}
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            {hasMounted ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="text-gradient">Experience Space</span>
                  <br />
                  <span className="text-white">Through Stories</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                  Journey through the cosmos with real-time space weather data transformed into 
                  immersive, educational stories. Witness solar flares, aurora displays, and 
                  cosmic events through the eyes of astronauts, scientists, and space explorers.
                </p>
              </motion.div>
            ) : (
              <div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="text-gradient">Experience Space</span>
                  <br />
                  <span className="text-white">Through Stories</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                  Journey through the cosmos with real-time space weather data transformed into 
                  immersive, educational stories. Witness solar flares, aurora displays, and 
                  cosmic events through the eyes of astronauts, scientists, and space explorers.
                </p>
              </div>
            )}

            {hasMounted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link 
                  href="/stories"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  🚀 Start Your AI Story Journey
                </Link>
                <Link 
                  href="/data"
                  className="glass px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  View Live Data
                </Link>
                <Link 
                  href="/about"
                  className="border border-blue-400 text-blue-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="/stories"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  🚀 Start Your AI Story Journey
                </a>
                <a 
                  href="/data"
                  className="glass px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  View Live Data
                </a>
                <a 
                  href="/about"
                  className="border border-blue-400 text-blue-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300"
                >
                  Learn More
                </a>
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <FeaturesSection />

          {/* Live Data Preview */}
          <LiveDataDashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
}
