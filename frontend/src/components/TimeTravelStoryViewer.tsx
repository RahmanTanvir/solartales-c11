'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeTravelEvent, getCharacterById } from '@/lib/timeTravelEvents';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Clock, User, Sparkles } from 'lucide-react';

interface TimeTravelStoryViewerProps {
  event: TimeTravelEvent;
  character: string;
  isLoading: boolean;
  onBack: () => void;
}

interface StorySection {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  educationalNote?: string;
  audioUrl?: string;
}

// Real API story generation
const generateHistoricalStory = async (event: TimeTravelEvent, character: string): Promise<{
  title: string;
  story: string;
  sections: StorySection[];
  educationalFacts: string[];
}> => {
  try {
    const response = await fetch('/api/historical-stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId: event.id,
        character: character,
        ageGroup: '11-13'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate story');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Story generation failed');
    }

    // Parse the story content into sections
    const storyContent = data.story.content;
    const sections = parseStoryIntoSections(storyContent, event);
    
    return {
      title: data.story.title,
      story: storyContent,
      sections: sections,
      educationalFacts: data.story.educationalFacts || []
    };
    
  } catch (error) {
    console.error('Error generating historical story:', error);
    
    // Fallback to mock data if API fails
    const characterData = getCharacterById(character);
    const fallbackData = getFallbackStoryForEvent(event.id, character);
    
    return {
      title: `${characterData?.name || 'Unknown'}: ${event.name}`,
      story: fallbackData.fullStory,
      sections: fallbackData.sections,
      educationalFacts: fallbackData.educationalFacts
    };
  }
};

// Parse AI-generated story into sections
function parseStoryIntoSections(story: string, event: TimeTravelEvent): StorySection[] {
  // Simple story parsing - in a real implementation, you might use more sophisticated NLP
  const paragraphs = story.split('\n\n').filter(p => p.trim());
  
  const sections: StorySection[] = [];
  let currentTimestamp = event.date;
  
  paragraphs.forEach((paragraph, index) => {
    if (paragraph.length > 50) { // Only include substantial paragraphs
      // Create timestamps based on the event progression
      const timeOffset = index * 2; // 2 hours apart
      const sectionTime = new Date(currentTimestamp.getTime() + (timeOffset * 60 * 60 * 1000));
      
      sections.push({
        id: `section-${index}`,
        title: generateSectionTitle(paragraph, index),
        content: paragraph.trim(),
        timestamp: sectionTime.toLocaleTimeString('en-US', { 
          year: 'numeric',
          month: 'long', 
          day: 'numeric',
          hour: '2-digit', 
          minute: '2-digit'
        }),
        educationalNote: generateEducationalNote(paragraph, event)
      });
    }
  });
  
  return sections.length > 0 ? sections : getFallbackStoryForEvent(event.id, '').sections;
}

// Generate section titles from content
function generateSectionTitle(content: string, index: number): string {
  const titles = [
    'The Beginning',
    'Strange Phenomena',
    'Growing Intensity', 
    'Peak Events',
    'Aftermath',
    'Reflection'
  ];
  
  // Try to extract a title from the first sentence
  const firstSentence = content.split('.')[0];
  if (firstSentence.length < 60) {
    return firstSentence;
  }
  
  return titles[index] || `Part ${index + 1}`;
}

// Generate educational notes based on content
function generateEducationalNote(content: string, event: TimeTravelEvent): string | undefined {
  const keywords = {
    'telegraph': 'Telegraph systems were the internet of the Victorian era, connecting the world for the first time.',
    'aurora': 'Auroras are created when solar particles interact with Earth\'s magnetic field and atmosphere.',
    'power grid': 'Power grids are vulnerable to geomagnetic storms which can induce dangerous electrical currents.',
    'satellite': 'Satellites in space are directly exposed to solar radiation and can be permanently damaged.',
    'magnetic field': 'Earth\'s magnetic field acts as a shield protecting us from harmful solar radiation.',
    'solar flare': 'Solar flares are massive explosions on the Sun\'s surface that release enormous amounts of energy.'
  };
  
  for (const [keyword, note] of Object.entries(keywords)) {
    if (content.toLowerCase().includes(keyword)) {
      return note;
    }
  }
  
  return undefined;
}

// Fallback story data if API fails
function getFallbackStoryForEvent(eventId: string, character: string) {
  const stories: Record<string, Record<string, any>> = {
    'carrington-1859': {
      telegraph_operator: {
        fullStory: "My name is Samuel Morrison, and I've been operating telegraph equipment for nearly a decade. Nothing, and I mean nothing, could have prepared me for what happened on that fateful September morning in 1859...",
        sections: [
          {
            id: 'morning',
            title: 'An Ordinary Morning',
            content: "I arrived at the telegraph office at dawn, just as I had every day for the past eight years. The brass instruments gleamed in the early morning light, and the familiar clicking of distant messages filled the air. Little did I know that this would be the last normal day of telegraph operations for quite some time.",
            timestamp: '6:00 AM - September 1, 1859',
            educationalNote: "Telegraph systems in 1859 were the cutting-edge technology of their time, similar to how the internet connects us today."
          },
          {
            id: 'first_signs',
            title: 'Strange Behavior',
            content: "Around 11 AM, something peculiar began happening. The telegraph lines started behaving erratically. Messages that should have taken minutes to send were either arriving garbled or not at all. The brass instruments began producing sparks - small at first, but growing larger and more frequent.",
            timestamp: '11:00 AM - The Storm Begins',
            educationalNote: "Geomagnetic storms induce electrical currents in long conductors like telegraph wires, causing these strange effects."
          },
          {
            id: 'chaos',
            title: 'Complete Chaos',
            content: "By noon, all hell had broken loose. The telegraph key became impossible to touch without receiving a painful shock. Sparks were flying from every piece of equipment, and some of the wires outside our building had caught fire! Most shocking of all, messages were somehow being sent without any power source connected to the lines.",
            timestamp: '12:00 PM - Peak of the Storm',
            educationalNote: "The geomagnetic storm was so powerful that it induced enough electrical current in the telegraph wires to transmit messages without batteries!"
          },
          {
            id: 'aurora',
            title: 'The Sky on Fire',
            content: "As evening approached, we stepped outside to see the most incredible sight of our lives. The entire sky was ablaze with colors - brilliant reds, greens, and purples dancing across the heavens. People in the streets were pointing and shouting, many falling to their knees in prayer, convinced the world was ending.",
            timestamp: '8:00 PM - Aurora at Unprecedented Latitudes',
            educationalNote: "The aurora was visible as far south as the Caribbean due to the extreme intensity of this geomagnetic storm."
          }
        ],
        educationalFacts: [
          "The Carrington Event was the most powerful geomagnetic storm in recorded history",
          "Telegraph wires carried electrical current without any power source during the storm",
          "The aurora was visible in tropical regions where it had never been seen before",
          "This event occurred during Solar Cycle 10, near solar maximum",
          "If a similar storm occurred today, it could cause trillions of dollars in damage to our electronic infrastructure"
        ]
      },
      victorian_scientist: {
        fullStory: "Dr. Margaret Whitfield, Natural Philosopher at the Royal Observatory. The events of September 1859 changed our understanding of the connection between solar and terrestrial phenomena...",
        sections: [
          {
            id: 'observation',
            title: 'Solar Observations',
            content: "Through my telescope that morning, I observed the most remarkable solar flares - brilliant white lights erupting from the Sun's surface. My colleague Richard Carrington had made similar observations just days before. Could these solar disturbances be connected to the strange electrical phenomena we were experiencing?",
            timestamp: '9:00 AM - Solar Flare Observation',
            educationalNote: "Richard Carrington and Richard Hodgson were the first to observe and record a solar flare on September 1, 1859."
          },
          {
            id: 'hypothesis',
            title: 'Forming a Theory',
            content: "As reports poured in from around the world about telegraph failures and strange auroral displays, I began to formulate a revolutionary hypothesis: the Sun was somehow affecting Earth's magnetic field and electrical systems. This challenged everything we thought we knew about the independence of celestial and terrestrial phenomena.",
            timestamp: '2:00 PM - Scientific Revelation',
            educationalNote: "The Carrington Event was the first scientifically observed connection between solar activity and geomagnetic disturbances."
          }
        ],
        educationalFacts: [
          "The event was named after Richard Carrington, who observed the solar flare",
          "This was the first time scientists connected solar flares to geomagnetic storms",
          "The observations led to the birth of space weather science",
          "Victorian scientists laid the groundwork for modern space weather prediction"
        ]
      }
    },
    'quebec-blackout-1989': {
      power_grid_operator: {
        fullStory: "Marie Tremblay, Senior Grid Operator at Hydro-Quebec. March 13, 1989 - a date that changed how we think about space weather and electrical infrastructure...",
        sections: [
          {
            id: 'normal_operations',
            title: 'Routine Night Shift',
            content: "It was supposed to be a quiet night shift. The Quebec power grid was running smoothly, supplying electricity to 6 million people across the province. Our massive hydroelectric dams were generating clean power, and everything was operating within normal parameters. Then, at 2:44 AM, everything changed.",
            timestamp: '2:44 AM - March 13, 1989',
            educationalNote: "Quebec's power grid was particularly vulnerable because it relied heavily on long transmission lines and had a unique grounding system."
          },
          {
            id: 'cascade_failure',
            title: 'Cascade Failure',
            content: "It started with a single transmission line tripping offline due to overcurrent. Within seconds, the protective systems began a cascade of shutdowns. One by one, our major transmission lines were disconnected as the system tried to protect itself from what it perceived as massive electrical faults. In less than 90 seconds, the entire Quebec grid had collapsed.",
            timestamp: '2:45 AM - Complete Grid Collapse',
            educationalNote: "Geomagnetic storms create geomagnetically induced currents (GICs) that can saturate power transformers and cause protective systems to trigger."
          },
          {
            id: 'desperate_measures',
            title: 'Fighting to Restore Power',
            content: "With 6 million people suddenly without power in the middle of a cold March night, we worked frantically to restore the grid. But every time we tried to bring a transmission line back online, the geomagnetic storm would induce more currents, causing the protection systems to trip again. We were fighting an invisible enemy in space.",
            timestamp: '3:00 AM - 11:00 AM - Restoration Attempts',
            educationalNote: "It took 9 hours to restore power because engineers had to wait for the geomagnetic storm to subside before safely restarting the grid."
          }
        ],
        educationalFacts: [
          "The Quebec blackout affected 6 million people for 9 hours",
          "The storm caused $2 billion in economic losses",
          "Geomagnetically induced currents can permanently damage power transformers",
          "This event led to improved space weather monitoring for power grid operators",
          "Modern power grids now have better protection against geomagnetic storms"
        ]
      }
    },
    'halloween-storm-2003': {
      astronaut: {
        fullStory: "Commander Elena Petrov aboard the International Space Station during the Halloween Solar Storms of 2003...",
        sections: [
          {
            id: 'space_view',
            title: 'Front Row Seat to Chaos',
            content: "From the International Space Station, we had the best view of the Halloween storms. But 'best' might not be the right word when you're directly in the path of a massive radiation storm. Our radiation detectors were screaming, and we received orders to take shelter in the most heavily shielded part of the station.",
            timestamp: 'October 28, 2003 - Solar Storm Arrival',
            educationalNote: "Astronauts face significantly increased radiation exposure during major solar storms and must take shelter to protect their health."
          },
          {
            id: 'satellite_damage',
            title: 'Watching Satellites Die',
            content: "Through our porthole, we could see the aurora dancing below us - a beautiful but ominous sign of the chaos unfolding on Earth. Our communications with ground control were spotty, and we learned that several satellites had been permanently damaged or destroyed by the storm. We were witnessing the vulnerability of our space-based civilization.",
            timestamp: 'October 29, 2003 - Peak Storm Activity',
            educationalNote: "The Halloween storms damaged or destroyed over a dozen satellites and disrupted GPS navigation worldwide."
          }
        ],
        educationalFacts: [
          "The Halloween storms occurred during solar maximum of Solar Cycle 23",
          "Airlines had to reroute polar flights due to radiation and communication risks",
          "The storms caused widespread GPS navigation failures",
          "Multiple Mars missions were affected by the radiation storm",
          "This event demonstrated the vulnerability of our satellite-dependent society"
        ]
      }
    }
  };

  return stories[eventId]?.[character] || {
    fullStory: "Story content not available for this character.",
    sections: [],
    educationalFacts: []
  };
}

export function TimeTravelStoryViewer({ event, character, isLoading, onBack }: TimeTravelStoryViewerProps) {
  const [story, setStory] = useState<any>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEducationalFacts, setShowEducationalFacts] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      generateHistoricalStory(event, character).then(setStory);
    }
  }, [event, character, isLoading]);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
      setSpeechSynthesisSupported(true);
    } else {
      setSpeechSynthesisSupported(false);
    }
  }, []);

  // Handle audio when audioEnabled changes or section changes
  useEffect(() => {
    if (audioEnabled && story && currentSection && speechSynthesis) {
      // Small delay to ensure the UI has updated
      const timer = setTimeout(() => {
        speakCurrentSection();
      }, 500);
      return () => clearTimeout(timer);
    } else if (!audioEnabled && isSpeaking) {
      stopSpeaking();
    }
  }, [audioEnabled, currentSectionIndex, story]);

  // Clean up speech on component unmount
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Space bar to play/pause
      if (event.code === 'Space' && audioEnabled) {
        event.preventDefault();
        togglePlayPause();
      }
      // 'M' to toggle mute/unmute
      else if (event.code === 'KeyM') {
        event.preventDefault();
        toggleAudio();
      }
      // Arrow keys for navigation
      else if (event.code === 'ArrowRight' && story) {
        event.preventDefault();
        handleNext();
      }
      else if (event.code === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (speechSynthesis && isSpeaking) {
        speechSynthesis.cancel();
      }
    };
  }, [audioEnabled, story, currentSectionIndex, isSpeaking]);

  const speakCurrentSection = () => {
    if (!speechSynthesis || !currentSection) return;

    try {
      // Stop any current speech
      speechSynthesis.cancel();

      // Create new utterance with cleaned text
      const textToSpeak = `${currentSection.title}. ${currentSection.content}`.replace(/[^\w\s\.,!?]/g, '');
      
      if (!textToSpeak.trim()) {
        console.warn('No text to speak');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Configure voice settings for era-appropriate narration
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Use default voice (browser will pick the best available)
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find an English voice
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        setIsPlaying(false);
        console.error('Speech synthesis error:', event.error || 'Unknown error');
      };

      setCurrentUtterance(utterance);
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Error in speakCurrentSection:', error);
      setIsSpeaking(false);
      setIsPlaying(false);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (!speechSynthesisSupported) {
      console.warn('Speech synthesis not supported');
      return;
    }

    const newAudioEnabled = !audioEnabled;
    setAudioEnabled(newAudioEnabled);
    
    if (!newAudioEnabled && isSpeaking) {
      stopSpeaking();
    } else if (newAudioEnabled && speechSynthesis && currentSection) {
      try {
        // Give user feedback that audio is now enabled
        const welcomeUtterance = new SpeechSynthesisUtterance(
          `Audio narration enabled. Click the play button to begin listening to ${currentSection.title}.`
        );
        welcomeUtterance.rate = 1.0;
        welcomeUtterance.volume = 0.6;
        
        // Use default voice
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
          if (englishVoice) {
            welcomeUtterance.voice = englishVoice;
          }
        }

        welcomeUtterance.onerror = (event) => {
          console.error('Welcome message speech error:', event.error);
        };
        
        speechSynthesis.speak(welcomeUtterance);
      } catch (error) {
        console.error('Error in toggleAudio:', error);
      }
    }
  };

  const togglePlayPause = () => {
    if (!speechSynthesis) return;

    if (isSpeaking) {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        setIsPlaying(false);
      } else if (speechSynthesis.paused) {
        speechSynthesis.resume();
        setIsPlaying(true);
      }
    } else if (audioEnabled && currentSection) {
      speakCurrentSection();
    }
  };

  const characterData = getCharacterById(character);

  const handleNext = () => {
    if (story && currentSectionIndex < story.sections.length - 1) {
      // Stop current speech before moving to next section
      if (isSpeaking) {
        stopSpeaking();
      }
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      // Stop current speech before moving to previous section
      if (isSpeaking) {
        stopSpeaking();
      }
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const currentSection = story?.sections[currentSectionIndex];

  if (isLoading || !story) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-6"
      >
        <div className={`${event.theme.colors.background} p-8 rounded-3xl border border-white/20 text-center max-w-md`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Clock className={`w-16 h-16 ${event.theme.colors.accent}`} />
          </motion.div>
          <h3 className={`text-xl font-bold mb-2 ${event.theme.colors.accent} ${event.theme.fonts.primary}`}>
            Traveling Through Time...
          </h3>
          <p className="text-gray-300">
            Generating your historical story experience
          </p>
          <div className="mt-4 flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className={`w-2 h-2 rounded-full ${event.theme.colors.accent.replace('text-', 'bg-')}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with character info */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Characters</span>
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleAudio}
            disabled={!speechSynthesisSupported}
            className={`p-2 rounded-lg transition-colors ${
              audioEnabled && speechSynthesisSupported 
                ? 'bg-purple-600 text-white' 
                : !speechSynthesisSupported 
                  ? 'bg-gray-600 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 text-gray-400'
            }`}
            title={
              !speechSynthesisSupported 
                ? 'Audio narration not supported in this browser' 
                : `${audioEnabled ? 'Disable' : 'Enable'} audio narration (Press M)`
            }
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          {!speechSynthesisSupported && (
            <span className="text-xs text-red-400">
              Audio narration not supported
            </span>
          )}
          
          <button
            onClick={() => setShowEducationalFacts(!showEducationalFacts)}
            className={`p-2 rounded-lg transition-colors ${
              showEducationalFacts ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
            }`}
            title="Toggle educational facts"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Keyboard shortcuts info */}
          <div className="hidden md:block text-xs text-gray-500">
            <span>Shortcuts: Space=Play/Pause, M=Audio, ←→=Navigate</span>
          </div>

          {/* Audio status indicator */}
          {audioEnabled && (
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-gray-400">
                {isSpeaking ? 'Speaking...' : 'Audio Ready'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Story header */}
      <div className={`${event.theme.colors.background} p-6 rounded-2xl border border-white/20`}>
        <div className="flex items-center space-x-4 mb-4">
          <div className={`text-4xl ${event.theme.colors.accent}`}>
            {characterData?.icon}
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${event.theme.colors.accent} ${event.theme.fonts.primary}`}>
              {story.title}
            </h2>
            <p className="text-gray-400">
              {characterData?.role} during {event.name}
            </p>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-gray-400">Progress:</span>
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${event.theme.colors.primary}`}
              style={{ width: `${((currentSectionIndex + 1) / story.sections.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-400">
            {currentSectionIndex + 1} / {story.sections.length}
          </span>
        </div>
      </div>

      {/* Story content */}
      <AnimatePresence mode="wait">
        {currentSection && (
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`${event.theme.colors.background} p-8 rounded-2xl border border-white/20`}
          >
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className={`text-sm ${event.theme.fonts.accent} text-purple-400`}>
                  {currentSection.timestamp}
                </span>
              </div>
              <h3 className={`text-xl font-bold ${event.theme.colors.accent} ${event.theme.fonts.primary}`}>
                {currentSection.title}
              </h3>
            </div>

            <p className={`text-gray-300 leading-relaxed text-lg mb-6 ${
              isSpeaking ? 'animate-pulse bg-blue-900/10 p-4 rounded-lg border border-blue-400/30' : ''
            }`}>
              {currentSection.content}
            </p>

            {currentSection.educationalNote && (
              <div className="bg-blue-900/20 border border-blue-400/30 p-4 rounded-lg mb-6">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-400 mb-1">Did You Know?</h4>
                    <p className="text-sm text-blue-200">{currentSection.educationalNote}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentSectionIndex === 0}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentSectionIndex === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
              >
                Previous
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePlayPause}
                  disabled={!audioEnabled}
                  className={`p-2 rounded-lg transition-colors ${
                    !audioEnabled 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : isSpeaking && isPlaying
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                  title={
                    !audioEnabled 
                      ? 'Enable audio first' 
                      : isSpeaking && isPlaying 
                        ? 'Pause narration (Space)' 
                        : 'Play narration (Space)'
                  }
                >
                  {isSpeaking && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => {
                    stopSpeaking();
                    setCurrentSectionIndex(0);
                  }}
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  title="Restart from beginning"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleNext}
                disabled={currentSectionIndex === story.sections.length - 1}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentSectionIndex === story.sections.length - 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : `bg-gradient-to-r ${event.theme.colors.primary} text-white hover:scale-105`
                }`}
              >
                {currentSectionIndex === story.sections.length - 1 ? 'Story Complete' : 'Next'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational facts panel */}
      <AnimatePresence>
        {showEducationalFacts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-2xl border border-blue-400/30"
          >
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Educational Facts</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {story.educationalFacts.map((fact: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/20"
                >
                  <p className="text-blue-200 text-sm">{fact}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
