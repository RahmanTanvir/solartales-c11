// Background Story Control Panel
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBackgroundStories } from '@/hooks/useBackgroundStories';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Clock, 
  Target, 
  Zap,
  BarChart3,
  CheckCircle
} from 'lucide-react';

export function BackgroundStoryControlPanel() {
  const {
    status,
    config,
    startGeneration,
    stopGeneration,
    triggerGeneration,
    updateConfiguration,
    formatTimeRemaining,
    canGenerateMore,
    getGenerationProgress,
    timeUntilNext
  } = useBackgroundStories();

  const [showSettings, setShowSettings] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);

  const handleConfigUpdate = () => {
    updateConfiguration(tempConfig);
    setShowSettings(false);
  };

  const progressPercent = getGenerationProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${status.isRunning ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Background Story Generator</h3>
            <p className="text-sm text-gray-400">
              {status.isRunning ? 'Active' : 'Stopped'} • 
              {status.todayStoriesCount}/{config.maxStoriesPerDay} stories today
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          {status.isRunning ? (
            <button
              onClick={stopGeneration}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4" />
              Stop
            </button>
          ) : (
            <button
              onClick={startGeneration}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          )}
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{status.todayStoriesCount}</div>
          <div className="text-sm text-gray-400">Generated Today</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {status.isRunning ? formatTimeRemaining(timeUntilNext) : '--'}
          </div>
          <div className="text-sm text-gray-400">Next Generation</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Math.floor(config.generationInterval / (1000 * 60))}m
          </div>
          <div className="text-sm text-gray-400">Interval</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${status.isGenerating ? 'text-yellow-400' : 'text-gray-400'}`}>
            {status.isGenerating ? '●' : '○'}
          </div>
          <div className="text-sm text-gray-400">
            {status.isGenerating ? 'Generating' : 'Idle'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Daily Progress</span>
          <span className="text-sm text-gray-400">{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              progressPercent >= 100 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          onClick={triggerGeneration}
          disabled={status.isGenerating || !canGenerateMore()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 disabled:opacity-50 text-white rounded-lg transition-colors flex-1"
        >
          <Zap className="w-4 h-4" />
          Generate Now
        </button>
        
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          onClick={() => window.location.href = '/stories'}
        >
          <BarChart3 className="w-4 h-4" />
          View Stories
        </button>
      </div>

      {!canGenerateMore() && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            Daily limit reached. Generation will resume tomorrow.
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
        >
          <h4 className="text-lg font-semibold mb-4">Generation Settings</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Stories per Day</label>
              <input
                type="number"
                min="1"
                max="50"
                value={tempConfig.maxStoriesPerDay}
                onChange={(e) => setTempConfig({
                  ...tempConfig,
                  maxStoriesPerDay: parseInt(e.target.value) || 10
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Generation Interval (minutes)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={Math.floor(tempConfig.generationInterval / (1000 * 60))}
                onChange={(e) => setTempConfig({
                  ...tempConfig,
                  generationInterval: (parseInt(e.target.value) || 30) * 60 * 1000
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Gap (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={Math.floor(tempConfig.minStoryGap / (1000 * 60))}
                onChange={(e) => setTempConfig({
                  ...tempConfig,
                  minStoryGap: (parseInt(e.target.value) || 10) * 60 * 1000
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfigUpdate}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Save Settings
              </button>
              <button
                onClick={() => {
                  setTempConfig(config);
                  setShowSettings(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
