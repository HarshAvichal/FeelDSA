import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight,
  BarChart3,
  List,
  Target,
  TrendingUp,
  Clock,
  Zap,
  Info
} from 'lucide-react';

const EnhancedSortingVisualizer = ({ 
  topic, 
  arrayState, 
  currentStep, 
  totalSteps, 
  isPlaying, 
  onPlayPause, 
  onReset, 
  onPrevious, 
  onNext,
  performanceMetrics = {},
  viewMode = 'array',
  comparisonData = null,
  onViewModeChange
}) => {
  console.log('[Visualizer] performanceMetrics:', performanceMetrics);
  const [showMetrics, setShowMetrics] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  // Animation variants for Framer Motion
  const comparisonVariant = {
    initial: { scale: 1 },
    animate: { scale: 1.15, transition: { yoyo: 2, duration: 0.25 } },
    exit: { scale: 1 }
  };
  const swapVariant = {
    initial: { scale: 1, backgroundColor: '#22c55e' }, // green
    animate: { scale: 1.15, backgroundColor: '#22c55e', transition: { yoyo: 2, duration: 0.25 } },
    exit: { scale: 1, backgroundColor: '#fff' }
  };
  const sortedVariant = {
    initial: { opacity: 0.7 },
    animate: { opacity: 1, backgroundColor: '#d1fae5', transition: { duration: 0.3 } },
    exit: { opacity: 0.7 }
  };

  // Get highlight colors and animation variants based on step data
  const getHighlightProps = (index) => {
    if (!currentStep?.highlightedIndices) return { color: 'bg-white', variant: undefined };
    const { primary, secondary, sorted, success } = currentStep.highlightedIndices;
    if (primary?.includes(index)) return { color: 'bg-blue-500 text-white', variant: comparisonVariant };
    if (secondary?.includes(index)) return { color: 'bg-orange-400 text-white', variant: comparisonVariant };
    if (success?.includes(index)) return { color: 'bg-green-500 text-white', variant: swapVariant };
    if (sorted?.includes(index)) return { color: 'bg-green-100 text-black', variant: sortedVariant };
    return { color: 'bg-white text-black', variant: undefined };
  };

  // Calculate progress percentage
  const progressPercentage = totalSteps > 1 ? ((currentStep?.stepIndex || 0) / (totalSteps - 1)) * 100 : 0;

  // Render different view modes
  const renderArrayView = () => (
    <div className="flex items-center justify-center space-x-2 min-h-[150px]">
      <AnimatePresence>
        {(currentStep?.array || arrayState).map((item, index) => {
          const { color, variant } = getHighlightProps(index);
          return (
            <motion.div
              key={item.id}
              layout
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variant}
              transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
              className={`w-16 h-16 rounded-lg border-2 border-gray-300 flex items-center justify-center font-bold text-lg shadow-md ${color}`}
            >
              {item.value}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  const renderBarChartView = () => (
    <div className="flex items-end justify-center space-x-2 min-h-[200px] bg-gray-50 p-4 rounded-lg">
      <AnimatePresence>
        {(currentStep?.array || arrayState).map((item, index) => {
          const height = (item.value / Math.max(...(currentStep?.array || arrayState).map(x => x.value))) * 150;
          const { color, variant } = getHighlightProps(index);
          return (
            <motion.div
              key={item.id}
              layout
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variant}
              transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
              className={`w-12 rounded-t-lg border border-gray-300 flex items-end justify-center font-bold text-sm shadow-md ${color}`}
              style={{ minHeight: '20px', height }}
            >
              <span className="mb-1">{item.value}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  const renderBubbleView = () => (
    <div className="flex items-center justify-center space-x-4 min-h-[200px] bg-gradient-to-b from-blue-50 to-blue-100 p-4 rounded-lg">
      <AnimatePresence>
        {(currentStep?.array || arrayState).map((item, index) => {
          const { color, variant } = getHighlightProps(index);
          return (
            <motion.div
              key={item.id}
              layout
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variant}
              transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.5 }}
              className={`w-20 h-20 rounded-full border-4 border-gray-300 flex items-center justify-center font-bold text-lg shadow-lg ${color}`}
              style={{
                boxShadow: color.includes('primary') ?
                  '0 0 20px rgba(59, 130, 246, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              {item.value}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  const renderVisualization = () => {
    switch (viewMode) {
      case 'barChart':
        return renderBarChartView();
      case 'bubble':
        return renderBubbleView();
      case 'array':
      default:
        return renderArrayView();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with controls and metrics */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start justify-between">
        <div className="flex-1 w-full">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{topic}</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Step {currentStep?.stepIndex || 0} of {totalSteps - 1}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>
        {/* View Mode Toggle */}
        <div className="flex flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className={`btn ${showMetrics ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm`}
          >
            <BarChart3 className="w-4 h-4" />
            Metrics
          </button>
          {comparisonData && (
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`btn ${showComparison ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm`}
            >
              <Info className="w-4 h-4" />
              Compare
            </button>
          )}
        </div>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-primary-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {/* Main Visualization */}
      <div className="card w-full overflow-x-auto">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold">Visualization</h3>
          <div className="flex flex-row gap-2">
            <button
              onClick={() => onViewModeChange && onViewModeChange('array')}
              className={`btn ${viewMode === 'array' ? 'btn-primary' : 'btn-secondary'} text-xs`}
            >
              <List className="w-3 h-3" />
            </button>
            <button
              onClick={() => onViewModeChange && onViewModeChange('barChart')}
              className={`btn ${viewMode === 'barChart' ? 'btn-primary' : 'btn-secondary'} text-xs`}
            >
              <BarChart3 className="w-3 h-3" />
            </button>
            <button
              onClick={() => onViewModeChange && onViewModeChange('bubble')}
              className={`btn ${viewMode === 'bubble' ? 'btn-primary' : 'btn-secondary'} text-xs`}
            >
              <Target className="w-3 h-3" />
            </button>
          </div>
        </div>
        {renderVisualization()}
      </div>
      {/* Performance Metrics */}
      {showMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="card w-full">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-sm sm:text-base">Comparisons</h4>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {performanceMetrics.comparisons || 0}
            </p>
          </div>
          <div className="card w-full">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Zap className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-sm sm:text-base">Swaps</h4>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {performanceMetrics.swaps || 0}
            </p>
          </div>
          <div className="card w-full">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-sm sm:text-base">Passes</h4>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">
              {performanceMetrics.passes || 0}
            </p>
          </div>
          <div className="card w-full">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-sm sm:text-base">Time</h4>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-orange-600">
              {performanceMetrics.duration ? `${performanceMetrics.duration}ms` : 'N/A'}
            </p>
          </div>
        </div>
      )}
      {/* Algorithm Comparison */}
      {showComparison && comparisonData && (
        <div className="card w-full overflow-x-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Algorithm Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Algorithm</th>
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Space</th>
                  <th className="text-left py-2">Stability</th>
                  <th className="text-left py-2">In-Place</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(comparisonData).map(([name, data]) => (
                  <tr key={name} className="border-b border-gray-100">
                    <td className="py-2 font-medium">{name}</td>
                    <td className="py-2 font-mono">{data.timeComplexity}</td>
                    <td className="py-2 font-mono">{data.spaceComplexity}</td>
                    <td className="py-2">{data.stability}</td>
                    <td className="py-2">{data.inPlace}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Current Operation Description */}
      <div className="card w-full">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Current Operation</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 min-h-[80px] sm:min-h-[100px]">
          <p className="text-blue-800 font-medium whitespace-pre-line text-sm sm:text-base">
            {currentStep?.operationDescription || 'Ready to start sorting...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSortingVisualizer; 