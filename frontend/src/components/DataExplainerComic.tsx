'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

interface ComicPanel {
  id: number;
  title: string;
  character: string;
  dialogue: string;
  explanation: string;
  visual: string;
  background: string;
  characterColor: string;
}

interface DataExplainerComicProps {
  isOpen: boolean;
  onClose: () => void;
  currentMetrics: any[]; // Real-time metrics data
  historicalData: any[]; // Chart data
}

export default function DataExplainerComic({ isOpen, onClose, currentMetrics = [], historicalData = [] }: DataExplainerComicProps) {
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Speech synthesis functionality
  const speak = (text: string) => {
    if (!soundEnabled) return;
    
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch for friendliness
    utterance.volume = 0.8;
    
    // Wait for voices to load if needed
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    };

    // Check if voices are loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoiceAndSpeak();
    } else {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    }
  };

  // Stop speaking function
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speak current panel when it changes and sound is enabled
  useEffect(() => {
    if (isOpen && soundEnabled && currentPanel < panels.length) {
      const currentPanelData = panels[currentPanel];
      if (currentPanelData) {
        // Small delay to let the animation settle
        const timer = setTimeout(() => {
          speak(currentPanelData.dialogue);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [currentPanel, soundEnabled, isOpen]);

  // Generate dynamic comic panels based on real-time data
  const generateDataPanels = () => {
    const panels: ComicPanel[] = [];

    // Welcome panel
    panels.push({
      id: 1,
      title: "Let's Explore Today's Space Weather!",
      character: "🌞",
      dialogue: "Hey there! I'm Captain Solar, and I'm excited to show you what's happening in space RIGHT NOW!",
      explanation: "We're looking at real data from space weather monitoring stations around the world!",
      visual: "�",
      background: "from-blue-900 to-purple-900",
      characterColor: "text-yellow-400"
    });

    // Find specific metrics to explain
    const solarFlare = currentMetrics.find(m => m.id === 'solar-flare');
    const geomagneticField = currentMetrics.find(m => m.id === 'geomagnetic-field');
    const solarWind = currentMetrics.find(m => m.id === 'solar-wind');
    const auroraActivity = currentMetrics.find(m => m.id === 'aurora-activity');

    // Solar Flare Panel
    if (solarFlare) {
      const flareClass = solarFlare.value;
      const isHighActivity = flareClass.startsWith('M') || flareClass.startsWith('X');
      
      panels.push({
        id: 2,
        title: `Today's Solar Flare: ${flareClass}`,
        character: "🌞",
        dialogue: isHighActivity 
          ? `Wow! I'm having a ${flareClass} class flare today - that's pretty strong! ${solarFlare.trend === 'up' ? "And it's getting stronger!" : "But it's calming down now."}`
          : `I'm having a gentle ${flareClass} class flare today - that's pretty calm for me! ${solarFlare.trend === 'up' ? "It might get a bit stronger." : "It's staying nice and quiet."}`,
        explanation: `Solar flares are classified from A (weakest) to X (strongest). ${flareClass} class means ${isHighActivity ? 'significant solar activity that could affect Earth!' : 'low solar activity - very peaceful!'}`,
        visual: isHighActivity ? "�" : "✨",
        background: isHighActivity ? "from-red-900 to-orange-900" : "from-yellow-900 to-orange-900",
        characterColor: "text-yellow-400"
      });
    }

    // Geomagnetic Field Panel
    if (geomagneticField) {
      const kpValue = parseFloat(geomagneticField.value);
      const isStorm = kpValue >= 5;
      
      panels.push({
        id: 3,
        title: `Earth's Magnetic Shield: Kp ${geomagneticField.value}`,
        character: "�",
        dialogue: isStorm 
          ? `My magnetic field is being shaken up today! Kp index is ${geomagneticField.value} - that means a geomagnetic storm is happening!`
          : `My magnetic shield is ${kpValue < 3 ? 'very calm' : 'a bit active'} today with a Kp index of ${geomagneticField.value}. I'm doing great!`,
        explanation: `The Kp index measures Earth's magnetic field disturbance from 0-9. ${isStorm ? 'Values 5+ mean geomagnetic storms that can create beautiful auroras!' : 'Low values mean calm space weather.'}`,
        visual: isStorm ? "⚡" : "�️",
        background: isStorm ? "from-purple-900 to-red-900" : "from-blue-900 to-green-900",
        characterColor: "text-green-400"
      });
    }

    // Solar Wind Panel
    if (solarWind) {
      const windSpeed = parseInt(solarWind.value);
      const isFast = windSpeed > 500;
      
      panels.push({
        id: 4,
        title: `Solar Wind Speed: ${solarWind.value} km/s`,
        character: "💨",
        dialogue: isFast 
          ? `Whoosh! I'm blowing really fast today at ${solarWind.value} km/s! That's faster than usual and might stir things up!`
          : `I'm flowing at a nice steady pace of ${solarWind.value} km/s today. That's pretty normal for solar wind!`,
        explanation: `Solar wind is a stream of particles from the Sun. Normal speed is 300-500 km/s. ${isFast ? 'High speeds can enhance geomagnetic activity!' : 'Current speed is typical.'}`,
        visual: isFast ? "🌪️" : "💨",
        background: isFast ? "from-cyan-900 to-blue-900" : "from-blue-900 to-purple-900",
        characterColor: "text-cyan-400"
      });
    }

    // Aurora Activity Panel
    if (auroraActivity) {
      const auroraLevel = auroraActivity.value.toLowerCase();
      const isHigh = auroraLevel === 'high';
      
      panels.push({
        id: 5,
        title: `Aurora Visibility: ${auroraActivity.value}`,
        character: "🌌",
        dialogue: isHigh 
          ? `Amazing! Aurora visibility is HIGH today! People in northern areas might see beautiful dancing lights tonight!`
          : `Aurora activity is ${auroraLevel} today. ${auroraLevel === 'medium' ? 'Some lucky people might still see me!' : 'I\'m taking a quiet day today.'}`,
        explanation: `Auroras happen when solar particles hit Earth's atmosphere. ${isHigh ? 'High activity means great visibility at high latitudes!' : 'Activity depends on solar wind and magnetic field conditions.'}`,
        visual: isHigh ? "🌈" : "✨",
        background: isHigh ? "from-green-900 to-purple-900" : "from-purple-900 to-blue-900",
        characterColor: "text-green-400"
      });
    }

    // Historical Data Panel
    if (historicalData.length > 0) {
      const latest = historicalData[historicalData.length - 1];
      const previous = historicalData[historicalData.length - 2];
      
      panels.push({
        id: 6,
        title: "Looking at the Trends",
        character: "📊",
        dialogue: `Let me show you the trends! Over the past 24 hours, ${latest?.solarFlare > (previous?.solarFlare || 0) ? 'solar activity has been increasing' : 'solar activity has been steady'}!`,
        explanation: "The charts show how space weather changes over time. Scientists watch these patterns to predict future space weather!",
        visual: "�",
        background: "from-indigo-900 to-purple-900",
        characterColor: "text-indigo-400"
      });
    }

    // Conclusion Panel
    panels.push({
      id: panels.length + 1,
      title: "You're Now a Space Weather Expert!",
      character: "�",
      dialogue: "Congratulations! You now understand today's space weather data. Keep exploring and learning about our amazing solar system!",
      explanation: "Space weather affects technology, creates beautiful auroras, and helps us understand our cosmic neighborhood!",
      visual: "�",
      background: "from-purple-900 to-pink-900",
      characterColor: "text-purple-400"
    });

    return panels;
  };

  const panels = generateDataPanels();

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && isOpen) {
      const timer = setInterval(() => {
        setCurrentPanel((prev) => {
          if (prev >= panels.length - 1) {
            setIsAutoPlay(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [isAutoPlay, isOpen, panels.length]);

  // Reset panel when comic opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentPanel(0);
    } else {
      stopSpeaking(); // Stop speaking when comic closes
    }
  }, [isOpen, currentMetrics, historicalData]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const nextPanel = () => {
    stopSpeaking();
    setCurrentPanel((prev) => Math.min(prev + 1, panels.length - 1));
    setIsAutoPlay(false);
  };

  const prevPanel = () => {
    stopSpeaking();
    setCurrentPanel((prev) => Math.max(prev - 1, 0));
    setIsAutoPlay(false);
  };

  const currentPanelData = panels[currentPanel];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-2xl md:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-700 mx-4 sm:mx-0"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-1 sm:gap-2">
                📚 <span className="hidden sm:inline">Space Weather Story Time</span>
                <span className="sm:hidden">Data Stories</span>
              </h2>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else if (soundEnabled) {
                      const currentPanelData = panels[currentPanel];
                      speak(currentPanelData?.dialogue || '');
                    } else {
                      setSoundEnabled(true);
                      const currentPanelData = panels[currentPanel];
                      speak(currentPanelData?.dialogue || '');
                    }
                  }}
                  className={`p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg transition-colors ${
                    isSpeaking ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                  title={
                    isSpeaking 
                      ? 'Stop speaking' 
                      : soundEnabled 
                        ? 'Read aloud' 
                        : 'Enable sound and read aloud'
                  }
                >
                  {isSpeaking ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </motion.div>
                  ) : soundEnabled ? (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Comic Panel */}
            <div className="relative">
              <motion.div
                key={currentPanel}
                className={`min-h-[300px] sm:min-h-[400px] bg-gradient-to-br ${currentPanelData.background} p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {/* Background Stars */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-white opacity-30"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        fontSize: `${Math.random() * 8 + 4}px`,
                      }}
                      animate={{
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    >
                      ⭐
                    </motion.div>
                  ))}
                </div>

                {/* Panel Title */}
                <motion.h3
                  className="text-2xl md:text-3xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentPanelData.title}
                </motion.h3>

                {/* Character and Visual */}
                <motion.div
                  className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className={`text-4xl sm:text-5xl md:text-6xl ${currentPanelData.characterColor}`}
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {currentPanelData.character}
                  </motion.div>
                  <motion.div
                    className="text-2xl sm:text-3xl md:text-4xl"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1,
                    }}
                  >
                    {currentPanelData.visual}
                  </motion.div>
                </motion.div>

                {/* Speech Bubble */}
                <motion.div
                  className={`bg-white/95 rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-2xl mx-auto mb-3 sm:mb-4 relative shadow-lg border-2 transition-colors ${
                    isSpeaking ? 'border-green-400 bg-green-50/95' : 'border-transparent'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="absolute -top-2 sm:-top-3 left-4 sm:left-8 w-4 h-4 sm:w-6 sm:h-6 bg-white/95 transform rotate-45"></div>
                  <div className="flex items-start gap-2">
                    <p className="text-gray-800 text-sm sm:text-lg font-medium leading-relaxed flex-1">
                      {currentPanelData.dialogue}
                    </p>
                    {isSpeaking && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5] 
                        }}
                        transition={{ 
                          duration: 0.8, 
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        className="text-green-600 text-lg"
                      >
                        🔊
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Explanation Box */}
                <motion.div
                  className="bg-blue-900/80 rounded-xl p-3 sm:p-4 max-w-xs sm:max-w-2xl mx-auto backdrop-blur-sm border border-blue-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">
                    💡 <strong>Science Fact:</strong> {currentPanelData.explanation}
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="p-3 sm:p-4 bg-gray-800 border-t border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                {/* Navigation */}
                <div className="flex items-center gap-2 order-1 sm:order-none">
                  <button
                    onClick={prevPanel}
                    disabled={currentPanel === 0}
                    className="p-1.5 sm:p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                  <span className="text-gray-300 text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">
                    {currentPanel + 1} / {panels.length}
                  </span>
                  <button
                    onClick={nextPanel}
                    disabled={currentPanel === panels.length - 1}
                    className="p-1.5 sm:p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 w-full sm:mx-6 order-2 sm:order-none">
                  <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-1.5 sm:h-2 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((currentPanel + 1) / panels.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Auto-play */}
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap order-3 sm:order-none ${
                    isAutoPlay
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">{isAutoPlay ? '⏸️ Pause' : '▶️ Auto-play'}</span>
                  <span className="sm:hidden">{isAutoPlay ? '⏸️' : '▶️'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}