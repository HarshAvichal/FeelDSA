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
import { bubbleSort } from '../utils/algorithms/sorting';
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

const EnhancedBubbleSort = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inputs, setInputs] = useState({
    customArray: '8, 3, 15, 6, 12, 1, 9, 4',
    selectedDataset: 'Random'
  });
  const [settings, setSettings] = useState({
    showOptimization: true,
    speed: 'normal',
    viewMode: 'array'
  });
  const [showEducational, setShowEducational] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showControls, setShowControls] = useState(false); // New state for button toggle
  const [originalArray, setOriginalArray] = useState([]); // Store the original unsorted array
  const navigate = useNavigate();

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

  // Speed settings
  const speedSettings = {
    slow: 2000,
    normal: 1000,
    fast: 500,
    instant: 0
  };

  // Create array from input
  const createArrayFromInput = (inputString) => {
    const numbers = inputString.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseInt(s, 10))
      .filter(n => !isNaN(n));
    
    return numbers.map(num => ({ id: getUniqueId(), value: num }));
  };

  // Create random array
  const createRandomArray = (size = 8) => {
    return Array.from({ length: size }, () => ({
      id: getUniqueId(),
      value: Math.floor(Math.random() * 90) + 10
    }));
  };

  // Initialize with default dataset
  useEffect(() => {
    const defaultArray = createArrayFromInput(inputs.customArray);
    dispatch({ type: 'SET_ARRAY_STATE', payload: defaultArray });
    setOriginalArray(defaultArray); // Store the original array
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Handle dataset selection
  const handleDatasetChange = (datasetName) => {
    const dataset = enhancedBubbleSort.predefinedDatasets[datasetName];
    if (dataset) {
      const newArray = dataset.map(num => ({ id: getUniqueId(), value: num }));
      dispatch({ type: 'SET_ARRAY_STATE', payload: newArray });
      setInputs(prev => ({ 
        ...prev, 
        selectedDataset: datasetName,
        customArray: dataset.join(', ')
      }));
      setOriginalArray(newArray); // Store the original array
    }
  };

  // Handle custom array creation
  const handleCreateArray = () => {
    const newArray = createArrayFromInput(inputs.customArray);
    if (newArray.length === 0) {
      alert('Please enter valid numbers separated by commas');
      return;
    }
    dispatch({ type: 'SET_ARRAY_STATE', payload: newArray });
    setOriginalArray(newArray); // Store the original array
    // Show the new array in the visualizer as a single step
    const initialStep = {
      array: newArray,
      highlightedIndices: {},
      operationDescription: 'Array created. Click Start Bubble Sort to begin.',
      stepIndex: 0
    };
    dispatch({ type: 'SET_TOTAL_STEPS', payload: 1 });
    dispatch({ type: 'SET_STEP', payload: initialStep });
    window.bubbleSortSteps = [initialStep];
  };

  // Handle random array creation
  const handleRandomArray = () => {
    const size = Math.floor(Math.random() * 6) + 5; // 5-10 elements
    const newArray = createRandomArray(size);
    dispatch({ type: 'SET_ARRAY_STATE', payload: newArray });
    setInputs(prev => ({ 
      ...prev, 
      selectedDataset: 'Random',
      customArray: newArray.map(item => item.value).join(', ')
    }));
    setOriginalArray(newArray); // Store the original array
  };

  // Start bubble sort
  const handleStartSort = () => {
    if (state.arrayState.length === 0) {
      alert('Please create an array first');
      return;
    }
    
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
    
    const steps = enhancedBubbleSort.steps(state.arrayState, settings);
    dispatch({ type: 'SET_TOTAL_STEPS', payload: steps.length });
    dispatch({ type: 'SET_STEP', payload: { ...steps[0], stepIndex: 0 } });
    window.bubbleSortSteps = steps;
  };

  // Animation controls
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

  const playAnimation = () => {
    if (!isPlaying || stepIndex >= totalSteps - 1) {
      dispatch({ type: 'SET_PLAYING', payload: false });
      return;
    }

    const steps = window.bubbleSortSteps;
    if (!steps || stepIndex + 1 >= steps.length) {
      dispatch({ type: 'SET_PLAYING', payload: false });
      return;
    }

    const nextStep = steps[stepIndex + 1];
    dispatch({ type: 'SET_STEP', payload: { ...nextStep, stepIndex: stepIndex + 1 } });
    dispatch({ type: 'SET_STEP_INDEX', payload: stepIndex + 1 });

    setTimeout(() => {
      if (isPlaying) {
        playAnimation();
      }
    }, speedSettings[settings.speed]);
  };

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

  const handlePrevious = () => {
    if (stepIndex > 0) {
      const steps = window.bubbleSortSteps;
      if (steps && stepIndex - 1 >= 0) {
        const prevStep = steps[stepIndex - 1];
        dispatch({ type: 'SET_STEP', payload: { ...prevStep, stepIndex: stepIndex - 1 } });
        dispatch({ type: 'SET_STEP_INDEX', payload: stepIndex - 1 });
        
        // Recalculate metrics up to this step
        recalculateMetricsUpToStep(stepIndex - 1);
      }
    }
  };

  // Helper function to recalculate metrics up to a specific step
  const recalculateMetricsUpToStep = (stepIndex) => {
    if (stepIndex < 0) return;
    
    const steps = window.bubbleSortSteps;
    if (!steps || stepIndex >= steps.length) return;
    
    // Get metrics from the current step's metadata
    const currentStep = steps[stepIndex];
    if (currentStep.metadata) {
      const { comparisons, swaps, pass } = currentStep.metadata;
      
      // Calculate realistic algorithm execution time
      const baseTimePerComparison = 0.1;
      const baseTimePerSwap = 0.5;
      const algorithmExecutionTime = Math.round(
        (comparisons * baseTimePerComparison) + (swaps * baseTimePerSwap)
      );
      
      // Update performance metrics with cumulative values
      dispatch({
        type: 'SET_PERFORMANCE_METRICS',
        payload: {
          comparisons: Math.max(comparisons || 0, performanceMetrics.comparisons || 0),
          swaps: Math.max(swaps || 0, performanceMetrics.swaps || 0),
          passes: Math.max(pass || 0, performanceMetrics.passes || 0),
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
        
        // Update performance metrics with cumulative values
        dispatch({
          type: 'SET_PERFORMANCE_METRICS',
          payload: {
            comparisons: Math.max(comparisons || 0, performanceMetrics.comparisons || 0),
            swaps: Math.max(swaps || 0, performanceMetrics.swaps || 0),
            passes: Math.max(pass || 0, performanceMetrics.passes || 0),
            duration: Math.max(1, algorithmExecutionTime)
          }
        });
      }
    }
  };

  const handleNext = () => {
    if (stepIndex < totalSteps - 1) {
      const steps = window.bubbleSortSteps;
      if (steps && stepIndex + 1 < steps.length) {
        const nextStep = steps[stepIndex + 1];
        dispatch({ type: 'SET_STEP', payload: { ...nextStep, stepIndex: stepIndex + 1 } });
        dispatch({ type: 'SET_STEP_INDEX', payload: stepIndex + 1 });
        
        // Recalculate metrics up to this step
        recalculateMetricsUpToStep(stepIndex + 1);
      }
    }
  };

  // Animation loop for Play button
  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex < totalSteps - 1) {
      const timer = setTimeout(() => {
        // Update metrics dynamically based on the next step
        const nextStepIndex = stepIndex + 1;
        const steps = window.bubbleSortSteps;
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
      }, speedSettings[settings.speed]);
      return () => clearTimeout(timer);
    } else {
      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({ type: 'SET_ANIMATING', payload: false });
      // Hide control buttons and show start button again
      setShowControls(false);
    }
  }, [isPlaying, stepIndex, totalSteps, settings.speed]);

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
                <h1 className="text-2xl font-bold text-gray-900">Bubble Sort</h1>
                <p className="text-sm text-gray-600 capitalize">Algorithm</p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Info</span>
            </button>
          </div>
        </div>
      </div>
      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
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
                  <p className="text-gray-700 leading-relaxed">{enhancedBubbleSort.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Complexity</h3>
                  <div className="space-y-2">
                    {Object.entries(enhancedBubbleSort.complexity).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="font-mono font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
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
                    {Object.keys(enhancedBubbleSort.predefinedDatasets).map(dataset => (
                      <option key={dataset} value={dataset}>{dataset}</option>
                    ))}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Animation Speed
                  </label>
                  <select
                    value={settings.speed}
                    onChange={(e) => setSettings(prev => ({ ...prev, speed: e.target.value }))}
                    className="input w-full"
                    disabled={isAnimating}
                  >
                    <option value="slow">Slow (2s)</option>
                    <option value="normal">Normal (1s)</option>
                    <option value="fast">Fast (0.5s)</option>
                    <option value="instant">Instant</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showOptimization"
                    checked={settings.showOptimization}
                    onChange={(e) => setSettings(prev => ({ ...prev, showOptimization: e.target.checked }))}
                    className="mr-2"
                    disabled={isAnimating}
                  />
                  <label htmlFor="showOptimization" className="text-sm text-gray-700">
                    Show optimization (early termination)
                  </label>
                </div>
              </div>
            </div>
            {/* Educational Content */}
            <div className="card w-full">
              <button
                onClick={() => setShowEducational(!showEducational)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Learn Bubble Sort
                </h3>
                {showEducational ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showEducational && (
                <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 sm:mb-2">How it works:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {enhancedBubbleSort.explanation.howItWorks.map((step, index) => (
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
                      {enhancedBubbleSort.explanation.advantages.map((advantage, index) => (
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
                      {enhancedBubbleSort.explanation.disadvantages.map((disadvantage, index) => (
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
              <div className="card w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                  <div className="w-full sm:w-auto text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Ready to Sort?</h3>
                    <p className="text-sm text-gray-600">
                      Click "Start Bubble Sort" to begin the visualization
                    </p>
                  </div>
                  <button
                    onClick={handleStartSort}
                    className="btn btn-primary w-full sm:w-auto"
                    disabled={isAnimating || arrayState.length === 0}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Bubble Sort
                  </button>
                </div>
              </div>
            ) : (
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
                  <div className="flex flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleReset}
                      className="btn btn-secondary w-full sm:w-auto"
                      disabled={totalSteps <= 1}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </button>
                    <button
                      onClick={handlePrevious}
                      className="btn btn-secondary w-full sm:w-auto"
                      disabled={stepIndex === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      className="btn btn-secondary w-full sm:w-auto"
                      disabled={stepIndex >= totalSteps - 1}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Enhanced Visualizer */}
            {totalSteps > 0 && (
              <EnhancedSortingVisualizer
                topic="Bubble Sort"
                arrayState={arrayState}
                currentStep={currentStep}
                totalSteps={totalSteps}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onReset={handleReset}
                onPrevious={handlePrevious}
                onNext={handleNext}
                performanceMetrics={performanceMetrics}
                viewMode={settings.viewMode}
                comparisonData={enhancedBubbleSort.comparisonData}
                onViewModeChange={(newViewMode) => setSettings(prev => ({ ...prev, viewMode: newViewMode }))}
              />
            )}
            {/* Code Display */}
            {operationDetails && (
              <div className="card w-full">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Implementation
                </h3>
                <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{enhancedBubbleSort.code}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBubbleSort; 