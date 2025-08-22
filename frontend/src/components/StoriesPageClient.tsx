'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Zap, Star, Waves, Users, Mic, MicOff, Play, Pause, Volume2, Plane, Tractor, Camera, MessageCircle, Sparkles } from 'lucide-react';
import { useRealTimeSpaceWeather } from '@/hooks/useRealTimeSpaceWeather';
import Navigation from '@/components/Navigation';

interface Character {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  greeting: string;
}

export default function StoriesPageClient() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'8-10' | '11-13' | '14-17'>('11-13');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStory, setCurrentStory] = useState<string>('');
  const [showStory, setShowStory] = useState(false);
  const [educationalFacts, setEducationalFacts] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const { mostSignificantEvent, recentEvents } = useRealTimeSpaceWeather();

  const characters: Character[] = [
    {
      id: 'astronaut',
      name: 'Sumaiya Subha',
      icon: <Rocket className="w-12 h-12" />,
      description: 'ISS Astronaut & Mission Specialist with over 400 days in space!',
      color: 'from-blue-400 via-blue-500 to-indigo-600',
      greeting: 'Hello from the International Space Station! I\'ve witnessed amazing space weather events from orbit. Let me share how space weather affects astronauts and spacecraft!'
    },
    {
      id: 'pilot',
      name: 'Captain Tanvir Rahman',
      icon: <Plane className="w-12 h-12" />,
      description: 'Experienced airline pilot who navigates space weather challenges during flights.',
      color: 'from-sky-400 via-blue-500 to-cyan-600',
      greeting: 'This is your captain speaking! I\'ve flown through many space weather events. Let me explain how pilots keep passengers safe when space weather affects our aircraft!'
    },
    {
      id: 'farmer',
      name: 'Wasif Ahmad',
      icon: <Tractor className="w-12 h-12" />,
      description: 'Modern farmer who uses GPS-guided tractors and precision agriculture technology.',
      color: 'from-green-400 via-emerald-500 to-teal-600',
      greeting: 'Welcome to my farm! You might be surprised to learn how space weather affects farming. Let me show you the connection between space and agriculture!'
    },
    {
      id: 'power_grid_operator',
      name: 'Ibrahim Ilham',
      icon: <Zap className="w-12 h-12" />,
      description: 'Power grid operator protecting electrical systems during geomagnetic storms.',
      color: 'from-orange-400 via-red-500 to-amber-600',
      greeting: 'I work at the power control center, keeping the lights on for millions of people. Let me explain how space weather can affect the electricity that powers our world!'
    },
    {
      id: 'aurora_hunter',
      name: 'Saad Wasit',
      icon: <Camera className="w-12 h-12" />,
      description: 'Aurora photographer and everyday person who witnesses space weather\'s beauty.',
      color: 'from-purple-400 via-pink-500 to-violet-600',
      greeting: 'I chase the Northern Lights across Canada! As a member of the general public, I\'ll show you how space weather creates the most beautiful light show on Earth!'
    },
    {
      id: 'radio_operator',
      name: 'Arman Khan',
      icon: <Waves className="w-12 h-12" />,
      description: 'Ham radio operator maintaining emergency communications during space weather events.',
      color: 'from-indigo-400 via-purple-500 to-blue-600',
      greeting: 'This is Arman, emergency communications coordinator. Let me explain how space weather disrupts radio waves and affects the technology that connects our world!'
    }
  ];

  const generateStory = async (character: Character) => {
    setIsGenerating(true);
    setShowStory(false);
    
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: character.id,
          ageGroup: selectedAgeGroup,
          eventType: mostSignificantEvent?.eventType || 'solar_flare',
          intensity: mostSignificantEvent?.severityLevel || 'moderate',
          eventTime: mostSignificantEvent?.eventTime || new Date().toISOString(),
          sourceData: mostSignificantEvent?.sourceData || {}
        })
      });

      const data = await response.json();
      
      if (data.success && data.story) {
        setCurrentStory(data.story.story);
        setEducationalFacts(generateEducationalFacts(mostSignificantEvent?.eventType || 'solar_flare'));
        setShowStory(true);
      }
    } catch (error) {
      console.error('Error generating story:', error);
      setCurrentStory('Oops! Something went wrong while creating your story. Please try again!');
      setEducationalFacts([]);
      setShowStory(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateEducationalFacts = (eventType: string): string[] => {
    const factsByType: Record<string, string[]> = {
      solar_flare: [
        "Solar flares are explosive releases of magnetic energy that can reach temperatures of 10-20 million degrees Celsius!",
        "The largest solar flare ever recorded was in 2003 and was so powerful it overloaded the sensors measuring it.",
        "Solar flares travel at the speed of light, so their radiation reaches Earth in just 8 minutes.",
        "During a solar flare, the Sun releases as much energy as billions of hydrogen bombs exploding every second!",
        "Solar flares are classified from A, B, C, M to X - with X being the most powerful category."
      ],
      cme: [
        "Coronal Mass Ejections can contain up to 1 billion tons of plasma traveling at speeds of 1-3 million mph!",
        "CMEs take 1-4 days to reach Earth, giving us time to prepare for their arrival.",
        "The largest CME on record occurred in 1859 and caused telegraph wires to spark and catch fire.",
        "CMEs can create beautiful auroras that can be seen much further from the poles than usual.",
        "A CME is like a giant magnetic bubble of plasma that can be larger than the planet Jupiter!"
      ],
      geomagnetic_storm: [
        "Geomagnetic storms can cause GPS systems to be off by several meters and disrupt satellite communications.",
        "The beautiful northern and southern lights (auroras) are actually caused by geomagnetic storms!",
        "Geomagnetic storms can induce electrical currents in power grids, sometimes causing blackouts.",
        "During severe geomagnetic storms, auroras have been seen as far south as the Caribbean and Hawaii.",
        "Migrating animals like sea turtles and birds can get confused during geomagnetic storms because they use Earth's magnetic field to navigate."
      ],
      radio_blackout: [
        "Radio blackouts occur when solar X-rays ionize the upper atmosphere, making it absorb radio waves.",
        "During radio blackouts, airplanes flying over the poles may lose radio contact with ground control.",
        "Ham radio operators around the world monitor space weather because it greatly affects their communications.",
        "Radio blackouts typically last from minutes to hours, depending on the strength of the solar flare.",
        "The ionosphere acts like a radio mirror during normal times but becomes absorptive during radio blackouts."
      ],
      aurora: [
        "Auroras occur 60-400 miles above Earth's surface in the thermosphere and mesosphere.",
        "The different colors of auroras depend on which gas molecules are hit: oxygen creates green and red, nitrogen creates blue and purple.",
        "Jupiter, Saturn, Uranus, and Neptune also have auroras, but they're mostly invisible ultraviolet light.",
        "An aurora can release as much energy as a magnitude 5.5 earthquake!",
        "Indigenous peoples have many beautiful legends about auroras - some believed they were dancing spirits of their ancestors."
      ]
    };

    const generalFacts = [
      "The Sun's magnetic field is 10,000 times stronger than Earth's magnetic field.",
      "Space weather can affect technology on Earth even though space is 100+ miles away!",
      "Astronauts in space need to take shelter during severe space weather events to avoid radiation.",
      "The Sun follows an 11-year cycle of activity, with solar maximum and solar minimum periods.",
      "Earth's magnetic field acts like a protective shield, deflecting most harmful space radiation."
    ];

    const eventFacts = factsByType[eventType] || generalFacts;
    // Return 3 random facts
    const shuffled = [...eventFacts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  // Text-to-Speech functions
  const playStory = () => {
    if (!speechSynthesis || !currentStory) return;

    // Stop any existing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentStory);
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use a more natural voice if available
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Natural') || 
      voice.name.includes('Enhanced') || 
      voice.lang.startsWith('en-')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  };

  const pauseStory = () => {
    if (speechSynthesis && isPlaying) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeStory = () => {
    if (speechSynthesis && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopStory = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    }
  };

  // Clean up speech when component unmounts or story changes
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]);

  useEffect(() => {
    // Stop speech when story changes
    stopStory();
  }, [currentStory]);

  const getCurrentWeatherSummary = () => {
    if (mostSignificantEvent) {
      return `Today: ${mostSignificantEvent.eventType.replace('_', ' ').toUpperCase()} - ${mostSignificantEvent.severityLevel}`;
    }
    if (recentEvents.length > 0) {
      return `Active Events: ${recentEvents.length} space weather activities`;
    }
    return 'Today: Calm space weather conditions';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navigation currentWeatherEvent={getCurrentWeatherSummary()} />

      {/* Hero Section */}
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-solar-gradient">Solar Tales</span>
                <br />
                <span className="text-white">Space Weather Stories</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                Discover amazing space weather stories with your favorite characters! 
                Experience solar flares, auroras, and cosmic events through the eyes of 
                legendary astronauts, scientists, and space explorers.
              </p>
            </motion.div>
          </div>

          {/* Age Group Selection */}
          {!selectedCharacter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="glass bg-gradient-to-br from-purple-800/30 to-blue-800/30 p-8 rounded-3xl backdrop-blur-sm max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-center mb-6 text-white">
                  Choose Your Reading Level
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: '8-10', label: 'Beginner (Ages 8-10)', description: 'Simple words and fun explanations' },
                    { value: '11-13', label: 'Intermediate (Ages 11-13)', description: 'Engaging vocabulary with science terms' },
                    { value: '14-17', label: 'Advanced (Ages 14-17)', description: 'Detailed scientific explanations' }
                  ].map((ageGroup) => (
                    <button
                      key={ageGroup.value}
                      onClick={() => setSelectedAgeGroup(ageGroup.value as '8-10' | '11-13' | '14-17')}
                      className={`p-4 rounded-xl transition-all duration-300 text-left border ${
                        selectedAgeGroup === ageGroup.value
                          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/50 shadow-lg shadow-cyan-400/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="font-semibold text-white mb-1">{ageGroup.label}</div>
                      <div className="text-sm text-gray-300">{ageGroup.description}</div>
                      {selectedAgeGroup === ageGroup.value && (
                        <div className="mt-2 flex items-center space-x-1 text-cyan-400">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-xs font-medium">Selected</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Character Selection */}
          {!selectedCharacter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12"
            >
              <h2 className="text-4xl font-bold text-center mb-12">
                Choose Your Space Weather Guide!
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {characters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
              >
                <div
                  className={`bg-gradient-to-br ${character.color} p-6 rounded-3xl cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:shadow-current/40 border border-white/20 backdrop-blur-sm hover:scale-105 group-hover:animate-pulse min-h-[24rem] max-h-[24rem] overflow-hidden`}
                  onClick={() => setSelectedCharacter(character)}
                >
                  <div className="text-center h-full flex flex-col">
                    {/* Top section - Icon, Name, Description */}
                    <div className="mb-4">
                      <div className="text-white mb-3 flex justify-center bg-white/30 w-16 h-16 rounded-full items-center mx-auto shadow-lg group-hover:bg-white/40 transition-all duration-300">
                        {character.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white drop-shadow-lg">{character.name}</h3>
                      <p className="text-sm text-white/95 drop-shadow-md">{character.description}</p>
                    </div>
                    
                    {/* Middle section - Greeting */}
                    <div className="flex-1 flex items-center mb-4">
                      <div className="w-full bg-white/30 rounded-xl p-3 border border-white/30 shadow-md">
                        <p className="text-xs italic text-white font-medium leading-tight">"{character.greeting}"</p>
                      </div>
                    </div>
                    
                    {/* Bottom section - Button */}
                    <div>
                      <button className="bg-white/40 hover:bg-white/60 px-4 py-2 rounded-full font-bold transition-colors text-gray-800 shadow-lg text-sm">
                        Choose {character.name}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
          )}

          {/* Story Generation & Display */}
          {selectedCharacter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12"
            >
          <div className="max-w-4xl mx-auto">
            {/* Character Header */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`glass bg-gradient-to-r ${selectedCharacter.color} p-6 rounded-3xl mb-8`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-white">{selectedCharacter.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
                    <p className="opacity-90">Your Space Weather Guide</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCharacter(null);
                    setShowStory(false);
                    setCurrentStory('');
                    setEducationalFacts([]);
                  }}
                  className="glass bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  Choose Different Guide
                </button>
              </div>
            </motion.div>

            {/* Story Action */}
            {!showStory && !isGenerating && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 p-12 rounded-3xl backdrop-blur-sm">
                  <h3 className="text-3xl font-bold mb-6">Ready for Your Story?</h3>
                  <p className="text-xl mb-4 text-blue-200">
                    {selectedCharacter.name} will create a personalized space weather adventure just for you!
                  </p>
                  <div className="flex items-center justify-center space-x-2 mb-8 text-cyan-300">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-lg font-medium">
                      Reading Level: {selectedAgeGroup === '8-10' ? 'Beginner (Ages 8-10)' : 
                                     selectedAgeGroup === '11-13' ? 'Intermediate (Ages 11-13)' : 
                                     'Advanced (Ages 14-17)'}
                    </span>
                  </div>
                  <button
                    onClick={() => generateStory(selectedCharacter)}
                    className="bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 px-8 py-4 rounded-full text-xl font-bold transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Create My Story!
                  </button>
                </div>
              </motion.div>
            )}

            {/* Loading Animation */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 p-12 rounded-3xl backdrop-blur-sm">
                  <div className="text-white mb-6 flex justify-center">
                    <Rocket className="w-16 h-16 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Creating Your Story...</h3>
                  <p className="text-lg text-blue-200 mb-6">
                    {selectedCharacter.name} is gathering the latest space weather data!
                  </p>
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Story Display */}
            {showStory && currentStory && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass bg-gradient-to-br from-indigo-800/50 to-purple-800/50 p-8 rounded-3xl backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="text-white">{selectedCharacter.icon}</div>
                      <h3 className="text-xl sm:text-2xl font-bold">Your Space Weather Adventure</h3>
                    </div>
                    
                    {/* Audio Controls */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {!isPlaying && !isPaused && (
                        <button
                          onClick={playStory}
                          className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-all duration-300 text-blue-200 hover:text-blue-100"
                          title="Listen to story"
                        >
                          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-sm font-medium hidden sm:inline">Listen</span>
                        </button>
                      )}
                      
                      {isPlaying && !isPaused && (
                        <button
                          onClick={pauseStory}
                          className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-all duration-300 text-orange-200 hover:text-orange-100"
                          title="Pause story"
                        >
                          <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-sm font-medium hidden sm:inline">Pause</span>
                        </button>
                      )}
                      
                      {isPaused && (
                        <button
                          onClick={resumeStory}
                          className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-all duration-300 text-green-200 hover:text-green-100"
                          title="Resume story"
                        >
                          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-sm font-medium hidden sm:inline">Resume</span>
                        </button>
                      )}
                      
                      {(isPlaying || isPaused) && (
                        <button
                          onClick={stopStory}
                          className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-red-200 hover:text-red-100"
                          title="Stop story"
                        >
                          <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Playing indicator */}
                  {isPlaying && (
                    <div className="mb-4 flex items-center space-x-2 text-blue-300">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm">Now playing...</span>
                    </div>
                  )}
                  
                  <div className="prose prose-invert prose-lg max-w-none">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                      {currentStory}
                    </p>
                  </div>
                </div>

                {/* Educational Facts Section */}
                {educationalFacts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-emerald-800/50 to-blue-800/50 p-8 rounded-3xl backdrop-blur-sm border border-emerald-400/20"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-emerald-400/20 p-3 rounded-full">
                        <Star className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-emerald-400">Did You Know?</h3>
                    </div>
                    <div className="space-y-4">
                      {educationalFacts.map((fact, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start space-x-3"
                        >
                          <div className="bg-emerald-400/20 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-emerald-400 font-bold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-gray-200 leading-relaxed">{fact}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* AI Question Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-cyan-800/50 to-indigo-800/50 p-8 rounded-3xl backdrop-blur-sm border border-cyan-400/20"
                >
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="bg-cyan-400/20 p-3 rounded-full">
                        <Sparkles className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-cyan-400">Curious About Space Weather?</h3>
                    </div>
                    <p className="text-gray-300 text-lg mb-6">
                      Have questions about what you just read? Our AI space weather expert is here to help!
                    </p>
                    <button
                      onClick={() => window.open('/ask', '_blank')}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-4 rounded-full font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-3 mx-auto"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span>Ask Our AI Space Weather Expert!</span>
                      <Sparkles className="w-5 h-5" />
                    </button>
                    <p className="text-cyan-300 text-sm">
                      Get instant answers about space weather, solar storms, and cosmic phenomena!
                    </p>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => generateStory(selectedCharacter)}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-6 py-3 rounded-full font-bold transition-all duration-300"
                  >
                    New Adventure
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCharacter(null);
                      setShowStory(false);
                      setCurrentStory('');
                      setEducationalFacts([]);
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-full font-bold transition-all duration-300"
                  >
                    New Guide
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass mt-16 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-solar-gradient">
              © 2025 SolarTales | Developed by Tanvir Rahman & The White Hole
            </p>
            <p className="text-gray-300 font-medium">
              SolarTales - Where Space Weather Meets Storytelling
            </p>
            <p className="text-gray-400 text-sm">
              NASA Space Apps Challenge 2025 | Powered by NASA Data
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .stars {
          background-image: radial-gradient(2px 2px at 20px 30px, #eee, transparent),
                            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
                            radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: sparkle 3s linear infinite;
        }
        
        @keyframes sparkle {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-100px); }
        }
      `}</style>
    </div>
  );
}
