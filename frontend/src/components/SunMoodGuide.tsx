import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Lightbulb, 
  X, 
  Zap, 
  Waves, 
  Shield, 
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { SunMood } from '@/components/SunCharacter';

interface SunMoodInfo {
  mood: SunMood;
  title: string;
  description: string;
  weatherConditions: string[];
  effects: string[];
  color: string;
  glowColor: string;
  icon: React.ReactNode;
  intensity: 'Low' | 'Medium' | 'High' | 'Very High' | 'Extreme';
}

const sunMoodData: SunMoodInfo[] = [
  {
    mood: 'calm',
    title: 'Calm & Peaceful Sun',
    description: 'Our Sun is in a relaxed state with minimal activity. Perfect conditions for space operations!',
    weatherConditions: [
      'No significant solar flares',
      'Stable magnetic field',
      'Normal solar wind speed',
      'Clear space weather'
    ],
    effects: [
      'Safe for astronauts to work outside',
      'Satellites operate normally',
      'GPS signals are accurate',
      'No radio interference'
    ],
    color: '#FFD700',
    glowColor: '#FFF8DC',
    icon: <Sun className="w-8 h-8" />,
    intensity: 'Low'
  },
  {
    mood: 'flare',
    title: 'Solar Flare Activity',
    description: 'The Sun is releasing bursts of energy - like cosmic sneezes that create beautiful space fireworks!',
    weatherConditions: [
      'C-class or M-class solar flares detected',
      'Brief X-ray bursts',
      'Increased electromagnetic radiation',
      'Short-term radio wave disruption'
    ],
    effects: [
      'Minor radio blackouts possible',
      'Enhanced aurora activity',
      'GPS accuracy may fluctuate briefly',
      'Beautiful light shows near poles'
    ],
    color: '#FF6B35',
    glowColor: '#FF8C42',
    icon: <Zap className="w-8 h-8" />,
    intensity: 'Medium'
  },
  {
    mood: 'storm',
    title: 'Geomagnetic Storm',
    description: 'The Sun\'s magnetic energy is creating spectacular aurora displays and affecting Earth\'s magnetic field!',
    weatherConditions: [
      'Coronal Mass Ejection (CME) impact',
      'Disturbed geomagnetic field',
      'Elevated Kp-index (4-6)',
      'Enhanced particle radiation'
    ],
    effects: [
      'Widespread aurora visibility',
      'Power grid fluctuations possible',
      'Satellite operations may be affected',
      'Radio communications disrupted'
    ],
    color: '#32CD32',
    glowColor: '#98FB98',
    icon: <Waves className="w-8 h-8" />,
    intensity: 'High'
  },
  {
    mood: 'radiation',
    title: 'High Radiation Event',
    description: 'The Sun is sending out energetic particles - astronauts need to take extra precautions!',
    weatherConditions: [
      'Solar Energetic Particle (SEP) event',
      'Elevated proton flux',
      'M-class or X-class flares',
      'Increased cosmic radiation'
    ],
    effects: [
      'Radiation hazard for astronauts',
      'Aircraft may reroute polar flights',
      'Satellite charging and damage risk',
      'Enhanced aurora at lower latitudes'
    ],
    color: '#FF4500',
    glowColor: '#FF6347',
    icon: <Shield className="w-8 h-8" />,
    intensity: 'Very High'
  },
  {
    mood: 'extreme',
    title: 'Extreme Space Weather',
    description: 'Major solar event in progress! The Sun is having a very active day with significant impacts expected.',
    weatherConditions: [
      'X-class solar flares',
      'Major geomagnetic storm (G4-G5)',
      'Severe radio blackouts',
      'Intense particle radiation'
    ],
    effects: [
      'Widespread power outages possible',
      'Satellite systems severely affected',
      'Complete radio blackouts',
      'Aurora visible at mid-latitudes',
      'GPS systems unreliable'
    ],
    color: '#DC143C',
    glowColor: '#FF1493',
    icon: <AlertTriangle className="w-8 h-8" />,
    intensity: 'Extreme'
  }
];

export default function SunMoodGuide() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<SunMood | null>(null);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'Low': return 'bg-green-900/20 text-green-300 border-green-400/20';
      case 'Medium': return 'bg-yellow-900/20 text-yellow-300 border-yellow-400/20';
      case 'High': return 'bg-orange-900/20 text-orange-300 border-orange-400/20';
      case 'Very High': return 'bg-red-900/20 text-red-300 border-red-400/20';
      case 'Extreme': return 'bg-purple-900/20 text-purple-300 border-purple-400/20';
      default: return 'bg-gray-900/20 text-gray-300 border-gray-400/20';
    }
  };

  return (
    <div className="mb-8">
      {/* Guide Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="flex justify-center"
      >
        <button
          onClick={() => setIsGuideOpen(true)}
          className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl flex items-center space-x-3 text-white"
        >
          <Lightbulb className="w-6 h-6" />
          <span>What Do Sun Moods Mean?</span>
          <Eye className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Guide Modal */}
      <AnimatePresence>
        {isGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsGuideOpen(false);
                setSelectedMood(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-gray-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                      <Sun className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Sun Mood Guide</h2>
                      <p className="text-gray-400 text-sm">Learn what each sun mood means for space weather</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsGuideOpen(false);
                      setSelectedMood(null);
                    }}
                    className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {!selectedMood ? (
                  // Mood Overview Grid
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sunMoodData.map((moodInfo, index) => (
                      <motion.button
                        key={moodInfo.mood}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedMood(moodInfo.mood)}
                        className="group bg-gray-800/50 hover:bg-gray-700/50 rounded-2xl p-6 transition-all duration-300 text-left border border-gray-600/30 hover:border-gray-500/50 hover:scale-[1.02]"
                      >
                        {/* Mood Icon and Title */}
                        <div className="flex items-center space-x-3 mb-4">
                          <div 
                            className="p-3 rounded-xl transition-colors"
                            style={{ 
                              backgroundColor: `${moodInfo.color}20`,
                              border: `1px solid ${moodInfo.color}40`
                            }}
                          >
                            <div style={{ color: moodInfo.color }}>
                              {moodInfo.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-white group-hover:text-gray-100">
                              {moodInfo.title}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full border ${getIntensityColor(moodInfo.intensity)}`}>
                              {moodInfo.intensity} Activity
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          {moodInfo.description}
                        </p>

                        {/* Quick Info */}
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 font-medium">KEY EFFECTS:</div>
                          <div className="flex flex-wrap gap-1">
                            {moodInfo.effects.slice(0, 2).map((effect, idx) => (
                              <span 
                                key={idx}
                                className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300"
                              >
                                {effect}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Click indicator */}
                        <div className="mt-4 text-center">
                          <span className="text-xs text-gray-500 group-hover:text-gray-400">
                            Click for detailed info →
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  // Detailed Mood View
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {(() => {
                      const moodInfo = sunMoodData.find(m => m.mood === selectedMood)!;
                      return (
                        <>
                          {/* Back Button */}
                          <button
                            onClick={() => setSelectedMood(null)}
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
                          >
                            <EyeOff className="w-4 h-4" />
                            <span>← Back to all moods</span>
                          </button>

                          {/* Mood Header */}
                          <div 
                            className="rounded-2xl p-8 text-center"
                            style={{
                              background: `linear-gradient(135deg, ${moodInfo.color}20, ${moodInfo.glowColor}10)`,
                              border: `1px solid ${moodInfo.color}40`
                            }}
                          >
                            <div 
                              className="inline-flex p-4 rounded-2xl mb-4"
                              style={{ backgroundColor: `${moodInfo.color}30` }}
                            >
                              <div style={{ color: moodInfo.color }}>
                                {moodInfo.icon}
                              </div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">{moodInfo.title}</h3>
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getIntensityColor(moodInfo.intensity)}`}>
                              {moodInfo.intensity} Activity Level
                            </span>
                            <p className="text-gray-300 mt-4 text-lg">{moodInfo.description}</p>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Weather Conditions */}
                            <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-400/20">
                              <h4 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                                <Waves className="w-5 h-5 mr-2" />
                                Space Weather Conditions
                              </h4>
                              <ul className="space-y-3">
                                {moodInfo.weatherConditions.map((condition, idx) => (
                                  <li key={idx} className="flex items-start space-x-3">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span className="text-gray-300">{condition}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Effects on Earth */}
                            <div className="bg-green-900/20 rounded-2xl p-6 border border-green-400/20">
                              <h4 className="text-xl font-bold text-green-300 mb-4 flex items-center">
                                <Shield className="w-5 h-5 mr-2" />
                                Effects on Earth & Technology
                              </h4>
                              <ul className="space-y-3">
                                {moodInfo.effects.map((effect, idx) => (
                                  <li key={idx} className="flex items-start space-x-3">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span className="text-gray-300">{effect}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Fun Fact */}
                          <div 
                            className="rounded-2xl p-6 text-center"
                            style={{
                              background: `linear-gradient(135deg, ${moodInfo.glowColor}10, transparent)`,
                              border: `1px solid ${moodInfo.color}20`
                            }}
                          >
                            <Lightbulb className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                            <h5 className="text-lg font-bold text-yellow-300 mb-2">Did You Know?</h5>
                            <p className="text-gray-300">
                              {moodInfo.mood === 'calm' && "During solar minimum, the Sun can go days or even weeks without producing any significant flares!"}
                              {moodInfo.mood === 'flare' && "Solar flares travel at the speed of light, reaching Earth in just 8 minutes and 20 seconds!"}
                              {moodInfo.mood === 'storm' && "Geomagnetic storms can make aurora visible as far south as the Caribbean during extreme events!"}
                              {moodInfo.mood === 'radiation' && "Astronauts on the ISS retreat to the most shielded parts of the station during radiation storms!"}
                              {moodInfo.mood === 'extreme' && "The 1859 Carrington Event was so powerful that telegraph operators received electric shocks and telegraph lines sparked fires!"}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}