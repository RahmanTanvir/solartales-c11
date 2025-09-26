'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type SunMood = 'calm' | 'flare' | 'storm' | 'radiation' | 'extreme';

interface SunCharacterProps {
  mood: SunMood;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showDialogue?: boolean;
  onSunClick?: () => void;
}

interface SunState {
  mood: SunMood;
  color: string;
  glowColor: string;
  message: string;
  intensity: number;
}

const sunStates: Record<SunMood, SunState> = {
  calm: {
    mood: 'calm',
    color: '#FFD700',
    glowColor: '#FFF8DC',
    message: "All calm here! A beautiful day in space ☀️",
    intensity: 0.3
  },
  flare: {
    mood: 'flare',
    color: '#FF6B35',
    glowColor: '#FF8C42',
    message: "Oops, I sneezed a solar flare! 🔥",
    intensity: 0.7
  },
  storm: {
    mood: 'storm',
    color: '#32CD32',
    glowColor: '#98FB98',
    message: "My storms are painting the sky with auroras 🌌",
    intensity: 0.6
  },
  radiation: {
    mood: 'radiation',
    color: '#FF4500',
    glowColor: '#FF6347',
    message: "Careful, astronauts! I'm a bit stormy today ⚡",
    intensity: 0.8
  },
  extreme: {
    mood: 'extreme',
    color: '#DC143C',
    glowColor: '#FF1493',
    message: "Whoa! Major flare incoming — stay safe Earthlings 🚨",
    intensity: 1.0
  }
};

const kidFriendlyExplanations: Record<SunMood, string[]> = {
  calm: [
    "Right now, I'm feeling very peaceful! 😌",
    "Think of me like a gentle campfire - warm and steady.",
    "This is perfect weather for astronauts to work in space!",
    "My magnetic field is calm, like a still pond. 🌊"
  ],
  flare: [
    "I just shot out a burst of energy - like a solar sneeze! 🤧",
    "Solar flares are like me throwing sparkles into space! ✨",
    "This energy travels super fast - faster than any rocket!",
    "Sometimes my flares can make pretty lights on Earth! 🌈"
  ],
  storm: [
    "I'm creating magnetic storms that make beautiful auroras! 🌌",
    "It's like I'm painting the night sky with green and blue colors!",
    "People near the North and South Pole might see dancing lights!",
    "My magnetic field is swirling like a cosmic whirlpool! 🌪️"
  ],
  radiation: [
    "I'm sending out lots of tiny particles called protons! ⚡",
    "Think of it like I'm sneezing cosmic dust everywhere!",
    "Astronauts need to stay inside their spacecraft when this happens.",
    "My energy is a bit too strong for people right now! 💪"
  ],
  extreme: [
    "WOW! I'm having a HUGE energy burst - my biggest sneeze ever! 🌋",
    "This is like cosmic fireworks, but much more powerful!",
    "Satellites might need to take a little nap to stay safe.",
    "This energy could reach Earth and affect our technology! 📱"
  ]
};

const SunFace: React.FC<{ mood: SunMood; sunSize: number }> = ({ mood, sunSize }) => {
  // Scale coordinates to match the sun size (using same scaling as visualizer)
  const scale = sunSize / 200; // Original viewBox was 0 0 200 200
  
  // Map homepage moods to appropriate expressions - PROPER SMILE RULES: Only smile when safe!
  const getFaceExpression = () => {
    switch(mood) {
      case 'calm':
        return {
          eyeType: 'closed', // Peaceful, sleeping
          mouthType: 'peaceful' // ✅ SAFE - gentle smile okay
        };
      case 'flare': 
        return {
          eyeType: 'bright', // Energetic but cautious
          mouthType: 'neutral' // ⚠️ MINOR RISK - neutral expression (flares can disrupt satellites)
        };
      case 'storm':
        return {
          eyeType: 'normal', // Steady
          mouthType: 'slight-smile' // ✅ MOSTLY SAFE - slight smile (beautiful auroras, minor effects)
        };
      case 'radiation':
        return {
          eyeType: 'intense', // Worried
          mouthType: 'concerned' // ❌ DANGEROUS - no smiling (astronauts at risk)
        };
      case 'extreme':
        return {
          eyeType: 'alert', // Very alert
          mouthType: 'worried' // ❌ VERY DANGEROUS - definitely no smiling (power grids, satellites at risk)
        };
    }
  };

  const { eyeType, mouthType } = getFaceExpression();

  return (
    <g transform={`translate(${sunSize/2 - 100 * scale}, ${sunSize/2 - 100 * scale}) scale(${scale})`}>
      {/* Eyes - Using exact same rendering as visualizer box */}
      {eyeType === 'closed' ? (
        <>
          <path d="M 75 85 Q 80 90 85 85" stroke="#333" strokeWidth="3" fill="none" />
          <path d="M 115 85 Q 120 90 125 85" stroke="#333" strokeWidth="3" fill="none" />
        </>
      ) : eyeType === 'normal' ? (
        <>
          <circle cx="80" cy="85" r="4" fill="#333" />
          <circle cx="120" cy="85" r="4" fill="#333" />
        </>
      ) : eyeType === 'bright' ? (
        <>
          <circle cx="80" cy="85" r="5" fill="#333" />
          <circle cx="120" cy="85" r="5" fill="#333" />
          <circle cx="81" cy="83" r="2" fill="#FFF" />
          <circle cx="121" cy="83" r="2" fill="#FFF" />
        </>
      ) : eyeType === 'intense' ? (
        <>
          <path d="M 70 80 L 85 85 L 70 90" stroke="#333" strokeWidth="3" fill="none" />
          <path d="M 130 80 L 115 85 L 130 90" stroke="#333" strokeWidth="3" fill="none" />
        </>
      ) : (
        <>
          <circle cx="80" cy="85" r="6" fill="#333" />
          <circle cx="120" cy="85" r="6" fill="#333" />
          <circle cx="82" cy="83" r="2" fill="#FFF" />
          <circle cx="122" cy="83" r="2" fill="#FFF" />
        </>
      )}
      
      {/* Mouth - Using exact same rendering as visualizer box */}
      {mouthType === 'peaceful' ? (
        <path d="M 90 110 Q 100 105 110 110" stroke="#333" strokeWidth="2" fill="none" />
      ) : mouthType === 'slight-smile' ? (
        <path d="M 90 110 Q 100 115 110 110" stroke="#333" strokeWidth="2" fill="none" />
      ) : mouthType === 'happy' ? (
        <path d="M 85 110 Q 100 125 115 110" stroke="#333" strokeWidth="3" fill="none" />
      ) : mouthType === 'neutral' ? (
        <path d="M 90 115 L 110 115" stroke="#333" strokeWidth="2" fill="none" />
      ) : mouthType === 'concerned' ? (
        <path d="M 90 115 Q 100 110 110 115" stroke="#333" strokeWidth="3" fill="none" />
      ) : (
        <ellipse cx="100" cy="115" rx="8" ry="6" fill="#333" />
      )}
    </g>
  );
};

const SunRays: React.FC<{ mood: SunMood; size: number }> = ({ mood, size }) => {
  const state = sunStates[mood];
  const rayCount = 16;
  const rays = Array.from({ length: rayCount }, (_, i) => i);
  const centerX = size / 2;
  const centerY = size / 2;
  const sunRadius = size * 0.25; // Same as sun body radius
  const rayStartRadius = sunRadius + size * 0.05; // Start rays just outside the sun
  const rayLength = size * 0.15; // Ray length

  const getRayAnimation = () => {
    switch (mood) {
      case 'calm':
        return {
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7],
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'flare':
        return {
          scale: [1, 1.3, 1],
          opacity: [0.8, 1, 0.8],
          transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'storm':
        return {
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
          transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'radiation':
        return {
          scale: [1, 1.4, 0.9, 1.2, 1],
          opacity: [0.5, 1, 0.3, 0.8, 0.5],
          transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'extreme':
        return {
          scale: [1, 1.5, 0.8, 1.3, 1],
          opacity: [0.9, 1, 0.4, 1, 0.9],
          transition: { duration: 0.3, repeat: Infinity, ease: 'easeInOut' as const }
        };
    }
  };

  return (
    <g>
      {rays.map((i) => {
        const angle = (i * 360) / rayCount;
        const angleRad = (angle * Math.PI) / 180;
        
        // Calculate start and end points for each ray
        const startX = centerX + Math.cos(angleRad) * rayStartRadius;
        const startY = centerY + Math.sin(angleRad) * rayStartRadius;
        const endX = centerX + Math.cos(angleRad) * (rayStartRadius + rayLength);
        const endY = centerY + Math.sin(angleRad) * (rayStartRadius + rayLength);
        
        const rayWidth = mood === 'extreme' ? size * 0.01 : mood === 'radiation' ? size * 0.008 : size * 0.006;
        
        return (
          <motion.line
            key={i}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={state.color}
            strokeWidth={rayWidth}
            strokeLinecap="round"
            animate={getRayAnimation()}
          />
        );
      })}
      
      {/* Additional shorter rays for more sun-like appearance */}
      {rays.map((i) => {
        if (i % 2 !== 0) return null; // Only every other ray
        
        const angle = (i * 360) / rayCount + (360 / rayCount / 2); // Offset by half
        const angleRad = (angle * Math.PI) / 180;
        
        const startX = centerX + Math.cos(angleRad) * (rayStartRadius + size * 0.02);
        const startY = centerY + Math.sin(angleRad) * (rayStartRadius + size * 0.02);
        const endX = centerX + Math.cos(angleRad) * (rayStartRadius + rayLength * 0.6);
        const endY = centerY + Math.sin(angleRad) * (rayStartRadius + rayLength * 0.6);
        
        return (
          <motion.line
            key={`short-${i}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={state.color}
            strokeWidth={size * 0.004}
            strokeLinecap="round"
            opacity={0.8}
            animate={getRayAnimation()}
          />
        );
      })}
    </g>
  );
};

const SunBurst: React.FC<{ mood: SunMood; size: number; trigger: boolean }> = ({ mood, size, trigger }) => {
  if (mood !== 'flare' && mood !== 'extreme') return null;

  const centerX = size / 2;
  const centerY = size / 2;
  const burstRadius1 = size * 0.35;
  const burstRadius2 = size * 0.25;

  return (
    <AnimatePresence>
      {trigger && (
        <motion.g
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <circle
            cx={centerX}
            cy={centerY}
            r={burstRadius1}
            fill={sunStates[mood].color}
            opacity="0.3"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={burstRadius2}
            fill={sunStates[mood].glowColor}
            opacity="0.5"
          />
        </motion.g>
      )}
    </AnimatePresence>
  );
};

export default function SunCharacter({ 
  mood, 
  className = '', 
  size = 'large',
  showDialogue = true,
  onSunClick
}: SunCharacterProps) {
  const [burstTrigger, setBurstTrigger] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showExpandedDialogue, setShowExpandedDialogue] = useState(false);
  const [currentExplanationIndex, setCurrentExplanationIndex] = useState(0);
  
  const state = sunStates[mood];
  const explanations = kidFriendlyExplanations[mood];
  
  const sizeMap = {
    small: 120,
    medium: 200,
    large: 300
  };
  
  const sunSize = sizeMap[size];

  // Handle clicking the sun or dialogue
  const handleSunClick = () => {
    if (showExpandedDialogue) {
      // Cycle through explanations
      setCurrentExplanationIndex((prev) => (prev + 1) % explanations.length);
    } else {
      // Show expanded dialogue
      setShowExpandedDialogue(true);
      setCurrentExplanationIndex(0);
    }
    
    // Call the parent's click handler if provided
    onSunClick?.();
  };

  // Reset expanded dialogue when mood changes
  useEffect(() => {
    setShowExpandedDialogue(false);
    setCurrentExplanationIndex(0);
  }, [mood]);

  // Auto-hide expanded dialogue after 10 seconds
  useEffect(() => {
    if (showExpandedDialogue) {
      const timeout = setTimeout(() => {
        setShowExpandedDialogue(false);
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [showExpandedDialogue, currentExplanationIndex]);

  // Trigger burst animation for flares and extreme events
  useEffect(() => {
    if (mood === 'flare' || mood === 'extreme') {
      const interval = setInterval(() => {
        setBurstTrigger(true);
        setTimeout(() => setBurstTrigger(false), 600);
      }, mood === 'extreme' ? 2000 : 4000);
      
      return () => clearInterval(interval);
    }
  }, [mood]);

  const getSunAnimation = () => {
    const baseAnimation = {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
    };

    if (mood === 'radiation') {
      return {
        ...baseAnimation,
        x: [-2, 2, -2, 2, 0],
        transition: { duration: 0.5, repeat: Infinity }
      };
    }

    return baseAnimation;
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Speech bubble */}
      {showDialogue && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 mb-4 max-w-sm text-center shadow-lg cursor-pointer hover:bg-white/100 transition-all duration-200"
          onClick={handleSunClick}
        >
          <AnimatePresence mode="wait">
            {showExpandedDialogue ? (
              <motion.div
                key={`expanded-${currentExplanationIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-800 font-medium text-sm mb-2">
                  {explanations[currentExplanationIndex]}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Click for more! 👆</span>
                  <div className="flex items-center gap-1">
                    <span>{currentExplanationIndex + 1}/{explanations.length}</span>
                    {currentExplanationIndex < explanations.length - 1 && (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-blue-500"
                      >
                        ●
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="basic"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-800 font-medium">{state.message}</p>
                <p className="text-xs text-gray-500 mt-2">Click me to learn more! 👆</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Speech bubble pointer */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
          </div>
        </motion.div>
      )}

      {/* Sun character */}
      <motion.div
        className="relative cursor-pointer"
        style={{ width: sunSize, height: sunSize }}
        animate={getSunAnimation()}
        whileHover={{ scale: 1.05 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleSunClick}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${state.glowColor}40 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: mood === 'extreme' ? 0.5 : mood === 'radiation' ? 1 : 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* SVG Sun */}
        <svg
          width={sunSize}
          height={sunSize}
          viewBox={`0 0 ${sunSize} ${sunSize}`}
          className="relative z-10"
        >
          {/* Rays behind the sun */}
          <SunRays mood={mood} size={sunSize} />
          
          {/* Burst effects */}
          <SunBurst mood={mood} size={sunSize} trigger={burstTrigger} />
          
          {/* Sun body */}
          <motion.circle
            cx={sunSize / 2}
            cy={sunSize / 2}
            r={sunSize * 0.25}
            fill={state.color}
            animate={{
              fill: state.color,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Face on top */}
          <SunFace mood={mood} sunSize={sunSize} />
        </svg>

        {/* Aurora effect for storm mood */}
        {mood === 'storm' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-full h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-b-full opacity-30 blur-sm"></div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}