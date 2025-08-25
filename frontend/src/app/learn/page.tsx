'use client';

import { useState, useEffect } from 'react';
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
  X,
  Volume2,
  VolumeX,
  Pause
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
    learningObjectives: string[];
    keyTerms: { term: string; definition: string }[];
    lessonNarrative: string[];
    activities: { title: string; materials?: string; steps: string[] }[];
    learnItAsStory: {
      scenario: string;
      storyElements: string[];
    };
    funFacts: string[];
    realWorldExample: string;
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
  
  // Audio-related state
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);

  const topics: Topic[] = [
    {
      id: 'sun-basics',
      title: 'Our Dynamic Sun',
      icon: <Sun className="w-8 h-8" />,
      description: 'Learn about the Sun as the source of space weather',
      color: 'from-yellow-400 via-orange-500 to-red-500',
      difficulty: 'Beginner',
      readTime: '30 min',
      content: {
        learningObjectives: [
          'Explain how nuclear fusion in the Sun\'s core generates energy',
          'Describe the 11-year solar activity cycle and its causes',
          'Identify sunspots and explain why they appear darker than surrounding regions',
          'Summarize how the Sun\'s magnetic field leads to solar storms'
        ],
        keyTerms: [
          { term: 'Nuclear fusion', definition: 'The process where hydrogen nuclei combine to form helium, releasing massive amounts of energy' },
          { term: 'Proton–proton chain', definition: 'The specific nuclear fusion process that powers the Sun' },
          { term: 'Sunspot', definition: 'Dark patches on the Sun\'s surface where intense magnetic fields suppress convection' },
          { term: 'Solar cycle', definition: 'The 11-year pattern of solar activity from quiet to active and back to quiet' },
          { term: 'Magnetic field line', definition: 'Invisible lines that show the direction and strength of magnetic forces' },
          { term: 'Solar maximum / solar minimum', definition: 'The periods of highest and lowest solar activity in the 11-year cycle' },
          { term: 'Solar storm', definition: 'Violent eruptions from the Sun that send energy and particles into space' }
        ],
        lessonNarrative: [
          'The Sun is not a static ball of heat—deep within its core, hydrogen nuclei fuse into helium, releasing immense energy in a process called nuclear fusion. This fusion powers sunlight and heat that sustain life on Earth.',
          'Every 11 years, the Sun goes through a solar cycle marked by fluctuating numbers of sunspots—dark patches on the surface where intense magnetic fields suppress convection. At solar maximum, sunspots and solar storms (including flares and coronal mass ejections) peak; at solar minimum, the Sun\'s surface appears much quieter.',
          'Sunspots form where the Sun\'s magnetic field lines twist and poke out of the surface, creating cooler regions that look dark against the bright photosphere. When these twisted fields snap and reconnect, they can unleash powerful solar storms that send high-energy particles and radiation into space—sometimes all the way to Earth.',
          'Understanding our dynamic Sun—and its ever-changing magnetic personality—is the first step toward predicting space weather and protecting our modern technology.'
        ],
        activities: [
          {
            title: 'Build a 3D Sun Model',
            materials: 'Colored foam balls or clay in three colors (yellow, orange, red); wooden skewers; labels',
            steps: [
              'Slice the foam ball into three concentric layers: core (red), radiative zone (orange), convective zone (yellow)',
              'Assemble layers on a skewer, largest layer on the outside',
              'Label each layer and write one key fact on each',
              'Present to classmates, explaining energy flow from core to surface'
            ]
          },
          {
            title: 'Track Real Sunspots',
            materials: 'NASA Solar Dynamics Observatory (SDO) website or NASA sunspot data portal',
            steps: [
              'Visit the NASA SDO sunspot count page',
              'Record daily sunspot numbers for one week',
              'Plot the numbers on graph paper or a digital chart',
              'Discuss any trends you observe and relate them to the solar cycle'
            ]
          },
          {
            title: 'Solar Activity Calendar',
            materials: 'Blank calendar template for one month; colored markers',
            steps: [
              'Each day, check NASA\'s solar activity report for flares or sunspots',
              'Mark days with sunspots in blue, days with flares in red',
              'At month\'s end, count the total events and write a short summary: "This month was quiet/busy because…"'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'Imagine you\'re an interplanetary reporter aboard the Solar Observer spacecraft, hurtling toward Earth through a storm of charged particles. As you approach, your instruments—just like the ones you learned about—flash warnings of incoming solar activity.',
          storyElements: [
            'You remember how nuclear fusion described the Sun\'s incredible energy source powering everything around you',
            'Solar cycles explained why your mission timing was so critical during this solar maximum period',
            'Recalling today\'s lesson on Our Dynamic Sun, you mentally map the Sun\'s magnetic field activity',
            'You deploy your sunspot tracking tools to identify the source of the current space weather',
            'You interpret the solar data to forecast what happens next as particles race toward Earth',
            'You share your report with scientists on Earth, who use your story-derived insights to prepare for the incoming solar storm'
          ]
        },
        funFacts: [
          'The Sun is so big that over 1 million Earths could fit inside it!',
          'Light from the Sun takes 8 minutes and 20 seconds to reach Earth',
          'The Sun\'s core is 27 million degrees Fahrenheit!',
          'Every second, the Sun converts 4 million tons of matter into energy'
        ],
        realWorldExample: 'When you feel warm sunshine on your face, you\'re experiencing energy that traveled 93 million miles from the Sun to reach you!'
      }
    },
    {
      id: 'solar-flares',
      title: 'Solar Flares',
      icon: <Zap className="w-8 h-8" />,
      description: 'Explosive bursts of energy from the Sun',
      color: 'from-orange-400 via-red-500 to-pink-500',
      difficulty: 'Intermediate',
      readTime: '25 min',
      content: {
        learningObjectives: [
          'Describe the process of magnetic reconnection that triggers solar flares',
          'Classify flares into C-, M-, and X-classes by X-ray intensity',
          'Explain how solar flares disrupt Earth\'s ionosphere and radio communications',
          'Locate real-time flare data from GOES satellite feeds'
        ],
        keyTerms: [
          { term: 'Magnetic reconnection', definition: 'The process where twisted magnetic field lines suddenly realign, releasing massive energy' },
          { term: 'Solar flare', definition: 'Sudden release of electromagnetic energy from the Sun\'s surface' },
          { term: 'GOES X-ray flux', definition: 'Measurement from satellites that determines flare classification strength' },
          { term: 'C-class, M-class, X-class', definition: 'Flare categories from weakest (C) to strongest (X) based on X-ray intensity' },
          { term: 'Ionosphere', definition: 'Layer of Earth\'s atmosphere containing electrically charged particles' },
          { term: 'Radio blackout (R-class)', definition: 'Disruption of radio signals caused by enhanced ionospheric absorption during flares' }
        ],
        lessonNarrative: [
          'Solar flares occur when twisted magnetic field lines in the Sun\'s atmosphere suddenly realign in a process called magnetic reconnection. This releases energy equivalent to millions of hydrogen bombs in mere minutes, accelerating particles and producing bursts of X-rays and ultraviolet light.',
          'Flares are classified by peak X-ray flux measured by the GOES satellites: C-class flares are common and minor; M-class flares can cause short-lived radio blackouts; and X-class flares are rare, powerful events that can significantly disrupt communications on Earth.',
          'When a flare\'s high-energy photons hit Earth\'s ionosphere, they increase ionization levels, causing radio signals (especially HF) to absorb or scatter—leading to R-class radio blackouts. Understanding flare classification helps forecasters warn pilots, mariners, and power-grid operators to take protective measures.'
        ],
        activities: [
          {
            title: 'GOES Data Retrieval',
            materials: 'NOAA GOES X-ray flux archive',
            steps: [
              'Navigate to the NOAA GOES X-ray flux data page',
              'Select a recent date range and download the X-ray flux CSV',
              'Identify any C, M, or X-class peaks',
              'Plot the flux vs. time and label each flare class'
            ]
          },
          {
            title: 'Flare Energy Calculation',
            materials: 'Calculator or spreadsheet software',
            steps: [
              'From GOES data, note the peak flux value for an X-class flare',
              'Convert flux units to joules using NOAA\'s conversion guidelines',
              'Compare the energy to TNT equivalent (1 kt TNT ≈ 4.184×10¹² J)',
              'Write a brief explanation of the calculation process'
            ]
          },
          {
            title: 'Simulate Radio Blackout',
            materials: 'Portable AM radio, computer or smartphone audio source',
            steps: [
              'Tune the AM radio to a distant station',
              'Play a prerecorded static burst to simulate ionospheric disturbance',
              'Observe how signal strength drops',
              'Discuss real-world implications for emergency communications'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'Imagine you\'re a space weather forecaster at NOAA\'s Space Weather Prediction Center when alarms suddenly blare—your GOES satellite has detected an X-class solar flare erupting from the Sun.',
          storyElements: [
            'You remember how magnetic reconnection described the explosive energy release now racing toward Earth',
            'X-ray flux measurements explained the flare\'s incredible intensity breaking your monitoring scales',
            'Recalling today\'s lesson on Solar Flares, you immediately assess the ionospheric impact timeline',
            'You deploy emergency communication protocols to warn radio operators of impending blackouts',
            'You interpret the GOES data to forecast R-class radio disruption severity and duration',
            'You share urgent alerts with aviation controllers and emergency responders who rely on your flare expertise to keep people safe'
          ]
        },
        funFacts: [
          'The largest solar flare ever recorded happened in 2003 and was so powerful it broke the instruments measuring it!',
          'Solar flares can heat the Sun\'s atmosphere to 10-20 million degrees',
          'During a solar flare, the Sun releases as much energy as it normally does in 10 billion years!',
          'Solar flares can make the northern lights visible much further south than usual'
        ],
        realWorldExample: 'In 1859, a massive solar flare caused telegraph wires to spark and catch fire. Some telegraph operators could disconnect their power and still send messages using just the energy from the aurora!'
      }
    },
    {
      id: 'auroras',
      title: 'Auroras (Northern & Southern Lights)',
      icon: <Waves className="w-8 h-8" />,
      description: 'Beautiful light displays caused by space weather',
      color: 'from-green-400 via-teal-500 to-blue-500',
      difficulty: 'Beginner',
      readTime: '30 min',
      content: {
        learningObjectives: [
          'Explain how charged particles cause auroral emissions',
          'Describe why auroras form at high latitudes',
          'Identify the gases responsible for green, red, and purple colors',
          'Correlate geomagnetic storm intensity with auroral brightness'
        ],
        keyTerms: [
          { term: 'Aurora borealis / australis', definition: 'Northern and Southern Lights - luminous displays in polar skies' },
          { term: 'Charged particles', definition: 'Electrically charged atoms and electrons from the solar wind' },
          { term: 'Collisional excitation', definition: 'When high-energy particles hit atmospheric gases, boosting them to higher energy states' },
          { term: 'Excited state', definition: 'When atoms have more energy than normal and are ready to emit light' },
          { term: 'Emission spectrum', definition: 'The specific colors of light that different gases produce when excited' },
          { term: 'Auroral oval', definition: 'Ring-shaped zones around magnetic poles where auroras typically appear' }
        ],
        lessonNarrative: [
          'Solar wind streams carry charged particles that spiral along Earth\'s magnetic field lines and collide with atmospheric atoms and molecules, exciting them to higher energy states. When these atoms return to their ground states, they emit photons—visible as the aurora, predominantly green from oxygen at ~100-300 km altitude, red from higher oxygen, and purple/blue from nitrogen.',
          'Auroras appear in oval rings around the geomagnetic poles. During intense geomagnetic storms, these ovals expand toward lower latitudes, making auroras visible much farther from the poles. Studying auroral displays provides insight into solar-magnetosphere interactions.'
        ],
        activities: [
          {
            title: 'Glow-in-a-Jar Aurora',
            materials: 'Tonic water, black light, clear jar',
            steps: [
              'Pour tonic water into the jar',
              'Shine black light to observe fluorescence',
              'Relate to molecular excitation and emission in auroras'
            ]
          },
          {
            title: 'Aurora Tracker',
            materials: 'NOAA\'s aurora forecast map',
            steps: [
              'Monitor aurora oval location over a week',
              'Record Kp index each day',
              'Plot Kp vs. auroral visibility latitude'
            ]
          },
          {
            title: 'Color Spectrum Analysis',
            materials: 'Gas discharge tubes (oxygen, nitrogen) or images',
            steps: [
              'View emission spectra',
              'Match colors to wavelengths',
              'Explain why certain gases produce specific auroral colors'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'Imagine you\'re an aurora photographer on a frozen lake in northern Alaska when your aurora alert app starts buzzing—a major geomagnetic storm is beginning and the Northern Lights are about to put on the show of a lifetime.',
          storyElements: [
            'You remember how charged particles described the solar wind now cascading into Earth\'s magnetosphere',
            'Collisional excitation explained the green and red glow beginning to dance across the sky above you',
            'Recalling today\'s lesson on Auroras, you predict where the brightest displays will appear next',
            'You deploy your camera settings to capture the oxygen emissions at the perfect wavelength',
            'You interpret the aurora\'s movements to forecast how the storm will intensify',
            'You share your stunning photos with aurora enthusiasts worldwide, using your story-guided knowledge to explain the science behind nature\'s greatest light show'
          ]
        },
        funFacts: [
          'Other planets have auroras too! Jupiter, Saturn, Uranus, and Neptune all have them',
          'The word "aurora" comes from the Roman goddess of dawn',
          'Auroras can make sounds - some people hear crackling or whooshing noises',
          'An aurora can release as much energy as a magnitude 5.5 earthquake!'
        ],
        realWorldExample: 'In March 1989, a geomagnetic storm caused auroras to be visible as far south as Florida and Cuba, and even caused a power outage in Quebec, Canada!'
      }
    },
    {
      id: 'magnetic-field',
      title: 'Earth\'s Magnetic Shield',
      icon: <Shield className="w-8 h-8" />,
      description: 'How Earth protects us from space weather',
      color: 'from-blue-400 via-purple-500 to-indigo-600',
      difficulty: 'Beginner',
      readTime: '20 min',
      content: {
        learningObjectives: [
          'Describe how Earth\'s molten core generates a dipolar magnetic field',
          'Explain the role of the magnetosphere in deflecting charged solar particles',
          'Identify the Van Allen radiation belts and their significance',
          'Discuss how geomagnetic storms compress and distort Earth\'s magnetic field'
        ],
        keyTerms: [
          { term: 'Magnetosphere', definition: 'The region around Earth dominated by Earth\'s magnetic field' },
          { term: 'Dynamo theory', definition: 'Scientific explanation of how Earth\'s liquid iron core generates magnetic fields' },
          { term: 'Van Allen belts', definition: 'Doughnut-shaped zones of trapped radiation around Earth' },
          { term: 'Plasmasphere', definition: 'Region of cold, dense plasma within the magnetosphere' },
          { term: 'Bow shock', definition: 'Boundary where solar wind first encounters Earth\'s magnetic field' },
          { term: 'Magnetopause', definition: 'Outer boundary of Earth\'s magnetosphere' }
        ],
        lessonNarrative: [
          'Earth\'s magnetic field arises from convective motions in its liquid iron core, creating a dynamo effect. This field extends into space, forming the magnetosphere, which acts as a protective bubble against harmful solar particles. Solar wind pressure shapes a bow shock and magnetopause boundary on the dayside and a long magnetotail on the nightside.',
          'Within this magnetic cocoon lie the Van Allen radiation belts, doughnut-shaped zones where charged particles spiral along field lines. During geomagnetic storms, enhanced solar wind pressure and southward interplanetary magnetic fields compress the magnetosphere, causing energetic particles to penetrate deeper, which can harm satellites and astronauts.',
          'Understanding the structure and dynamics of Earth\'s magnetic shield is essential for predicting space weather impacts on our technology and infrastructure.'
        ],
        activities: [
          {
            title: 'Magnetosphere Model',
            materials: 'Bar magnet, styrofoam ball, iron filings',
            steps: [
              'Embed a bar magnet at the center of the ball',
              'Sprinkle iron filings on the surface and gently tap to reveal field lines',
              'Sketch the pattern and label magnetosphere components'
            ]
          },
          {
            title: 'Interactive Simulation',
            materials: 'Online magnetosphere simulator (e.g., NASA\'s CCMC)',
            steps: [
              'Vary solar wind speed and IMF orientation',
              'Observe changes in magnetopause distance and tail length',
              'Record and compare three different conditions'
            ]
          },
          {
            title: 'Radiation Belt Mapping',
            materials: 'Visualization from Van Allen Probes data',
            steps: [
              'Access real particle flux measurements',
              'Plot flux vs. radial distance for electrons and protons',
              'Identify inner and outer belts and discuss variations during storms'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'Imagine you\'re a mission controller at NASA watching in awe as a massive solar storm approaches Earth, but you\'re not worried—you know Earth\'s incredible magnetic shield is about to spring into action.',
          storyElements: [
            'You remember how dynamo theory described Earth\'s core generating this invisible protective barrier',
            'Magnetosphere boundaries explained how solar wind gets deflected around our planet like water around a rock',
            'Recalling today\'s lesson on Earth\'s Magnetic Shield, you watch the Van Allen belts light up with trapped particles',
            'You deploy magnetometer readings to track how the magnetopause compresses under solar wind pressure',
            'You interpret the data to forecast where dangerous particles might penetrate our defenses',
            'You share updates with astronauts on the ISS, using your magnetic field knowledge to keep them safe in their orbiting sanctuary'
          ]
        },
        funFacts: [
          'Earth\'s magnetic field is about 10,000 times weaker than a refrigerator magnet',
          'The magnetic poles are constantly moving - the north magnetic pole moves about 25 miles per year!',
          'Mars lost most of its magnetic field billions of years ago',
          'Earth\'s magnetic field has completely flipped many times in the past'
        ],
        realWorldExample: 'When you use a compass, the needle points to Earth\'s magnetic north pole, which is actually different from the geographic North Pole!'
      }
    },
    {
      id: 'space-weather-effects',
      title: 'Space Weather & Technology',
      icon: <Satellite className="w-8 h-8" />,
      description: 'How space weather affects our daily lives',
      color: 'from-purple-400 via-pink-500 to-red-500',
      difficulty: 'Intermediate',
      readTime: '22 min',
      content: {
        learningObjectives: [
          'Identify how geomagnetic storms affect GPS satellite accuracy and navigation systems',
          'Explain the mechanisms by which space weather disrupts power grid operations',
          'Assess radiation risks to astronauts and airline passengers during solar events',
          'Evaluate economic impacts of space weather on various technological sectors'
        ],
        keyTerms: [
          { term: 'Geomagnetic storm', definition: 'Disturbance in Earth\'s magnetic field caused by solar wind interactions' },
          { term: 'GPS scintillation', definition: 'Rapid fluctuations in satellite signal strength causing navigation errors' },
          { term: 'Geomagnetically Induced Current (GIC)', definition: 'Electric currents in power lines caused by changing magnetic fields' },
          { term: 'Total Electron Content (TEC)', definition: 'Measure of electrons in ionosphere affecting radio wave propagation' },
          { term: 'Single Event Upset (SEU)', definition: 'Temporary electronic malfunction caused by high-energy particles' },
          { term: 'Polar cap absorption', definition: 'Enhanced radio wave absorption at high latitudes during solar events' }
        ],
        lessonNarrative: [
          'Space weather represents one of the most significant natural threats to our modern technological infrastructure. When charged particles and electromagnetic radiation from solar storms interact with Earth\'s magnetosphere and ionosphere, they can disrupt virtually every space-based and ground-based system we depend on daily.',
          'GPS satellites experience signal degradation during geomagnetic storms as ionospheric disturbances cause scintillation—rapid fluctuations that make precise positioning difficult. Power grids suffer from geomagnetically induced currents (GICs) that flow through transmission lines during magnetic field changes, potentially causing transformer damage and widespread blackouts.',
          'Aviation faces dual challenges: increased radiation exposure on polar routes during solar particle events, and disrupted communications in polar regions. Astronauts aboard the International Space Station must retreat to shielded areas during severe space weather to avoid dangerous radiation doses.',
          'Economic impacts cascade across sectors—from precision agriculture relying on GPS guidance to financial markets dependent on satellite communications. Understanding these vulnerabilities is crucial for developing resilient systems and mitigation strategies.'
        ],
        activities: [
          {
            title: 'GPS Accuracy Monitoring',
            materials: 'Smartphone GPS app with accuracy display, space weather data',
            steps: [
              'Record GPS accuracy readings during quiet space weather conditions',
              'Monitor same location during a geomagnetic storm (G1 or higher)',
              'Compare accuracy differences and document error patterns',
              'Correlate findings with real-time ionospheric TEC measurements'
            ]
          },
          {
            title: 'Power Grid Vulnerability Analysis',
            materials: 'GIC monitoring data, power grid maps, storm event reports',
            steps: [
              'Research major geomagnetic storm impacts on power systems',
              'Map vulnerable transmission lines at high geomagnetic latitudes',
              'Calculate potential GIC levels using storm intensity data',
              'Propose protective measures for critical infrastructure'
            ]
          },
          {
            title: 'Radiation Exposure Calculator',
            materials: 'Solar particle event data, flight path information',
            steps: [
              'Select a recent solar particle event from NOAA archives',
              'Choose several airline routes (polar and equatorial)',
              'Calculate radiation dose increases during the event',
              'Compare with annual radiation exposure limits for aircrew'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'You\'re the chief technology officer of a major airline when a massive solar storm erupts, threatening to disrupt flights worldwide—you need to use your space weather knowledge to protect passengers and maintain operations!',
          storyElements: [
            'GPS scintillation reports flood in as navigation systems begin showing large position errors',
            'Using geomagnetic storm forecasts, you reroute polar flights to avoid dangerous radiation levels',
            'Power grid operators call asking about potential GIC-induced transformer damage at airports',
            'Following space weather alerts, you activate backup communication systems as satellite links degrade',
            'You coordinate with space weather forecasters to determine when normal operations can safely resume',
            'Your proactive response, guided by understanding technological vulnerabilities, prevents major disruptions and keeps passengers safe'
          ]
        },
        funFacts: [
          'A single space weather event in 1989 caused a 9-hour blackout in Quebec, affecting 6 million people',
          'GPS errors can increase from 1 meter to over 100 meters during severe geomagnetic storms',
          'The International Space Station carries extra radiation shielding specifically for space weather events',
          'Some modern cars have over 100 microprocessors that could be affected by space weather'
        ],
        realWorldExample: 'In October 2003, space weather caused 47 commercial flights to reroute away from polar regions, and GPS-guided farm equipment in the Midwest experienced significant positioning errors during harvest season.'
      }
    },
    {
      id: 'cme',
      title: 'Coronal Mass Ejections (CMEs)',
      icon: <Globe className="w-8 h-8" />,
      description: 'Massive clouds of solar particles heading to Earth',
      color: 'from-red-400 via-orange-500 to-yellow-500',
      difficulty: 'Intermediate',
      readTime: '25 min',
      content: {
        learningObjectives: [
          'Define CMEs and describe their formation mechanism in the solar corona',
          'Calculate CME travel times from Sun to Earth using velocity measurements',
          'Classify CME directions and predict Earth-directed events',
          'Analyze the relationship between CME speed and geomagnetic storm intensity'
        ],
        keyTerms: [
          { term: 'Coronal Mass Ejection (CME)', definition: 'Large-scale expulsion of plasma and magnetic fields from the solar corona' },
          { term: 'Flux rope', definition: 'Twisted magnetic field structure that can trigger CMEs' },
          { term: 'Halo CME', definition: 'Earth-directed CME appearing as a circular halo in coronagraph images' },
          { term: 'Interplanetary CME (ICME)', definition: 'The interplanetary manifestation of a CME as it travels through space' },
          { term: 'Magnetic cloud', definition: 'A subset of ICMEs with smoothly rotating magnetic fields and low temperatures' },
          { term: 'Shock sheath', definition: 'Region of compressed plasma ahead of fast CMEs' },
          { term: 'Transit time', definition: 'Time required for CME to travel from Sun to Earth (typically 1-5 days)' }
        ],
        lessonNarrative: [
          'Coronal Mass Ejections are among the most powerful space weather phenomena, capable of expelling billions of tons of plasma from the Sun at speeds ranging from 20 km/s to over 3000 km/s. These eruptions originate when magnetic field lines in the corona become unstable and reconnect explosively, launching magnetized plasma clouds into interplanetary space.',
          'When a CME travels toward Earth, it can be detected using coronagraphs that block the Sun\'s bright disk to reveal the faint corona. Earth-directed CMEs appear as expanding halos in these images. The fastest CMEs can reach Earth in as little as 15-18 hours, while slower ones may take 3-5 days, allowing varying amounts of time for space weather forecasters to issue warnings.',
          'Upon arrival at Earth, CMEs interact with the magnetosphere, potentially causing severe geomagnetic storms. The strength of the resulting storm depends on the CME\'s speed, magnetic field strength and orientation, and plasma density. The most dangerous CMEs have southward-oriented magnetic fields that efficiently couple with Earth\'s northward-pointing field.',
          'Understanding CME properties and propagation is crucial for protecting astronauts, satellites, power grids, and communication systems from space weather impacts.'
        ],
        activities: [
          {
            title: 'CME Detection Analysis',
            materials: 'SOHO/LASCO coronagraph data, measurement tools',
            steps: [
              'Access recent LASCO C2 and C3 coronagraph movies',
              'Identify CME events and measure angular widths',
              'Classify events as partial halo, halo, or non-Earth directed',
              'Calculate apparent speeds using height-time measurements'
            ]
          },
          {
            title: 'Transit Time Prediction',
            materials: 'CME catalog data, propagation models',
            steps: [
              'Select a historical Earth-directed CME event',
              'Use the measured speed to predict arrival time at Earth',
              'Compare prediction with actual arrival time from in-situ data',
              'Discuss factors that cause prediction uncertainties'
            ]
          },
          {
            title: 'Storm Impact Assessment',
            materials: 'Dst index data, CME parameters',
            steps: [
              'Correlate CME speeds with resulting Dst minimum values',
              'Create scatter plot showing speed vs. storm intensity',
              'Identify outliers and discuss other contributing factors',
              'Propose improved prediction methods'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'You\'re a space weather forecaster at NOAA when your computer alerts you to a massive bright halo in the latest SOHO coronagraph image—a billion-ton plasma cloud is racing toward Earth at 2000 km/s!',
          storyElements: [
            'Using flux rope theory, you recognize this CME originated from twisted magnetic fields that explosively reconnected',
            'Your transit time calculations show the interplanetary CME will arrive in approximately 20 hours',
            'You issue alerts to power grid operators about potential geomagnetic storm conditions',
            'Following magnetic cloud signatures, you track the CME\'s magnetic field orientation as it approaches',
            'When the shock sheath arrives first, you monitor sudden increases in solar wind pressure',
            'You guide satellite operators through protective measures as the main magnetic cloud engulfs Earth\'s magnetosphere'
          ]
        },
        funFacts: [
          'The fastest CME ever recorded reached speeds of over 3000 km/s - that\'s 1% the speed of light!',
          'A large CME can contain the mass equivalent to a small mountain',
          'The 1859 Carrington Event CME was so powerful it caused telegraph lines to spark',
          'CMEs occur most frequently during solar maximum, with several per day possible'
        ],
        realWorldExample: 'In March 1989, a CME caused a 9-hour blackout in Quebec, Canada, affecting 6 million people and costing millions of dollars.'
      }
    },
    {
      id: 'understanding-live-data',
      title: 'Understanding Live Space Weather Data',
      icon: <Activity className="w-8 h-8" />,
      description: 'Learn how to read and interpret real-time space weather measurements',
      color: 'from-cyan-400 via-blue-500 to-indigo-600',
      difficulty: 'Beginner',
      readTime: '20 min',
      content: {
        learningObjectives: [
          'Identify key space weather parameters measured by satellites',
          'Interpret solar wind speed, density, and magnetic field data',
          'Recognize patterns that indicate incoming geomagnetic storms',
          'Use real-time data to predict space weather impacts'
        ],
        keyTerms: [
          { term: 'Solar wind speed', definition: 'Velocity of charged particles streaming from the Sun, measured in km/s' },
          { term: 'Proton density', definition: 'Number of protons per cubic centimeter in the solar wind' },
          { term: 'Interplanetary Magnetic Field (IMF)', definition: 'Magnetic field carried by solar wind through space' },
          { term: 'Bz component', definition: 'North-south component of IMF that determines geomagnetic coupling' },
          { term: 'Kp index', definition: 'Global measure of geomagnetic activity on a scale of 0-9' },
          { term: 'GOES satellite', definition: 'Geostationary spacecraft monitoring space weather near Earth' }
        ],
        lessonNarrative: [
          'Space weather monitoring relies on a network of satellites that continuously measure conditions in interplanetary space and near Earth. The Advanced Composition Explorer (ACE) satellite, positioned at the L1 Lagrange point 1.5 million kilometers sunward of Earth, provides crucial early warning data about incoming solar wind conditions.',
          'Key measurements include solar wind speed (typically 300-800 km/s), proton density (1-100 particles/cm³), and the interplanetary magnetic field strength and direction. The Bz component is particularly important—when it points southward (negative values), it can efficiently couple with Earth\'s northward-pointing magnetic field, triggering geomagnetic storms.',
          'Real-time data allows forecasters to issue warnings 15-60 minutes before space weather impacts reach Earth. High-speed solar wind streams, sudden increases in particle density, and strong southward IMF are key indicators of potential geomagnetic activity. Understanding these patterns helps protect technological systems and plan space missions.'
        ],
        activities: [
          {
            title: 'Real-Time Data Analysis',
            materials: 'NOAA SWPC website, ACE real-time solar wind data',
            steps: [
              'Access current solar wind parameters from ACE satellite',
              'Record speed, density, and Bz values for 1 hour',
              'Identify any significant changes or unusual patterns',
              'Predict geomagnetic activity for the next 6 hours'
            ]
          },
          {
            title: 'Storm Signature Recognition',
            materials: 'Historical storm data, event timeline',
            steps: [
              'Examine solar wind data from a major geomagnetic storm',
              'Identify the arrival of shock, sheath, and magnetic cloud',
              'Correlate Bz turning southward with Dst index changes',
              'Create a timeline of storm phases and impacts'
            ]
          },
          {
            title: 'Forecasting Practice',
            materials: 'Live data feeds, prediction worksheet',
            steps: [
              'Monitor current space weather conditions',
              'Use trending parameters to make 24-hour forecasts',
              'Compare your predictions with official NOAA forecasts',
              'Evaluate accuracy and identify improvement areas'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'You\'re monitoring space weather at mission control when suddenly the ACE satellite data shows solar wind speed jumping from 400 to 700 km/s and the magnetic field Bz component turning strongly southward—a perfect recipe for a geomagnetic storm!',
          storyElements: [
            'Reading proton density spikes, you recognize the signature of a CME shock arrival',
            'Tracking Bz component changes, you predict the onset of magnetic reconnection at the magnetopause',
            'Using Kp index forecasts, you calculate the storm will likely reach G3 (Strong) levels',
            'Following GOES satellite magnetometer data, you watch Earth\'s magnetic field respond to the solar wind pressure',
            'You alert satellite operators about increased radiation levels and potential charging effects',
            'Coordinating with aurora photographers, you provide real-time updates on visibility predictions for tonight\'s display'
          ]
        },
        funFacts: [
          'ACE satellite data takes about 1 hour to reach Earth after being transmitted',
          'Solar wind speed can vary from 200 km/s during quiet times to over 1000 km/s in fast streams',
          'The Kp index is updated every 3 hours using global magnetometer networks',
          'GOES satellites orbit at the same speed as Earth\'s rotation, staying above the same location'
        ],
        realWorldExample: 'Airlines use real-time space weather data to reroute polar flights when radiation levels spike, protecting passengers and crew from excess cosmic ray exposure.'
      }
    },
    {
      id: 'space-weather-scales',
      title: 'Space Weather Scales & Alerts',
      icon: <Target className="w-8 h-8" />,
      description: 'Learn the rating systems used to measure space weather intensity',
      color: 'from-yellow-400 via-orange-500 to-red-600',
      difficulty: 'Intermediate',
      readTime: '18 min',
      content: {
        learningObjectives: [
          'Compare the G, S, and R space weather scales with their corresponding physical measurements',
          'Interpret NOAA space weather alert messages and their impact categories',
          'Predict technological effects based on scale ratings and historical data',
          'Analyze real-time space weather conditions using standardized scale classifications'
        ],
        keyTerms: [
          { term: 'G-Scale (Geomagnetic storms)', definition: 'Five-level scale (G1-G5) measuring geomagnetic disturbance intensity' },
          { term: 'S-Scale (Solar radiation storms)', definition: 'Five-level scale (S1-S5) measuring solar energetic particle flux' },
          { term: 'R-Scale (Radio blackouts)', definition: 'Five-level scale (R1-R5) measuring solar X-ray flux impacts on HF radio' },
          { term: 'Kp index', definition: 'Global geomagnetic activity index from 0-9 that determines G-scale ratings' },
          { term: 'GOES X-ray flux', definition: 'Measurement determining R-scale radio blackout classifications' },
          { term: 'Proton flux threshold', definition: 'Particle intensity levels that define S-scale radiation storm categories' }
        ],
        lessonNarrative: [
          'NOAA\'s Space Weather Scales provide standardized ways to communicate space weather severity to various user communities, similar to how the Saffir-Simpson scale categorizes hurricanes. The three scales address different phenomena: G-scale for geomagnetic storms, S-scale for solar radiation storms, and R-scale for radio blackouts.',
          'The G-scale ranges from G1 (minor) to G5 (extreme) based on the planetary Kp index, with G1 storms causing minor power grid fluctuations and enhanced aurora, while G5 storms can cause widespread power system collapse. The S-scale measures solar energetic particle events that primarily affect polar aviation and satellite operations.',
          'R-scale events result from solar X-ray flares and immediately impact high-frequency radio communications, with R1 events causing minor degradation and R5 events causing complete HF radio blackouts for hours. Understanding these scales helps users assess risks and take appropriate protective actions.',
          'Real-time scale assessments enable timely warnings to critical infrastructure operators, airlines, satellite operators, and emergency services, allowing them to implement protective measures and maintain operational safety during severe space weather.'
        ],
        activities: [
          {
            title: 'Scale Correlation Analysis',
            materials: 'Historical space weather event database, impact reports',
            steps: [
              'Collect data from recent G3+ geomagnetic storms',
              'Document reported impacts for each scale level',
              'Create correlation charts between scale ratings and actual effects',
              'Identify patterns and exceptions in the scale-impact relationships'
            ]
          },
          {
            title: 'Real-Time Alert Tracking',
            materials: 'NOAA SWPC alert feeds, notification apps',
            steps: [
              'Subscribe to NOAA space weather alerts and watches',
              'Monitor alerts for one month and record scale classifications',
              'Track which predicted events verified and which did not',
              'Analyze forecasting accuracy for different scale levels'
            ]
          },
          {
            title: 'Impact Scenario Planning',
            materials: 'Space weather scale descriptions, infrastructure maps',
            steps: [
              'Choose a major metropolitan area for analysis',
              'Map critical infrastructure (power, communications, transportation)',
              'Develop impact scenarios for G1, G3, and G5 storm levels',
              'Present findings with recommended preparedness measures'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'You\'re the emergency management coordinator for a major city when NOAA issues a G4 (Severe) geomagnetic storm watch—you need to translate this technical alert into actionable protective measures for your community!',
          storyElements: [
            'Understanding G-scale classifications, you recognize this means widespread power system voltage irregularities are possible',
            'Using S-scale knowledge, you coordinate with airports about potential radiation exposure on polar flights',
            'Following R-scale protocols, you alert emergency services about possible HF radio communication disruptions',
            'You activate backup power systems at critical facilities based on the G4 storm severity prediction',
            'Monitoring real-time Kp index values, you track the storm\'s actual intensity as it develops',
            'Your scale-based emergency response plan, informed by space weather education, helps minimize community disruption during the event'
          ]
        },
        funFacts: [
          'A G5 geomagnetic storm hasn\'t occurred since October 2003!',
          'R3 radio blackouts can disrupt emergency services communications for hours',
          'S-scale events are most dangerous for astronauts and airline passengers at high altitudes',
          'Most space weather events are G1 or G2 - relatively mild'
        ],
        realWorldExample: 'The March 1989 Quebec blackout was caused by a G4 geomagnetic storm, demonstrating how even "severe" (not extreme) ratings can have major infrastructure impacts.'
      }
    },
    {
      id: 'satellite-monitoring',
      title: 'Satellites That Watch Space Weather',
      icon: <Satellite className="w-8 h-8" />,
      description: 'Meet the spacecraft that monitor space weather 24/7',
      color: 'from-gray-400 via-slate-500 to-zinc-600',
      difficulty: 'Intermediate',
      readTime: '22 min',
      content: {
        learningObjectives: [
          'Identify major space weather monitoring satellites and their specific functions',
          'Explain the strategic positioning of satellites at Lagrange points',
          'Compare different types of space weather instruments and their measurements',
          'Evaluate the importance of multi-satellite coordinated observations'
        ],
        keyTerms: [
          { term: 'SOHO', definition: 'Solar and Heliospheric Observatory - ESA/NASA mission studying the Sun since 1996' },
          { term: 'ACE', definition: 'Advanced Composition Explorer satellite providing solar wind early warning data' },
          { term: 'DSCOVR', definition: 'Deep Space Climate Observatory monitoring space weather at L1 point' },
          { term: 'Lagrange point L1', definition: 'Gravitational balance point 1.5 million km sunward of Earth' },
          { term: 'Coronagraph', definition: 'Instrument that blocks the Sun\'s disk to observe the corona' },
          { term: 'Magnetometer', definition: 'Device that measures magnetic field strength and direction' },
          { term: 'Particle detector', definition: 'Instrument measuring charged particle flux and energy' }
        ],
        lessonNarrative: [
          'A constellation of specialized satellites continuously monitors space weather from multiple vantage points, providing the data essential for forecasting and understanding solar-terrestrial interactions. These robotic sentinels range from solar observatories like SOHO, which has revolutionized our understanding of the Sun, to near-Earth monitors like GOES satellites that track real-time conditions.',
          'Strategic positioning is crucial for space weather surveillance. Satellites at the L1 Lagrange point (ACE, DSCOVR, SOHO) provide 15-60 minutes advance warning of solar wind changes, while STEREO spacecraft offer stereoscopic views of solar eruptions. The Parker Solar Probe ventures closer to the Sun than any previous mission, sampling the solar wind at its source.',
          'Different satellites carry complementary instrument suites: coronagraphs reveal CMEs, magnetometers measure magnetic fields, and particle detectors monitor radiation environments. This coordinated approach allows scientists to track space weather events from their solar origins through interplanetary space to their terrestrial impacts.',
          'Satellite data integration enables comprehensive space weather forecasting, combining solar observations with near-Earth measurements to predict geomagnetic storms, radiation levels, and atmospheric disturbances that affect technology and human activities.'
        ],
        activities: [
          {
            title: 'Satellite Mission Analysis',
            materials: 'Mission fact sheets for SOHO, ACE, DSCOVR, STEREO',
            steps: [
              'Research orbital characteristics and instrument suites for each satellite',
              'Create a timeline showing mission launches and current status',
              'Map satellite positions relative to Earth and Sun',
              'Identify redundancies and gaps in current monitoring capabilities'
            ]
          },
          {
            title: 'Real-Time Data Integration',
            materials: 'Live data feeds from multiple satellites',
            steps: [
              'Access current SOHO coronagraph images for CME detection',
              'Compare ACE and DSCOVR solar wind measurements',
              'Correlate GOES magnetometer data with L1 predictions',
              'Create a comprehensive space weather status report'
            ]
          },
          {
            title: 'Future Mission Design',
            materials: 'Space weather requirements, orbital mechanics tools',
            steps: [
              'Identify current limitations in space weather monitoring',
              'Propose new satellite missions to fill observational gaps',
              'Design optimal orbits and instrument configurations',
              'Present mission concepts with scientific justification'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'You\'re the mission operations director coordinating a fleet of space weather satellites when a major solar storm erupts—you need to choreograph observations from six different spacecraft to track the event from Sun to Earth!',
          storyElements: [
            'SOHO coronagraphs first detect the CME eruption, revealing a full halo event aimed at Earth',
            'STEREO spacecraft provide 3D reconstruction of the CME structure and propagation direction',
            'Using Lagrange point positioning, you calculate 36-hour arrival time for the disturbance',
            'ACE satellite begins detecting the shock front, providing 45 minutes advance warning',
            'DSCOVR confirms the magnetic field orientation as the cloud engulfs L1',
            'You coordinate GOES satellites to monitor Earth\'s magnetospheric response in real-time'
          ]
        },
        funFacts: [
          'SOHO has discovered over 4,000 comets while watching the Sun - more than any other observatory!',
          'The Parker Solar Probe will eventually approach within 4 million miles of the Sun',
          'ACE satellite has provided over 25 years of continuous solar wind monitoring',
          'STEREO spacecraft revealed the 3D structure of CMEs for the first time'
        ],
        realWorldExample: 'During the July 2012 "Carrington-class" solar storm, STEREO satellites provided crucial 3D observations that helped scientists understand what would have been the most severe space weather event in modern history if it had hit Earth.'
      }
    },
    {
      id: 'solar-cycle',
      title: 'The Solar Cycle: Sun\'s 11-Year Rhythm',
      icon: <Sun className="w-8 h-8" />,
      description: 'Discover how the Sun changes over time in predictable cycles',
      color: 'from-yellow-300 via-orange-400 to-red-500',
      difficulty: 'Intermediate',
      readTime: '18 min',
      content: {
        learningObjectives: [
          'Describe the 11-year solar cycle and its phases of minimum and maximum activity',
          'Explain the relationship between sunspot numbers and solar activity levels',
          'Predict space weather frequency changes throughout the solar cycle',
          'Analyze historical solar cycle data to identify patterns and variations'
        ],
        keyTerms: [
          { term: 'Solar cycle', definition: 'The approximately 11-year periodic variation in the Sun\'s magnetic activity' },
          { term: 'Solar minimum', definition: 'Phase of the cycle with fewest sunspots and lowest solar activity' },
          { term: 'Solar maximum', definition: 'Phase of the cycle with peak sunspot numbers and highest solar activity' },
          { term: 'Sunspot number', definition: 'Daily index tracking solar activity based on sunspot counts and groups' },
          { term: 'Solar dynamo', definition: 'The mechanism generating the Sun\'s magnetic field through differential rotation' },
          { term: 'Maunder Minimum', definition: 'Historical period (1645-1715) of extremely low solar activity' }
        ],
        lessonNarrative: [
          'The solar cycle represents one of the most fundamental rhythms in our solar system, driven by the complex interplay of the Sun\'s rotation and convective motions that generate its magnetic field. Every 11 years on average, the Sun\'s magnetic polarity completely reverses, creating a 22-year magnetic cycle, though the activity patterns repeat on the shorter 11-year timescale.',
          'Solar minimum periods feature very few sunspots, minimal flare activity, and reduced CME frequency, while solar maximum brings peak sunspot numbers, frequent solar flares, and heightened space weather activity. The current Solar Cycle 25 began in December 2019 and is expected to reach maximum around 2024-2025.',
          'Sunspot counting, pioneered by astronomers like Galileo, remains our primary method for tracking solar cycle progression. The sunspot number combines both the total count of individual spots and the number of sunspot groups, providing a standardized measure of solar activity that has been continuously recorded for over 400 years.',
          'Understanding solar cycle variations helps space weather forecasters predict long-term activity trends, assists mission planners in choosing optimal launch windows, and helps engineers design spacecraft systems robust enough to survive both quiet and active periods.'
        ],
        activities: [
          {
            title: 'Solar Cycle Data Analysis',
            materials: 'Historical sunspot number data (SILSO database)',
            steps: [
              'Plot sunspot numbers from 1700 to present',
              'Identify and label solar minima and maxima',
              'Calculate average cycle lengths and peak intensities',
              'Compare current cycle strength to historical averages'
            ]
          },
          {
            title: 'Activity Correlation Study',
            materials: 'Solar flare catalogs, CME databases, sunspot records',
            steps: [
              'Collect monthly solar flare counts for 2 complete cycles',
              'Correlate flare frequency with sunspot numbers',
              'Create scatter plots showing the relationship',
              'Discuss lag times between sunspot and flare activity'
            ]
          },
          {
            title: 'Cycle Prediction Challenge',
            materials: 'Current cycle data, prediction models',
            steps: [
              'Analyze Solar Cycle 25 progression to date',
              'Compare with official NOAA predictions',
              'Create your own peak prediction with justification',
              'Monitor ongoing data to validate predictions'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'You\'re a solar physicist in 2008 witnessing the deepest solar minimum in a century—the Sun has been spotless for months, and some colleagues are joking that the Sun has "gone to sleep," but you know it\'s gathering energy for the next big cycle!',
          storyElements: [
            'Using solar dynamo theory, you explain how the Sun\'s magnetic field is quietly reorganizing itself',
            'Tracking sunspot numbers daily, you watch for the first tiny spots that will signal the new cycle\'s beginning',
            'You compare current minimum conditions to the famous Maunder Minimum of the 1600s',
            'Following magnetic polarity reversals, you detect the first signs that Solar Cycle 24 is starting',
            'You predict that within 3-4 years, the Sun will transform from this quiet state into an active, flare-producing powerhouse',
            'You help satellite operators prepare for gradually increasing space weather activity as the cycle progresses toward maximum'
          ]
        },
        funFacts: [
          'The solar cycle was discovered by amateur astronomer Heinrich Schwabe in 1843 after 17 years of daily observations',
          'Solar Cycle 19 (1954-1964) was the strongest on record, producing the massive 1959 solar storm',
          'During the 2008-2009 minimum, the Sun was spotless for 260 days - almost 71% of the time!',
          'The Maunder Minimum coincided with Europe\'s "Little Ice Age" though the connection is debated'
        ],
        realWorldExample: 'NASA uses solar cycle predictions to time major missions - the Hubble Space Telescope was launched near solar minimum to minimize radiation exposure during deployment.'
      }
    },
    {
      id: 'space-weather-prediction',
      title: 'Predicting Space Weather',
      icon: <Brain className="w-8 h-8" />,
      description: 'How scientists forecast space weather like meteorologists forecast Earth weather',
      color: 'from-purple-400 via-violet-500 to-indigo-600',
      difficulty: 'Advanced',
      readTime: '25 min',
      content: {
        learningObjectives: [
          'Compare space weather forecasting techniques with terrestrial weather prediction methods',
          'Analyze the role of physics-based models versus empirical approaches in space weather forecasting',
          'Evaluate forecast accuracy and lead times for different types of space weather events',
          'Assess how machine learning and AI are improving space weather prediction capabilities'
        ],
        keyTerms: [
          { term: 'MHD models', definition: 'Magnetohydrodynamic computer simulations of plasma and magnetic field interactions' },
          { term: 'Empirical models', definition: 'Statistical prediction methods based on historical data patterns' },
          { term: 'Ensemble forecasting', definition: 'Running multiple model simulations to assess prediction uncertainty' },
          { term: 'Lead time', definition: 'The advance warning time available for different space weather phenomena' },
          { term: 'Persistence forecasting', definition: 'Assuming current conditions will continue unchanged' },
          { term: 'Verification metrics', definition: 'Statistical measures used to evaluate forecast accuracy and skill' }
        ],
        lessonNarrative: [
          'Space weather forecasting combines physical understanding, computational modeling, and statistical analysis to predict solar and geomagnetic activity. Unlike terrestrial weather, space weather involves plasma physics and electromagnetic interactions across vast distances from the Sun to Earth, making prediction particularly challenging.',
          'Current operational models include physics-based MHD simulations that solve plasma equations, empirical models based on statistical relationships, and hybrid approaches combining both methods. Lead times vary dramatically: solar flare impacts arrive in 8 minutes, while CME effects can be predicted 1-5 days in advance.',
          'Forecast accuracy depends strongly on the phenomenon and lead time. Solar flare occurrence is nearly impossible to predict more than hours ahead, while recurring high-speed solar wind streams can be forecast weeks in advance. Geomagnetic storm intensity predictions remain one of the most challenging aspects of space weather forecasting.',
          'Machine learning and artificial intelligence are revolutionizing space weather prediction by identifying subtle patterns in massive datasets, improving automated event detection, and enhancing forecast accuracy through ensemble methods and uncertainty quantification.'
        ],
        activities: [
          {
            title: 'Forecast Verification Study',
            materials: 'NOAA forecast archives, actual space weather event data',
            steps: [
              'Collect 6 months of NOAA geomagnetic storm forecasts',
              'Compare predictions with actual Kp index measurements',
              'Calculate verification statistics (probability of detection, false alarm rate)',
              'Analyze which forecast lead times show highest skill'
            ]
          },
          {
            title: 'Model Comparison Exercise',
            materials: 'WSA-ENLIL model output, empirical model predictions',
            steps: [
              'Access CME arrival time predictions from different models',
              'Track actual arrival times for several Earth-directed CMEs',
              'Compare model performance and identify systematic biases',
              'Discuss advantages and limitations of each approach'
            ]
          },
          {
            title: 'AI Pattern Recognition',
            materials: 'Solar magnetogram data, machine learning tools',
            steps: [
              'Train a simple classifier to identify flare-productive active regions',
              'Test the model on held-out data and evaluate performance',
              'Compare AI predictions with human expert assessments',
              'Discuss potential and limitations of automated forecasting'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'You\'re a space weather forecaster at NOAA when multiple models start disagreeing about whether an Earth-directed CME will cause a major geomagnetic storm—you need to weigh the evidence and issue the most accurate forecast possible!',
          storyElements: [
            'Using MHD model outputs, you analyze the CME\'s predicted magnetic field orientation and arrival time',
            'Empirical models suggest different storm intensity based on historical similar events',
            'You apply ensemble forecasting techniques to quantify the uncertainty in your predictions',
            'Machine learning algorithms flag potential model biases you hadn\'t considered',
            'Following verification metrics from past performance, you weight different model contributions',
            'Your scientifically-informed forecast helps power grid operators and satellite missions prepare for the most likely space weather scenario'
          ]
        },
        funFacts: [
          'Space weather forecasters work 24/7, just like regular meteorologists',
          'The most accurate predictions are often only 15-60 minutes ahead',
          'Computer models can simulate the entire journey from Sun to Earth in 3D',
          'AI models can now detect solar flares faster than human forecasters'
        ],
        realWorldExample: 'In October 2003, forecasters successfully predicted a series of major space weather events, helping airlines reroute flights and power companies prepare protective measures, preventing millions of dollars in damage.'
      }
    },
    {
      id: 'climate-vs-weather',
      title: 'Space Climate vs Space Weather',
      icon: <Globe className="w-8 h-8" />,
      description: 'Understanding the difference between short-term events and long-term patterns',
      color: 'from-teal-400 via-cyan-500 to-blue-600',
      difficulty: 'Intermediate',
      readTime: '20 min',
      content: {
        learningObjectives: [
          'Distinguish between space weather events and space climate patterns',
          'Analyze long-term solar activity trends and their terrestrial impacts',
          'Evaluate paleoclimate evidence for past space climate variations',
          'Predict how space climate changes might affect future technological systems'
        ],
        keyTerms: [
          { term: 'Space weather', definition: 'Short-term variations in space environment (minutes to days)' },
          { term: 'Space climate', definition: 'Long-term statistical description of space environment (years to centuries)' },
          { term: 'Maunder Minimum', definition: 'Period of extremely low solar activity from 1645-1715 CE' },
          { term: 'Grand solar minimum', definition: 'Extended periods of reduced solar activity lasting decades' },
          { term: 'Cosmogenic isotopes', definition: 'Isotopes produced by cosmic rays that record past solar activity' },
          { term: 'Heliospheric modulation', definition: 'How solar activity affects cosmic ray flux reaching Earth' }
        ],
        lessonNarrative: [
          'The distinction between space weather and space climate parallels the difference between terrestrial weather and climate. Space weather encompasses individual events like solar flares and geomagnetic storms occurring over minutes to days, while space climate describes long-term statistical patterns of solar activity and space environment conditions over years to millennia.',
          'Space climate variations are driven primarily by long-term changes in solar magnetic activity, including the 11-year solar cycle, longer-term modulations like the Gleissberg cycle (~88 years), and even longer variations. The most famous space climate event was the Maunder Minimum (1645-1715), when sunspots virtually disappeared and coincided with the Little Ice Age.',
          'Evidence for past space climate comes from cosmogenic isotopes like ¹⁴C and ¹⁰Be preserved in tree rings and ice cores. During periods of low solar activity, reduced solar wind allows more cosmic rays to reach Earth, producing more cosmogenic isotopes. This provides a record of solar activity extending back thousands of years.',
          'Understanding space climate is crucial for long-term planning of space missions, satellite constellation design, and assessing technological vulnerabilities. Future grand solar minima could reduce space weather frequency but increase cosmic ray exposure, while periods of enhanced activity could strain technological systems.'
        ],
        activities: [
          {
            title: 'Sunspot Cycle Analysis',
            materials: 'Historical sunspot data from 1700-present',
            steps: [
              'Plot 300+ years of annual sunspot numbers',
              'Identify periods of enhanced and reduced activity',
              'Calculate long-term trends and cycle amplitude variations',
              'Compare current Solar Cycle 25 with historical patterns'
            ]
          },
          {
            title: 'Cosmogenic Isotope Investigation',
            materials: '¹⁴C and ¹⁰Be data from ice cores and tree rings',
            steps: [
              'Access cosmogenic isotope datasets covering the last 1000 years',
              'Identify the Maunder Minimum signature in isotope records',
              'Correlate isotope variations with known historical solar activity',
              'Reconstruct solar activity for periods before telescopic observations'
            ]
          },
          {
            title: 'Future Scenario Planning',
            materials: 'Solar cycle predictions, technology vulnerability assessments',
            steps: [
              'Research predictions for future solar cycle strengths',
              'Model space weather frequency changes under different scenarios',
              'Assess technological vulnerabilities for a grand solar minimum',
              'Develop adaptation strategies for long-term space climate changes'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'You\'re a historian studying the 1600s when you discover that during the Maunder Minimum, the Thames River in London froze solid every winter, aurora sightings virtually disappeared, and cosmic ray exposure increased significantly—you realize you\'re seeing space climate in action!',
          storyElements: [
            'Using cosmogenic isotope records, you trace how reduced solar activity allowed more cosmic rays to reach Earth',
            'Historical documents reveal the near-complete absence of aurora observations during this grand solar minimum',
            'You connect the lack of sunspots recorded by early astronomers to the broader space climate pattern',
            'Following paleoclimate evidence, you see how space climate changes coincided with terrestrial climate impacts',
            'Your research shows how space weather frequency dropped dramatically during this extended quiet period',
            'You help modern scientists understand how future grand solar minima might affect our technology-dependent civilization differently than past societies'
          ]
        },
        funFacts: [
          'The Little Ice Age on Earth might have been partly influenced by the Maunder Minimum space climate',
          'During grand solar minima, cosmic radiation reaching Earth increases by 15-20%',
          'Space climate changes can affect atmospheric chemistry and ozone production',
          'Scientists study ice cores from Greenland to learn about ancient space climate'
        ],
        realWorldExample: 'The Maunder Minimum (1645-1715) was a period of very few sunspots that coincided with unusually cold weather in Europe, demonstrating how space climate can influence terrestrial climate patterns.'
      }
    },
    {
      id: 'space-weather-careers',
      title: 'Careers in Space Weather',
      icon: <Rocket className="w-8 h-8" />,
      description: 'Explore exciting career paths in space weather science and forecasting',
      color: 'from-indigo-400 via-purple-500 to-pink-600',
      difficulty: 'Beginner',
      readTime: '15 min',
      content: {
        learningObjectives: [
          'Identify various career paths within the space weather field',
          'Compare educational requirements for different space weather professions',
          'Evaluate the interdisciplinary nature of space weather careers',
          'Research current job market trends and opportunities in space weather'
        ],
        keyTerms: [
          { term: 'Space weather forecaster', definition: 'Professional who monitors and predicts space weather conditions for operational users' },
          { term: 'Heliophysicist', definition: 'Scientist studying the Sun and its effects throughout the solar system' },
          { term: 'Space systems engineer', definition: 'Engineer designing spacecraft and instruments resilient to space weather' },
          { term: 'Data scientist', definition: 'Analyst using computational methods to extract insights from space weather datasets' },
          { term: 'Science communicator', definition: 'Professional translating complex space weather concepts for public understanding' },
          { term: 'Mission operations specialist', definition: 'Expert coordinating spacecraft operations during space weather events' }
        ],
        lessonNarrative: [
          'Space weather offers diverse career opportunities spanning pure research, operational forecasting, engineering applications, and public education. The field requires interdisciplinary knowledge combining physics, astronomy, engineering, computer science, and communication skills to address the growing challenges of protecting our technology-dependent society.',
          'Research careers focus on advancing fundamental understanding of solar-terrestrial physics through theoretical modeling, observational analysis, and mission planning. Universities, national laboratories, and space agencies employ researchers to study everything from solar dynamics to magnetospheric processes, often requiring advanced degrees in physics, astronomy, or related fields.',
          'Operational roles center on real-time monitoring and forecasting at organizations like NOAA\'s Space Weather Prediction Center, where forecasters provide 24/7 warnings to protect critical infrastructure. These positions often require backgrounds in atmospheric science, physics, or meteorology, plus specialized training in space weather phenomena and prediction techniques.'
        ],
        activities: [
          {
            title: 'Career Path Investigation',
            materials: 'Professional networking sites, job postings, career websites',
            steps: [
              'Research 5 different space weather career categories',
              'Identify required education, skills, and experience for each',
              'Find current job openings and salary ranges',
              'Interview a space weather professional if possible'
            ]
          },
          {
            title: 'Educational Planning',
            materials: 'University course catalogs, degree program descriptions',
            steps: [
              'Map undergraduate courses that prepare for space weather careers',
              'Identify graduate programs specializing in space physics or related fields',
              'Research internship opportunities at space weather organizations',
              'Create a personalized educational timeline toward your career goal'
            ]
          },
          {
            title: 'Skills Assessment',
            materials: 'Self-evaluation tools, career aptitude tests',
            steps: [
              'Assess your current strengths in math, science, and communication',
              'Identify which space weather career best matches your interests',
              'Develop a plan to strengthen areas needing improvement',
              'Set specific goals for building relevant experience'
            ]
          }
        ],
        learnItAsStory: {
          scenario: 'You\'re a high school student fascinated by today\'s space weather lesson when you suddenly realize this could become your future career—you start imagining yourself as a space weather professional making a real difference in protecting society!',
          storyElements: [
            'As a space weather forecaster, you could issue critical warnings that protect power grids and aviation',
            'Working as a heliophysicist, you might discover new aspects of how the Sun affects Earth',
            'Following an engineering path, you could design next-generation space weather monitoring satellites',
            'Your data science skills could revolutionize space weather prediction using machine learning',
            'As a science communicator, you could help the public understand and prepare for space weather risks',
            'Your career choice today, inspired by space weather education, could lead to protecting astronauts, satellites, and technology that billions of people depend on'
          ]
        },
        funFacts: [
          'The first space weather forecasters were actually radio operators during World War II!',
          'Some space weather scientists get to travel to Antarctica for research',
          'Space weather affects everything from farming GPS to financial trading systems',
          'New careers in space weather are being created as our technology becomes more vulnerable'
        ],
        realWorldExample: 'Dr. Tamitha Skov, known as the "Space Weather Woman," combines research expertise with social media outreach to make space weather accessible to millions of people worldwide.'
      }
    }
  ];

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
      setSpeechSynthesisSupported(true);
    } else {
      setSpeechSynthesisSupported(false);
    }
  }, []);

  // Handle audio when topic content changes
  useEffect(() => {
    if (audioEnabled && speechSynthesis) {
      if (isInPathMode && selectedPath) {
        // In path mode, speak the current lesson topic
        const pathTopics = getTopicsByPath(selectedPath);
        const currentTopic = pathTopics[currentLessonIndex];
        if (currentTopic) {
          speakText(getTopicContentForSpeech(currentTopic));
        }
      } else if (selectedTopic) {
        // In regular mode, speak the selected topic
        speakText(getTopicContentForSpeech(selectedTopic));
      }
    } else if (!audioEnabled && isSpeaking) {
      stopSpeaking();
    }
  }, [audioEnabled, selectedTopic, currentLessonIndex, isInPathMode, selectedPath]);

  const getTopicContentForSpeech = (topic: Topic): string => {
    const content = topic.content;
    let speechText = `${topic.title}. ${topic.description}. `;
    
    // Add lesson narrative
    if (content.lessonNarrative && content.lessonNarrative.length > 0) {
      speechText += content.lessonNarrative.join(' ');
    }
    
    return speechText;
  };

  const speakText = (text: string) => {
    if (!speechSynthesis || !text) return;

    // Stop any current speech
    if (isSpeaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Try to use a natural-sounding voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Natural') || voice.name.includes('Google') || voice.name.includes('Microsoft'))
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentUtterance(null);
    }
  };

  const toggleAudio = () => {
    const newAudioEnabled = !audioEnabled;
    setAudioEnabled(newAudioEnabled);

    if (!newAudioEnabled && isSpeaking) {
      stopSpeaking();
    } else if (newAudioEnabled && speechSynthesis && selectedTopic) {
      speakText(getTopicContentForSpeech(selectedTopic));
    }
  };

  const learningPaths: LearningPath[] = [
    {
      id: 'young-explorer',
      title: 'Young Space Explorer',
      description: 'Perfect for curious kids aged 6-10! Interactive lessons with story-based learning about the Sun, auroras, and space careers.',
      color: 'from-blue-400 to-purple-500',
      icon: <Rocket className="w-6 h-6" />,
      topics: ['sun-basics', 'auroras', 'magnetic-field', 'space-weather-careers'],
      ageGroup: '6-10 years'
    },
    {
      id: 'space-detective',
      title: 'Space Weather Detective',
      description: 'For young scientists aged 10-14! Comprehensive lessons with hands-on activities, real data analysis, and space weather investigations.',
      color: 'from-green-400 to-teal-500',
      icon: <Eye className="w-6 h-6" />,
      topics: ['sun-basics', 'solar-flares', 'auroras', 'space-weather-effects', 'understanding-live-data', 'space-weather-scales', 'solar-cycle'],
      ageGroup: '10-14 years'
    },
    {
      id: 'space-scientist',
      title: 'Future Space Scientist',
      description: 'Advanced learning for teens aged 14+! Complete curriculum with detailed objectives, technical vocabulary, and professional-level activities.',
      color: 'from-purple-400 to-pink-500',
      icon: <Brain className="w-6 h-6" />,
      topics: ['sun-basics', 'solar-flares', 'auroras', 'magnetic-field', 'space-weather-effects', 'cme', 'understanding-live-data', 'space-weather-scales', 'satellite-monitoring', 'solar-cycle', 'space-weather-prediction', 'climate-vs-weather', 'space-weather-careers'],
      ageGroup: '14+ years'
    },
    {
      id: 'data-analyst',
      title: 'Live Data Specialist',
      description: 'Master real-time space weather monitoring! Professional-level lessons with SOHO/ACE data analysis, forecasting techniques, and satellite operations.',
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
      
      // Search in learning objectives
      if (content.learningObjectives.some(obj => obj.toLowerCase().includes(searchTerm))) return true;
      
      // Search in key terms
      if (content.keyTerms.some(term => 
        term.term.toLowerCase().includes(searchTerm) || 
        term.definition.toLowerCase().includes(searchTerm)
      )) return true;
      
      // Search in lesson narrative
      if (content.lessonNarrative.some(paragraph => paragraph.toLowerCase().includes(searchTerm))) return true;
      
      // Search in activities
      if (content.activities.some(activity => 
        activity.title.toLowerCase().includes(searchTerm) ||
        activity.steps.some(step => step.toLowerCase().includes(searchTerm))
      )) return true;
      
      // Search in story elements
      if (content.learnItAsStory.scenario.toLowerCase().includes(searchTerm)) return true;
      if (content.learnItAsStory.storyElements.some(element => element.toLowerCase().includes(searchTerm))) return true;
      
      // Search in fun facts
      if (content.funFacts.some(fact => fact.toLowerCase().includes(searchTerm))) return true;
      
      // Search in real world example
      if (content.realWorldExample.toLowerCase().includes(searchTerm)) return true;

      return false;
    });

    setSearchResults(results);
  };  const handleSearch = (query: string) => {
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
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">13 Comprehensive Lessons</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Each with learning objectives, key terms, detailed narratives, hands-on activities, and story-based learning.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-800/50 to-teal-800/50 p-4 sm:p-6 lg:p-8 rounded-3xl backdrop-blur-sm border border-green-400/20">
                <div className="text-green-400 mb-3 sm:mb-4">
                  <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">4 Structured Learning Paths</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Age-appropriate progressions from Young Explorer (6-10) to Future Space Scientist (14+) and specialized Data Analyst track.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 p-4 sm:p-6 lg:p-8 rounded-3xl backdrop-blur-sm border border-purple-400/20">
                <div className="text-purple-400 mb-3 sm:mb-4">
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">Interactive Learning Features</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  📖 Learn It As Story scenarios, real-time data analysis, SOHO/ACE satellite exploration, and practical forecasting exercises.
                </p>
              </div>

              {/* Featured Topic */}
              <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-orange-800/30 to-red-800/30 p-4 sm:p-6 lg:p-8 rounded-3xl backdrop-blur-sm border border-orange-400/20">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                  <div className="text-orange-400 flex-shrink-0">
                    <Sun className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Start Your Educational Journey</h3>
                    <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-3">
                      Begin with "Our Dynamic Sun" - a comprehensive 30-minute lesson featuring learning objectives, 
                      key terminology, interactive activities, and immersive story-based scenarios.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg">4 Learning Objectives</span>
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-lg">7 Key Terms</span>
                      <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg">3 Hands-on Activities</span>
                      <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-lg">📖 Story-based Learning</span>
                    </div>
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

                    {/* Audio Controls */}
                    {speechSynthesisSupported && (
                      <div className="mb-6 p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Volume2 className="w-5 h-5 text-purple-400" />
                            <span className="text-purple-400 font-medium">Audio Narration</span>
                            {isSpeaking && (
                              <div className="flex items-center space-x-2 text-green-400">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm">Speaking...</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {audioEnabled && isSpeaking ? (
                              <button
                                onClick={stopSpeaking}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                title="Stop narration"
                              >
                                <Pause className="w-4 h-4 text-red-400" />
                              </button>
                            ) : (
                              <button
                                onClick={toggleAudio}
                                className={`p-2 rounded-lg transition-colors ${
                                  audioEnabled 
                                    ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400' 
                                    : 'bg-gray-600/20 hover:bg-gray-600/30 text-gray-400'
                                }`}
                                title={audioEnabled ? 'Disable audio narration' : 'Enable audio narration'}
                              >
                                {audioEnabled ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Click to enable audio narration of the lesson content
                        </p>
                      </div>
                    )}

                    <div className="space-y-8">
                      {/* Learning Objectives */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
                          <Target className="w-5 h-5 mr-2" />
                          Learning Objectives
                        </h3>
                        <ul className="space-y-2">
                          {selectedTopic.content.learningObjectives.map((objective, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <ChevronRight className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">
                                {searchQuery ? highlightSearchTerm(objective, searchQuery) : objective}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Terms */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center">
                          <Brain className="w-5 h-5 mr-2" />
                          Key Terms
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {selectedTopic.content.keyTerms.map((term, index) => (
                            <div key={index} className="bg-green-900/20 p-4 rounded-xl border border-green-400/20">
                              <h4 className="font-semibold text-green-300 mb-2">{term.term}</h4>
                              <p className="text-gray-300 text-sm">
                                {searchQuery ? highlightSearchTerm(term.definition, searchQuery) : term.definition}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lesson Narrative */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Lesson Narrative
                        </h3>
                        <div className="space-y-4">
                          {selectedTopic.content.lessonNarrative.map((paragraph, index) => (
                            <p key={index} className="text-gray-300 leading-relaxed">
                              {searchQuery ? highlightSearchTerm(paragraph, searchQuery) : paragraph}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Activities */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center">
                          <Activity className="w-5 h-5 mr-2" />
                          Activities
                        </h3>
                        <div className="space-y-6">
                          {selectedTopic.content.activities.map((activity, index) => (
                            <div key={index} className="bg-yellow-900/20 p-6 rounded-xl border border-yellow-400/20">
                              <h4 className="font-semibold text-yellow-300 mb-3 text-lg">{activity.title}</h4>
                              {activity.materials && (
                                <div className="mb-4">
                                  <h5 className="font-medium text-yellow-200 mb-2">Materials:</h5>
                                  <p className="text-gray-300 text-sm italic">{activity.materials}</p>
                                </div>
                              )}
                              <div>
                                <h5 className="font-medium text-yellow-200 mb-2">Steps:</h5>
                                <ol className="space-y-2">
                                  {activity.steps.map((step, stepIndex) => (
                                    <li key={stepIndex} className="flex items-start space-x-3">
                                      <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                        {stepIndex + 1}
                                      </span>
                                      <span className="text-gray-300 text-sm">
                                        {searchQuery ? highlightSearchTerm(step, searchQuery) : step}
                                      </span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Learn It As Story */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-pink-400 flex items-center">
                          📖 Learn It As Story
                        </h3>
                        <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 p-6 rounded-xl border border-pink-400/20">
                          <p className="text-gray-300 mb-4 italic">
                            {searchQuery ? highlightSearchTerm(selectedTopic.content.learnItAsStory.scenario, searchQuery) : selectedTopic.content.learnItAsStory.scenario}
                          </p>
                          <div className="space-y-3">
                            {selectedTopic.content.learnItAsStory.storyElements.map((element, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <Star className="w-4 h-4 text-pink-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">
                                  {searchQuery ? highlightSearchTerm(element, searchQuery) : element}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Fun Facts */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center">
                          <Lightbulb className="w-5 h-5 mr-2" />
                          Fun Facts
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedTopic.content.funFacts.map((fact, index) => (
                            <div key={index} className="bg-cyan-900/20 p-4 rounded-xl border border-cyan-400/20">
                              <p className="text-gray-300 text-sm">
                                {searchQuery ? highlightSearchTerm(fact, searchQuery) : fact}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Real World Example */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-orange-400 flex items-center">
                          <Eye className="w-5 h-5 mr-2" />
                          Real World Example
                        </h3>
                        <div className="bg-orange-900/20 p-6 rounded-xl border border-orange-400/20">
                          <p className="text-gray-300">
                            {searchQuery ? highlightSearchTerm(selectedTopic.content.realWorldExample, searchQuery) : selectedTopic.content.realWorldExample}
                          </p>
                        </div>
                      </div>

                      {/* Ask AI Expert */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center">
                          <Brain className="w-5 h-5 mr-2" />
                          Questions? Ask Our AI Space Weather Expert!
                        </h3>
                        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-400/20">
                          <p className="text-gray-300 mb-4">
                            Have questions about {selectedTopic.title.toLowerCase()}? Our AI expert is ready to help you understand space weather concepts, explain complex phenomena, and explore related topics in detail.
                          </p>
                          <button
                            onClick={() => {
                              // Navigate to AI chat with context about this topic
                              window.location.href = `/ask?topic=${encodeURIComponent(selectedTopic.title)}&context=${encodeURIComponent(`I'm learning about ${selectedTopic.title}: ${selectedTopic.description}`)}`;
                            }}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 text-white"
                          >
                            <Brain className="w-5 h-5" />
                            <span>Ask About {selectedTopic.title}</span>
                          </button>
                        </div>
                      </div>
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

                        {/* Audio Controls */}
                        {speechSynthesisSupported && (
                          <div className="mb-8 p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Volume2 className="w-5 h-5 text-purple-400" />
                                <span className="text-purple-400 font-medium">Audio Narration</span>
                                {isSpeaking && (
                                  <div className="flex items-center space-x-2 text-green-400">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm">Speaking...</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {audioEnabled && isSpeaking ? (
                                  <button
                                    onClick={stopSpeaking}
                                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                    title="Stop narration"
                                  >
                                    <Pause className="w-4 h-4 text-red-400" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={toggleAudio}
                                    className={`p-2 rounded-lg transition-colors ${
                                      audioEnabled 
                                        ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400' 
                                        : 'bg-gray-600/20 hover:bg-gray-600/30 text-gray-400'
                                    }`}
                                    title={audioEnabled ? 'Disable audio narration' : 'Enable audio narration'}
                                  >
                                    {audioEnabled ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Click to enable audio narration of the lesson content
                            </p>
                          </div>
                        )}

                        {/* Content Sections */}
                        <div className="space-y-8">
                          {/* Learning Objectives */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
                              <Target className="w-5 h-5 mr-2" />
                              Learning Objectives
                            </h4>
                            <ul className="space-y-2">
                              {currentTopic.content.learningObjectives.map((objective, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                  <ChevronRight className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-300">{objective}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Key Terms */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-green-400 flex items-center">
                              <Brain className="w-5 h-5 mr-2" />
                              Key Terms
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              {currentTopic.content.keyTerms.map((term, index) => (
                                <div key={index} className="bg-green-900/20 p-4 rounded-xl border border-green-400/20">
                                  <h5 className="font-semibold text-green-300 mb-2">{term.term}</h5>
                                  <p className="text-gray-300 text-sm">{term.definition}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Lesson Narrative */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-purple-400 flex items-center">
                              <BookOpen className="w-5 h-5 mr-2" />
                              Lesson Narrative
                            </h4>
                            <div className="space-y-4">
                              {currentTopic.content.lessonNarrative.map((paragraph, index) => (
                                <p key={index} className="text-gray-300 leading-relaxed">{paragraph}</p>
                              ))}
                            </div>
                          </div>

                          {/* Activities */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-yellow-400 flex items-center">
                              <Activity className="w-5 h-5 mr-2" />
                              Activities
                            </h4>
                            <div className="space-y-4">
                              {currentTopic.content.activities.map((activity, index) => (
                                <div key={index} className="bg-yellow-900/20 p-6 rounded-xl border border-yellow-400/20">
                                  <h5 className="font-semibold text-yellow-300 mb-3">{activity.title}</h5>
                                  {activity.materials && (
                                    <p className="text-gray-400 text-sm mb-3">
                                      <span className="font-medium">Materials:</span> {activity.materials}
                                    </p>
                                  )}
                                  <ol className="space-y-2">
                                    {activity.steps.map((step, stepIndex) => (
                                      <li key={stepIndex} className="flex items-start space-x-3">
                                        <span className="bg-yellow-500 text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                          {stepIndex + 1}
                                        </span>
                                        <span className="text-gray-300 text-sm">{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Learn It As Story */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-pink-400 flex items-center">
                              <BookOpen className="w-5 h-5 mr-2" />
                              📖 Learn It As Story
                            </h4>
                            <div className="bg-pink-900/20 p-6 rounded-xl border border-pink-400/20">
                              <p className="text-pink-200 font-medium mb-4 italic">{currentTopic.content.learnItAsStory.scenario}</p>
                              <div className="space-y-2">
                                {currentTopic.content.learnItAsStory.storyElements.map((element, index) => (
                                  <p key={index} className="text-gray-300 text-sm leading-relaxed pl-4 border-l-2 border-pink-400/30">
                                    {element}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Fun Facts */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-orange-400 flex items-center">
                              <Star className="w-5 h-5 mr-2" />
                              Fun Facts
                            </h4>
                            <div className="space-y-3">
                              {currentTopic.content.funFacts.map((fact, index) => (
                                <div key={index} className="bg-orange-900/20 p-4 rounded-xl border border-orange-400/20">
                                  <p className="text-gray-300">{fact}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Real World Example */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-cyan-400 flex items-center">
                              <Globe className="w-5 h-5 mr-2" />
                              Real World Example
                            </h4>
                            <div className="bg-cyan-900/20 p-6 rounded-xl border border-cyan-400/20">
                              <p className="text-gray-300 leading-relaxed">{currentTopic.content.realWorldExample}</p>
                            </div>
                          </div>

                          {/* Ask AI Expert */}
                          <div>
                            <h4 className="text-xl font-bold mb-4 text-purple-400 flex items-center">
                              <Brain className="w-5 h-5 mr-2" />
                              Questions? Ask Our AI Space Weather Expert!
                            </h4>
                            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-400/20">
                              <p className="text-gray-300 mb-4 leading-relaxed">
                                Have questions about {currentTopic.title.toLowerCase()}? Our AI expert is ready to help you understand space weather concepts, explain complex phenomena, and explore related topics in detail.
                              </p>
                              <button
                                onClick={() => {
                                  // Navigate to AI chat with context about this topic
                                  window.location.href = `/ask?topic=${encodeURIComponent(currentTopic.title)}&context=${encodeURIComponent(`I'm learning about ${currentTopic.title}: ${currentTopic.description}`)}`;
                                }}
                                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 text-white"
                              >
                                <Brain className="w-5 h-5" />
                                <span>Ask About {currentTopic.title}</span>
                              </button>
                            </div>
                          </div>
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
