'use client';

import { motion } from 'framer-motion';
import { TimeTravelEvent } from '@/lib/timeTravelEvents';
import { Calendar, MapPin, Zap, Clock, ArrowRight } from 'lucide-react';

interface TimeTravelEventCardProps {
  event: TimeTravelEvent;
  onSelect: () => void;
  alignment: 'left' | 'right';
}

export function TimeTravelEventCard({ event, onSelect, alignment }: TimeTravelEventCardProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return <Zap className="w-5 h-5 text-red-400" />;
      case 'high':
        return <Zap className="w-5 h-5 text-orange-400" />;
      case 'moderate':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      default:
        return <Zap className="w-5 h-5 text-green-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return 'border-red-500/50 bg-red-900/10';
      case 'high':
        return 'border-orange-500/50 bg-orange-900/10';
      case 'moderate':
        return 'border-yellow-500/50 bg-yellow-900/10';
      default:
        return 'border-green-500/50 bg-green-900/10';
    }
  };

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${event.theme.colors.background} 
        backdrop-blur-sm 
        rounded-2xl 
        border border-white/20 
        p-6 
        cursor-pointer 
        group 
        transition-all 
        duration-500 
        hover:border-white/40 
        hover:shadow-2xl
        ${alignment === 'right' ? 'text-right' : 'text-left'}
      `}
    >
      {/* Era badge */}
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${event.theme.colors.primary} text-white`}>
        {event.era}
      </div>

      {/* Event title */}
      <h3 className={`text-2xl font-bold mb-3 ${event.theme.colors.accent} ${event.theme.fonts.primary}`}>
        {event.name}
      </h3>

      {/* Date and location */}
      <div className={`flex items-center space-x-4 mb-4 ${alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={`text-sm text-gray-300 ${event.theme.fonts.accent}`}>
            {event.date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getSeverityColor(event.severity)}`}>
          {getSeverityIcon(event.severity)}
          <span className="text-xs font-medium capitalize">{event.severity}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 leading-relaxed mb-6">
        {event.description}
      </p>

      {/* Impact preview */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-purple-400 mb-2">Key Impacts:</h4>
        <ul className="space-y-1">
          {event.impacts.slice(0, 3).map((impact, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>{impact}</span>
            </li>
          ))}
          {event.impacts.length > 3 && (
            <li className="text-sm text-gray-500 italic">
              +{event.impacts.length - 3} more impacts...
            </li>
          )}
        </ul>
      </div>

      {/* Historical context */}
      <div className="mb-6 p-4 bg-black/20 rounded-lg border border-white/10">
        <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Historical Context</span>
        </h4>
        <p className="text-sm text-gray-300 italic">
          {event.historicalContext}
        </p>
      </div>

      {/* Available perspectives */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-green-400 mb-2">Experience as:</h4>
        <div className={`flex space-x-2 ${alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
          {event.characters.map((character, index) => (
            <div
              key={character}
              className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
            >
              {character.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          ))}
        </div>
      </div>

      {/* Action button */}
      <div className={`flex ${alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
        <div className="flex items-center space-x-2 text-purple-400 group-hover:text-purple-300 transition-colors">
          <span className="font-medium">Experience This Event</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Era-specific decorative elements */}
      <div className="absolute top-4 right-4 opacity-20">
        {event.era === 'Victorian Era' && (
          <div className="text-amber-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L19 7.27L15.18 12L19 16.73L13.09 15.74L12 22L10.91 15.74L5 16.73L8.82 12L5 7.27L10.91 8.26L12 2Z"/>
            </svg>
          </div>
        )}
        {event.era === 'Modern Era' && (
          <div className="text-blue-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
            </svg>
          </div>
        )}
        {event.era === 'Internet Age' && (
          <div className="text-orange-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.58 10.76C10.22 10.54 9.8 10.4 9.35 10.35L8.23 9.23C7.64 8.64 6.7 8.64 6.11 9.23L2.75 12.59C2.16 13.18 2.16 14.12 2.75 14.71L6.11 18.07C6.7 18.66 7.64 18.66 8.23 18.07L11.59 14.71C12.18 14.12 12.18 13.18 11.59 12.59L10.47 11.47C10.42 11.02 10.28 10.6 10.06 10.24L15.65 4.65L18.32 7.32L19.82 5.82L14.82 0.82L12 3.64L12 2ZM12 8C12.55 8 13 8.45 13 9S12.55 10 12 10 11 9.55 11 9 11.45 8 12 8Z"/>
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}
