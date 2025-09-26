import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sun } from 'lucide-react';
import SunCharacter from './SunCharacter';

interface MoodDetails {
  whatHappens: string;
  earthEffects: string[];
  coolFact: string;
}

interface SunMoodVisual {
  mood: 'calm' | 'flare' | 'storm' | 'radiation' | 'extreme';
  title: string;
  color: string;
  glowColor: string;
  description: string;
  intensity: number;
  emoji: string;
  details: MoodDetails;
}

const sunMoodVisuals: SunMoodVisual[] = [
  {
    mood: 'calm',
    title: 'Calm',
    color: '#98FB98',
    glowColor: '#90EE90',
    description: 'Very quiet solar conditions', 
    intensity: 0.2,
    emoji: '😊',
    details: {
      whatHappens: "The Sun is taking a nice, peaceful nap! 😴 Very few sunspots and minimal solar wind activity. It's being super quiet and gentle.",
      earthEffects: [
        "🌌 Only very faint auroras, mostly visible with special cameras",
        "📡 Perfect conditions for all space technology and communications",
        "🛰️ Satellites work at their absolute best",
        "🔬 Scientists can study the Sun's quieter features more easily"
      ],
      coolFact: "During solar minimum (the calmest period), the Sun can go weeks without any sunspots at all! But don't worry - it's still burning at 10,000°F on the surface! 🔥"
    }
  },
  {
    mood: 'flare',
    title: 'Solar Flare',
    color: '#FF6B35',
    glowColor: '#FF8C42',
    description: 'Solar flare activity detected',
    intensity: 0.7,
    emoji: '🔥',
    details: {
      whatHappens: "The Sun is feeling energetic and playful! 🌟 It just sneezed out a solar flare - like a burst of energy shooting into space!",
      earthEffects: [
        "🌈 Auroras become brighter and more active, especially near the poles",
        "📡 Minor effects on satellite communications",
        "👀 Great time for aurora watchers in northern areas",
        "🔬 Scientists get excited because there's lots of interesting data to study"
      ],
      coolFact: "Solar flares travel at millions of miles per hour! They're like cosmic fireworks that can reach Earth in just 8 minutes! ✨🚀"
    }
  },
  {
    mood: 'storm',
    title: 'Magnetic Storm',
    color: '#32CD32',
    glowColor: '#98FB98',
    description: 'Geomagnetic storm conditions',
    intensity: 0.6,
    emoji: '🌌',
    details: {
      whatHappens: "The Sun is creating beautiful magnetic storms! 🌌 It's painting the sky with swirling magnetic fields that make amazing auroras.",
      earthEffects: [
        "🌈 Beautiful dancing auroras visible in many northern places",
        "📡 Some GPS devices might be slightly less accurate",
        "🎨 The night sky becomes a natural light show",
        "🌍 Earth's magnetic field gets a gentle cosmic massage"
      ],
      coolFact: "Magnetic storms create auroras that can be so bright they were once mistaken for fires! People used to call fire departments thinking buildings were burning! 🔥🌈"
    }
  },
  {
    mood: 'radiation',
    title: 'Radiation Storm',
    color: '#FF4500',
    glowColor: '#FF6347',
    description: 'Solar radiation event in progress',
    intensity: 0.8,
    emoji: '⚡',
    details: {
      whatHappens: "The Sun is sending out energetic particles! ⚡ Think of it as the Sun throwing tiny cosmic balls very fast through space.",
      earthEffects: [
        "🛰️ Satellites need to be extra careful and might take a short break",
        "✈️ Polar flights might change routes to stay safe",
        "👨‍🚀 Astronauts stay in protected areas of the space station",
        "🌍 Earth's atmosphere and magnetic field keep us safe on the ground"
      ],
      coolFact: "Solar radiation storms are like cosmic snowstorms - but instead of snowflakes, it's tiny particles traveling at incredible speeds! 🌨️⚡"
    }
  },
  {
    mood: 'extreme',
    title: 'Extreme Activity',
    color: '#8B0000',
    glowColor: '#DC143C',
    description: 'Extreme solar weather conditions',
    intensity: 1.0,
    emoji: '⚠️',
    details: {
      whatHappens: "The Sun is having its biggest tantrum! ⚠️ Multiple events happening at once - it's like a cosmic thunderstorm with lightning, wind, and hail all together!",
      earthEffects: [
        "🌈 Spectacular auroras visible much farther south than usual",
        "📡 Some technology systems might need temporary shutdowns for safety",
        "🛰️ Satellites follow special protective procedures",
        "🌍 Scientists work extra hard to monitor and protect our technology"
      ],
      coolFact: "The most extreme solar storm ever recorded happened in 1859 and made telegraph wires spark! Some telegraph operators could send messages just using the aurora electricity! ⚡📬"
    }
  }
];



interface SunMoodVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood?: 'calm' | 'flare' | 'storm' | 'radiation' | 'extreme';
}

export default function SunMoodVisualizer({ isOpen, onClose, currentMood = 'calm' }: SunMoodVisualizerProps) {
  const [selectedMood, setSelectedMood] = useState<SunMoodVisual['mood']>(currentMood);

  // Update selected mood when currentMood prop changes and modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedMood(currentMood);
    }
  }, [isOpen, currentMood]);

  const selectedMoodData = sunMoodVisuals.find(visual => visual.mood === selectedMood);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-700/50 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <Sun size={32} className="text-yellow-400" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Sun Mood Visualizer</h2>
          </div>
          
          <p className="text-lg text-gray-300">
            Explore different space weather conditions and learn how the Sun affects Earth! 🌍
          </p>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Mood Selection */}
          <div className="lg:w-2/5 p-4 border-r border-gray-700/50 overflow-y-auto flex-shrink-0">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">Current Conditions</h3>
            
            <div className="space-y-2">
              {sunMoodVisuals.map((visual) => (
                <motion.button
                  key={visual.mood}
                  onClick={() => setSelectedMood(visual.mood)}
                  className={`w-full p-3 rounded-xl border-2 transition-all ${
                    selectedMood === visual.mood
                      ? 'border-purple-500 bg-purple-900/30 shadow-md shadow-purple-500/20'
                      : 'border-gray-600/50 hover:border-gray-500/70 hover:bg-gray-800/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{visual.emoji}</div>
                    <div className="text-left flex-1">
                      <h4 className="font-semibold text-gray-100">{visual.title}</h4>
                      <p className="text-sm text-gray-300 mt-1">{visual.description}</p>
                    </div>
                    {selectedMood === visual.mood && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 bg-purple-400 rounded-full"
                      />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:w-3/5 p-4 overflow-y-auto flex-1">
            {selectedMoodData && (
              <div className="space-y-4 h-full">
                {/* Sun Visualization */}
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <SunCharacter
                      mood={selectedMoodData.mood}
                      size="large"
                      showDialogue={false}
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-100 mb-2">
                    {selectedMoodData.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4">
                    {selectedMoodData.description}
                  </p>

                </div>

                {/* Educational Details */}
                {selectedMoodData.details && (
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 space-y-4">
                    {/* What Happens */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-100 mb-2 flex items-center gap-2">
                        🌟 What's Happening
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedMoodData.details.whatHappens}
                      </p>
                    </div>

                    {/* Earth Effects */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-100 mb-2 flex items-center gap-2">
                        🌍 Effects on Earth
                      </h4>
                      <ul className="space-y-1">
                        {selectedMoodData.details.earthEffects.map((effect, index) => (
                          <li key={index} className="text-gray-300 flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cool Fact */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-100 mb-2 flex items-center gap-2">
                        🤯 Cool Fact
                      </h4>
                      <div className="bg-gray-900/70 rounded-lg p-3 border-l-4 border-purple-500">
                        <p className="text-gray-300 leading-relaxed">
                          {selectedMoodData.details.coolFact}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}