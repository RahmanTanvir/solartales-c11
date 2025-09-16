'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface FeaturePlanetProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  delay?: number;
  orbitRadius: number;
  orbitSpeed: number;
  href?: string;
}

function FeaturePlanet({ icon, title, subtitle, gradient, delay = 0, orbitRadius, orbitSpeed, href }: FeaturePlanetProps) {
  const [isHovered, setIsHovered] = useState(false);

  const planetContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, type: 'spring', bounce: 0.4 }}
      className="relative"
    >
      {/* Floating Animation Container */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 4 + orbitSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Planet Card */}
        <motion.div
          className={`relative w-48 h-48 rounded-full ${gradient} p-6 cursor-pointer group shadow-2xl overflow-hidden`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          animate={isHovered ? { boxShadow: '0 0 30px rgba(255,255,255,0.3)' } : {}}
          transition={{ duration: 0.3 }}
        >
          {/* Twinkling stars inside planet */}
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Planet Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            {/* Icon */}
            <motion.div
              className="text-6xl mb-2"
              animate={isHovered ? { scale: 1.2, rotate: 10 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>

            {/* Title */}
            <motion.h3
              className="text-white font-bold text-lg mb-1 drop-shadow-lg"
              animate={isHovered ? { y: -2 } : { y: 0 }}
            >
              {title}
            </motion.h3>

            {/* Subtitle */}
            <motion.p
              className="text-white/90 text-sm font-medium"
              animate={isHovered ? { y: -2 } : { y: 0 }}
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Hover Ring Effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-white/30"
            initial={{ scale: 1, opacity: 0 }}
            animate={isHovered ? { scale: 1.2, opacity: 1 } : { scale: 1, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Orbital Trail */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-white/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {planetContent}
      </a>
    );
  }

  return planetContent;
}

export function FeaturesSection() {
  const features = [
    {
      icon: '📚',
      title: 'Story Worlds',
      subtitle: 'Stories Made From the Stars',
      gradient: 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600',
      orbitRadius: 100,
      orbitSpeed: 1,
      href: '/stories'
    },
    {
      icon: '☀️',
      title: 'Space Weather',
      subtitle: 'Real Sun, Real Fun',
      gradient: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
      orbitRadius: 120,
      orbitSpeed: 0.8,
      href: '/data'
    },
    {
      icon: '🚀',
      title: 'Adventures',
      subtitle: 'Click to Explore',
      gradient: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600',
      orbitRadius: 110,
      orbitSpeed: 1.2,
      href: '/time-travel'
    },
    {
      icon: '🛡️',
      title: 'Safe Learning',
      subtitle: 'Fun & Educational',
      gradient: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500',
      orbitRadius: 90,
      orbitSpeed: 0.9,
      href: '/learn'
    }
  ];

  return (
    <section className="relative py-20">
      {/* Background Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Floating Comets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`comet-${i}`}
            className="absolute"
            initial={{ x: '-100px', y: `${20 + i * 30}%` }}
            animate={{ x: 'calc(100vw + 100px)', y: `${10 + i * 30}%` }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              delay: i * 7,
              ease: 'linear',
            }}
          >
            <div className="w-2 h-2 bg-blue-300 rounded-full">
              <div className="absolute inset-0 bg-blue-300 rounded-full animate-ping"></div>
            </div>
            <motion.div
              className="absolute top-1/2 right-full w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-300"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>

      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4 text-white"
          animate={{
            textShadow: [
              '0 0 10px rgba(255,255,255,0.5)',
              '0 0 20px rgba(255,255,255,0.8)',
              '0 0 10px rgba(255,255,255,0.5)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Why Kids Love This? ✨
        </motion.h2>
        <motion.p
          className="text-xl text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Explore our magical space playground where learning meets adventure!
        </motion.p>
      </motion.div>

      {/* Feature Planets */}
      <div className="relative">
        {/* Central Orbit Container */}
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative"
              style={{
                zIndex: 10 - index,
              }}
            >
              <FeaturePlanet
                icon={feature.icon}
                title={feature.title}
                subtitle={feature.subtitle}
                gradient={feature.gradient}
                delay={0.2 + index * 0.2}
                orbitRadius={feature.orbitRadius}
                orbitSpeed={feature.orbitSpeed}
                href={feature.href}
              />
            </motion.div>
          ))}
        </div>

        {/* Central Cosmic Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
            zIndex: -1,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>
    </section>
  );
}
