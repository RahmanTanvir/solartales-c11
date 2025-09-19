'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function SolarAdventureButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [showShootingStar, setShowShootingStar] = useState(false);

  // Sparkle animation trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Shooting star on hover
  useEffect(() => {
    if (isHovered) {
      const timeout = setTimeout(() => {
        setShowShootingStar(true);
        setTimeout(() => setShowShootingStar(false), 800);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isHovered]);

  const handleClick = () => {
    setIsClicked(true);
    // Animation will trigger but navigation happens immediately via Link
  };

  // Orbiting planets data - responsive sizes
  const planets = [
    { size: 6, orbit: 80, speed: 20, color: '#FF6B6B', delay: 0 },
    { size: 4, orbit: 90, speed: 15, color: '#4ECDC4', delay: 5 },
    { size: 3, orbit: 70, speed: 25, color: '#45B7D1', delay: 10 },
  ];

  return (
    <div className="relative w-full flex justify-center">
      {/* Orbiting Planets - Hidden on very small screens */}
      <div className="hidden sm:block">
        {planets.map((planet, index) => (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: planet.orbit * 2,
              height: planet.orbit * 2,
              marginTop: -planet.orbit,
              marginLeft: -planet.orbit,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: planet.speed,
              repeat: Infinity,
              ease: 'linear',
              delay: planet.delay,
            }}
          >
            <motion.div
              className="absolute top-0 left-1/2 rounded-full opacity-60"
              style={{
                width: planet.size,
                height: planet.size,
                marginLeft: -planet.size / 2,
                backgroundColor: planet.color,
                boxShadow: `0 0 ${planet.size}px ${planet.color}40`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Shooting Star - Responsive positioning */}
      <AnimatePresence>
        {showShootingStar && (
          <motion.div
            className="absolute top-0 left-0 pointer-events-none hidden sm:block"
            initial={{ x: -50, y: 20, opacity: 0 }}
            animate={{ x: 150, y: -20, opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-300 rounded-full shadow-lg">
              <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping"></div>
            </div>
            <motion.div
              className="absolute top-1/2 right-full w-6 sm:w-8 h-0.5 bg-gradient-to-r from-transparent to-yellow-300"
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solar Flare Burst on Click */}
      <AnimatePresence>
        {isClicked && (
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 pointer-events-none"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0, y: -20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="text-4xl">🔥</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scattered Stars on Click */}
      <AnimatePresence>
        {isClicked && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 pointer-events-none text-yellow-300"
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <Link href="/stories" className="block">
        <motion.button
          className="relative overflow-hidden px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-full text-lg sm:text-xl font-bold text-white cursor-pointer group w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          style={{
            background: 'linear-gradient(135deg, #6B46C1 0%, #3B82F6 50%, #FDE047 100%)',
            backgroundSize: '200% 200%',
            filter: 'drop-shadow(0 4px 16px rgba(107, 70, 193, 0.3)) drop-shadow(0 8px 32px rgba(107, 70, 193, 0.2))',
          }}
          animate={{
            scale: isClicked ? [1, 0.95, 1.05, 1] : [1, 1.02, 1],
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            boxShadow: isHovered
              ? [
                  '0 8px 32px rgba(107, 70, 193, 0.4)',
                  '0 12px 40px rgba(59, 130, 246, 0.5)',
                  '0 8px 32px rgba(107, 70, 193, 0.4)',
                ]
              : [
                  '0 4px 16px rgba(107, 70, 193, 0.3)',
                  '0 8px 24px rgba(107, 70, 193, 0.4)',
                  '0 4px 16px rgba(107, 70, 193, 0.3)',
                ],
          }}
          transition={{
            scale: isClicked
              ? { duration: 0.6, ease: 'easeInOut' }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            backgroundPosition: { duration: 8, repeat: Infinity, ease: 'linear' },
            boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
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
              background: 'linear-gradient(135deg, #A855F7, #3B82F6, #FDE047, #A855F7) border-box',
              mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
            }}
            animate={{
              opacity: isHovered ? [0.6, 1, 0.6] : [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Button Text */}
          <motion.span
            className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 text-center"
            animate={{
              y: isHovered ? [0, -1, 0] : 0,
            }}
            transition={{
              duration: 0.6,
              repeat: isHovered ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <span className="hidden sm:inline">✨</span>
            <span className="px-1">Start My Solar Adventure!</span>
            <span className="hidden sm:inline">✨</span>
          </motion.span>

          {/* Sparkle Overlay */}
          <AnimatePresence>
            {showSparkles && (
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-200 text-xs"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 180],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: 'easeInOut',
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Aurora Wave Effect */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.3), transparent)',
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Ripple Effect for Mobile */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white opacity-0"
            animate={
              isClicked
                ? {
                    scale: [0, 2],
                    opacity: [0.3, 0],
                  }
                : {}
            }
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      </Link>
    </div>
  );
}