// AI Generated Stories Display Component
'use client';

import React, { useState, useEffect } from 'react';

// Types for the stories
export interface GeneratedStory {
  id: string;
  title: string;
  story: string;
  character: string;
  ageGroup: string;
  educationalFacts: string[];
  spaceWeatherEvent: {
    type: string;
    intensity: string;
    timestamp: Date;
    description: string;
    impacts: string[];
  };
  generatedAt: Date;
  isActive: boolean;
}

export type Character = 
  | 'solar_flare' 
  | 'astronaut' 
  | 'pilot' 
  | 'aurora_hunter' 
  | 'power_grid_operator'
  | 'farmer'
  | 'radio_operator';

interface AIStoriesProps {
  autoRefresh?: boolean;
  showControls?: boolean;
}

export const AIGeneratedStories: React.FC<AIStoriesProps> = ({ 
  autoRefresh = true, 
  showControls = true 
}) => {
  const [stories, setStories] = useState<GeneratedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | 'all'>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | 'all'>('all');
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  // Load stories on component mount
  useEffect(() => {
    loadStories();
    
    if (autoRefresh) {
      const interval = setInterval(loadStories, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedCharacter]);

  // Load stories from the API
  const loadStories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCharacter !== 'all') {
        params.append('character', selectedCharacter);
      }
      
      const response = await fetch(`/api/stories?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        // Filter by age group if selected
        const filteredStories = selectedAgeGroup === 'all' 
          ? data.stories 
          : data.stories.filter((story: GeneratedStory) => story.ageGroup === selectedAgeGroup);
        
        // Parse dates
        const storiesWithDates = filteredStories.map((story: any) => ({
          ...story,
          generatedAt: new Date(story.generatedAt),
          spaceWeatherEvent: {
            ...story.spaceWeatherEvent,
            timestamp: new Date(story.spaceWeatherEvent.timestamp)
          }
        }));
        
        setStories(storiesWithDates);
      } else {
        console.error('Error loading stories:', data.error);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate story for current conditions
  const generateStoryNow = async () => {
    if (selectedCharacter === 'all') return;
    
    try {
      setGenerating(true);
      const ageGroup = selectedAgeGroup === 'all' ? '11-13' : selectedAgeGroup;
      
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: selectedCharacter,
          ageGroup: ageGroup,
          eventType: 'solar_flare',
          intensity: 'moderate',
          description: 'Current space weather conditions',
          impacts: ['Ongoing space weather activity']
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Parse the date properly
        const newStory = {
          ...data.story,
          generatedAt: new Date(data.story.generatedAt),
          spaceWeatherEvent: {
            ...data.story.spaceWeatherEvent,
            timestamp: new Date(data.story.spaceWeatherEvent.timestamp)
          }
        };
        setStories(prev => [newStory, ...prev]);
      } else {
        console.error('Error generating story:', data.error);
        alert('Failed to generate story. Please try again.');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Please check your connection.');
    } finally {
      setGenerating(false);
    }
  };

  // Get event type display name
  const getEventTypeName = (type: string) => {
    const names = {
      'solar_flare': 'Solar Flare',
      'cme': 'Coronal Mass Ejection',
      'geomagnetic_storm': 'Geomagnetic Storm',
      'radio_blackout': 'Radio Blackout'
    };
    return names[type as keyof typeof names] || type;
  };

  // Get intensity badge color
  const getIntensityColor = (intensity: string) => {
    const colors = {
      'minor': 'bg-green-100 text-green-800 border-green-200',
      'moderate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'strong': 'bg-orange-100 text-orange-800 border-orange-200',
      'severe': 'bg-red-100 text-red-800 border-red-200',
      'extreme': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[intensity as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get character emoji
  const getCharacterEmoji = (character: Character) => {
    const emojis = {
      'solar_flare': '☀️',
      'astronaut': '👨‍🚀',
      'pilot': '✈️',
      'aurora_hunter': '📸',
      'power_grid_operator': '⚡',
      'farmer': '🚜',
      'radio_operator': '📻'
    };
    return emojis[character] || '🌟';
  };

  return (
    <div className="ai-generated-stories p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🤖 AI Space Weather Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time AI-generated stories based on current space weather events
          </p>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Character Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Character
                </label>
                <select
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value as Character | 'all')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Characters</option>
                  <option value="solar_flare">☀️ Solar Flare</option>
                  <option value="astronaut">👨‍🚀 Astronaut</option>
                  <option value="pilot">✈️ Pilot</option>
                  <option value="aurora_hunter">📸 Aurora Hunter</option>
                  <option value="power_grid_operator">⚡ Power Grid Operator</option>
                  <option value="farmer">🚜 Farmer</option>
                  <option value="radio_operator">📻 Radio Operator</option>
                </select>
              </div>

              {/* Age Group Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Age Group
                </label>
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Age Groups</option>
                  <option value="8-10">Ages 8-10</option>
                  <option value="11-13">Ages 11-13</option>
                  <option value="14-17">Ages 14-17</option>
                </select>
              </div>

              {/* Generate Now Button */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generate Story
                </label>
                <button
                  onClick={generateStoryNow}
                  disabled={loading || generating || selectedCharacter === 'all'}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                    selectedCharacter === 'all' || loading || generating
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  {generating ? '✨ Generating...' : '✨ Generate Story'}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={loadStories}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? '🔄 Loading...' : '🔄 Refresh Stories'}
              </button>
            </div>
          </div>
        )}

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI-generated stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Stories Yet</h3>
            <p className="text-gray-600 mb-4">
              Start auto-generation or generate a story manually to see AI-powered space weather narratives!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Story Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{getCharacterEmoji(story.character as Character)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getIntensityColor(story.spaceWeatherEvent.intensity)}`}>
                      {story.spaceWeatherEvent.intensity.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {story.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      {getEventTypeName(story.spaceWeatherEvent.type)}
                    </span>
                    <span className="bg-green-100 px-2 py-1 rounded">
                      Ages {story.ageGroup}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Generated {story.generatedAt.toLocaleDateString()} at {story.generatedAt.toLocaleTimeString()}
                  </p>
                </div>

                {/* Story Preview */}
                <div className="p-6">
                  <div className={`text-gray-700 leading-relaxed ${expandedStory === story.id ? '' : 'line-clamp-4'}`}>
                    {story.story}
                  </div>
                  
                  <button
                    onClick={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
                    className="mt-4 text-blue-500 hover:text-blue-600 font-semibold text-sm"
                  >
                    {expandedStory === story.id ? '📖 Show Less' : '📚 Read Full Story'}
                  </button>
                </div>

                {/* Educational Facts */}
                {story.educationalFacts.length > 0 && (
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      🧠 Educational Facts
                    </h4>
                    <ul className="space-y-1">
                      {story.educationalFacts.slice(0, 3).map((fact, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Status Indicator */}
        <div className="fixed bottom-6 right-6">
          <div className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm font-semibold ${
            generating ? 'bg-purple-500' : 'bg-gray-500'
          }`}>
            {generating ? '🤖 Generating story...' : '🤖 Ready to generate'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratedStories;
