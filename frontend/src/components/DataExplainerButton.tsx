'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Zap, Brain } from 'lucide-react';

interface DataExplainerButtonProps {
  onClick: () => void;
}

export default function DataExplainerButton({ onClick }: DataExplainerButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [showLightning, setShowLightning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sparkle animation trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1500);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Lightning effect on hover
  useEffect(() => {
    if (isHovered) {
      const timeout = setTimeout(() => {
        setShowLightning(true);
        setTimeout(() => setShowLightning(false), 600);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [isHovered]);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
    onClick();
  };

  // Floating data symbols
  const dataSymbols = ['📊', '🌟', '⚡', '🔬', '📡', '🌌'];

  return (
    <div className="relative w-full flex justify-center mb-8">
      {/* Floating Data Symbols - Reduced on mobile */}
      <div className="absolute inset-0 pointer-events-none">
        {dataSymbols.map((symbol, index) => (
          <motion.div
            key={index}
            className={`absolute opacity-30 ${index > 3 ? 'hidden sm:block' : ''}`}
            style={{
              left: `${15 + (index * (isMobile ? 18 : 12))}%`,
              top: `${30 + Math.sin(index) * (isMobile ? 15 : 20)}%`,
              fontSize: 'clamp(14px, 4vw, 24px)',
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + index * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.3,
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Sparkle Effect - Reduced count on mobile */}
      <AnimatePresence>
        {showSparkles && (
          <>
            {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute pointer-events-none text-yellow-300"
                style={{
                  left: `${50 + (Math.sin(i * 0.8) * (isMobile ? 40 : 60))}%`,
                  top: `${50 + (Math.cos(i * 0.8) * (isMobile ? 30 : 40))}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, delay: i * 0.1 }}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Lightning Effect */}
      <AnimatePresence>
        {showLightning && (
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 pointer-events-none text-blue-400"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Zap className="w-8 h-8" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Knowledge Burst on Click */}
      <AnimatePresence>
        {isClicked && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 pointer-events-none text-purple-400"
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 120,
                  y: (Math.random() - 0.5) * 120,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <Brain className="w-5 h-5" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        className="relative overflow-hidden px-8 sm:px-12 md:px-16 py-5 sm:py-6 md:py-7 rounded-full text-lg sm:text-xl md:text-2xl font-bold text-white cursor-pointer group w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 30%, #10B981 60%, #F59E0B 100%)',
          backgroundSize: '300% 300%',
          filter: 'drop-shadow(0 4px 20px rgba(139, 92, 246, 0.4)) drop-shadow(0 8px 40px rgba(6, 182, 212, 0.3))',
        }}
        animate={{
          scale: isClicked ? [1, 0.95, 1.05, 1] : [1, 1.02, 1],
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          boxShadow: isHovered
            ? [
                '0 8px 40px rgba(139, 92, 246, 0.5)',
                '0 12px 50px rgba(6, 182, 212, 0.6)',
                '0 8px 40px rgba(139, 92, 246, 0.5)',
              ]
            : [
                '0 4px 20px rgba(139, 92, 246, 0.4)',
                '0 8px 30px rgba(6, 182, 212, 0.5)',
                '0 4px 20px rgba(139, 92, 246, 0.4)',
              ],
        }}
        transition={{
          scale: isClicked
            ? { duration: 0.5, ease: 'easeInOut' }
            : { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          backgroundPosition: { duration: 10, repeat: Infinity, ease: 'linear' },
          boxShadow: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Glowing Border */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            background: 'linear-gradient(135deg, #A855F7, #06B6D4, #10B981, #F59E0B, #A855F7) border-box',
            mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
          animate={{
            opacity: isHovered ? [0.6, 1, 0.6] : [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Flowing Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${(i * 8.33)}%`,
                top: '50%',
              }}
              animate={{
                x: ['-100%', '400%'],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Button Text */}
        <motion.span
          className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 text-center"
          animate={{
            y: isHovered ? [0, -2, 0] : 0,
          }}
          transition={{
            duration: 0.8,
            repeat: isHovered ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="px-1">Explain Today's Data!</span>
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
          >
            🌟
          </motion.div>
        </motion.span>

        {/* Inner Glow */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20"
          animate={{
            opacity: isHovered ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Ripple Effect for Mobile */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white opacity-0"
          animate={
            isClicked
              ? {
                  scale: [0, 2.5],
                  opacity: [0.3, 0],
                }
              : {}
          }
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    </div>
  );
}