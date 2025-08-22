'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  Globe, 
  Clock, 
  Brain, 
  Users, 
  Heart, 
  Sparkles, 
  Star,
  Sun,
  Satellite,
  Shield,
  MessageCircle,
  BookOpen,
  Headphones,
  Gamepad2,
  Eye,
  Wifi,
  Award,
  ExternalLink,
  Mail,
  Facebook,
  MessageSquare,
  Phone
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Real-Time AI Narratives",
      description: "Harnessing live feeds from NASA DONKI and NOAA SWPC, our AI engine crafts personalized stories that shift with the Sun's activity—whether you're a farmer tracking GPS accuracy, a pilot navigating radio blackouts, an astronaut safeguarding satellites, a power grid operator monitoring geomagnetic risks, or simply a curious member of the public."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Immersive 3D Visualizations",
      description: "Step into our interactive solar system built with Three.js and React Three Fiber. Rotate the Sun, zoom in on Earth's magnetosphere, and watch particle streams dance in real time. Every animation brings you closer to the dynamic forces at play between our star and planet."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time-Travel Through History",
      description: "Experience history's most dramatic space weather events from first-hand perspectives: Carrington Event (1859), Quebec Blackout (1989), Halloween Storms (2003), and more."
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Ask Our AI Space Weather Expert",
      description: "Can't find the answer on the page? Chat with our friendly AI: ask why auroras glow different colors, how solar flares form, or what risks current storms pose to your devices."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Educational & Accessible by Design",
      description: "Multimodal learning with text, audio narration, animations, quizzes, and mini-games. Content tailored for ages 8–10, 11–13, 14–17 with diverse narrators and inclusive features."
    }
  ];

  const historicalEvents = [
    {
      year: "1859",
      event: "Carrington Event",
      description: "Telegraph wires ablaze under the charge of the strongest geomagnetic storm ever recorded.",
      icon: <Zap className="w-6 h-6" />
    },
    {
      year: "1989",
      event: "Quebec Blackout",
      description: "A nine-hour power outage that taught us how intertwined our grids are with the cosmos.",
      icon: <Shield className="w-6 h-6" />
    },
    {
      year: "2003",
      event: "Halloween Storms",
      description: "A series of solar assaults that disrupted satellites, flights, and even Mars missions.",
      icon: <Satellite className="w-6 h-6" />
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Data Collection",
      description: "Live polling of NASA DONKI and NOAA SWPC every 15 minutes.",
      icon: <Satellite className="w-8 h-8" />
    },
    {
      step: "02", 
      title: "AI Generation",
      description: "Space weather conditions feed dynamic prompts into AI, producing age-appropriate narratives and speech synthesis.",
      icon: <Brain className="w-8 h-8" />
    },
    {
      step: "03",
      title: "Visualization",
      description: "Stories come alive in 3D and audio. Particle effects, global maps, and interactive timelines update in real time.",
      icon: <Star className="w-8 h-8" />
    }
  ];

  const learningFeatures = [
    { icon: <BookOpen className="w-6 h-6" />, label: "Text Stories" },
    { icon: <Headphones className="w-6 h-6" />, label: "Audio Narration" },
    { icon: <Star className="w-6 h-6" />, label: "Animations" },
    { icon: <Gamepad2 className="w-6 h-6" />, label: "Mini-Games" },
    { icon: <Eye className="w-6 h-6" />, label: "High Contrast" },
    { icon: <Wifi className="w-6 h-6" />, label: "Offline Mode" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-12 px-4"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div variants={fadeInUp} className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                About SolarTales
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover the Sun's story and its impact on our world through SolarTales—a revolutionary platform that turns space weather data into immersive, AI-powered narratives and 3D experiences.
            </p>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="flex justify-center">
            <div className="glass p-8 rounded-2xl">
              <motion.img 
                src="/logo.png" 
                alt="Solar Tales Logo" 
                className="w-24 h-24 mx-auto mb-4 object-contain drop-shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1],
                  filter: [
                    "drop-shadow(0 0 0px rgba(59, 130, 246, 0.5))",
                    "drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))",
                    "drop-shadow(0 0 0px rgba(59, 130, 246, 0.5))"
                  ]
                }}
                transition={{ 
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  filter: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              <p className="text-gray-300 text-lg">Making space weather as engaging as your favorite bedtime story</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Vision Section */}
      <motion.section 
        className="py-12 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Our Vision</h2>
            <div className="glass p-8 rounded-2xl">
              <Heart className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                SolarTales is driven by a single goal: to spark curiosity and deepen understanding of space weather by making complex science as engaging and accessible as your favorite bedtime story. We believe every solar flare, coronal mass ejection, and geomagnetic storm carries a tale worth telling.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* What We Offer Section */}
      <motion.section 
        className="py-12 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">What We Offer</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Historical Events Section */}
      <motion.section 
        className="py-12 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Historic Space Weather Events</h2>
            <p className="text-xl text-gray-300">Experience history's most dramatic space weather events</p>
          </motion.div>
          
          <div className="space-y-8">
            {historicalEvents.map((event, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass p-6 rounded-xl flex items-center space-x-6 hover:scale-105 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white">
                    {event.icon}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-3xl font-bold text-orange-400">{event.year}</span>
                    <h3 className="text-2xl font-semibold text-white">{event.event}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="py-12 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">How It Works</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass p-8 rounded-xl text-center hover:scale-105 transition-all duration-300"
              >
                <div className="text-6xl font-bold text-purple-400 mb-4">{step.step}</div>
                <div className="text-blue-400 mb-4 flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Learning Features Section */}
      <motion.section 
        className="py-12 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Multimodal Learning Experience</h2>
            <p className="text-xl text-gray-300">Designed for accessibility and engagement across all learning styles</p>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="glass p-8 rounded-2xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {learningFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                    {feature.icon}
                  </div>
                  <p className="text-sm text-gray-300 font-medium">{feature.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">Reading Levels & Character Diversity:</strong> Tailored content for ages 8–10, 11–13, 14–17—told by narrators from diverse backgrounds.<br/>
                <strong className="text-white">Inclusive Features:</strong> Adjustable fonts, high-contrast themes, screen-reader support, and offline PWA mode ensure no one is left out.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="py-12 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Meet the Visionaries</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp} className="glass p-8 rounded-xl text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-400">
                <img 
                  src="/Tanvir.jpg" 
                  alt="Md. Tanvir Rahman" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Md. Tanvir Rahman</h3>
              <p className="text-lg font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mb-2">Project Founder & Lead Developer</p>
              <p className="text-blue-400 font-semibold mb-6">Team Leader, The White Hole</p>
              
              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://linktr.ee/tanvircoded"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Portfolio</span>
                </a>
                <a 
                  href="mailto:iamtanvir75@gmail.com"
                  className="flex items-center space-x-2 border border-blue-400 text-blue-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="glass p-8 rounded-xl text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-400 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500">
                <img 
                  src="/TWH-logo.png" 
                  alt="The White Hole Team" 
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Design & Innovation Collective</h3>
              <p className="text-lg font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-violet-300 bg-clip-text text-transparent mb-2">The White Hole Team</p>
              <p className="text-purple-400 font-semibold mb-6">Bringing cosmic stories to life through technology</p>
              
              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://twhinnovators24.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
                <a 
                  href="https://www.facebook.com/twhinnovator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 border border-purple-400 text-purple-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-400 hover:text-white transition-all duration-300"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Partners & Acknowledgments */}
      <motion.section 
        className="py-12 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Partners & Acknowledgments</h2>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="glass p-8 rounded-2xl text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
              <div className="flex items-center space-x-3">
                <Award className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-semibold text-white">NASA DONKI</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-8 h-8 text-green-400" />
                <span className="text-xl font-semibold text-white">NOAA SWPC</span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Special thanks to <strong className="text-white">NASA DONKI</strong> and <strong className="text-white">NOAA SWPC</strong> for providing open space weather data that makes SolarTales possible. Their commitment to open science enables us to bring the wonders of space weather to audiences worldwide.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Feedback & Contact Section */}
      <motion.section 
        className="py-12 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Get Involved</h2>
            <p className="text-xl text-gray-300">Help us improve SolarTales and stay connected</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feedback Card */}
            <motion.div variants={fadeInUp} className="glass p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Share Your Feedback</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your suggestions help us improve Solar Tales and make it better for everyone. Share your ideas, report issues, or suggest new features.
              </p>
              <a 
                href="https://forms.gle/jeGughWsRJdDaHG2A"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Give Feedback</span>
              </a>
            </motion.div>

            {/* Contact Card */}
            <motion.div variants={fadeInUp} className="glass p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Have questions about Solar Tales? Want to collaborate or learn more? Get in touch with us directly via WhatsApp.
              </p>
              <a 
                href="https://wa.me/8801866659407"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 rounded-lg text-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                <span>Contact on WhatsApp</span>
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-12 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeInUp} className="glass p-8 rounded-2xl">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Explore the Solar System?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of space enthusiasts discovering the Sun's impact on our world through immersive storytelling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/stories" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
              </a>
              <a 
                href="/ask" 
                className="border border-blue-400 text-blue-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300"
              >
                Ask Our AI Expert
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
