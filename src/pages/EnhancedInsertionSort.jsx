import React, { useState, useEffect, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight,
  Plus,
  Trash2,
  Dice5,
  Settings,
  BookOpen,
  Code,
  BarChart3,
  Target,
  Zap,
  Clock,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EnhancedSortingVisualizer from '../components/EnhancedSortingVisualizer';
import { insertionSort } from '../utils/algorithms/sorting';
import { getUniqueId } from '../utils/constants';

// Reducer for managing state
const initialState = {
  arrayState: [],
  currentStep: null,
  totalSteps: 0,
  stepIndex: 0,
  isPlaying: false,
  isAnimating: false,
  operationDetails: null,
  performanceMetrics: {
    comparisons: 0,
    swaps: 0,
    passes: 0,
    duration: 0
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ARRAY_STATE':
      return { ...state, arrayState: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_TOTAL_STEPS':
      return { ...state, totalSteps: action.payload };
    case 'SET_STEP_INDEX':
      return { ...state, stepIndex: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_ANIMATING':
      return { ...state, isAnimating: action.payload };
    case 'SET_OPERATION_DETAILS':
      return { ...state, operationDetails: action.payload };
    case 'SET_PERFORMANCE_METRICS':
      return { ...state, performanceMetrics: { ...action.payload } };
    default:
      return state;
  }
}

const EnhancedInsertionSort = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [viewMode, setViewMode] = useState('array');
  const [showLearnSection, setShowLearnSection] = useState(false);
  const [showCodeSection, setShowCodeSection] = useState(false);
  const [showControls, setShowControls] = useState(false); // New state for button toggle
  const [originalArray, setOriginalArray] = useState([]); // Store the original unsorted array
  
  const {
    arrayState,
    currentStep,
    totalSteps,
    stepIndex,
    isPlaying,
    isAnimating,
    operationDetails,
    performanceMetrics
  } = state;

  const [inputs, setInputs] = useState({
    selectedDataset: 'Random',
    customArray: '8, 3, 15, 6, 12, 1, 9, 4',
    animationSpeed: 'Normal (1s)',
    showOptimization: true
  });

  // Speed settings
  const speedSettings = {
    'Slow (2s)': 2000,
    'Normal (1s)': 1000,
    'Fast (0.5s)': 500
  };

  // Predefined datasets
  const predefinedDatasets = {
    'Random': [8, 3, 15, 6, 12, 1, 9, 4],
    'Nearly Sorted': [1, 2, 4, 3, 5, 6, 8, 7],
    'Reversed': [10, 9, 8, 7, 6, 5, 4, 3],
    'Duplicates': [3, 1, 4, 1, 5, 9, 2, 6],
    'Small Range': [1, 2, 1, 2, 1, 2, 1, 2]
  };

  // Initialize array on component mount
  useEffect(() => {
    const initialArray = predefinedDatasets['Random'].map(value => ({
      id: getUniqueId(),
      value: value
    }));
    dispatch({ type: 'SET_ARRAY_STATE', payload: initialArray });
    setOriginalArray([...initialArray]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDatasetChange = (datasetName) => {
    setInputs(prev => ({ ...prev, selectedDataset: datasetName }));
    if (datasetName !== 'Custom') {
      const dataset = predefinedDatasets[datasetName];
      const arrayWithIds = dataset.map(value => ({
        id: getUniqueId(),
        value: value
      }));
      dispatch({ type: 'SET_ARRAY_STATE', payload: arrayWithIds });
      setOriginalArray([...arrayWithIds]); // Store the original array
    }
  };

  const handleCreateArray = () => {
    if (inputs.customArray.trim()) {
      const values = inputs.customArray.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      if (values.length > 0) {
        const arrayWithIds = values.map(value => ({
          id: getUniqueId(),
          value: value
        }));
        dispatch({ type: 'SET_ARRAY_STATE', payload: arrayWithIds });
        setOriginalArray([...arrayWithIds]); // Store the original array
        setInputs(prev => ({ ...prev, selectedDataset: 'Custom' }));
      }
    }
  };

  const handleRandomArray = () => {
    const randomArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 1);
    const arrayWithIds = randomArray.map(value => ({
      id: getUniqueId(),
      value: value
    }));
    dispatch({ type: 'SET_ARRAY_STATE', payload: arrayWithIds });
    setOriginalArray([...arrayWithIds]); // Store the original array
    setInputs(prev => ({ ...prev, selectedDataset: 'Random' }));
  };

  const handleStartSort = () => {
    if (arrayState.length === 0) return;
    
    // Show control buttons and hide start button
    setShowControls(true);
    
    // Set playing state to true since animation starts immediately
    dispatch({ type: 'SET_PLAYING', payload: true });
    dispatch({ type: 'SET_ANIMATING', payload: true });
    
    // Initialize metrics to 0
    dispatch({ 
      type: 'SET_PERFORMANCE_METRICS', 
      payload: {
        comparisons: 0,
        swaps: 0,
        passes: 0,
        duration: 0
      }
    });
    
    // Generate steps for insertion sort
    const steps = insertionSort.steps(arrayState);
    dispatch({ type: 'SET_TOTAL_STEPS', payload: steps.length });
    dispatch({ type: 'SET_STEP', payload: { ...steps[0], stepIndex: 0 } });
    window.insertionSortSteps = steps;
  };

  const handlePlayPause = () => {
    if (totalSteps <= 1) return;
    
    if (isPlaying) {
      // Pause: Stop the animation
      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({ type: 'SET_ANIMATING', payload: false });
    } else {
      // Resume: Continue the animation from current step
      dispatch({ type: 'SET_PLAYING', payload: true });
      dispatch({ type: 'SET_ANIMATING', payload: true });
    }
  };

  // Animation loop for Play button
  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex < totalSteps - 1) {
      const timer = setTimeout(() => {
        // Update metrics dynamically based on the next step
        const nextStepIndex = stepIndex + 1;
        const steps = window.insertionSortSteps;
        if (steps && nextStepIndex < steps.length) {
          const nextStep = steps[nextStepIndex];
          
          // Get metrics from the next step's metadata
          if (nextStep.metadata) {
            const { comparisons, swaps, pass } = nextStep.metadata;
            
            // Calculate realistic algorithm execution time
            const baseTimePerComparison = 0.1; // 0.1ms per comparison
            const baseTimePerSwap = 0.5; // 0.5ms per swap
            const algorithmExecutionTime = Math.round(
              (comparisons * baseTimePerComparison) + (swaps * baseTimePerSwap)
            );
            
            // Calculate new cumulative values
            const newComparisons = Math.max(comparisons || 0, performanceMetrics.comparisons || 0);
            const newSwaps = Math.max(swaps || 0, performanceMetrics.swaps || 0);
            const newPasses = Math.max(pass || 0, performanceMetrics.passes || 0);
            
            // Update performance metrics in real-time with cumulative values
            const newMetrics = {
              comparisons: newComparisons,
              swaps: newSwaps,
              passes: newPasses,
              duration: Math.max(1, algorithmExecutionTime)
            };
            
            dispatch({
              type: 'SET_PERFORMANCE_METRICS',
              payload: newMetrics
            });
          } else {
            // Try to get metrics directly from step object properties
            const { comparisons, swaps, pass } = nextStep;
            
            if (comparisons !== undefined || swaps !== undefined || pass !== undefined) {
              // Calculate realistic algorithm execution time
              const baseTimePerComparison = 0.1; // 0.1ms per comparison
              const baseTimePerSwap = 0.5; // 0.5ms per swap
              const algorithmExecutionTime = Math.round(
                (comparisons * baseTimePerComparison) + (swaps * baseTimePerSwap)
              );
              
              // Calculate new cumulative values
              const newComparisons = Math.max(comparisons || 0, performanceMetrics.comparisons || 0);
              const newSwaps = Math.max(swaps || 0, performanceMetrics.swaps || 0);
              const newPasses = Math.max(pass || 0, performanceMetrics.passes || 0);
              
              // Update performance metrics in real-time with cumulative values
              const newMetrics = {
                comparisons: newComparisons,
                swaps: newSwaps,
                passes: newPasses,
                duration: Math.max(1, algorithmExecutionTime)
              };
              
              dispatch({
                type: 'SET_PERFORMANCE_METRICS',
                payload: newMetrics
              });
            }
          }
        }
        
        handleNext();
      }, speedSettings[inputs.animationSpeed]);
      return () => clearTimeout(timer);
    } else {
      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({ type: 'SET_ANIMATING', payload: false });
      // Hide control buttons and show start button again
      setShowControls(false);
    }
  }, [isPlaying, stepIndex, totalSteps, inputs.animationSpeed]);

  const handleReset = () => {
    // Stop any ongoing animation
    dispatch({ type: 'SET_PLAYING', payload: false });
    dispatch({ type: 'SET_ANIMATING', payload: false });
    
    // Reset to initial array state (unsorted)
    if (originalArray.length > 0) {
      dispatch({ type: 'SET_ARRAY_STATE', payload: [...originalArray] });
    }
    
    // Reset step tracking
    dispatch({ type: 'SET_STEP_INDEX', payload: 0 });
    dispatch({ type: 'SET_TOTAL_STEPS', payload: 0 });
    dispatch({ type: 'SET_STEP', payload: null });
    
    // Show start button again
    setShowControls(false);
    
    // Reset performance metrics to 0
    dispatch({
      type: 'SET_PERFORMANCE_METRICS',
      payload: {
        comparisons: 0,
        swaps: 0,
        passes: 0,
        duration: 0
      }
    });
  };

  const handleNext = () => {
    if (stepIndex < totalSteps - 1) {
      const nextStepIndex = stepIndex + 1;
      dispatch({ type: 'SET_STEP_INDEX', payload: nextStepIndex });
      
      // Recalculate metrics up to this step
      recalculateMetricsUpToStep(nextStepIndex);
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      const prevStepIndex = stepIndex - 1;
      dispatch({ type: 'SET_STEP_INDEX', payload: prevStepIndex });
      
      // Recalculate metrics up to this step
      recalculateMetricsUpToStep(prevStepIndex);
    }
  };

  // Helper function to recalculate metrics up to a specific step
  const recalculateMetricsUpToStep = (stepIndex) => {
    if (stepIndex < 0) return;
    
    // Get the stored steps instead of regenerating them
    const steps = window.insertionSortSteps;
    if (!steps || stepIndex >= steps.length) return;
    
    const currentStep = steps[stepIndex];
    
    // Get metrics from the current step's metadata
    if (currentStep.metadata) {
      const { comparisons, swaps, pass } = currentStep.metadata;
      
      // Calculate realistic algorithm execution time
      const baseTimePerComparison = 0.1;
      const baseTimePerSwap = 0.5;
      const algorithmExecutionTime = Math.round(
        (comparisons * baseTimePerComparison) + (swaps * baseTimePerSwap)
      );
      
      // Update performance metrics
      dispatch({
        type: 'SET_PERFORMANCE_METRICS',
        payload: {
          comparisons: comparisons || 0,
          swaps: swaps || 0,
          passes: pass || 0,
          duration: Math.max(1, algorithmExecutionTime)
        }
      });
    } else {
      // Try to get metrics directly from step object properties
      const { comparisons, swaps, pass } = currentStep;
      
      if (comparisons !== undefined || swaps !== undefined || pass !== undefined) {
        // Calculate realistic algorithm execution time
        const baseTimePerComparison = 0.1;
        const baseTimePerSwap = 0.5;
        const algorithmExecutionTime = Math.round(
          (comparisons * baseTimePerComparison) + (swaps * baseTimePerSwap)
        );
        
        // Update performance metrics
        dispatch({
          type: 'SET_PERFORMANCE_METRICS',
          payload: {
            comparisons: comparisons || 0,
            swaps: swaps || 0,
            passes: pass || 0,
            duration: Math.max(1, algorithmExecutionTime)
          }
        });
      }
    }
    
    // Update the current step with the correct stepIndex
    const updatedCurrentStep = { ...currentStep, stepIndex: stepIndex };
    dispatch({ type: 'SET_STEP', payload: updatedCurrentStep });
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Topics</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Insertion Sort</h1>
                <p className="text-sm text-gray-600">Algorithm</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowLearnSection(!showLearnSection)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Learn Section */}
      <AnimatePresence>
        {showLearnSection && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{insertionSort.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Complexity</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-mono font-medium text-gray-900">{insertionSort.complexity.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Space:</span>
                      <span className="font-mono font-medium text-gray-900">{insertionSort.complexity.space}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => setShowCodeSection(!showCodeSection)}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {showCodeSection ? 'Hide' : 'Show'} C++ Code
                    </button>
                    
                    {showCodeSection && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3"
                      >
                        <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{insertionSort.code}</code>
                        </pre>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Dataset Management */}
            <div className="card w-full">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Dataset Management
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {/* Predefined Datasets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Predefined Datasets
                  </label>
                  <select
                    value={inputs.selectedDataset}
                    onChange={(e) => handleDatasetChange(e.target.value)}
                    className="input w-full"
                    disabled={isAnimating}
                  >
                    {Object.keys(predefinedDatasets).map(dataset => (
                      <option key={dataset} value={dataset}>{dataset}</option>
                    ))}
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                {/* Custom Array Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Custom Array
                  </label>
                  <textarea
                    name="customArray"
                    value={inputs.customArray}
                    onChange={handleInputChange}
                    placeholder="Enter numbers separated by commas (e.g., 8, 3, 15, 6)"
                    className="input w-full font-mono"
                    rows="3"
                    disabled={isAnimating}
                  />
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleCreateArray}
                    className="btn btn-primary w-full sm:flex-grow"
                    disabled={isAnimating}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Array
                  </button>
                  <button
                    onClick={handleRandomArray}
                    className="btn btn-secondary w-full sm:w-auto"
                    disabled={isAnimating}
                  >
                    <Dice5 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="card w-full">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {/* Animation Speed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Animation Speed
                  </label>
                  <select
                    name="animationSpeed"
                    value={inputs.animationSpeed}
                    onChange={handleInputChange}
                    className="input w-full"
                    disabled={isAnimating}
                  >
                    <option value="Fast (0.5s)">Fast (0.5s)</option>
                    <option value="Normal (1s)">Normal (1s)</option>
                    <option value="Slow (2s)">Slow (2s)</option>
                  </select>
                </div>
                
                {/* Optimization Option */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="showOptimization"
                    checked={inputs.showOptimization}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    disabled={isAnimating}
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Show optimization (early termination)
                  </label>
                </div>
              </div>
            </div>

            {/* Learn Insertion Sort */}
            <div className="card w-full">
              <button
                onClick={() => setShowLearnSection(!showLearnSection)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-base sm:text-lg font-semibold">Learn Insertion Sort</span>
                </div>
                <motion.div animate={{ rotate: showLearnSection ? 180 : 0 }}>
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>
              {showLearnSection && (
                <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 sm:mb-2">How it works:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {insertionSort.explanation.howItWorks.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 sm:mb-2">Advantages:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {insertionSort.explanation.advantages.map((advantage, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 sm:mb-2">Disadvantages:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {insertionSort.explanation.disadvantages.map((disadvantage, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>{disadvantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Visualization */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Start Button or Controls */}
            {!showControls ? (
              // Show Start Button
              <div className="card w-full">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Ready to Sort?</h3>
                <p className="text-gray-600 mb-4">
                  Click 'Start Insertion Sort' to begin the visualization
                </p>
                <button
                  onClick={handleStartSort}
                  className="btn btn-primary w-full sm:w-auto text-lg px-8 py-3"
                  disabled={isAnimating || arrayState.length === 0}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Insertion Sort
                </button>
              </div>
            ) : (
              // Show Controls
              <div className="card w-full">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Controls</h3>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                  <button
                    onClick={handlePlayPause}
                    className={`btn ${isPlaying ? 'btn-secondary' : 'btn-primary'} w-full sm:w-24`}
                    disabled={totalSteps <= 1}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn btn-secondary w-full sm:w-24"
                    disabled={totalSteps <= 1}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </button>
                  <button
                    onClick={handlePrevious}
                    className="btn btn-secondary w-full sm:w-24"
                    disabled={stepIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn btn-secondary w-full sm:w-24"
                    disabled={stepIndex === totalSteps - 1}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Main Visualization */}
            <div className="card w-full overflow-x-auto">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold">Visualization</h3>
                <div className="flex flex-row gap-2">
                  <button
                    onClick={() => handleViewModeChange('array')}
                    className={`btn ${viewMode === 'array' ? 'btn-primary' : 'btn-secondary'} text-xs`}
                  >
                    <Code className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('barChart')}
                    className={`btn ${viewMode === 'barChart' ? 'btn-primary' : 'btn-secondary'} text-xs`}
                  >
                    <BarChart3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('bubble')}
                    className={`btn ${viewMode === 'bubble' ? 'btn-primary' : 'btn-secondary'} text-xs`}
                  >
                    <Target className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <EnhancedSortingVisualizer
                topic="Insertion Sort"
                arrayState={arrayState}
                currentStep={currentStep}
                totalSteps={totalSteps}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onReset={handleReset}
                onPrevious={handlePrevious}
                onNext={handleNext}
                performanceMetrics={performanceMetrics}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
            </div>

            {/* Performance Metrics */}
            <div className="card w-full">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{performanceMetrics.comparisons}</div>
                  <div className="text-sm text-gray-600">Comparisons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{performanceMetrics.swaps}</div>
                  <div className="text-sm text-gray-600">Swaps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{performanceMetrics.passes}</div>
                  <div className="text-sm text-gray-600">Passes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{performanceMetrics.duration}ms</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedInsertionSort;
