'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { 
  Sun, 
  Earth, 
  Zap, 
  Radio, 
  Satellite, 
  Shield, 
  Lightbulb, 
  BookOpen,
  Play,
  ChevronRight,
  Star,
  Waves,
  Globe,
  Rocket,
  Activity,
  Eye,
  Brain,
  Target,
  Search,
  X
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  content: {
    overview: string;
    keyPoints: string[];
    funFacts: string[];
    realWorldExample: string;
    activity?: string;
  };
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  topics: string[]; // topic IDs
  ageGroup: string;
}

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'explore' | 'paths'>('overview');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isInPathMode, setIsInPathMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Topic[]>([]);

  const topics: Topic[] = [
    {
      id: 'sun-basics',
      title: 'Our Dynamic Sun',
      icon: <Sun className="w-8 h-8" />,
      description: 'Learn about the Sun as the source of space weather',
      color: 'from-yellow-400 via-orange-500 to-red-500',
      difficulty: 'Beginner',
      readTime: '5 min',
      content: {
        overview: 'The Sun is like a giant ball of hot gas that creates all space weather. It\'s constantly sending out particles and energy that travel through space and can affect Earth!',
        keyPoints: [
          'The Sun is 93 million miles away from Earth',
          'It\'s made mostly of hydrogen and helium gas',
          'The Sun\'s surface temperature is about 10,000°F (5,500°C)',
          'Solar activity follows an 11-year cycle',
          'The Sun creates magnetic fields that can twist and snap'
        ],
        funFacts: [
          'The Sun is so big that over 1 million Earths could fit inside it!',
          'Light from the Sun takes 8 minutes and 20 seconds to reach Earth',
          'The Sun\'s core is 27 million degrees Fahrenheit!',
          'Every second, the Sun converts 4 million tons of matter into energy'
        ],
        realWorldExample: 'When you feel warm sunshine on your face, you\'re experiencing energy that traveled 93 million miles from the Sun to reach you!',
        activity: 'Look at the Sun\'s daily position (SAFELY - never look directly at the Sun!) and notice how it changes throughout the day and seasons.'
      }
    },
    {
      id: 'solar-flares',
      title: 'Solar Flares',
      icon: <Zap className="w-8 h-8" />,
      description: 'Explosive bursts of energy from the Sun',
      color: 'from-orange-400 via-red-500 to-pink-500',
      difficulty: 'Beginner',
      readTime: '6 min',
      content: {
        overview: 'Solar flares are like giant explosions on the Sun that release enormous amounts of energy. They happen when the Sun\'s magnetic field lines get tangled up and suddenly snap!',
        keyPoints: [
          'Solar flares are classified from A, B, C, M to X (X being the strongest)',
          'They release energy equivalent to billions of hydrogen bombs',
          'Flares travel at the speed of light, reaching Earth in 8 minutes',
          'They can disrupt radio communications on Earth',
          'Large flares can be seen as bright flashes on the Sun'
        ],
        funFacts: [
          'The largest solar flare ever recorded happened in 2003 and was so powerful it broke the instruments measuring it!',
          'Solar flares can heat the Sun\'s atmosphere to 10-20 million degrees',
          'During a solar flare, the Sun releases as much energy as it normally does in 10 billion years!',
          'Solar flares can make the northern lights visible much further south than usual'
        ],
        realWorldExample: 'In 1859, a massive solar flare caused telegraph wires to spark and catch fire. Some telegraph operators could disconnect their power and still send messages using just the energy from the aurora!',
        activity: 'Track solar flare activity using NASA\'s space weather websites and see if you can spot any effects on Earth!'
      }
    },
    {
      id: 'auroras',
      title: 'Auroras (Northern & Southern Lights)',
      icon: <Waves className="w-8 h-8" />,
      description: 'Beautiful light displays caused by space weather',
      color: 'from-green-400 via-teal-500 to-blue-500',
      difficulty: 'Beginner',
      readTime: '7 min',
      content: {
        overview: 'Auroras are like nature\'s own light show! They happen when particles from the Sun collide with gases in Earth\'s atmosphere, creating beautiful dancing lights in the sky.',
        keyPoints: [
          'Auroras occur 60-400 miles above Earth\'s surface',
          'They\'re most commonly seen near the North and South Poles',
          'Green auroras come from oxygen, red from high-altitude oxygen, blue/purple from nitrogen',
          'Auroras follow Earth\'s magnetic field lines',
          'They can appear as curtains, arcs, or spirals'
        ],
        funFacts: [
          'Other planets have auroras too! Jupiter, Saturn, Uranus, and Neptune all have them',
          'The word "aurora" comes from the Roman goddess of dawn',
          'Auroras can make sounds - some people hear crackling or whooshing noises',
          'An aurora can release as much energy as a magnitude 5.5 earthquake!'
        ],
        realWorldExample: 'In March 1989, a geomagnetic storm caused auroras to be visible as far south as Florida and Cuba, and even caused a power outage in Quebec, Canada!',
        activity: 'Use aurora forecast websites to predict when auroras might be visible in your area, or take a virtual aurora tour online!'
      }
    },
    {
      id: 'magnetic-field',
      title: 'Earth\'s Magnetic Shield',
      icon: <Shield className="w-8 h-8" />,
      description: 'How Earth protects us from space weather',
      color: 'from-blue-400 via-purple-500 to-indigo-600',
      difficulty: 'Intermediate',
      readTime: '8 min',
      content: {
        overview: 'Earth has an invisible protective shield called the magnetosphere that deflects most harmful space weather. It\'s like having a superhero force field around our planet!',
        keyPoints: [
          'Earth\'s magnetic field is generated by molten iron in the core',
          'The magnetosphere extends about 10 times Earth\'s radius into space',
          'It deflects most solar wind particles around Earth',
          'The field has north and south poles, like a giant bar magnet',
          'Animals like sea turtles and birds use it for navigation'
        ],
        funFacts: [
          'Earth\'s magnetic field is about 10,000 times weaker than a refrigerator magnet',
          'The magnetic poles are constantly moving - the north magnetic pole moves about 25 miles per year!',
          'Mars lost most of its magnetic field billions of years ago',
          'Earth\'s magnetic field has completely flipped many times in the past'
        ],
        realWorldExample: 'When you use a compass, the needle points to Earth\'s magnetic north pole, which is actually different from the geographic North Pole!',
        activity: 'Try using a compass in different locations and notice how it always points north, demonstrating Earth\'s magnetic field.'
      }
    },
    {
      id: 'space-weather-effects',
      title: 'Space Weather & Technology',
      icon: <Satellite className="w-8 h-8" />,
      description: 'How space weather affects our daily lives',
      color: 'from-purple-400 via-pink-500 to-red-500',
      difficulty: 'Intermediate',
      readTime: '9 min',
      content: {
        overview: 'Space weather doesn\'t just create pretty lights - it can affect the technology we use every day, from GPS to the internet!',
        keyPoints: [
          'GPS satellites can become less accurate during space weather events',
          'Power grids can be affected by geomagnetic storms',
          'Radio communications can be disrupted',
          'Astronauts must take shelter during severe space weather',
          'Airlines may change flight routes over the poles'
        ],
        funFacts: [
          'A single space weather event in 1989 caused a 9-hour blackout in Quebec, affecting 6 million people',
          'Space weather can cause the atmosphere to expand, making satellites fall to lower orbits',
          'Some car GPS systems can be off by several meters during geomagnetic storms',
          'The International Space Station has a special shelter area for space weather emergencies'
        ],
        realWorldExample: 'In 2003, space weather caused temporary GPS outages for farmers during planting season, affecting precision agriculture across several states.',
        activity: 'Monitor your GPS accuracy during different space weather conditions and see if you notice any differences!'
      }
    },
    {
      id: 'cme',
      title: 'Coronal Mass Ejections (CMEs)',
      icon: <Globe className="w-8 h-8" />,
      description: 'Massive clouds of solar particles heading to Earth',
      color: 'from-red-400 via-orange-500 to-yellow-500',
      difficulty: 'Advanced',
      readTime: '10 min',
      content: {
        overview: 'Coronal Mass Ejections are like giant bubbles of plasma and magnetic field that the Sun burps out into space. They\'re much larger than solar flares and can cause major space weather when they hit Earth!',
        keyPoints: [
          'CMEs can contain up to 1 billion tons of plasma',
          'They travel at speeds of 1-3 million mph through space',
          'CMEs take 1-4 days to reach Earth, giving us warning time',
          'They can be larger than the planet Jupiter',
          'The fastest CMEs can reach Earth in just 15-18 hours'
        ],
        funFacts: [
          'The largest CME on record occurred in 1859 and caused the "Carrington Event"',
          'CMEs happen more often during solar maximum (every few days)',
          'During solar minimum, CMEs might only happen once a week',
          'Not all CMEs are aimed at Earth - many miss us completely'
        ],
        realWorldExample: 'The 1859 Carrington Event was so powerful that auroras were seen as far south as the Caribbean, and some telegraph systems worked without power!',
        activity: 'Use NASA\'s SOHO spacecraft images to watch for CMEs leaving the Sun and predict when they might reach Earth.'
      }
    },
    {
      id: 'understanding-live-data',
      title: 'Understanding Live Space Weather Data',
      icon: <Activity className="w-8 h-8" />,
      description: 'Learn how to read and interpret real-time space weather measurements',
      color: 'from-cyan-400 via-blue-500 to-indigo-600',
      difficulty: 'Beginner',
      readTime: '8 min',
      content: {
        overview: 'Live space weather data might look confusing at first, but it\'s like learning to read a weather forecast for space! Each measurement tells us what\'s happening right now between the Sun and Earth.',
        keyPoints: [
          'Solar wind speed is measured in kilometers per second (km/s)',
          'Magnetic field strength shows how "twisted" space around Earth is',
          'Particle density tells us how "crowded" space is with charged particles',
          'Real-time means the data is only 1-2 hours old due to travel time',
          'Different spacecraft measure different aspects of space weather'
        ],
        funFacts: [
          'The ACE spacecraft sits 1 million miles from Earth, giving us early warning!',
          'Space weather data updates every few minutes, 24/7',
          'Scientists use colors (green, yellow, red) to show space weather intensity',
          'Some satellites can predict space weather 15-60 minutes before it hits Earth'
        ],
        realWorldExample: 'When you see high solar wind speeds (over 500 km/s) in live data, it often means auroras will be visible that night!',
        activity: 'Visit NOAA Space Weather Prediction Center and try to identify if current conditions are quiet, active, or stormy!'
      }
    },
    {
      id: 'space-weather-scales',
      title: 'Space Weather Scales & Alerts',
      icon: <Target className="w-8 h-8" />,
      description: 'Learn the rating systems used to measure space weather intensity',
      color: 'from-yellow-400 via-orange-500 to-red-600',
      difficulty: 'Intermediate',
      readTime: '9 min',
      content: {
        overview: 'Just like hurricanes have categories, space weather has scales! Scientists use special rating systems to tell us how strong space weather events are and what effects to expect.',
        keyPoints: [
          'G-Scale measures geomagnetic storms (G1 to G5)',
          'S-Scale measures solar radiation storms (S1 to S5)',
          'R-Scale measures radio blackouts (R1 to R5)',
          'Higher numbers mean stronger effects and more disruption',
          'G1 and G2 storms can actually enhance aurora viewing!'
        ],
        funFacts: [
          'A G5 geomagnetic storm hasn\'t happened since 2003!',
          'R3 radio blackouts can disrupt emergency services communications',
          'S-scale events are most dangerous for astronauts and airline passengers',
          'Most space weather events are G1 or G2 - relatively mild'
        ],
        realWorldExample: 'The March 1989 Quebec blackout was caused by a G4 geomagnetic storm, showing how G4-G5 events can affect power grids.',
        activity: 'Track current space weather alerts and see which scales are being used today!'
      }
    },
    {
      id: 'satellite-monitoring',
      title: 'Satellites That Watch Space Weather',
      icon: <Satellite className="w-8 h-8" />,
      description: 'Meet the spacecraft that monitor space weather 24/7',
      color: 'from-gray-400 via-slate-500 to-zinc-600',
      difficulty: 'Intermediate',
      readTime: '10 min',
      content: {
        overview: 'We have an amazing fleet of satellites constantly watching the Sun and monitoring space weather. These robotic sentinels are our early warning system for space storms!',
        keyPoints: [
          'SOHO spacecraft has been watching the Sun for over 25 years',
          'ACE satellite gives us 15-60 minutes warning of incoming space weather',
          'DSCOVR sits between Earth and Sun, monitoring solar wind',
          'Parker Solar Probe flies closer to the Sun than any spacecraft before',
          'Multiple satellites work together to create 3D space weather maps'
        ],
        funFacts: [
          'SOHO has discovered over 4,000 comets while watching the Sun!',
          'The Parker Solar Probe will eventually get within 4 million miles of the Sun',
          'Some space weather satellites have been working for over 20 years',
          'STEREO spacecraft give us views of the "back" of the Sun'
        ],
        realWorldExample: 'In 2012, STEREO satellites detected a massive CME that would have caused worldwide disruption if it had hit Earth!',
        activity: 'Explore NASA\'s real-time satellite data and see what each spacecraft is currently measuring!'
      }
    },
    {
      id: 'solar-cycle',
      title: 'The Solar Cycle: Sun\'s 11-Year Rhythm',
      icon: <Sun className="w-8 h-8" />,
      description: 'Discover how the Sun changes over time in predictable cycles',
      color: 'from-yellow-300 via-orange-400 to-red-500',
      difficulty: 'Intermediate',
      readTime: '11 min',
      content: {
        overview: 'The Sun isn\'t always the same! It goes through an 11-year cycle of activity, sometimes being very quiet and sometimes being very active with lots of flares and storms.',
        keyPoints: [
          'Solar minimum = few sunspots, less space weather activity',
          'Solar maximum = many sunspots, more flares and CMEs',
          'Sunspot numbers help track where we are in the cycle',
          'Each cycle is slightly different - some are stronger than others',
          'We\'re currently approaching solar maximum around 2024-2025'
        ],
        funFacts: [
          'The solar cycle was discovered by counting sunspots over many years',
          'During solar minimum, we might go weeks without any solar flares',
          'During solar maximum, several flares might happen every day',
          'The strongest solar cycle in recent history was in the 1950s'
        ],
        realWorldExample: 'The 2008-2009 solar minimum was so quiet that some scientists worried the Sun was "broken" - but it was just in a really deep quiet phase!',
        activity: 'Look up current sunspot numbers and see if you can figure out where we are in the current solar cycle!'
      }
    },
    {
      id: 'space-weather-prediction',
      title: 'Predicting Space Weather',
      icon: <Brain className="w-8 h-8" />,
      description: 'How scientists forecast space weather like meteorologists forecast Earth weather',
      color: 'from-purple-400 via-violet-500 to-indigo-600',
      difficulty: 'Advanced',
      readTime: '12 min',
      content: {
        overview: 'Space weather forecasting is like regular weather forecasting, but much harder! Scientists use computer models, satellite data, and their understanding of the Sun to predict what space weather is coming.',
        keyPoints: [
          'Solar flares can be predicted minutes to hours in advance',
          'CMEs can be tracked and their Earth arrival time predicted',
          'Geomagnetic storm intensity is harder to predict accurately',
          'AI and machine learning are improving space weather forecasts',
          'Some events are impossible to predict more than a few hours ahead'
        ],
        funFacts: [
          'Space weather forecasters work 24/7, just like regular meteorologists',
          'The most accurate predictions are only 15-60 minutes ahead',
          'Computer models can simulate the entire journey from Sun to Earth',
          'False alarms happen when predicted storms weaken or miss Earth'
        ],
        realWorldExample: 'In October 2003, forecasters successfully predicted a series of major space weather events, helping airlines and power companies prepare.',
        activity: 'Compare space weather forecasts with what actually happens and see how accurate they are!'
      }
    },
    {
      id: 'climate-vs-weather',
      title: 'Space Climate vs Space Weather',
      icon: <Globe className="w-8 h-8" />,
      description: 'Understanding the difference between short-term events and long-term patterns',
      color: 'from-teal-400 via-cyan-500 to-blue-600',
      difficulty: 'Intermediate',
      readTime: '8 min',
      content: {
        overview: 'Just like Earth has weather (daily changes) and climate (long-term patterns), space has both space weather (sudden events) and space climate (how the Sun behaves over many years).',
        keyPoints: [
          'Space weather = individual flares, CMEs, and storms',
          'Space climate = solar cycle patterns and long-term trends',
          'Climate affects how often weather events happen',
          'Both are important for understanding space environment',
          'Climate changes over decades, weather changes in minutes to days'
        ],
        funFacts: [
          'The Little Ice Age on Earth might have been partly caused by very quiet space climate',
          'Space climate affects how much cosmic radiation reaches Earth',
          'Long-term space climate can influence Earth\'s atmosphere',
          'Scientists study ice cores to learn about ancient space climate'
        ],
        realWorldExample: 'The Maunder Minimum (1645-1715) was a period of very few sunspots that coincided with unusually cold weather on Earth.',
        activity: 'Research how space climate has changed over the past 400 years and what patterns scientists have discovered!'
      }
    },
    {
      id: 'space-weather-careers',
      title: 'Careers in Space Weather',
      icon: <Rocket className="w-8 h-8" />,
      description: 'Explore exciting career paths in space weather science and forecasting',
      color: 'from-indigo-400 via-purple-500 to-pink-600',
      difficulty: 'Beginner',
      readTime: '7 min',
      content: {
        overview: 'Space weather is a growing field with many exciting career opportunities! From forecasting to research to spacecraft engineering, there are many ways to work with space weather.',
        keyPoints: [
          'Space weather forecasters work at NOAA and other agencies',
          'Research scientists study how space weather works',
          'Engineers design satellites and instruments to monitor space',
          'Educators teach others about space weather and its effects',
          'Many careers combine space weather with other fields'
        ],
        funFacts: [
          'The first space weather forecasters were actually radio operators!',
          'Some space weather scientists get to travel to Antarctica for research',
          'Space weather affects everything from farming to finance',
          'New careers in space weather are being created all the time'
        ],
        realWorldExample: 'Dr. Tamitha Skov is known as the "Space Weather Woman" and makes space weather accessible through social media and education.',
        activity: 'Research a space weather scientist or forecaster and learn about their career path and current work!'
      }
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: 'young-explorer',
      title: 'Young Space Explorer',
      description: 'Perfect for curious kids aged 6-10 who love space adventures!',
      color: 'from-blue-400 to-purple-500',
      icon: <Rocket className="w-6 h-6" />,
      topics: ['sun-basics', 'auroras', 'magnetic-field', 'space-weather-careers'],
      ageGroup: '6-10 years'
    },
    {
      id: 'space-detective',
      title: 'Space Weather Detective',
      description: 'For young scientists aged 10-14 ready to investigate space mysteries!',
      color: 'from-green-400 to-teal-500',
      icon: <Eye className="w-6 h-6" />,
      topics: ['sun-basics', 'solar-flares', 'auroras', 'space-weather-effects', 'understanding-live-data', 'space-weather-scales', 'solar-cycle'],
      ageGroup: '10-14 years'
    },
    {
      id: 'space-scientist',
      title: 'Future Space Scientist',
      description: 'Advanced learning for teens aged 14+ who want to understand everything!',
      color: 'from-purple-400 to-pink-500',
      icon: <Brain className="w-6 h-6" />,
      topics: ['sun-basics', 'solar-flares', 'auroras', 'magnetic-field', 'space-weather-effects', 'cme', 'understanding-live-data', 'space-weather-scales', 'satellite-monitoring', 'solar-cycle', 'space-weather-prediction', 'climate-vs-weather', 'space-weather-careers'],
      ageGroup: '14+ years'
    },
    {
      id: 'data-analyst',
      title: 'Live Data Specialist',
      description: 'Master understanding and interpreting real-time space weather data!',
      color: 'from-cyan-400 to-blue-500',
      icon: <Activity className="w-6 h-6" />,
      topics: ['understanding-live-data', 'space-weather-scales', 'satellite-monitoring', 'space-weather-prediction', 'solar-cycle', 'climate-vs-weather'],
      ageGroup: 'All ages'
    }
  ];

  const getTopicsByPath = (pathId: string) => {
    const path = learningPaths.find(p => p.id === pathId);
    if (!path) return [];
    return topics.filter(topic => path.topics.includes(topic.id));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-900/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-900/20';
      case 'Advanced': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  // Search functionality
  const searchTopics = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const results = topics.filter(topic => {
      // Search in title
      if (topic.title.toLowerCase().includes(searchTerm)) return true;
      
      // Search in description
      if (topic.description.toLowerCase().includes(searchTerm)) return true;
      
      // Search in content
      const content = topic.content;
      if (content.overview.toLowerCase().includes(searchTerm)) return true;
      
      // Search in key points
      if (content.keyPoints.some(point => point.toLowerCase().includes(searchTerm))) return true;
      
      // Search in fun facts
      if (content.funFacts.some(fact => fact.toLowerCase().includes(searchTerm))) return true;
      
      // Search in real world example
      if (content.realWorldExample.toLowerCase().includes(searchTerm)) return true;
      
      // Search in activity
      if (content.activity && content.activity.toLowerCase().includes(searchTerm)) return true;
      
      return false;
    });

    setSearchResults(results);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchTopics(query);
    // Automatically switch to Explore Topics tab when searching
    if (query.trim()) {
      setActiveTab('explore');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    // Optionally switch back to overview tab when clearing search
    // setActiveTab('overview');
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-400/30 text-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navigation currentWeatherEvent="Learning Mode Active" />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Learn About</span>
              <br />
              <span className="text-white">Space Weather</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Discover the fascinating world of space weather through interactive lessons, 
              fun activities, and amazing facts that will make you a space weather expert!
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 flex space-x-1">
              {[
                { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
                { id: 'explore', label: 'Topics', icon: <Target className="w-4 h-4" /> },
                { id: 'paths', label: 'Paths', icon: <Activity className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 text-xs sm:text-sm ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-12">
            <div className="relative max-w-2xl w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lessons, concepts, or space weather topics..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Search Results Count */}
              {searchQuery && (
                <div className="mt-3 text-center">
                  <p className="text-gray-400 text-sm">
                    {searchResults.length === 0 
                      ? 'No lessons found'
                      : `Found ${searchResults.length} lesson${searchResults.length === 1 ? '' : 's'}`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            >
              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 p-4 sm:p-6 lg:p-8 rounded-3xl backdrop-blur-sm border border-blue-400/20">
                <div className="text-blue-400 mb-3 sm:mb-4">
                  <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">13 Comprehensive Topics</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  From basic Sun science to advanced live data interpretation and space weather forecasting.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-800/50 to-teal-800/50 p-4 sm:p-6 lg:p-8 rounded-3xl backdrop-blur-sm border border-green-400/20">
                <div className="text-green-400 mb-3 sm:mb-4">
                  <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">4 Learning Paths</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Including a specialized "Live Data Specialist" path for mastering real-time space weather monitoring.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 p-4 sm:p-6 lg:p-8 rounded-3xl backdrop-blur-sm border border-purple-400/20">
                <div className="text-purple-400 mb-3 sm:mb-4">
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">Hands-on Activities</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Real-world examples, live data exploration, and practical exercises to understand space weather.
                </p>
              </div>

              {/* Featured Topic */}
              <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-orange-800/30 to-red-800/30 p-4 sm:p-6 lg:p-8 rounded-3xl backdrop-blur-sm border border-orange-400/20">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                  <div className="text-orange-400 flex-shrink-0">
                    <Sun className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Start Your Journey</h3>
                    <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                      Begin with "Our Dynamic Sun" to understand the source of all space weather, 
                      then explore how it affects Earth and our technology!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('explore');
                    setSelectedTopic(topics[0]);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Learning</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'explore' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Topic List */}
              <div className="lg:col-span-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold">
                    {searchQuery ? 'Search Results' : 'Choose a Topic'}
                  </h3>
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {(searchQuery ? searchResults : topics).map((topic, index) => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedTopic(topic)}
                      className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                        selectedTopic?.id === topic.id
                          ? 'bg-blue-500/20 border-blue-400'
                          : 'bg-gray-800/30 border-gray-600/30 hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3 mb-2">
                        <div className={`text-xl sm:text-2xl bg-gradient-to-r ${topic.color} bg-clip-text text-transparent flex-shrink-0`}>
                          {topic.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm sm:text-base">
                            {searchQuery ? highlightSearchTerm(topic.title, searchQuery) : topic.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(topic.difficulty)}`}>
                              {topic.difficulty}
                            </span>
                            <span className="text-gray-400">{topic.readTime}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {searchQuery ? highlightSearchTerm(topic.description, searchQuery) : topic.description}
                      </p>
                      {searchQuery && (
                        <div className="mt-2 text-xs text-blue-400">
                          Click to view this lesson
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {searchQuery && searchResults.length === 0 && (
                    <div className="text-center py-8">
                      <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">No lessons found for "{searchQuery}"</p>
                      <p className="text-gray-500 text-sm">
                        Try searching for terms like "solar", "aurora", "data", or "satellite"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Topic Content */}
              <div className="lg:col-span-2">
                {selectedTopic ? (
                  <motion.div
                    key={selectedTopic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-600/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                      <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-r ${selectedTopic.color} flex-shrink-0`}>
                        {selectedTopic.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-2xl sm:text-3xl font-bold">{selectedTopic.title}</h2>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(selectedTopic.difficulty)}`}>
                            {selectedTopic.difficulty}
                          </span>
                          <span className="text-gray-400">{selectedTopic.readTime} read</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Overview */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-blue-400">Overview</h3>
                        <p className="text-gray-300 leading-relaxed">
                          {searchQuery ? highlightSearchTerm(selectedTopic.content.overview, searchQuery) : selectedTopic.content.overview}
                        </p>
                      </div>

                      {/* Key Points */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-green-400">Key Points</h3>
                        <ul className="space-y-2">
                          {selectedTopic.content.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <ChevronRight className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">
                                {searchQuery ? highlightSearchTerm(point, searchQuery) : point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Fun Facts */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-purple-400">Fun Facts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedTopic.content.funFacts.map((fact, index) => (
                            <div key={index} className="bg-purple-900/20 p-4 rounded-xl border border-purple-400/20">
                              <p className="text-gray-300 text-sm">
                                {searchQuery ? highlightSearchTerm(fact, searchQuery) : fact}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Real World Example */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-orange-400">Real World Example</h3>
                        <div className="bg-orange-900/20 p-6 rounded-xl border border-orange-400/20">
                          <p className="text-gray-300">
                            {searchQuery ? highlightSearchTerm(selectedTopic.content.realWorldExample, searchQuery) : selectedTopic.content.realWorldExample}
                          </p>
                        </div>
                      </div>

                      {/* Activity */}
                      {selectedTopic.content.activity && (
                        <div>
                          <h3 className="text-xl font-bold mb-4 text-yellow-400">Try This Activity</h3>
                          <div className="bg-yellow-900/20 p-6 rounded-xl border border-yellow-400/20">
                            <p className="text-gray-300">
                              {searchQuery ? highlightSearchTerm(selectedTopic.content.activity, searchQuery) : selectedTopic.content.activity}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-12 border border-gray-600/30 text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Select a Topic</h3>
                    <p className="text-gray-400">
                      {searchQuery 
                        ? 'Search for lessons above or choose a topic from the left to start learning!' 
                        : 'Choose a topic from the left to start learning!'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'paths' && !isInPathMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Choose Your Learning Adventure</h2>
                <p className="text-gray-300 text-base sm:text-lg">
                  Pick a learning path that matches your age and interests for the best experience!
                </p>
              </div>

              {learningPaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`bg-gradient-to-r ${path.color} p-1 rounded-3xl`}
                >
                  <div className="bg-gray-900/90 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 lg:mb-0">
                        <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-r ${path.color} flex-shrink-0 self-start sm:self-auto`}>
                          {path.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl sm:text-2xl font-bold mb-2">{path.title}</h3>
                          <p className="text-gray-300 mb-2 text-sm sm:text-base">{path.description}</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <span className="text-xs sm:text-sm text-gray-400 bg-gray-800/50 px-2 sm:px-3 py-1 rounded-full">
                              {path.ageGroup}
                            </span>
                            <span className="text-xs sm:text-sm text-blue-400 bg-blue-900/20 px-2 sm:px-3 py-1 rounded-full">
                              {path.topics.length} lessons
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedPath(path.id);
                          setCurrentLessonIndex(0);
                          setIsInPathMode(true);
                        }}
                        className={`bg-gradient-to-r ${path.color} px-4 sm:px-6 lg:px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto mt-4 lg:mt-0`}
                      >
                        Start Path
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'paths' && isInPathMode && selectedPath && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {(() => {
                const path = learningPaths.find(p => p.id === selectedPath);
                const pathTopics = getTopicsByPath(selectedPath);
                const currentTopic = pathTopics[currentLessonIndex];
                
                if (!path || !currentTopic) return null;

                return (
                  <div>
                    {/* Path Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <button
                          onClick={() => setIsInPathMode(false)}
                          className="bg-gray-800/50 p-2 rounded-xl hover:bg-gray-700/50 transition-all duration-300 flex-shrink-0"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
                        </button>
                        <div className="min-w-0">
                          <h2 className="text-xl sm:text-2xl font-bold">{path.title}</h2>
                          <p className="text-gray-400 text-sm sm:text-base">
                            Lesson {currentLessonIndex + 1} of {pathTopics.length}
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="flex-1 max-w-md sm:mx-8">
                        <div className="bg-gray-800/50 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${path.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${((currentLessonIndex + 1) / pathTopics.length) * 100}%` }}
                          />
                        </div>
                        <p className="text-center text-xs sm:text-sm text-gray-400 mt-2">
                          {Math.round(((currentLessonIndex + 1) / pathTopics.length) * 100)}% Complete
                        </p>
                      </div>
                    </div>

                    {/* Current Lesson */}
                    <div className={`bg-gradient-to-r ${currentTopic.color} p-1 rounded-3xl`}>
                      <div className="bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8">
                        {/* Topic Header */}
                        <div className="flex items-center space-x-4 mb-8">
                          <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentTopic.color}`}>
                            {currentTopic.icon}
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold mb-2">{currentTopic.title}</h3>
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(currentTopic.difficulty)}`}>
                                {currentTopic.difficulty}
                              </span>
                              <span className="text-gray-400 text-sm">{currentTopic.readTime}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-8">
                          {/* Overview */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-blue-400">Overview</h4>
                            <p className="text-gray-300 leading-relaxed">{currentTopic.content.overview}</p>
                          </div>

                          {/* Key Points */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-green-400">Key Points</h4>
                            <ul className="space-y-2">
                              {currentTopic.content.keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                  <span className="bg-green-500 w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-gray-300">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Fun Facts */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-purple-400">Fun Facts</h4>
                            <div className="space-y-3">
                              {currentTopic.content.funFacts.map((fact, index) => (
                                <div key={index} className="bg-purple-900/20 p-4 rounded-xl border border-purple-400/20">
                                  <p className="text-gray-300">{fact}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Real World Example */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-orange-400">Real World Example</h4>
                            <div className="bg-orange-900/20 p-6 rounded-xl border border-orange-400/20">
                              <p className="text-gray-300 leading-relaxed">{currentTopic.content.realWorldExample}</p>
                            </div>
                          </div>

                          {/* Activity */}
                          {currentTopic.content.activity && (
                            <div>
                              <h4 className="text-xl font-bold mb-4 text-cyan-400">Try This Activity</h4>
                              <div className="bg-cyan-900/20 p-6 rounded-xl border border-cyan-400/20">
                                <p className="text-gray-300 leading-relaxed">{currentTopic.content.activity}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-600/30 space-y-4 sm:space-y-0">
                          <button
                            onClick={() => {
                              if (currentLessonIndex > 0) {
                                setCurrentLessonIndex(currentLessonIndex - 1);
                              }
                            }}
                            disabled={currentLessonIndex === 0}
                            className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base w-full sm:w-auto ${
                              currentLessonIndex === 0
                                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                          >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
                            <span>Previous</span>
                          </button>

                          <div className="text-center order-first sm:order-none">
                            <p className="text-gray-400 text-xs sm:text-sm">
                              Lesson {currentLessonIndex + 1} of {pathTopics.length}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              if (currentLessonIndex < pathTopics.length - 1) {
                                setCurrentLessonIndex(currentLessonIndex + 1);
                              } else {
                                // Path completed
                                setIsInPathMode(false);
                                setSelectedPath(null);
                                setCurrentLessonIndex(0);
                              }
                            }}
                            className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r ${path.color} hover:scale-105 text-sm sm:text-base w-full sm:w-auto`}
                          >
                            <span>
                              {currentLessonIndex === pathTopics.length - 1 ? 'Complete Path' : 'Next Lesson'}
                            </span>
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
