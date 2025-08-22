'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, Sparkles, MessageCircle, Brain, Lightbulb } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  followUp?: string;
  interestingFact?: string;
  recommendation?: {
    title: string;
    link: string;
  };
}

interface SuggestedPrompt {
  id: string;
  text: string;
  icon: React.ReactNode;
}

interface InterestingFact {
  id: string;
  fact: string;
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: '1',
    text: 'What makes the Northern Lights dance?',
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: '2',
    text: 'Could a solar storm knock out my phone?',
    icon: <Lightbulb className="w-4 h-4" />
  },
  {
    id: '3',
    text: 'Tell me about the biggest solar storm ever!',
    icon: <Brain className="w-4 h-4" />
  },
  {
    id: '4',
    text: 'How do astronauts stay safe from space weather?',
    icon: <MessageCircle className="w-4 h-4" />
  },
  {
    id: '5',
    text: 'Can animals sense space weather?',
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: '6',
    text: 'What does space weather sound like?',
    icon: <Lightbulb className="w-4 h-4" />
  }
];

const interestingFacts: InterestingFact[] = [
  {
    id: '1',
    fact: 'A single solar flare can release energy equal to 100 million nuclear bombs! 💥'
  },
  {
    id: '2',
    fact: 'Auroras make crackling sounds that some people can hear! 🎵'
  },
  {
    id: '3',
    fact: 'Solar storms can make GPS think you\'re in a different location! 📍'
  },
  {
    id: '4',
    fact: 'The Sun shoots out particles so fast they reach Earth in just 8 minutes! ⚡'
  },
  {
    id: '5',
    fact: 'Some birds and whales get confused during geomagnetic storms! 🐋'
  },
  {
    id: '6',
    fact: 'Jupiter\'s auroras are 100 times brighter than Earth\'s! ✨'
  },
  {
    id: '7',
    fact: 'Solar storms can make the Northern Lights appear as far south as Florida! 🌴'
  },
  {
    id: '8',
    fact: 'The International Space Station has a special "storm shelter" room! 🚀'
  }
];

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null);
  const [rateLimitReset, setRateLimitReset] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Rotate interesting facts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % interestingFacts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: "Hey there, space explorer! 🚀 I'm your AI StoryGuide, and I'm super excited to chat with you about the amazing world of space weather! Ask me anything about solar flares, auroras, or how the Sun affects Earth. I love sharing cool space facts and stories!",
        timestamp: new Date(),
        followUp: "What space weather mystery would you like to solve first?",
        interestingFact: "Did you know the Sun is so powerful that it could melt a penny from 90 million miles away? 🌞"
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputText.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: text,
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        }),
      });

      // Update rate limit info from headers
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const reset = response.headers.get('X-RateLimit-Reset');
      if (remaining) setRateLimitRemaining(parseInt(remaining));
      if (reset) setRateLimitReset(parseInt(reset));

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json();
          setError(`Rate limit exceeded. Please wait ${errorData.retryAfter} seconds before asking another question.`);
          return;
        }
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setError(null);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.answer,
        timestamp: new Date(),
        followUp: data.followUp,
        interestingFact: data.interestingFact,
        recommendation: data.recommendation
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setError('Having trouble connecting. Please try again in a moment.');
      
      // Fallback response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting right now, but I'd love to help! Space weather is fascinating - it includes solar flares, geomagnetic storms, and cosmic rays from our Sun that can affect Earth in amazing ways!",
        timestamp: new Date(),
        followUp: "Would you like to try asking me something else?",
        interestingFact: "Solar flares can reach temperatures of 50 million degrees Celsius!"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakMessage = (content: string) => {
    if (!speechSynthesis) return;

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  // Helper function to parse follow-up questions with multiple options
  const parseFollowUpOptions = (followUp: string) => {
    // Check if it's a question with multiple options separated by commas, "or", or hyphens
    const patterns = [
      /(.+?)\s*-\s*([^,]+(?:,\s*[^,]+)*(?:\s+or\s+[^,]+)?)\?*$/,  // "Question - option1, option2, or option3"
      /(.+?)\s*:\s*([^,]+(?:,\s*[^,]+)*(?:\s+or\s+[^,]+)?)\?*$/,  // "Question: option1, option2, or option3"
      /(.+?)\s*\?\s*([^,]+(?:,\s*[^,]+)*(?:\s+or\s+[^,]+)?)$/     // "Question? option1, option2, or option3"
    ];

    for (const pattern of patterns) {
      const match = followUp.match(pattern);
      if (match) {
        const question = match[1].trim();
        const optionsText = match[2].trim();
        
        // Split options by comma and "or"
        const options = optionsText
          .split(/,|\s+or\s+/)
          .map(opt => opt.trim())
          .filter(opt => opt.length > 0);
        
        if (options.length > 1) {
          return { question, options };
        }
      }
    }
    
    return null;
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputText(prompt);
    handleSendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              Ask SolarTales
            </h1>
            <p className="text-xl text-purple-300">
              Chat with our AI StoryGuide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Window */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-purple-500/20 shadow-2xl"
              >
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${
                          message.type === 'user' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-slate-700 text-gray-100'
                        } rounded-2xl px-4 py-3 shadow-lg`}>
                          {message.type === 'ai' && (
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-white/10 backdrop-blur-sm border border-purple-400/30">
                                <img 
                                  src="/logo.png" 
                                  alt="SolarTales AI" 
                                  className="w-4 h-4 object-contain"
                                />
                              </div>
                              <span className="text-xs text-purple-300 font-medium">AI StoryGuide</span>
                              <button
                                onClick={() => speakMessage(message.content)}
                                className="ml-auto p-1 hover:bg-slate-600 rounded"
                                title="Listen to response"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          
                          <p className="text-sm">{message.content}</p>
                          
                          {message.followUp && (
                            <div className="mt-3 p-2 bg-slate-600/50 rounded-lg border border-purple-400/30">
                              <p className="text-xs text-purple-300 font-medium mb-2 flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Follow-up:
                              </p>
                              {(() => {
                                const parsedOptions = parseFollowUpOptions(message.followUp!);
                                if (parsedOptions) {
                                  return (
                                    <div>
                                      <p className="text-xs text-gray-300 mb-2">{parsedOptions.question}</p>
                                      <div className="flex flex-wrap gap-2">
                                        {parsedOptions.options.map((option, index) => (
                                          <button
                                            key={index}
                                            onClick={() => handleSuggestedPrompt(`Tell me about ${option}`)}
                                            className="text-xs px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white transition-all duration-200 rounded-full border border-purple-400/50 hover:border-purple-300 hover:scale-105"
                                            title={`Learn about ${option}`}
                                          >
                                            {option}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <button
                                      onClick={() => handleSuggestedPrompt(message.followUp!)}
                                      className="text-xs text-left w-full text-purple-200 hover:text-white transition-colors cursor-pointer bg-purple-600/20 hover:bg-purple-600/40 p-2 rounded border border-purple-400/50 hover:border-purple-300"
                                      title="Click to ask this question"
                                    >
                                      💬 {message.followUp}
                                    </button>
                                  );
                                }
                              })()}
                            </div>
                          )}
                          
                          {message.interestingFact && (
                            <div className="mt-3 p-2 bg-blue-600/20 rounded-lg border border-blue-400/30">
                              <p className="text-xs text-blue-300 font-medium mb-1 flex items-center">
                                <Lightbulb className="w-3 h-3 mr-1" />
                                Did you know?
                              </p>
                              <button
                                onClick={() => handleSuggestedPrompt(`Tell me more about: ${message.interestingFact}`)}
                                className="text-xs text-left w-full text-blue-200 hover:text-white transition-colors cursor-pointer bg-blue-600/20 hover:bg-blue-600/40 p-2 rounded border border-blue-400/50 hover:border-blue-300"
                                title="Click to learn more about this fact"
                              >
                                🔍 {message.interestingFact}
                              </button>
                            </div>
                          )}
                          
                          {message.recommendation && (
                            <div className="mt-3 p-2 bg-green-600/20 rounded-lg">
                              <p className="text-xs text-green-300 font-medium mb-1">📖 Recommended:</p>
                              <button
                                onClick={() => window.location.href = message.recommendation!.link}
                                className="text-xs text-green-300 hover:text-green-200 underline"
                              >
                                {message.recommendation.title}
                              </button>
                            </div>
                          )}
                          
                          <span className="text-xs opacity-50 mt-2 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-slate-700 rounded-2xl px-4 py-3 max-w-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-purple-400/30">
                            <img 
                              src="/logo.png" 
                              alt="SolarTales AI" 
                              className="w-4 h-4 object-contain animate-pulse"
                            />
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-purple-500/20 p-4">
                  {error && (
                    <div className="mb-3 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
                      {error}
                    </div>
                  )}
                  
                  {rateLimitRemaining !== null && rateLimitRemaining <= 3 && (
                    <div className="mb-3 p-2 bg-orange-900/50 border border-orange-500/50 rounded-lg text-orange-200 text-xs">
                      Rate limit: {rateLimitRemaining} questions remaining this minute
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask me anything about space weather or your story…"
                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleVoiceInput}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                          isListening ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-purple-400'
                        }`}
                        title={isListening ? 'Stop listening' : 'Voice input'}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim() || isLoading}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Suggested Prompts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-purple-500/20 p-4"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
                  Try asking:
                  <span className="text-xs text-purple-300 ml-2">(Click to send)</span>
                </h3>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handleSuggestedPrompt(prompt.text)}
                      className="w-full text-left p-3 bg-slate-700/50 hover:bg-purple-600/30 rounded-lg transition-all duration-300 group border border-transparent hover:border-purple-400/50"
                      title="Click to ask this question"
                    >
                      <div className="flex items-center text-sm text-gray-300 group-hover:text-white transition-colors">
                        <span className="text-purple-400 mr-2 group-hover:scale-110 transition-transform">{prompt.icon}</span>
                        💬 {prompt.text}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Interesting Facts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-purple-500/20 p-4"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                  Did you know?
                  <span className="text-xs text-yellow-300 ml-2">(Click for more)</span>
                </h3>
                <AnimatePresence mode="wait">
                  <motion.button
                    key={currentFactIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => handleSuggestedPrompt(`Tell me more about: ${interestingFacts[currentFactIndex].fact}`)}
                    className="w-full text-left p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 border border-blue-400/20 hover:border-blue-400/40"
                    title="Click to learn more about this fact"
                  >
                    <p className="text-sm text-gray-300 hover:text-white transition-colors">
                      🔍 {interestingFacts[currentFactIndex].fact}
                    </p>
                  </motion.button>
                </AnimatePresence>
                <div className="flex justify-center mt-3 space-x-1">
                  {interestingFacts.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentFactIndex ? 'bg-purple-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
