import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  RotateCcw,
  Award,
  Target,
  Lightbulb,
  ArrowRight,
  Rocket,
  Activity
} from 'lucide-react';

interface PathRecommendationQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    value: string;
    weight: { [pathId: string]: number };
  }[];
}

interface PathRecommendationProps {
  onPathRecommendation: (pathId: string) => void;
  learningPaths: Array<{
    id: string;
    title: string;
    description: string;
    color: string;
    icon: React.ReactNode;
    ageGroup: string;
  }>;
}

export default function PathRecommendationQuiz({ onPathRecommendation, learningPaths }: PathRecommendationProps) {
  const [isQuizRevealed, setIsQuizRevealed] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [recommendedPath, setRecommendedPath] = useState<string | null>(null);

  const questions: PathRecommendationQuestion[] = [
    {
      id: 'age-experience',
      question: 'What best describes your age and experience level?',
      options: [
        {
          text: 'I\'m 6-10 years old and love space stories',
          value: 'young',
          weight: { 'young-explorer': 5, 'space-detective': 1, 'space-scientist': 0, 'data-analyst': 0 }
        },
        {
          text: 'I\'m 10-14 years old and enjoy science experiments',
          value: 'teen',
          weight: { 'young-explorer': 2, 'space-detective': 5, 'space-scientist': 2, 'data-analyst': 0 }
        },
        {
          text: 'I\'m 14+ years old and want detailed scientific knowledge',
          value: 'advanced',
          weight: { 'young-explorer': 0, 'space-detective': 2, 'space-scientist': 5, 'data-analyst': 3 }
        },
        {
          text: 'I\'m an adult/professional interested in technical data',
          value: 'professional',
          weight: { 'young-explorer': 0, 'space-detective': 0, 'space-scientist': 3, 'data-analyst': 5 }
        }
      ]
    },
    {
      id: 'learning-style',
      question: 'How do you prefer to learn?',
      options: [
        {
          text: 'Through stories and fun activities',
          value: 'stories',
          weight: { 'young-explorer': 4, 'space-detective': 3, 'space-scientist': 1, 'data-analyst': 0 }
        },
        {
          text: 'By doing experiments and investigations',
          value: 'hands-on',
          weight: { 'young-explorer': 2, 'space-detective': 4, 'space-scientist': 3, 'data-analyst': 2 }
        },
        {
          text: 'Through detailed explanations and theory',
          value: 'theoretical',
          weight: { 'young-explorer': 0, 'space-detective': 2, 'space-scientist': 4, 'data-analyst': 2 }
        },
        {
          text: 'By analyzing real data and making predictions',
          value: 'data-driven',
          weight: { 'young-explorer': 0, 'space-detective': 1, 'space-scientist': 2, 'data-analyst': 4 }
        }
      ]
    },
    {
      id: 'interest-focus',
      question: 'What aspect of space weather interests you most?',
      options: [
        {
          text: 'How the Sun affects Earth and creates beautiful auroras',
          value: 'phenomena',
          weight: { 'young-explorer': 4, 'space-detective': 3, 'space-scientist': 2, 'data-analyst': 1 }
        },
        {
          text: 'How space weather impacts technology and daily life',
          value: 'impacts',
          weight: { 'young-explorer': 2, 'space-detective': 4, 'space-scientist': 3, 'data-analyst': 2 }
        },
        {
          text: 'The scientific processes behind solar storms and magnetic fields',
          value: 'science',
          weight: { 'young-explorer': 1, 'space-detective': 2, 'space-scientist': 4, 'data-analyst': 2 }
        },
        {
          text: 'Monitoring and predicting space weather events',
          value: 'forecasting',
          weight: { 'young-explorer': 0, 'space-detective': 2, 'space-scientist': 3, 'data-analyst': 4 }
        }
      ]
    },
    {
      id: 'time-commitment',
      question: 'How much time do you want to spend learning?',
      options: [
        {
          text: 'Quick overview - I want the basics in a few lessons',
          value: 'quick',
          weight: { 'young-explorer': 4, 'space-detective': 2, 'space-scientist': 1, 'data-analyst': 1 }
        },
        {
          text: 'Moderate depth - Several lessons with activities',
          value: 'moderate',
          weight: { 'young-explorer': 2, 'space-detective': 4, 'space-scientist': 2, 'data-analyst': 2 }
        },
        {
          text: 'Comprehensive study - All topics in detail',
          value: 'comprehensive',
          weight: { 'young-explorer': 1, 'space-detective': 2, 'space-scientist': 4, 'data-analyst': 2 }
        },
        {
          text: 'Professional focus - Technical and data analysis topics',
          value: 'professional',
          weight: { 'young-explorer': 0, 'space-detective': 1, 'space-scientist': 2, 'data-analyst': 4 }
        }
      ]
    },
    {
      id: 'goal',
      question: 'What\'s your main goal?',
      options: [
        {
          text: 'Learn something cool about space for fun',
          value: 'fun',
          weight: { 'young-explorer': 4, 'space-detective': 2, 'space-scientist': 1, 'data-analyst': 0 }
        },
        {
          text: 'Complete a school project or assignment',
          value: 'school',
          weight: { 'young-explorer': 2, 'space-detective': 4, 'space-scientist': 3, 'data-analyst': 1 }
        },
        {
          text: 'Understand space weather for academic/career purposes',
          value: 'academic',
          weight: { 'young-explorer': 0, 'space-detective': 2, 'space-scientist': 4, 'data-analyst': 3 }
        },
        {
          text: 'Gain professional skills for work or research',
          value: 'professional',
          weight: { 'young-explorer': 0, 'space-detective': 0, 'space-scientist': 2, 'data-analyst': 4 }
        }
      ]
    }
  ];

  const handleAnswerSelect = (questionId: string, optionValue: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionValue }));
  };

  const calculateRecommendation = () => {
    const pathScores: { [pathId: string]: number } = {
      'young-explorer': 0,
      'space-detective': 0,
      'space-scientist': 0,
      'data-analyst': 0
    };

    // Calculate weighted scores based on answers
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const selectedOption = question.options.find(opt => opt.value === answer);
        if (selectedOption) {
          Object.entries(selectedOption.weight).forEach(([pathId, weight]) => {
            pathScores[pathId] += weight;
          });
        }
      }
    });

    // Find the path with the highest score
    const recommendedPathId = Object.entries(pathScores).reduce((a, b) => 
      pathScores[a[0]] > pathScores[b[0]] ? a : b
    )[0];

    setRecommendedPath(recommendedPathId);
    setShowResults(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateRecommendation();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setRecommendedPath(null);
  };

  const getRecommendedPath = () => {
    return learningPaths.find(path => path.id === recommendedPath);
  };

  const isCurrentQuestionAnswered = answers[questions[currentQuestionIndex]?.id];
  const allQuestionsAnswered = questions.every(q => answers[q.id]);

  return (
    <div className="mt-12">
      {/* Quiz Reveal Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => setIsQuizRevealed(!isQuizRevealed)}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Not Sure Where to Start?</h3>
                <p className="text-gray-300 text-sm">
                  Take our quick assessment to find your perfect learning path!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {showResults && recommendedPath && (
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-400">
                    Recommended!
                  </div>
                  <div className="text-xs text-gray-400">Path Found</div>
                </div>
              )}
              <motion.div
                animate={{ rotate: isQuizRevealed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-6 h-6 text-gray-300" />
              </motion.div>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Quiz Content */}
      <AnimatePresence>
        {isQuizRevealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-3xl">
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-3xl p-6">
                {!showResults ? (
                  // Quiz Questions
                  <>
                    {/* Quiz Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Target className="w-6 h-6 text-purple-400" />
                        <h3 className="text-2xl font-bold text-white">
                          Find Your Learning Path
                        </h3>
                      </div>
                      <button
                        onClick={resetQuiz}
                        className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                        title="Reset Quiz"
                      >
                        <RotateCcw className="w-4 h-4 text-gray-300" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm text-gray-400">
                          Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                      </div>
                      <div className="bg-gray-800 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` 
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Current Question */}
                    <motion.div
                      key={currentQuestionIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="mb-8"
                    >
                      <h4 className="text-xl font-semibold text-white mb-6">
                        {questions[currentQuestionIndex].question}
                      </h4>

                      <div className="space-y-3">
                        {questions[currentQuestionIndex].options.map((option, index) => {
                          const isSelected = answers[questions[currentQuestionIndex].id] === option.value;
                          
                          return (
                            <button
                              key={index}
                              onClick={() => handleAnswerSelect(questions[currentQuestionIndex].id, option.value)}
                              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                                isSelected
                                  ? 'bg-purple-900/50 border-purple-400/50 text-purple-200'
                                  : 'bg-gray-700/50 border-gray-600/30 hover:bg-gray-600/50 hover:border-gray-500/50 text-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-sm font-bold ${
                                  isSelected ? 'bg-purple-500 border-purple-400' : 'border-gray-500'
                                }`}>
                                  {String.fromCharCode(65 + index)}
                                </span>
                                <span>{option.text}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                          currentQuestionIndex === 0
                            ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-700/50 hover:bg-gray-600/50 text-white'
                        }`}
                      >
                        Previous
                      </button>

                      <button
                        onClick={nextQuestion}
                        disabled={!isCurrentQuestionAnswered}
                        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 ${
                          !isCurrentQuestionAnswered
                            ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        }`}
                      >
                        <span>{currentQuestionIndex === questions.length - 1 ? 'Get My Path' : 'Next'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  // Results
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <Award className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                    
                    <h3 className="text-3xl font-bold mb-4 text-white">
                      Perfect Match Found!
                    </h3>
                    
                    {recommendedPath && getRecommendedPath() && (
                      <div className="mb-8">
                        <div className={`bg-gradient-to-r ${getRecommendedPath()!.color} p-1 rounded-2xl mb-4`}>
                          <div className="bg-gray-900/80 rounded-2xl p-6">
                            <div className="flex items-center justify-center space-x-4 mb-4">
                              <div className={`p-3 rounded-xl bg-gradient-to-r ${getRecommendedPath()!.color}`}>
                                {getRecommendedPath()!.icon}
                              </div>
                              <div>
                                <h4 className="text-2xl font-bold text-white">
                                  {getRecommendedPath()!.title}
                                </h4>
                                <p className="text-gray-300 text-sm">
                                  {getRecommendedPath()!.ageGroup}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-300 text-center">
                              {getRecommendedPath()!.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button
                            onClick={() => onPathRecommendation(recommendedPath)}
                            className={`bg-gradient-to-r ${getRecommendedPath()!.color} px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center space-x-2`}
                          >
                            <Rocket className="w-5 h-5" />
                            <span>Start This Path</span>
                          </button>
                          
                          <button
                            onClick={resetQuiz}
                            className="bg-gray-700/50 hover:bg-gray-600/50 px-6 py-3 rounded-xl font-bold transition-all duration-300 text-white"
                          >
                            Take Quiz Again
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-gray-400 text-sm">
                      Don't agree with our recommendation? Feel free to explore any of the other learning paths above!
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}