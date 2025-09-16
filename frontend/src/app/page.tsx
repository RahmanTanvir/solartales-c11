'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FeaturesSection } from '@/components/FeatureCard';
import { LiveDataDashboard } from '@/components/LiveDataDashboard';
import SunCharacter from '@/components/SunCharacter';
import SolarAdventureButton from '@/components/SolarAdventureButton';
import { useSunMood } from '@/hooks/useSunMood';

export default function HomePage() {
  const [currentWeatherEvent, setCurrentWeatherEvent] = useState('Solar Activity Detected');
  const [hasMounted, setHasMounted] = useState(false);
  const { mood, analysis, isLoading, refreshMood } = useSunMood();

  useEffect(() => {
    setHasMounted(true);
    
    // Update weather event based on sun mood analysis
    if (analysis) {
      const event = analysis.reasons[0] || 'Solar Activity Detected';
      setCurrentWeatherEvent(event);
    }
  }, [analysis]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navigation currentWeatherEvent={currentWeatherEvent} />

      {/* Hero Section */}
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Sun Character Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
            {/* Sun Character */}
            <div className="lg:w-1/2 flex justify-center">
              {hasMounted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <SunCharacter
                    mood={mood}
                    size="large"
                    showDialogue={true}
                    onSunClick={refreshMood}
                    className="cursor-pointer"
                  />
                </motion.div>
              )}
              {!hasMounted && (
                <div className="w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse" />
              )}
            </div>

            {/* Title and Description */}
            <div className="lg:w-1/2 text-center lg:text-left">
              {hasMounted ? (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                    <span className="text-gradient">Experience Space</span>
                    <br />
                    <span className="text-white">Through Stories</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-6">
                    Journey through the cosmos with real-time space weather data transformed into 
                    immersive, educational stories. Our friendly Sun companion reacts to live solar activity,
                    making space science engaging and accessible.
                  </p>
                </motion.div>
              ) : (
                <div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                    <span className="text-gradient">Experience Space</span>
                    <br />
                    <span className="text-white">Through Stories</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-8">
                    Journey through the cosmos with real-time space weather data transformed into 
                    immersive, educational stories. Our friendly Sun companion reacts to live solar activity,
                    making space science engaging and accessible.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mb-16">
            {hasMounted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex justify-center items-center"
              >
                <SolarAdventureButton />
              </motion.div>
            ) : (
              <div className="flex justify-center items-center">
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-12 py-6 rounded-full text-xl font-bold text-white animate-pulse">
                  ✨ Start My Solar Adventure! ✨
                </div>
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
