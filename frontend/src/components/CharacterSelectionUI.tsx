'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Plane, Tractor, Zap, Camera, Radio, Clock, Trophy, BookOpen, Star } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  longDescription: string;
  icon: React.ReactNode;
  gradient: string;
  personality: string[];
  expertise: string[];
  achievements: string[];
  storyCount: number;
  averageRating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface CharacterSelectionUIProps {
  selectedCharacter: string;
  onCharacterSelect: (characterId: string) => void;
  className?: string;
}

export function CharacterSelectionUI({ 
  selectedCharacter, 
  onCharacterSelect, 
  className = '' 
}: CharacterSelectionUIProps) {
  const [expandedCharacter, setExpandedCharacter] = useState<string | null>(null);

  const characters: Character[] = [
    {
      id: 'astronaut',
      name: 'Sumaiya Subha',
      role: 'ISS Astronaut & Mission Specialist',
      description: 'Experience space weather from the International Space Station',
      longDescription: 'A veteran astronaut with over 400 days in space, Sumaiya has witnessed numerous space weather events firsthand from the ISS. Her stories combine technical expertise with the wonder of experiencing cosmic phenomena from orbit, explaining how space weather affects astronauts and spacecraft.',
      icon: <Rocket className="w-6 h-6" />,
      gradient: 'from-blue-400 to-purple-600',
      personality: ['Adventurous', 'Technical', 'Inspiring', 'Courageous'],
      expertise: ['Space Operations', 'Radiation Safety', 'Aurora Observations', 'Emergency Procedures'],
      achievements: ['3 Space Missions', 'ISS Commander', 'EVA Specialist', 'Science Officer'],
      storyCount: 24,
      averageRating: 4.8,
      difficulty: 'Intermediate'
    },
    {
      id: 'pilot',
      name: 'Captain Tanvir Rahman',
      role: 'Commercial Airline Pilot',
      description: 'Navigate space weather challenges during flight operations',
      longDescription: 'An experienced airline pilot with 20 years of flying experience who regularly deals with space weather impacts on navigation, communications, and flight safety. Tanvir explains how pilots adapt when space weather affects aircraft systems and passenger safety.',
      icon: <Plane className="w-6 h-6" />,
      gradient: 'from-sky-400 to-blue-500',
      personality: ['Professional', 'Safety-focused', 'Adaptable', 'Communicative'],
      expertise: ['Aviation Navigation', 'Radio Communications', 'GPS Systems', 'Flight Safety'],
      achievements: ['20+ Years Flying', 'Safety Excellence Award', 'Aurora Flight Expert', 'Emergency Training'],
      storyCount: 31,
      averageRating: 4.9,
      difficulty: 'Intermediate'
    },
    {
      id: 'farmer',
      name: 'Wasif Ahmad',
      role: 'Modern Precision Farmer',
      description: 'Understand how space weather affects modern agriculture',
      longDescription: 'A modern farmer who relies on GPS-guided tractors and precision agriculture technology. Wasif shows how space weather impacts farming operations and how farmers adapt when technology fails, connecting space science to food production.',
      icon: <Tractor className="w-6 h-6" />,
      gradient: 'from-green-400 to-emerald-500',
      personality: ['Practical', 'Resourceful', 'Community-focused', 'Earth-connected'],
      expertise: ['Precision Agriculture', 'GPS Technology', 'Weather Monitoring', 'Crop Management'],
      achievements: ['Sustainable Farming Award', 'Technology Pioneer', 'Community Leader', 'Harvest Excellence'],
      storyCount: 18,
      averageRating: 4.7,
      difficulty: 'Beginner'
    },
    {
      id: 'power_grid_operator',
      name: 'Ibrahim Ilham',
      role: 'Regional Power Grid Operator',
      description: 'Protect electrical systems during geomagnetic storms',
      longDescription: 'A power grid operator who works at the regional electrical control center, monitoring and protecting electrical systems during geomagnetic storms. Ibrahim explains how space weather threatens our electrical infrastructure and how operators work to keep the lights on.',
      icon: <Zap className="w-6 h-6" />,
      gradient: 'from-orange-400 to-red-500',
      personality: ['Vigilant', 'Technical', 'Responsible', 'Problem-solver'],
      expertise: ['Power Systems', 'Grid Protection', 'Emergency Response', 'Load Management'],
      achievements: ['Grid Stability Expert', 'Emergency Coordinator', 'Technology Specialist', 'Public Service Award'],
      storyCount: 22,
      averageRating: 4.8,
      difficulty: 'Advanced'
    },
    {
      id: 'aurora_hunter',
      name: 'Saad Wasit',
      role: 'Aurora Photographer & General Public',
      description: 'Witness the beauty of space weather as an everyday person',
      longDescription: 'A photography enthusiast and aurora chaser from northern Canada who represents the general public. Saad shares the excitement of witnessing Northern Lights and explains how space weather affects ordinary people in their daily lives.',
      icon: <Camera className="w-6 h-6" />,
      gradient: 'from-purple-400 to-pink-500',
      personality: ['Enthusiastic', 'Creative', 'Curious', 'Community-minded'],
      expertise: ['Aurora Photography', 'Weather Tracking', 'Public Outreach', 'Nature Observation'],
      achievements: ['Award-winning Photos', 'Aurora Forecast Blog', 'Community Educator', 'Citizen Scientist'],
      storyCount: 20,
      averageRating: 4.6,
      difficulty: 'Beginner'
    },
    {
      id: 'radio_operator',
      name: 'Arman Khan',
      role: 'Ham Radio Operator & Emergency Communications',
      description: 'Experience communication disruptions during space weather events',
      longDescription: 'A ham radio operator and emergency communications volunteer who represents both radio enthusiasts and everyday citizens who rely on communications during emergencies. Arman explains how space weather affects radio waves and emergency services.',
      icon: <Radio className="w-6 h-6" />,
      gradient: 'from-indigo-400 to-purple-500',
      personality: ['Technical', 'Community-service', 'Reliable', 'Educational'],
      expertise: ['Radio Communications', 'Emergency Response', 'Signal Propagation', 'Public Service'],
      achievements: ['Emergency Coordinator', 'Radio Excellence Award', 'Public Service Medal', 'Technical Expert'],
      storyCount: 16,
      averageRating: 4.7,
      difficulty: 'Intermediate'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose Your Perspective</h2>
        <p className="text-gray-400">
          Each character offers a unique viewpoint on space weather events
        </p>
      </div>

      <div className="grid gap-4">
        {characters.map((character) => {
          const isSelected = selectedCharacter === character.id;
          const isExpanded = expandedCharacter === character.id;

          return (
            <motion.div
              key={character.id}
              layout
              className={`glass rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'ring-2 ring-blue-400 bg-white/20'
                  : 'hover:bg-white/10'
              }`}
              onClick={() => {
                onCharacterSelect(character.id);
                setExpandedCharacter(isExpanded ? null : character.id);
              }}
            >
              {/* Main Character Card */}
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Character Avatar */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${character.gradient} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                    {character.icon}
                  </div>

                  {/* Character Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{character.name}</h3>
                        <p className="text-sm text-gray-400">{character.role}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(character.difficulty)}`}>
                          {character.difficulty}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center"
                          >
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">{character.description}</p>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{character.storyCount} stories</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(character.averageRating)}
                        <span className="ml-1">{character.averageRating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personality Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {character.personality.slice(0, 3).map((trait, index) => (
                    <span
                      key={index}
                      className="text-xs bg-white/10 px-2 py-1 rounded-full"
                    >
                      {trait}
                    </span>
                  ))}
                  {character.personality.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{character.personality.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/10 overflow-hidden"
                  >
                    <div className="p-6 space-y-4">
                      {/* Long Description */}
                      <div>
                        <h4 className="font-semibold mb-2">About {character.name}</h4>
                        <p className="text-sm text-gray-300">{character.longDescription}</p>
                      </div>

                      {/* Expertise */}
                      <div>
                        <h4 className="font-semibold mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {character.expertise.map((skill, index) => (
                            <span
                              key={index}
                              className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center space-x-1">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span>Achievements</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {character.achievements.map((achievement, index) => (
                            <div
                              key={index}
                              className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded flex items-center space-x-1"
                            >
                              <Star className="w-3 h-3" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <button
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'bg-white/10 hover:bg-white/20 text-gray-300'
                          }`}
                        >
                          {isSelected ? 'Selected Character' : 'Select This Character'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
