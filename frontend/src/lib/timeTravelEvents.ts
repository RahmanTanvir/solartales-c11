export interface TimeTravelEvent {
  id: string;
  name: string;
  date: Date;
  era: string;
  description: string;
  longDescription: string;
  impacts: string[];
  historicalContext: string;
  characters: string[];
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
    };
    fonts: {
      primary: string;
      accent: string;
    };
    decorations: string[];
  };
  imageUrl: string;
  significance: string;
}

export interface HistoricalCharacter {
  id: string;
  name: string;
  role: string;
  icon: string;
  description: string;
  perspective: string;
}

// Historical space weather events with detailed context
export const historicalEvents: TimeTravelEvent[] = [
  {
    id: 'carrington-1859',
    name: 'The Carrington Event',
    date: new Date('1859-09-01'),
    era: 'Victorian Era',
    description: 'The most powerful geomagnetic storm in recorded history',
    longDescription: 'On September 1-2, 1859, the most powerful geomagnetic storm in recorded history struck Earth. Telegraph systems worldwide failed, operators received electric shocks, and auroras were visible as far south as the Caribbean and Rome. This event occurred during the peak of Solar Cycle 10 and was caused by a massive coronal mass ejection.',
    impacts: [
      'Telegraph systems worldwide failed and sparked',
      'Telegraph operators received dangerous electric shocks',
      'Aurora borealis visible as far south as the Caribbean',
      'Telegraph lines carried electrical current without power source',
      'Mining equipment magnetized by the storm',
      'Ships navigation compasses went haywire'
    ],
    historicalContext: 'During the Victorian era, the telegraph was the cutting-edge technology connecting the world. The first transatlantic telegraph cable had been laid just the year before, revolutionizing global communication.',
    characters: ['telegraph_operator', 'victorian_scientist', 'ship_navigator'],
    severity: 'extreme',
    theme: {
      colors: {
        primary: 'from-amber-700 to-orange-800',
        secondary: 'from-yellow-600 to-amber-700',
        accent: 'text-amber-400',
        background: 'bg-gradient-to-br from-amber-900/20 to-orange-900/30'
      },
      fonts: {
        primary: 'font-serif',
        accent: 'font-mono'
      },
      decorations: ['sepia-filter', 'vintage-borders', 'telegraph-symbols']
    },
    imageUrl: '/historical/carrington-1859.jpg',
    significance: 'First documented major space weather event affecting technology'
  },
  {
    id: 'quebec-blackout-1989',
    name: 'Quebec Blackout Storm',
    date: new Date('1989-03-13'),
    era: 'Modern Era',
    description: 'Geomagnetic storm that left 6 million people without power',
    longDescription: 'On March 13, 1989, a powerful geomagnetic storm caused a complete power grid collapse in Quebec, Canada, leaving 6 million people without electricity for 9 hours. The storm damaged transformers and caused billions of dollars in economic losses.',
    impacts: [
      '6 million people lost power for 9 hours',
      'Hydro-Quebec power grid completely collapsed',
      'Power transformers permanently damaged',
      'Air traffic control systems disrupted',
      'Aurora visible in southern United States',
      'Satellite operations severely affected'
    ],
    historicalContext: 'The late 1980s marked the beginning of our modern dependence on electrical grids and computer systems. This was the first major demonstration of space weather\'s impact on modern infrastructure.',
    characters: ['power_grid_operator', 'emergency_responder', 'radio_operator'],
    severity: 'high',
    theme: {
      colors: {
        primary: 'from-blue-700 to-indigo-800',
        secondary: 'from-cyan-600 to-blue-700',
        accent: 'text-blue-400',
        background: 'bg-gradient-to-br from-blue-900/20 to-indigo-900/30'
      },
      fonts: {
        primary: 'font-sans',
        accent: 'font-mono'
      },
      decorations: ['neon-glow', 'circuit-patterns', 'power-symbols']
    },
    imageUrl: '/historical/quebec-1989.jpg',
    significance: 'First major power grid failure due to space weather in the modern era'
  },
  {
    id: 'halloween-storm-2003',
    name: 'Halloween Solar Storms',
    date: new Date('2003-10-28'),
    era: 'Internet Age',
    description: 'Series of powerful solar storms during Halloween 2003',
    longDescription: 'Between October 28 and November 4, 2003, a series of powerful solar storms disrupted satellites, GPS systems, and power grids worldwide. This event occurred during the peak of our satellite-dependent modern world.',
    impacts: [
      'GPS navigation systems failed globally',
      'Multiple satellites damaged or destroyed',
      'Power outages in Sweden and South Africa',
      'Airlines rerouted polar flights',
      'Internet and cell phone disruptions',
      'Mars missions affected by radiation'
    ],
    historicalContext: 'The early 2000s saw the rise of GPS technology, satellite internet, and our modern connected world. This storm demonstrated our vulnerability to space weather in the digital age.',
    characters: ['astronaut', 'gps_technician', 'satellite_operator'],
    severity: 'extreme',
    theme: {
      colors: {
        primary: 'from-orange-600 to-red-700',
        secondary: 'from-purple-600 to-orange-600',
        accent: 'text-orange-400',
        background: 'bg-gradient-to-br from-orange-900/20 to-purple-900/30'
      },
      fonts: {
        primary: 'font-sans',
        accent: 'font-mono'
      },
      decorations: ['halloween-theme', 'digital-glitch', 'satellite-symbols']
    },
    imageUrl: '/historical/halloween-2003.jpg',
    significance: 'Demonstrated vulnerability of modern satellite-dependent technology'
  }
];

// Character definitions for each historical period
export const historicalCharacters: Record<string, HistoricalCharacter> = {
  telegraph_operator: {
    id: 'telegraph_operator',
    name: 'Samuel Morrison',
    role: 'Telegraph Operator',
    icon: '📡',
    description: 'A skilled telegraph operator working the transatlantic cables during the Victorian era.',
    perspective: 'Experience the terror and wonder as telegraph equipment behaves impossibly during the great storm.'
  },
  victorian_scientist: {
    id: 'victorian_scientist',
    name: 'Dr. Margaret Whitfield',
    role: 'Natural Philosopher',
    icon: '🔬',
    description: 'A pioneering scientist studying the mysterious connection between solar observations and earthly phenomena.',
    perspective: 'Witness the birth of space weather science through careful observation and deduction.'
  },
  ship_navigator: {
    id: 'ship_navigator',
    name: 'Captain William Hayes',
    role: 'Ship Navigator',
    icon: '🧭',
    description: 'An experienced sea captain whose compass and navigation become unreliable.',
    perspective: 'Navigate treacherous waters when your most trusted instruments fail you.'
  },
  power_grid_operator: {
    id: 'power_grid_operator',
    name: 'Marie Tremblay',
    role: 'Power Grid Operator',
    icon: '⚡',
    description: 'A Hydro-Quebec operator watching helplessly as the entire power grid collapses.',
    perspective: 'Race against time to restore power to 6 million people in freezing temperatures.'
  },
  emergency_responder: {
    id: 'emergency_responder',
    name: 'Lieutenant David Chen',
    role: 'Emergency Coordinator',
    icon: '🚨',
    description: 'An emergency response coordinator managing the crisis as Quebec goes dark.',
    perspective: 'Coordinate massive emergency response with limited communication during a blackout.'
  },
  radio_operator: {
    id: 'radio_operator',
    name: 'Sarah Rodriguez',
    role: 'Radio Operator',
    icon: '📻',
    description: 'A ham radio operator providing critical emergency communications.',
    perspective: 'Become a vital communication link when all modern systems fail.'
  },
  astronaut: {
    id: 'astronaut',
    name: 'Commander Elena Petrov',
    role: 'ISS Astronaut',
    icon: '👨‍🚀',
    description: 'An astronaut aboard the International Space Station during the Halloween storms.',
    perspective: 'Experience the raw power of solar storms from the front row seat in space.'
  },
  gps_technician: {
    id: 'gps_technician',
    name: 'Dr. James Park',
    role: 'GPS Systems Engineer',
    icon: '🛰️',
    description: 'A GPS engineer watching global navigation systems fail during critical operations.',
    perspective: 'Witness modern society\'s dependence on satellites as GPS systems worldwide fail.'
  },
  satellite_operator: {
    id: 'satellite_operator',
    name: 'Lisa Anderson',
    role: 'Satellite Operations Manager',
    icon: '📡',
    description: 'A satellite operator racing to protect billions of dollars of space infrastructure.',
    perspective: 'Fight to save satellites from the invisible radiation storm battering them.'
  }
};

// Era-specific styling themes
export const eraThemes = {
  victorian: {
    colors: {
      primary: 'from-amber-700 to-orange-800',
      secondary: 'from-yellow-600 to-amber-700',
      accent: 'text-amber-400',
      background: 'bg-gradient-to-br from-amber-900/20 to-orange-900/30'
    },
    fonts: {
      primary: 'font-serif',
      accent: 'font-mono'
    },
    decorations: ['sepia-filter', 'vintage-borders', 'telegraph-symbols'],
    music: 'classical-piano',
    soundEffects: ['telegraph-clicks', 'steam-hiss', 'pocket-watch-tick']
  },
  modern: {
    colors: {
      primary: 'from-blue-700 to-indigo-800',
      secondary: 'from-cyan-600 to-blue-700',
      accent: 'text-blue-400',
      background: 'bg-gradient-to-br from-blue-900/20 to-indigo-900/30'
    },
    fonts: {
      primary: 'font-sans',
      accent: 'font-mono'
    },
    decorations: ['neon-glow', 'circuit-patterns', 'power-symbols'],
    music: 'electronic-ambient',
    soundEffects: ['electrical-hum', 'computer-beeps', 'radio-static']
  },
  digital: {
    colors: {
      primary: 'from-orange-600 to-red-700',
      secondary: 'from-purple-600 to-orange-600',
      accent: 'text-orange-400',
      background: 'bg-gradient-to-br from-orange-900/20 to-purple-900/30'
    },
    fonts: {
      primary: 'font-sans',
      accent: 'font-mono'
    },
    decorations: ['digital-glitch', 'satellite-symbols', 'matrix-effect'],
    music: 'cyber-synthwave',
    soundEffects: ['modem-dial', 'satellite-beep', 'digital-glitch']
  }
};

export function getEventById(id: string): TimeTravelEvent | undefined {
  return historicalEvents.find(event => event.id === id);
}

export function getCharacterById(id: string): HistoricalCharacter | undefined {
  return historicalCharacters[id];
}

export function getEraTheme(era: string) {
  switch (era.toLowerCase()) {
    case 'victorian era':
      return eraThemes.victorian;
    case 'modern era':
      return eraThemes.modern;
    case 'internet age':
      return eraThemes.digital;
    default:
      return eraThemes.modern;
  }
}
