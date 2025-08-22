'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Zap, Activity, Wind, Sparkles } from 'lucide-react';

interface AudioContextState {
  context: AudioContext | null;
  gainNode: GainNode | null;
  oscillators: OscillatorNode[];
}

interface SoundEffect {
  id: string;
  name: string;
  icon: React.ReactNode;
  frequency: number;
  type: OscillatorType;
  color: string;
  description: string;
}

export function WebAudioFeatures() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [activeEffects, setActiveEffects] = useState<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContextState>({
    context: null,
    gainNode: null,
    oscillators: []
  });

  const soundEffects: SoundEffect[] = [
    {
      id: 'solar-wind',
      name: 'Solar Wind',
      icon: <Wind className="w-4 h-4" />,
      frequency: 80,
      type: 'sine',
      color: 'bg-blue-500',
      description: 'Ambient solar wind particles'
    },
    {
      id: 'magnetic-field',
      name: 'Magnetic Field',
      icon: <Activity className="w-4 h-4" />,
      frequency: 120,
      type: 'triangle',
      color: 'bg-green-500',
      description: 'Earth\'s magnetic field resonance'
    },
    {
      id: 'solar-flare',
      name: 'Solar Flare',
      icon: <Zap className="w-4 h-4" />,
      frequency: 200,
      type: 'sawtooth',
      color: 'bg-yellow-500',
      description: 'Solar flare electromagnetic pulse'
    },
    {
      id: 'aurora',
      name: 'Aurora',
      icon: <Sparkles className="w-4 h-4" />,
      frequency: 300,
      type: 'sine',
      color: 'bg-purple-500',
      description: 'Aurora borealis harmonics'
    }
  ];

  useEffect(() => {
    return () => {
      // Cleanup audio context on unmount
      if (audioContextRef.current.context) {
        audioContextRef.current.oscillators.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {
            // Oscillator already stopped
          }
        });
        audioContextRef.current.context?.close();
      }
    };
  }, []);

  const initializeAudioContext = async () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = context.createGain();
      gainNode.connect(context.destination);
      gainNode.gain.value = volume;

      audioContextRef.current = {
        context,
        gainNode,
        oscillators: []
      };

      // Resume context if suspended (required by some browsers)
      if (context.state === 'suspended') {
        await context.resume();
      }

      setIsEnabled(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  };

  const createOscillator = (frequency: number, type: OscillatorType): OscillatorNode | null => {
    const { context, gainNode } = audioContextRef.current;
    if (!context || !gainNode) return null;

    try {
      const oscillator = context.createOscillator();
      const oscillatorGain = context.createGain();
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      
      // Create a subtle modulation for more interesting sound
      const lfo = context.createOscillator();
      const lfoGain = context.createGain();
      
      lfo.frequency.setValueAtTime(0.5, context.currentTime);
      lfo.type = 'sine';
      lfoGain.gain.setValueAtTime(frequency * 0.1, context.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      // Set up volume envelope
      oscillatorGain.gain.setValueAtTime(0, context.currentTime);
      oscillatorGain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.5);
      
      oscillator.connect(oscillatorGain);
      oscillatorGain.connect(gainNode);
      
      oscillator.start();
      lfo.start();
      
      // Store reference for cleanup
      audioContextRef.current.oscillators.push(oscillator);
      
      return oscillator;
    } catch (error) {
      console.error('Failed to create oscillator:', error);
      return null;
    }
  };

  const toggleEffect = async (effectId: string) => {
    if (!isEnabled) {
      const initialized = await initializeAudioContext();
      if (!initialized) return;
    }

    const newActiveEffects = new Set(activeEffects);
    
    if (activeEffects.has(effectId)) {
      // Stop the effect
      newActiveEffects.delete(effectId);
      
      // Find and stop the corresponding oscillator
      const { context, oscillators } = audioContextRef.current;
      if (context) {
        const effectIndex = soundEffects.findIndex(effect => effect.id === effectId);
        if (effectIndex !== -1 && oscillators[effectIndex]) {
          try {
            const oscillator = oscillators[effectIndex];
            oscillator.stop();
            oscillators.splice(effectIndex, 1);
          } catch (e) {
            console.log('Oscillator already stopped');
          }
        }
      }
    } else {
      // Start the effect
      newActiveEffects.add(effectId);
      
      const effect = soundEffects.find(e => e.id === effectId);
      if (effect) {
        createOscillator(effect.frequency, effect.type);
      }
    }
    
    setActiveEffects(newActiveEffects);
  };

  const toggleAudio = async () => {
    if (isEnabled) {
      // Disable audio
      setIsEnabled(false);
      setActiveEffects(new Set());
      
      if (audioContextRef.current.context) {
        audioContextRef.current.oscillators.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {
            // Already stopped
          }
        });
        audioContextRef.current.oscillators = [];
        await audioContextRef.current.context?.close();
        audioContextRef.current.context = null;
        audioContextRef.current.gainNode = null;
      }
    } else {
      // Enable audio
      await initializeAudioContext();
    }
  };

  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioContextRef.current.gainNode) {
      audioContextRef.current.gainNode.gain.setValueAtTime(
        newVolume,
        audioContextRef.current.context!.currentTime
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Space Audio Experience</h3>
          <p className="text-sm text-gray-400">
            Immerse yourself in the sounds of space weather
          </p>
        </div>
        
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-lg transition-all duration-300 ${
            isEnabled 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
          }`}
        >
          {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          {/* Volume Control */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => updateVolume(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Sound Effects */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Space Weather Sounds</h4>
            <div className="grid grid-cols-2 gap-3">
              {soundEffects.map((effect) => {
                const isActive = activeEffects.has(effect.id);
                
                return (
                  <motion.button
                    key={effect.id}
                    onClick={() => toggleEffect(effect.id)}
                    className={`p-3 rounded-lg text-left transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 border border-blue-400'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-6 h-6 ${effect.color} rounded flex items-center justify-center text-white text-xs`}>
                        {effect.icon}
                      </div>
                      <span className="text-sm font-medium">{effect.name}</span>
                      {isActive && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{effect.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Audio Visualization */}
          {activeEffects.size > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-black/20 rounded-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                {Array.from({ length: 8 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-gradient-to-t from-blue-500 to-purple-400 rounded-full"
                    animate={{
                      height: [10, 30, 10],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-center text-gray-400 mt-2">
                {activeEffects.size} sound{activeEffects.size !== 1 ? 's' : ''} playing
              </p>
            </motion.div>
          )}

          {/* Instructions */}
          <div className="text-xs text-gray-500 p-3 bg-white/5 rounded-lg">
            <p className="mb-1">🎧 Use headphones for the best experience</p>
            <p className="mb-1">🔊 Each sound represents different space weather phenomena</p>
            <p>🌌 Combine multiple sounds to create your own space ambience</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
