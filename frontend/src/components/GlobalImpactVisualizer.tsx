'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, AlertTriangle, Globe, Zap, Activity } from 'lucide-react';

interface ImpactData {
  location: string;
  country: string;
  coordinates: [number, number];
  impactType: 'aurora' | 'communication' | 'power' | 'navigation';
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  population: number;
  description: string;
}

interface GlobalImpactVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  weatherEvent: string;
}

export function GlobalImpactVisualizer({ isOpen, onClose, weatherEvent }: GlobalImpactVisualizerProps) {
  const [impactData, setImpactData] = useState<ImpactData[]>([]);
  const [selectedImpact, setSelectedImpact] = useState<ImpactData | null>(null);

  useEffect(() => {
    if (isOpen) {
      console.log('GlobalImpactVisualizer: Loading impact data for', weatherEvent);
      // Simulate global impact data based on current space weather
      const impacts: ImpactData[] = [
        {
          location: 'Tromsø, Norway',
          country: 'Norway',
          coordinates: [69.6496, 18.9560],
          impactType: 'aurora',
          severity: 'high',
          population: 76000,
          description: 'Strong aurora displays visible with naked eye. Tourism impact positive.'
        },
        {
          location: 'Anchorage, Alaska',
          country: 'USA',
          coordinates: [61.2176, -149.8997],
          impactType: 'aurora',
          severity: 'high',
          population: 290000,
          description: 'Spectacular aurora visible across central Alaska. Airlines adjusting polar routes.'
        },
        {
          location: 'Yellowknife, Canada',
          country: 'Canada',
          coordinates: [62.4540, -114.3718],
          impactType: 'aurora',
          severity: 'moderate',
          population: 20000,
          description: 'Moderate aurora activity. Local aurora tours reporting excellent visibility.'
        },
        {
          location: 'Stockholm, Sweden',
          country: 'Sweden',
          coordinates: [59.3293, 18.0686],
          impactType: 'communication',
          severity: 'moderate',
          population: 975000,
          description: 'Minor HF radio communication disruptions. Aviation rerouting some flights.'
        },
        {
          location: 'Quebec, Canada',
          country: 'Canada',
          coordinates: [46.8139, -71.2080],
          impactType: 'power',
          severity: 'low',
          population: 540000,
          description: 'Power grid operators monitoring for potential voltage irregularities.'
        },
        {
          location: 'London, UK',
          country: 'United Kingdom',
          coordinates: [51.5074, -0.1278],
          impactType: 'navigation',
          severity: 'low',
          population: 9000000,
          description: 'Minor GPS accuracy degradation reported in some areas.'
        }
      ];

      console.log('GlobalImpactVisualizer: Setting impact data', impacts.length, 'impacts');
      setImpactData(impacts);
    }
  }, [isOpen, weatherEvent]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'extreme': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactIcon = (type: string) => {
    switch (type) {
      case 'aurora': return <Globe className="w-5 h-5 md:w-4 md:h-4" />;
      case 'communication': return <Activity className="w-5 h-5 md:w-4 md:h-4" />;
      case 'power': return <Zap className="w-5 h-5 md:w-4 md:h-4" />;
      case 'navigation': return <MapPin className="w-5 h-5 md:w-4 md:h-4" />;
      default: return <AlertTriangle className="w-5 h-5 md:w-4 md:h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 md:p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass max-w-6xl w-full max-w-[98vw] sm:max-w-[95vw] max-h-[95vh] md:max-h-[90vh] overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-white/10">
              <div className="min-w-0 flex-1 pr-2">
                <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gradient truncate">Global Impact Analysis</h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-400 truncate">Current Event: {weatherEvent}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row h-[calc(95vh-140px)]">
              {/* World Map with Proper Geography - More space on mobile */}
              <div className="flex-1 p-2 sm:p-3 md:p-6 relative overflow-hidden h-[60vh] lg:h-auto lg:min-h-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 md:mb-4 gap-2">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold">Affected Regions</h3>
                  <div className="text-xs md:text-sm text-blue-300 bg-blue-900/30 px-2 md:px-3 py-1 rounded border border-blue-400/30 whitespace-nowrap">
                    Tap map points for details
                  </div>
                </div>
                
                {/* Enhanced world map representation - Better mobile height */}
                <div className="relative w-full h-[calc(100%-60px)] bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-gray-600/30">
                  {/* Ocean background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-800/20"></div>
                  
                  {/* Continents - Simplified SVG-like shapes */}
                  {/* North America */}
                  <div className="absolute top-[25%] left-[15%] w-[20%] h-[25%] bg-green-800/40 rounded-l-3xl rounded-r-xl"></div>
                  {/* South America */}
                  <div className="absolute top-[45%] left-[22%] w-[8%] h-[20%] bg-green-800/40 rounded-xl"></div>
                  {/* Europe */}
                  <div className="absolute top-[20%] left-[45%] w-[8%] h-[15%] bg-green-800/40 rounded-lg"></div>
                  {/* Asia */}
                  <div className="absolute top-[15%] left-[50%] w-[25%] h-[25%] bg-green-800/40 rounded-2xl"></div>
                  {/* Africa */}
                  <div className="absolute top-[35%] left-[48%] w-[10%] h-[20%] bg-green-800/40 rounded-xl"></div>
                  {/* Australia */}
                  <div className="absolute top-[55%] left-[70%] w-[8%] h-[8%] bg-green-800/40 rounded-lg"></div>
                  
                  {/* Aurora Zones */}
                  {/* Northern Aurora Zone (Arctic Circle) */}
                  <div className="absolute top-[5%] left-0 right-0 h-[15%] bg-gradient-to-r from-green-400/20 via-green-300/30 to-green-400/20 rounded-full blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/40 to-transparent animate-pulse"></div>
                  </div>
                  
                  {/* Southern Aurora Zone (Antarctic Circle) */}
                  <div className="absolute bottom-[5%] left-0 right-0 h-[12%] bg-gradient-to-r from-blue-400/20 via-blue-300/30 to-blue-400/20 rounded-full blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-pulse"></div>
                  </div>
                  
                  {/* Magnetic Field Lines Visualization */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="fieldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.3}} />
                        <stop offset="50%" style={{stopColor: '#8b5cf6', stopOpacity: 0.5}} />
                        <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.3}} />
                      </linearGradient>
                    </defs>
                    
                    {/* Magnetic field lines */}
                    <path d="M 50 30 Q 200 10 350 30" stroke="url(#fieldGradient)" strokeWidth="2" fill="none" className="animate-pulse" />
                    <path d="M 40 50 Q 200 20 360 50" stroke="url(#fieldGradient)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '0.5s'}} />
                    <path d="M 30 80 Q 200 40 370 80" stroke="url(#fieldGradient)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '1s'}} />
                    <path d="M 30 120 Q 200 160 370 120" stroke="url(#fieldGradient)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '1.5s'}} />
                    <path d="M 40 150 Q 200 180 360 150" stroke="url(#fieldGradient)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '2s'}} />
                    <path d="M 50 170 Q 200 190 350 170" stroke="url(#fieldGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '2.5s'}} />
                  </svg>
                  
                  {/* Impact Points with Enhanced Visualization */}
                  {impactData.map((impact, index) => {
                    const topPosition = Math.max(10, Math.min(80, (90 - Math.abs(impact.coordinates[0])) * 0.8));
                    const leftPosition = Math.max(10, Math.min(90, (impact.coordinates[1] + 180) / 360 * 80 + 10));
                    
                    return (
                      <motion.div
                        key={impact.location}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="absolute cursor-pointer group z-10"
                        style={{
                          top: `${topPosition}%`,
                          left: `${leftPosition}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => {
                          console.log('Impact point clicked:', impact.location);
                          setSelectedImpact(impact);
                        }}
                      >
                        {/* Larger clickable area for mobile */}
                        <div className="absolute inset-0 w-16 h-16 md:w-12 md:h-12 -m-8 md:-m-6 rounded-full hover:bg-white/10 transition-colors"></div>
                        
                        {/* Impact ripple effect */}
                        <div className={`absolute inset-0 w-12 h-12 md:w-8 md:h-8 rounded-full ${getSeverityColor(impact.severity)} opacity-20 animate-ping pointer-events-none`}></div>
                        <div className={`absolute inset-0 w-10 h-10 md:w-6 md:h-6 rounded-full ${getSeverityColor(impact.severity)} opacity-40 animate-ping pointer-events-none`} style={{animationDelay: '0.5s'}}></div>
                        
                        {/* Main impact point - larger on mobile */}
                        <div className={`relative w-8 h-8 md:w-4 md:h-4 rounded-full ${getSeverityColor(impact.severity)} border-2 ${selectedImpact?.location === impact.location ? 'border-white shadow-xl ring-2 ring-white/50' : 'border-white'} shadow-lg group-hover:scale-110 transition-all duration-200 pointer-events-none`}>
                          <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse"></div>
                          {selectedImpact?.location === impact.location && (
                            <div className="absolute inset-0 rounded-full bg-white/20 ring-1 ring-white/60"></div>
                          )}
                        </div>
                        
                        {/* Tooltip on hover - hidden on mobile to save space */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block">
                          <div className="bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-600/50">
                            <div className="font-semibold">{impact.location}</div>
                            <div className="text-gray-300">{impact.impactType} - {impact.severity}</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95"></div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {/* Enhanced Legend - Mobile optimized */}
                  <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 glass p-2 md:p-4 rounded-lg border border-gray-600/30 max-w-[180px] md:max-w-none">
                    <h4 className="text-xs md:text-sm font-semibold mb-2 md:mb-3">Legend</h4>
                    
                    {/* Impact Severity */}
                    <div className="mb-2 md:mb-4">
                      <div className="text-xs font-medium text-gray-300 mb-1 md:mb-2">Severity</div>
                      <div className="space-y-0.5 md:space-y-1 text-xs">
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full border border-white/50"></div>
                          <span>Low</span>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full border border-white/50"></div>
                          <span>Moderate</span>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-orange-500 rounded-full border border-white/50"></div>
                          <span>High</span>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full border border-white/50"></div>
                          <span>Extreme</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Aurora Zones - Simplified for mobile */}
                    <div>
                      <div className="text-xs font-medium text-gray-300 mb-1 md:mb-2">Aurora</div>
                      <div className="space-y-0.5 md:space-y-1 text-xs">
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <div className="w-3 h-0.5 md:w-4 md:h-1 bg-gradient-to-r from-green-400/50 to-green-300/50 rounded-full"></div>
                          <span>Northern</span>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <div className="w-3 h-0.5 md:w-4 md:h-1 bg-gradient-to-r from-blue-400/50 to-blue-300/50 rounded-full"></div>
                          <span>Southern</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Coordinate Grid */}
                  <div className="absolute inset-0 opacity-20">
                    {/* Latitude lines */}
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={`lat-${i}`}
                        className="absolute left-0 right-0 h-px bg-gray-400/30"
                        style={{ top: `${20 + i * 15}%` }}
                      ></div>
                    ))}
                    {/* Longitude lines */}
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={`lon-${i}`}
                        className="absolute top-0 bottom-0 w-px bg-gray-400/30"
                        style={{ left: `${15 + i * 12}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Impact Details - Mobile responsive */}
              <div className="w-full lg:w-80 p-3 sm:p-4 md:p-6 border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto max-h-[35vh] lg:max-h-none">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-4">Impact Details</h3>
                
                {selectedImpact ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="glass p-3 md:p-4 rounded-lg border border-blue-400/30">
                      <div className="flex items-center space-x-2 mb-2">
                        {getImpactIcon(selectedImpact.impactType)}
                        <h4 className="font-semibold text-blue-300 text-sm md:text-base">{selectedImpact.location}</h4>
                      </div>
                      <p className="text-xs md:text-sm text-gray-400 mb-3">{selectedImpact.country}</p>
                      
                      <div className="space-y-2 text-xs md:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Population:</span>
                          <span>{selectedImpact.population.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Impact Type:</span>
                          <span className="capitalize">{selectedImpact.impactType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Severity:</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(selectedImpact.severity)} text-white`}>
                            {selectedImpact.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Coordinates:</span>
                          <span className="text-xs font-mono">
                            {selectedImpact.coordinates[0].toFixed(2)}°, {selectedImpact.coordinates[1].toFixed(2)}°
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-2 md:p-3 bg-gray-800/50 rounded border border-gray-600/30">
                        <h5 className="text-xs md:text-sm font-medium text-blue-300 mb-1">Impact Assessment</h5>
                        <p className="text-xs md:text-sm text-gray-300">{selectedImpact.description}</p>
                      </div>
                      
                      <button
                        onClick={() => setSelectedImpact(null)}
                        className="mt-3 w-full px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded text-xs md:text-sm transition-colors"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center text-gray-400 py-6 md:py-8">
                    <MapPin className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 opacity-50" />
                    <p className="text-sm md:text-base">Tap on a location point to view detailed impact information</p>
                  </div>
                )}

                {/* Summary Stats */}
                <div className="mt-4 md:mt-6 space-y-3">
                  <h4 className="font-semibold text-sm md:text-base">Global Summary</h4>
                  <div className="glass p-3 rounded-lg text-xs md:text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Total Affected:</span>
                      <span>{impactData.reduce((sum, impact) => sum + impact.population, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Regions:</span>
                      <span>{impactData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Aurora Visible:</span>
                      <span>{impactData.filter(i => i.impactType === 'aurora').length} locations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
