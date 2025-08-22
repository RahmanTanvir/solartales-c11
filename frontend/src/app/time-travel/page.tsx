'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { TimeTravelEvent } from '@/lib/timeTravelEvents';
import { TimeTravelEventCard } from '@/components/TimeTravelEventCard';
import { TimeTravelStoryViewer } from '@/components/TimeTravelStoryViewer';
import { Clock, Calendar, Sparkles, ArrowLeft, History, Globe, Zap } from 'lucide-react';

// Historical space weather events
const historicalEvents: TimeTravelEvent[] = [
  {
    id: 'carrington-1859',
    name: 'The Carrington Event',
    date: new Date('1859-09-01'),
    era: 'Victorian Era',
    description: 'The most powerful geomagnetic storm in recorded history',
    longDescription: 'On September 1-2, 1859, the most powerful geomagnetic storm in recorded history struck Earth. Telegraph systems worldwide failed, operators received electric shocks, and auroras were visible as far south as the Caribbean and Rome.',
    impacts: [
      'Telegraph systems worldwide failed',
      'Telegraph wires sparked and caught fire',
      'Aurora seen as far south as the Caribbean',
      'Telegraph operators received electric shocks',
      'Some telegraph systems worked without power'
    ],
    historicalContext: 'During the Victorian era, the telegraph was the main form of long-distance communication, connecting the world for the first time.',
    characters: ['telegraph_operator', 'victorian_scientist', 'ship_navigator'],
    severity: 'extreme',
    theme: {
      colors: {
        primary: 'from-amber-700 to-orange-800',
        secondary: 'from-yellow-600 to-amber-700',
        accent: 'text-amber-400',
        background: 'bg-gradient-to-br from-amber-900/20 to-orange-900/30'
      },
      fonts: {
        primary: 'font-serif',
        accent: 'font-mono'
      },
      decorations: ['sepia-filter', 'vintage-borders', 'telegraph-symbols']
    },
    imageUrl: '/historical/carrington-1859.jpg',
    significance: 'First documented major space weather event affecting technology'
  },
  {
    id: 'quebec-blackout-1989',
    name: 'Quebec Blackout Storm',
    date: new Date('1989-03-13'),
    era: 'Modern Era',
    description: 'Geomagnetic storm that left 6 million people without power in Quebec',
    longDescription: 'On March 13, 1989, a powerful geomagnetic storm caused a complete power grid collapse in Quebec, Canada, leaving 6 million people without electricity for 9 hours.',
    impacts: [
      '6 million people lost power for 9 hours',
      'Power grid transformers damaged',
      'Air traffic control systems disrupted',
      'Aurora visible in southern United States',
      'Satellite operations affected'
    ],
    historicalContext: 'The late 1980s marked the beginning of our modern dependence on electrical grids and computer systems.',
    characters: ['power_grid_operator', 'emergency_responder', 'radio_operator'],
    severity: 'high',
    theme: {
      colors: {
        primary: 'from-blue-700 to-indigo-800',
        secondary: 'from-cyan-600 to-blue-700',
        accent: 'text-blue-400',
        background: 'bg-gradient-to-br from-blue-900/20 to-indigo-900/30'
      },
      fonts: {
        primary: 'font-sans',
        accent: 'font-mono'
      },
      decorations: ['neon-glow', 'circuit-patterns', 'power-symbols']
    },
    imageUrl: '/historical/quebec-1989.jpg',
    significance: 'First major power grid failure due to space weather in the modern era'
  },
  {
    id: 'halloween-storm-2003',
    name: 'Halloween Solar Storms',
    date: new Date('2003-10-28'),
    era: 'Internet Age',
    description: 'Series of powerful solar storms during Halloween 2003',
    longDescription: 'Between October 28 and November 4, 2003, a series of powerful solar storms disrupted satellites, GPS systems, and power grids worldwide during the peak of the internet age.',
    impacts: [
      'GPS navigation systems failed',
      'Satellites damaged or destroyed',
      'Power outages in Sweden',
      'Airlines rerouted polar flights',
      'Internet and cell phone disruptions'
    ],
    historicalContext: 'The early 2000s saw the rise of GPS technology, satellite internet, and our modern connected world.',
    characters: ['astronaut', 'gps_technician', 'satellite_operator'],
    severity: 'extreme',
    theme: {
      colors: {
        primary: 'from-orange-600 to-red-700',
        secondary: 'from-purple-600 to-orange-600',
        accent: 'text-orange-400',
        background: 'bg-gradient-to-br from-orange-900/20 to-purple-900/30'
      },
      fonts: {
        primary: 'font-sans',
        accent: 'font-digital'
      },
      decorations: ['halloween-theme', 'digital-glitch', 'satellite-symbols']
    },
    imageUrl: '/historical/halloween-2003.jpg',
    significance: 'Demonstrated vulnerability of modern satellite-dependent technology'
  }
];

export default function TimeTravelPage() {
  const [selectedEvent, setSelectedEvent] = useState<TimeTravelEvent | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEventSelect = (event: TimeTravelEvent) => {
    setSelectedEvent(event);
    setSelectedCharacter(null);
    setShowStoryViewer(false);
  };

  const handleCharacterSelect = async (character: string) => {
    setSelectedCharacter(character);
    setIsLoading(true);
    setShowStoryViewer(true);
    
    // Simulate loading time for story generation
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setSelectedCharacter(null);
    setShowStoryViewer(false);
  };

  const handleBackToCharacters = () => {
    setShowStoryViewer(false);
    setSelectedCharacter(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <Navigation currentWeatherEvent="Time Travel Mode Active" />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Clock className="w-12 h-12 text-purple-400 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-gradient">
                Time Travel
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Journey through history's most dramatic space weather events and experience them through the eyes of those who lived through them.
            </p>
            
            {/* Navigation breadcrumb */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <History className="w-4 h-4" />
              {!selectedEvent && <span>Select Historical Event</span>}
              {selectedEvent && !showStoryViewer && (
                <>
                  <span>{selectedEvent.name}</span>
                  <span>→</span>
                  <span>Choose Your Perspective</span>
                </>
              )}
              {selectedEvent && showStoryViewer && (
                <>
                  <span>{selectedEvent.name}</span>
                  <span>→</span>
                  <span>Experience the Story</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Content based on current step */}
          <AnimatePresence mode="wait">
            {!selectedEvent && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Timeline visualization */}
                <div className="relative">
                  {/* Desktop timeline line */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-blue-500 opacity-30"></div>
                  {/* Mobile timeline line */}
                  <div className="md:hidden absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-blue-500 opacity-30"></div>
                  
                  {historicalEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`flex items-center mb-16 ${
                        /* Mobile: always left-aligned */
                        'flex-row'
                      } ${
                        /* Desktop: alternating sides */ 
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Desktop layout */}
                      <div className={`hidden md:block w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                        <TimeTravelEventCard
                          event={event}
                          onSelect={() => handleEventSelect(event)}
                          alignment={index % 2 === 0 ? 'right' : 'left'}
                        />
                      </div>
                      
                      {/* Mobile layout - stacked vertically */}
                      <div className="md:hidden w-full pl-16">
                        <TimeTravelEventCard
                          event={event}
                          onSelect={() => handleEventSelect(event)}
                          alignment={'left'}
                        />
                      </div>
                      
                      {/* Timeline dot */}
                      <div className="relative z-10">
                        {/* Desktop dot */}
                        <div className="hidden md:block w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-4 border-gray-900"></div>
                        {/* Mobile dot */}
                        <div className="md:hidden absolute left-[-31px] w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-4 border-gray-900"></div>
                      </div>
                      
                      {/* Desktop right spacer */}
                      <div className="hidden md:block w-1/2"></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedEvent && !showStoryViewer && (
              <motion.div
                key="characters"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Back button */}
                <button
                  onClick={handleBackToEvents}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Events</span>
                </button>

                {/* Event details with era-specific styling */}
                <div className={`${selectedEvent.theme.colors.background} p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10`}>
                  <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8">
                    <div>
                      <h2 className={`text-2xl md:text-3xl font-bold ${selectedEvent.theme.colors.accent} mb-4 ${selectedEvent.theme.fonts.primary}`}>
                        {selectedEvent.name}
                      </h2>
                      <p className="text-gray-300 mb-6 text-sm md:text-base leading-relaxed">
                        {selectedEvent.longDescription}
                      </p>
                      
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                          <span className={`text-sm md:text-base ${selectedEvent.theme.fonts.accent}`}>
                            {selectedEvent.date.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                          <span className="text-sm md:text-base">{selectedEvent.era}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                          <span className="text-sm md:text-base capitalize">{selectedEvent.severity} Severity</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold mb-4 text-purple-400">Historical Impact</h3>
                      <ul className="space-y-2">
                        {selectedEvent.impacts.map((impact, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-2"
                          >
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300 text-sm md:text-base">{impact}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Character selection */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
                    Choose Your Historical Perspective
                  </h3>
                  
                  {/* Mobile: Stack vertically, Desktop: Grid */}
                  <div className="flex flex-col space-y-4 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
                    {selectedEvent.characters.map((character, index) => (
                      <motion.button
                        key={character}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleCharacterSelect(character)}
                        className={`${selectedEvent.theme.colors.background} p-4 md:p-6 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 md:hover:scale-105 group`}
                      >
                        <CharacterIcon character={character} event={selectedEvent} />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {showStoryViewer && selectedEvent && selectedCharacter && (
              <TimeTravelStoryViewer
                event={selectedEvent}
                character={selectedCharacter}
                isLoading={isLoading}
                onBack={handleBackToCharacters}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Character icon component with era-specific styling
function CharacterIcon({ character, event }: { character: string; event: TimeTravelEvent }) {
  const characterData = getCharacterData(character, event);
  
  return (
    <div className="text-center md:text-center">
      {/* Mobile: Horizontal layout, Desktop: Vertical layout */}
      <div className="flex md:block items-center md:items-start space-x-4 md:space-x-0">
        <div className={`text-3xl md:text-4xl mb-0 md:mb-4 ${event.theme.colors.accent} flex-shrink-0`}>
          {characterData.icon}
        </div>
        <div className="flex-1 text-left md:text-center">
          <h4 className={`font-semibold mb-1 md:mb-2 text-sm md:text-base ${event.theme.fonts.primary}`}>
            {characterData.name}
          </h4>
          <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-4">
            {characterData.role}
          </p>
          <div className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs ${event.theme.colors.primary} text-white`}>
            Experience Their Story
          </div>
        </div>
      </div>
    </div>
  );
}

// Character data based on historical context
function getCharacterData(character: string, event: TimeTravelEvent) {
  const characterMap: Record<string, Record<string, any>> = {
    telegraph_operator: {
      carrington: {
        icon: '📡',
        name: 'Telegraph Operator',
        role: 'Operating the Victorian communication network'
      }
    },
    victorian_scientist: {
      carrington: {
        icon: '🔬',
        name: 'Victorian Scientist',
        role: 'Studying this mysterious phenomenon'
      }
    },
    ship_navigator: {
      carrington: {
        icon: '🧭',
        name: 'Ship Navigator',
        role: 'Navigating by compass during the storm'
      }
    },
    power_grid_operator: {
      quebec: {
        icon: '⚡',
        name: 'Power Grid Operator',
        role: 'Managing Quebec\'s electrical grid'
      }
    },
    emergency_responder: {
      quebec: {
        icon: '🚨',
        name: 'Emergency Responder',
        role: 'Coordinating emergency response'
      }
    },
    radio_operator: {
      quebec: {
        icon: '📻',
        name: 'Radio Operator',
        role: 'Maintaining emergency communications'
      }
    },
    astronaut: {
      halloween: {
        icon: '👨‍🚀',
        name: 'ISS Astronaut',
        role: 'Experiencing the storm from space'
      }
    },
    gps_technician: {
      halloween: {
        icon: '🛰️',
        name: 'GPS Technician',
        role: 'Monitoring satellite navigation systems'
      }
    },
    satellite_operator: {
      halloween: {
        icon: '📡',
        name: 'Satellite Operator',
        role: 'Managing satellite communications'
      }
    }
  };

  const eventKey = event.id.split('-')[0]; // carrington, quebec, halloween
  return characterMap[character]?.[eventKey] || {
    icon: '👤',
    name: character.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    role: 'Historical perspective'
  };
}
