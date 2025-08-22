'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Globe, Users, Clock, MessageCircle } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
  href?: string;
}

export function FeatureCard({ icon, title, description, gradient, delay = 0, href }: FeatureCardProps) {
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`glass p-6 rounded-xl transition-all duration-300 group ${
        href ? 'hover:bg-white/15 cursor-pointer hover:scale-105' : 'hover:bg-white/15'
      }`}
    >
      <div className={`w-12 h-12 ${gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Real-Time Solar Activity",
      description: "Experience live solar flares, coronal mass ejections, and space weather events as they happen, powered by NASA DONKI and NOAA data.",
      gradient: "bg-gradient-to-r from-yellow-400 to-orange-500 solar-flare",
      href: "/data"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-white" />,
      title: "Interactive Stories",
      description: "Choose your character perspective - astronaut, scientist, or space enthusiast - and experience space weather through engaging narratives.",
      gradient: "bg-gradient-to-r from-green-400 to-blue-500 aurora",
      href: "/stories"
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      title: "Time Travel Mode",
      description: "Journey through history's most dramatic space weather events - from the 1859 Carrington Event to the 2003 Halloween Storms.",
      gradient: "bg-gradient-to-r from-amber-400 to-orange-600",
      href: "/time-travel"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      title: "Ask AI StoryGuide",
      description: "Chat with our friendly AI assistant! Ask questions about space weather, get fun facts, and discover new stories tailored just for you.",
      gradient: "bg-gradient-to-r from-indigo-400 to-purple-500",
      href: "/ask"
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Educational Content", 
      description: "Learn about space weather phenomena through age-appropriate content, interactive activities, and scientifically accurate information.",
      gradient: "bg-gradient-to-r from-purple-400 to-pink-500",
      href: "/learn"
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Multi-Perspective Learning",
      description: "Experience events from different viewpoints: ISS astronauts, airline pilots, farmers, power grid operators, and the general public.",
      gradient: "bg-gradient-to-r from-cyan-400 to-blue-500"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          gradient={feature.gradient}
          delay={0.4 + index * 0.1}
          href={feature.href}
        />
      ))}
    </div>
  );
}
