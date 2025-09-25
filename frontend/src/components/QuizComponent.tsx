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
  Target
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface QuizProps {
  questions: QuizQuestion[];
  topicTitle: string;
  topicColor: string;
}

interface QuestionState {
  selectedAnswer: number | null;
  isAnswered: boolean;
  showExplanation: boolean;
}

export default function QuizComponent({ questions, topicTitle, topicColor }: QuizProps) {
  const [isQuizRevealed, setIsQuizRevealed] = useState(false);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(
    questions.map(() => ({
      selectedAnswer: null,
      isAnswered: false,
      showExplanation: false
    }))
  );

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newStates = [...questionStates];
    newStates[questionIndex] = {
      ...newStates[questionIndex],
      selectedAnswer: answerIndex,
      isAnswered: true
    };
    setQuestionStates(newStates);
  };

  const toggleExplanation = (questionIndex: number) => {
    const newStates = [...questionStates];
    newStates[questionIndex] = {
      ...newStates[questionIndex],
      showExplanation: !newStates[questionIndex].showExplanation
    };
    setQuestionStates(newStates);
  };

  const resetQuiz = () => {
    setQuestionStates(
      questions.map(() => ({
        selectedAnswer: null,
        isAnswered: false,
        showExplanation: false
      }))
    );
  };

  const getScore = () => {
    const answeredQuestions = questionStates.filter(state => state.isAnswered);
    const correctAnswers = questionStates.filter(
      (state, index) => state.isAnswered && state.selectedAnswer === questions[index].correctAnswer
    );
    return {
      correct: correctAnswers.length,
      total: answeredQuestions.length,
      allAnswered: answeredQuestions.length === questions.length
    };
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-900/20 text-green-300 border-green-400/20';
      case 'medium': return 'bg-yellow-900/20 text-yellow-300 border-yellow-400/20';
      case 'hard': return 'bg-red-900/20 text-red-300 border-red-400/20';
      default: return 'bg-blue-900/20 text-blue-300 border-blue-400/20';
    }
  };

  const score = getScore();

  return (
    <div>
      {/* Quiz Reveal Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => setIsQuizRevealed(!isQuizRevealed)}
          className={`w-full bg-gradient-to-r ${topicColor} p-1 rounded-2xl transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${topicColor}`}>
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Test Your Knowledge</h3>
                <p className="text-gray-300 text-sm">
                  Ready to challenge yourself? Take the {topicTitle} quiz!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {score.allAnswered && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    {score.correct}/{score.total}
                  </div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
              )}
              <motion.div
                animate={{ rotate: isQuizRevealed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Target className="w-6 h-6 text-gray-300" />
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
            <div className={`bg-gradient-to-r ${topicColor} p-1 rounded-3xl`}>
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-3xl p-6">
                {/* Quiz Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-6 h-6 text-purple-400" />
                    <h3 className="text-2xl font-bold text-white">
                      {topicTitle} Assessment
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    {score.allAnswered && (
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <span className="text-lg font-bold">
                          {Math.round((score.correct / score.total) * 100)}%
                        </span>
                      </div>
                    )}
                    <button
                      onClick={resetQuiz}
                      className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                      title="Reset Quiz"
                    >
                      <RotateCcw className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm text-gray-400">
                      {score.total}/{questions.length} answered
                    </span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(score.total / questions.length) * 100}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                  {questions.map((question, questionIndex) => {
                    const questionState = questionStates[questionIndex];
                    const isCorrect = questionState.selectedAnswer === question.correctAnswer;
                    
                    return (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: questionIndex * 0.1 }}
                        className="bg-gray-800/50 rounded-2xl p-6 border border-gray-600/30"
                      >
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                {questionIndex + 1}
                              </span>
                              {question.difficulty && (
                                <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(question.difficulty)}`}>
                                  {question.difficulty}
                                </span>
                              )}
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-4">
                              {question.question}
                            </h4>
                          </div>
                          {questionState.isAnswered && (
                            <div className="ml-4">
                              {isCorrect ? (
                                <CheckCircle className="w-6 h-6 text-green-400" />
                              ) : (
                                <XCircle className="w-6 h-6 text-red-400" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-4">
                          {question.options.map((option, optionIndex) => {
                            const isSelected = questionState.selectedAnswer === optionIndex;
                            const isCorrectOption = optionIndex === question.correctAnswer;
                            const showCorrect = questionState.isAnswered;
                            
                            let optionClass = "w-full text-left p-4 rounded-xl border transition-all duration-300 ";
                            
                            if (!questionState.isAnswered) {
                              optionClass += "bg-gray-700/50 border-gray-600/30 hover:bg-gray-600/50 hover:border-gray-500/50";
                            } else {
                              if (isSelected && isCorrect) {
                                optionClass += "bg-green-900/30 border-green-400/50 text-green-300";
                              } else if (isSelected && !isCorrect) {
                                optionClass += "bg-red-900/30 border-red-400/50 text-red-300";
                              } else if (isCorrectOption) {
                                optionClass += "bg-green-900/20 border-green-400/30 text-green-300";
                              } else {
                                optionClass += "bg-gray-700/30 border-gray-600/30 text-gray-400";
                              }
                            }

                            return (
                              <button
                                key={optionIndex}
                                onClick={() => !questionState.isAnswered && handleAnswerSelect(questionIndex, optionIndex)}
                                disabled={questionState.isAnswered}
                                className={optionClass}
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="w-6 h-6 rounded-full border flex items-center justify-center text-sm font-bold">
                                    {String.fromCharCode(65 + optionIndex)}
                                  </span>
                                  <span>{option}</span>
                                  {showCorrect && isCorrectOption && (
                                    <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Feedback */}
                        {questionState.isAnswered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border ${
                              isCorrect 
                                ? 'bg-green-900/20 border-green-400/30' 
                                : 'bg-red-900/20 border-red-400/30'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              {isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                              )}
                              <span className={`font-semibold ${
                                isCorrect ? 'text-green-300' : 'text-red-300'
                              }`}>
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                              </span>
                            </div>
                            
                            {/* Explanation Toggle */}
                            <button
                              onClick={() => toggleExplanation(questionIndex)}
                              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {questionState.showExplanation ? (
                                <>
                                  <EyeOff className="w-4 h-4" />
                                  <span className="text-sm">Hide explanation</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4" />
                                  <span className="text-sm">Show explanation</span>
                                </>
                              )}
                            </button>

                            {/* Explanation */}
                            <AnimatePresence>
                              {questionState.showExplanation && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600/30 overflow-hidden"
                                >
                                  <p className="text-gray-300 text-sm">
                                    {question.explanation}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Final Score */}
                {score.allAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-400/30"
                  >
                    <div className="text-center">
                      <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                      <p className="text-xl text-purple-300 mb-2">
                        Your Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                      </p>
                      <p className="text-gray-300">
                        {score.correct === score.total 
                          ? "Perfect score! You've mastered this topic! 🎉" 
                          : score.correct / score.total >= 0.8 
                          ? "Great job! You have a strong understanding! 👏"
                          : score.correct / score.total >= 0.6
                          ? "Good work! Review the explanations to improve further. 📚"
                          : "Keep studying! Review the lesson content and try again. 💪"
                        }
                      </p>
                    </div>
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