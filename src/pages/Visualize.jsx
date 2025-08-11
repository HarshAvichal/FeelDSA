import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Info, Play, Pause, RotateCcw, Plus, Trash2, Eye, Search, Target, Edit, Dice5, Pencil, ShieldCheck, ChevronDown } from 'lucide-react'
import { useVisualizer } from '../context/VisualizerContext'
import Visualizer from '../components/Visualizer'
import AITutorChat from '../components/AITutorChat'
import { algorithms, dataStructures, getOperationSteps, generateRandomArray, getSortedArray, getAlgorithmSteps } from '../utils/algorithms'
import { binarySearchProblems } from '../utils/algorithms/binarySearchProblems'
import toast from 'react-hot-toast'
import Tippy from '@tippyjs/react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const OperationDetails = ({ details }) => {
  if (!details || (!details.complexity && !details.code)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card mt-8"
    >
      <h3 className="text-lg font-semibold mb-4">Operation Details</h3>
      {details.complexity && (
        <div className="mb-4">
          <h4 className="font-medium text-md mb-2">Complexity</h4>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Time:</span>
            <span className="font-mono font-medium text-gray-900">{details.complexity.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Space:</span>
            <span className="font-mono font-medium text-gray-900">{details.complexity.space}</span>
          </div>
        </div>
      )}
      {details.code && (
        <div>
          <h4 className="font-medium text-md mb-2">C++ Example</h4>
          <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
            <code>
              {details.code}
            </code>
          </pre>
        </div>
      )}
    </motion.div>
  );
};

const Visualize = () => {
  const { topic } = useParams()
  const decodedTopic = decodeURIComponent(topic)
  const navigate = useNavigate()
  const { 
    arrayState, 
    dispatch, 
    operationDetails, 
    stepIndex, 
    totalSteps,
    isPlaying,
    speed
  } = useVisualizer()

  const [topicData, setTopicData] = useState(null)
  const [showInfo, setShowInfo] = useState(false)
  const [inputs, setInputs] = useState({ value: '', index: '', customArray: '8, 3, 15, 6, 22, 11', rows: '3', cols: '4', row: '', col: '' });
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedSortAlgorithm, setSelectedSortAlgorithm] = useState('Bubble Sort');
  const [selectedTraversalAlgorithm, setSelectedTraversalAlgorithm] = useState('Row-Major Traversal');
  const [steps, setSteps] = useState([]);
  const [mobileControlsVisible, setMobileControlsVisible] = useState(false);

  // Control Handlers
  const handlePlayPause = useCallback(() => {
    if (totalSteps <= 1) return;
    dispatch({ type: 'SET_PLAYING', payload: !isPlaying });
  }, [totalSteps, isPlaying, dispatch]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: false });
    if (steps.length > 0) {
      const firstStep = steps[0];
      dispatch({ 
        type: 'SET_STEP', 
        payload: {
          ...firstStep,
          stepIndex: 0,
        }
      });
    }
  }, [steps, dispatch]);

  const handleNext = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      const nextStepIndex = stepIndex + 1;
      const nextStep = steps[nextStepIndex];
      dispatch({
        type: 'SET_STEP',
        payload: {
          ...nextStep,
          stepIndex: nextStepIndex,
        },
      });
    }
  }, [stepIndex, totalSteps, steps, dispatch]);

  const handlePrevious = useCallback(() => {
    if (stepIndex > 0) {
      const prevStepIndex = stepIndex - 1;
      const prevStep = steps[prevStepIndex];
      dispatch({
        type: 'SET_STEP',
        payload: {
          ...prevStep,
          stepIndex: prevStepIndex,
        },
      });
    }
  }, [stepIndex, steps, dispatch]);

  // This effect handles the auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    if (stepIndex < totalSteps - 1) {
      const timer = setTimeout(handleNext, speed);
      return () => clearTimeout(timer);
    } else {
      // Automatically stop playing when the end is reached
      dispatch({ type: 'SET_PLAYING', payload: false });
    }
  }, [isPlaying, stepIndex, totalSteps, speed, handleNext, dispatch]);

  const handleNewArray = () => {
    const newArray = generateRandomArray(8, 1, 50);
    
    if (topicData?.type === 'binarySearchProblem') {
      // For binary search problems, we don't generate steps immediately
      // Just set the array and let user perform search operation
      dispatch({ type: 'SET_ARRAY_STATE', payload: newArray });
      dispatch({ 
        type: 'SET_STEP', 
        payload: {
          stepIndex: 0,
          highlightedIndices: {},
          operationDescription: `New array created. Ready to perform ${topicData.name.toLowerCase()}.`
        }
      });
      dispatch({ type: 'SET_TOTAL_STEPS', payload: 1 });
      dispatch({ type: 'SET_PLAYING', payload: false });
    } else {
      const algorithmSteps = getAlgorithmSteps(decodedTopic, newArray, null);
      setSteps(algorithmSteps);
      dispatch({ type: 'SET_TOTAL_STEPS', payload: algorithmSteps.length });
      dispatch({ type: 'SET_PLAYING', payload: false });
      
      if (algorithmSteps.length > 0) {
        const firstStep = algorithmSteps[0];
        dispatch({ 
          type: 'SET_STEP', 
          payload: {
            stepIndex: 0,
            highlightedIndices: firstStep.highlightedIndices,
            operationDescription: firstStep.operationDescription
          }
        });
        dispatch({ type: 'SET_ARRAY_STATE', payload: firstStep.array });
      }
    }
  };

  useEffect(() => {
    const algorithmData = algorithms[decodedTopic]
    const dataStructureData = dataStructures[decodedTopic]
    
    // Check if this is a binary search problem from the URL
    const isBinarySearchProblem = decodedTopic.includes('binary-search-problems/')
    let problemName = null
    
    if (isBinarySearchProblem) {
      // Extract problem name from URL
      const urlParts = decodedTopic.split('/')
      problemName = urlParts[urlParts.length - 1].replace(/-/g, ' ')
      // Convert to proper case (e.g., "first occurrence" -> "First Occurrence")
      problemName = problemName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }
    
    const binarySearchProblemData = problemName ? binarySearchProblems[problemName] : null
    
    let resolvedTopicData;
    if (binarySearchProblemData) {
      resolvedTopicData = { ...binarySearchProblemData, type: 'binarySearchProblem', name: problemName };
    } else if (algorithmData) {
      resolvedTopicData = { ...algorithmData, type: 'algorithm', name: decodedTopic };
    } else if (dataStructureData) {
      resolvedTopicData = { ...dataStructureData, type: 'dataStructure', name: decodedTopic };
    } else {
      navigate('/')
      return
    }

    setTopicData(resolvedTopicData)
    dispatch({ type: 'SET_TOPIC', payload: decodedTopic })

    // Initialize state based on type
    if (resolvedTopicData.type === 'dataStructure' || resolvedTopicData.name === 'Binary Search' || resolvedTopicData.name === 'Linear Search') {
      let initialArray = [];
      let initialDescription = `Create an array to visualize ${resolvedTopicData.name}.`;

      if (resolvedTopicData.name === 'Arrays') {
        initialDescription = 'Create a new array to begin.';
      } else if (resolvedTopicData.name === 'Binary Search') {
        initialDescription = 'Create an array, sort it, and then search for a target value.';
      } else if (resolvedTopicData.name === 'Linear Search') {
        initialDescription = 'Create an array to search for a target value.';
      }

      dispatch({ type: 'SET_ARRAY_STATE', payload: initialArray });
      dispatch({ 
        type: 'SET_STEP', 
        payload: {
          stepIndex: 0,
          highlightedIndices: {},
          operationDescription: initialDescription
        }
      });
      dispatch({ type: 'SET_TOTAL_STEPS', payload: 1 });
    }

  }, [topic, navigate, dispatch])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleRandomArray = () => {
    const newArray = generateRandomArray(8, 1, 50);

    // Existing logic for other components
    const algorithmSteps = getAlgorithmSteps(decodedTopic, newArray, null);
    setSteps(algorithmSteps);
    dispatch({ type: 'SET_ARRAY_STATE', payload: newArray });
    dispatch({ type: 'SET_TOTAL_STEPS', payload: algorithmSteps.length });
    dispatch({ type: 'SET_PLAYING', payload: false });
    
    if (algorithmSteps.length > 0) {
      const firstStep = algorithmSteps[0];
      dispatch({ 
        type: 'SET_STEP', 
        payload: {
          stepIndex: 0,
          highlightedIndices: firstStep.highlightedIndices,
          operationDescription: firstStep.operationDescription
        }
      });
    }
  };

  const confirmAndExecute = (title, text, confirmButtonText, action) => {
    MySwal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText
    }).then((result) => {
      if (result.isConfirmed) {
        action();
      }
    })
  }

  const handleCreateWithConfirmation = (options = {}) => {
    if (arrayState.length > 0) {
      confirmAndExecute(
        'Are you sure?',
        'This will replace the current array.',
        'Yes, create new array!',
        () => handleOperation('create', options)
      );
    } else {
      handleOperation('create', options);
    }
  };

  const handleClearWithConfirmation = () => {
    if (arrayState.length > 0) {
        confirmAndExecute(
        'Are you sure?',
        'This will clear the array and all operations.',
        'Yes, clear it!',
        () => dispatch({ type: 'CLEAR_ARRAY' })
      );
    }
  }

  const handleOperation = (operation, options = {}) => {
    if (isAnimating) return;

    const { value, index, customArray, rows, cols, row, col } = { ...inputs, ...options };
    
    let details;
    if (decodedTopic === 'Binary Search' || decodedTopic === 'Linear Search') {
      if (operation === 'search') {
        details = algorithms[decodedTopic]?.operationDetails?.[operation];
      }
    } else if (decodedTopic === '2D Arrays' && operation === 'traverse') {
      details = dataStructures[decodedTopic]?.operationDetails?.traverse?.[selectedTraversalAlgorithm];
    } else if (operation === 'sort' && decodedTopic === 'Arrays') {
      // Dynamically fetch code and complexity for the selected sort algorithm
      const algo = algorithms[selectedSortAlgorithm];
      details = algo?.operationDetails?.sort || {
        complexity: algo?.complexity,
        code: algo?.operationDetails?.sort?.code || algo?.code
      };
    } else {
      details = dataStructures[decodedTopic]?.operationDetails?.[operation] || algorithms[decodedTopic]?.operationDetails?.[operation];
    }
    
    if (details) {
        dispatch({
            type: 'SET_OPERATION_DETAILS',
            payload: details,
        });
    }

    // Custom Array Parsing
    const parsedCustomArray = customArray.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseInt(s, 10))
      .filter(n => !isNaN(n));
      
    const parsedValue = parseInt(value, 10);
    const parsedIndex = parseInt(index, 10);
    const parsedRows = parseInt(rows || '3', 10);
    const parsedCols = parseInt(cols || '4', 10);
    const parsedRow = parseInt(row, 10);
    const parsedCol = parseInt(col, 10);
    
    let operationSteps = [];

    // Dispatch to the correct operation with the correct arguments
    switch (operation) {
        // Shared Operations
        case 'search':
            if (decodedTopic === 'Binary Search' || decodedTopic === 'Linear Search' || topicData?.type === 'binarySearchProblem') {
              if (isNaN(parsedValue)) { 
                toast.error("Please enter a valid target value."); 
                return; 
              }
              
              if (decodedTopic === 'Binary Search' || topicData?.type === 'binarySearchProblem') {
                const isArraySorted = arrayState.length > 0 && arrayState.every((item, index) => 
                  index === 0 || item === null || arrayState[index - 1] === null || item.value >= arrayState[index - 1].value
                );
                
                if (!isArraySorted) {
                  toast.error("Array must be sorted for binary search! Please sort the array first.");
                  return;
                }
              }
              
              if (topicData?.type === 'binarySearchProblem') {
                // Handle binary search problems
                if (topicData.name === 'Peak Element' || topicData.name === 'Find Minimum in Rotated Array') {
                  // These problems don't need a target value
                  operationSteps = topicData.steps(arrayState);
                } else if (topicData.name === 'Sqrt(x)') {
                  // Sqrt(x) doesn't need an array, just the target value
                  operationSteps = topicData.steps([], parsedValue);
                } else {
                  // Other problems need a target value
                  operationSteps = topicData.steps(arrayState, parsedValue);
                }
              } else {
                operationSteps = getAlgorithmSteps(decodedTopic, arrayState, parsedValue);
              }
              
              setSteps(operationSteps);
              dispatch({ type: 'SET_TOTAL_STEPS', payload: operationSteps.length });
              
              if (operationSteps.length > 0) {
                const firstStep = operationSteps[0];
                dispatch({ 
                  type: 'SET_STEP', 
                  payload: { ...firstStep, stepIndex: 0 }
                });
              }
              return; 
            } 
            
            operationSteps = getOperationSteps(decodedTopic, 'search', arrayState, parsedValue);
            break;

        // Array Operations
        case 'create':
            if (decodedTopic === 'Arrays') {
              if (parsedCustomArray.length === 0) { toast.error("Please enter a valid, comma-separated list of numbers."); return; }
              operationSteps = getOperationSteps(decodedTopic, 'create', arrayState, parsedCustomArray);
            } else if (decodedTopic === '2D Arrays') {
               const customInput = options.isRandom ? '' : customArray;
               operationSteps = getOperationSteps(decodedTopic, 'create', arrayState, parsedRows, parsedCols, customInput);
            } else if (decodedTopic === 'Binary Search' || decodedTopic === 'Linear Search' || topicData?.type === 'binarySearchProblem') {
              if (topicData?.name === 'Sqrt(x)') {
                // Sqrt(x) doesn't need an array, just set empty array
                dispatch({ type: 'SET_ARRAY_STATE', payload: [] });
                dispatch({ 
                  type: 'SET_STEP', 
                  payload: {
                    stepIndex: 0,
                    highlightedIndices: {},
                    operationDescription: 'Enter a number to find its square root.'
                  }
                });
                dispatch({ type: 'SET_TOTAL_STEPS', payload: 1 });
                return;
              } else if (topicData?.name === 'Peak Element') {
                // For Peak Element, create a mountain array
                if (parsedCustomArray.length === 0) {
                  // Use default mountain array if no custom input
                  const defaultMountainArray = [1, 3, 5, 4, 2];
                  operationSteps = getOperationSteps('Arrays', 'create', arrayState, defaultMountainArray, defaultMountainArray.length);
                } else {
                  operationSteps = getOperationSteps('Arrays', 'create', arrayState, parsedCustomArray, parsedCustomArray.length);
                }
              } else if (topicData?.name === 'Find Minimum in Rotated Array') {
                // For Find Minimum, create a rotated sorted array
                if (parsedCustomArray.length === 0) {
                  // Use default rotated array if no custom input
                  const defaultRotatedArray = [4, 5, 6, 7, 0, 1, 2];
                  operationSteps = getOperationSteps('Arrays', 'create', arrayState, defaultRotatedArray, defaultRotatedArray.length);
                } else {
                  operationSteps = getOperationSteps('Arrays', 'create', arrayState, parsedCustomArray, parsedCustomArray.length);
                }
              } else {
                // Default case for other binary search problems
                if (parsedCustomArray.length === 0) { 
                  toast.error("Please enter a valid, comma-separated list of numbers."); 
                  return; 
                }
                if (parsedCustomArray.length > 15) {
                  toast.error("Please enter 15 or fewer numbers for optimal visualization.");
                  return;
                }
                operationSteps = getOperationSteps('Arrays', 'create', arrayState, parsedCustomArray, parsedCustomArray.length);
              }
            }
            break;
        case 'insert':
            if (isNaN(parsedValue)) { toast.error("Please enter a valid value."); return; }
            
            let indexToInsert = parseInt(index, 10);
            
            // If index is not provided, find the first empty slot to append
            if (isNaN(indexToInsert)) {
                indexToInsert = arrayState.findIndex(v => v === null);
                if (indexToInsert === -1) {
                    toast.error("Array is full. Cannot append new element.");
                    return;
                }
            }
            
            operationSteps = getOperationSteps(decodedTopic, 'insert', arrayState, parsedValue, indexToInsert);
            break;
        case 'update':
            if (decodedTopic === 'Arrays') {
                if (isNaN(parsedValue) || isNaN(parsedIndex)) { toast.error("Please enter a valid value and index."); return; }
                operationSteps = getOperationSteps(decodedTopic, 'update', arrayState, parsedIndex, parsedValue);
            } else if (decodedTopic === '2D Arrays') {
                if (isNaN(parsedValue) || isNaN(parsedRow) || isNaN(parsedCol)) { toast.error("Please enter a valid value, row, and column."); return; }
                operationSteps = getOperationSteps(decodedTopic, 'update', arrayState, parsedRow, parsedCol, parsedValue);
            }
            break;
        case 'delete':
            if (isNaN(parsedIndex)) { toast.error("Please enter a valid index."); return; }
            operationSteps = getOperationSteps(decodedTopic, 'delete', arrayState, parsedIndex);
            break;
        case 'access':
             if (decodedTopic === 'Arrays') {
                if (isNaN(parsedIndex)) { toast.error("Please enter a valid index."); return; }
                operationSteps = getOperationSteps(decodedTopic, 'access', arrayState, parsedIndex);
            } else if (decodedTopic === '2D Arrays') {
                if (isNaN(parsedRow) || isNaN(parsedCol)) { toast.error("Please enter a valid row and column."); return; }
                operationSteps = getOperationSteps(decodedTopic, 'access', arrayState, parsedRow, parsedCol);
            }
            break;
        case 'sort':
            if (decodedTopic === 'Binary Search') {
              const sortedArray = getSortedArray(arrayState);
              dispatch({ type: 'SET_ARRAY_STATE', payload: sortedArray });
              dispatch({ 
                type: 'SET_STEP', 
                payload: {
                  stepIndex: 0,
                  highlightedIndices: {},
                  operationDescription: `Operation 'sort' complete. Ready for next operation.`
                }
              });
              dispatch({ type: 'SET_TOTAL_STEPS', payload: 1 });
              toast.success('Array sorted successfully! Ready for binary search.');
              return; // Return early to skip animation
            }
            
            operationSteps = getOperationSteps(decodedTopic, 'sort', arrayState, selectedSortAlgorithm);
            break;

        case 'traverse':
            operationSteps = getOperationSteps(decodedTopic, 'traverse', arrayState, selectedTraversalAlgorithm);
            break;

        // Stack Operations
        case 'push':
             if (isNaN(parsedValue)) { toast.error("Please enter a valid value."); return; }
            operationSteps = getOperationSteps(decodedTopic, 'push', arrayState, parsedValue);
            break;
        case 'pop':
            operationSteps = getOperationSteps(decodedTopic, 'pop', arrayState);
            break;
        case 'peek':
            operationSteps = getOperationSteps(decodedTopic, 'peek', arrayState);
            break;
        default:
            console.warn(`Unknown operation: ${operation}`);
            return;
    }

    setSteps(operationSteps);
    
    if (operationSteps && operationSteps.length > 0) {
      // The logic below is for auto-playing animations, which we now skip for binary search.
      setIsAnimating(true);
      dispatch({ type: 'SET_TOTAL_STEPS', payload: operationSteps.length });
      
      const finalStep = operationSteps[operationSteps.length - 1];
      const finalState = finalStep.array;
      const finalDescription = finalStep.operationDescription;

      const playSteps = (stepIndex) => {
        if (stepIndex >= operationSteps.length) {
          dispatch({ type: 'SET_ARRAY_STATE', payload: finalState });
          dispatch({ 
            type: 'SET_STEP', 
            payload: {
              stepIndex: 0,
              highlightedIndices: {},
              operationDescription: `Operation '${operation}' complete. Ready for next operation.`
            }
          });
          // For single-step operations, keep the description and highlighting
          if (operationSteps.length === 1) {
              dispatch({
                  type: 'SET_STEP',
                  payload: {
                      stepIndex: 0,
                      highlightedIndices: finalStep.highlightedIndices,
                      operationDescription: finalDescription
                  }
              })
          }
          dispatch({ type: 'SET_TOTAL_STEPS', payload: 1 });
          setIsAnimating(false);
          setInputs(prev => ({ ...prev, value: '', index: '' })); // Clear value/index but keep capacity/size
          return;
        }

        const step = operationSteps[stepIndex];
        dispatch({ type: 'SET_ARRAY_STATE', payload: step.array });
        dispatch({
          type: 'SET_STEP',
          payload: {
            stepIndex: stepIndex,
            highlightedIndices: step.highlightedIndices,
            operationDescription: step.operationDescription
          }
        });

        setTimeout(() => playSteps(stepIndex + 1), 900);
      };

      playSteps(0);
    }
  };

  const renderDataStructureControlsContent = () => {
    if (topicData?.type !== 'dataStructure' || !topicData.operations) return null;

    const operationIcons = {
      create: <Plus className="w-4 h-4" />,
      insert: <Plus className="w-4 h-4" />,
      update: <Edit className="w-4 h-4" />,
      delete: <Trash2 className="w-4 h-4" />,
      access: <Target className="w-4 h-4" />,
      search: <Search className="w-4 h-4" />,
      sort: <Play className="w-4 h-4" />,
      push: <Plus className="w-4 h-4" />,
      pop: <Trash2 className="w-4 h-4" />,
      peek: <Eye className="w-4 h-4" />,
    };
    
    const sharedButtonClass = (primary = false) => 
        `btn ${primary ? 'btn-primary' : 'btn-secondary'} flex items-center justify-center w-full h-10 disabled:opacity-50 disabled:cursor-not-allowed`;
    
    const iconButtonClass = () => 
        `btn btn-secondary flex items-center justify-center w-10 h-10 p-0 disabled:opacity-50 disabled:cursor-not-allowed`;

    if (topicData.name === 'Arrays') {
      return (
        <>
          <h3 className="text-lg font-semibold mb-4">Array Operations</h3>
          
          <div className="space-y-4">
            {/* Create / Modify */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Create or Modify Array</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="customArray"
                  value={inputs.customArray}
                  onChange={handleInputChange}
                  placeholder="e.g., 8, 3, 15, 6"
                  className="input flex-grow"
                  disabled={isAnimating}
                />
                <Tippy content="Randomize">
                  <button onClick={handleRandomArray} className={iconButtonClass()} disabled={isAnimating}>
                    <Dice5 size={20} />
                  </button>
                </Tippy>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={handleCreateWithConfirmation} className="btn btn-primary flex-grow" disabled={isAnimating}>
                  <Play size={16} className="mr-2" /> Create Array
                </button>
                <Tippy content="Clear Array">
                  <button onClick={handleClearWithConfirmation} className={iconButtonClass()} disabled={isAnimating || arrayState.length === 0}>
                    <Trash2 size={20} />
                  </button>
                </Tippy>
              </div>
            </div>

            <hr />

            {/* Actions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" name="value" value={inputs.value} onChange={handleInputChange} placeholder="Value" className="input" disabled={isAnimating} />
                <input type="number" name="index" value={inputs.index} onChange={handleInputChange} placeholder="Index" className="input" disabled={isAnimating} />
                
                <Tippy content="Insert value at index (or end if empty)">
                  <button onClick={() => handleOperation('insert')} className={sharedButtonClass()} disabled={isAnimating}>
                    {operationIcons.insert} Insert
                  </button>
                </Tippy>
                <Tippy content="Update value at index">
                  <button onClick={() => handleOperation('update')} className={sharedButtonClass()} disabled={isAnimating}>
                    {operationIcons.update} Update
                  </button>
                </Tippy>
              </div>
              <div className="flex justify-around items-center mt-3">
                  <Tippy content="Search (uses Value)">
                      <button onClick={() => handleOperation('search')} className={iconButtonClass()} disabled={isAnimating || arrayState.length === 0}>
                          {operationIcons.search}
                      </button>
                  </Tippy>
                  <Tippy content="Access (uses Index)">
                     <button onClick={() => handleOperation('access')} className={iconButtonClass()} disabled={isAnimating || arrayState.length === 0}>
                         {operationIcons.access}
                     </button>
                   </Tippy>
                  <Tippy content="Delete (uses Index)">
                     <button onClick={() => handleOperation('delete')} className={iconButtonClass()} disabled={isAnimating || arrayState.length === 0}>
                         {operationIcons.delete}
                     </button>
                   </Tippy>
              </div>
            </div>

            <hr />

            {/* Sorting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Array</label>
              <div className="flex gap-2">
                <select
                  name="sortAlgorithm"
                  value={selectedSortAlgorithm}
                  onChange={(e) => setSelectedSortAlgorithm(e.target.value)}
                  className="input flex-grow"
                  disabled={isAnimating || arrayState.length === 0}
                >
                  <option value="Bubble Sort">Bubble Sort</option>
                  <option value="Selection Sort">Selection Sort</option>
                  <option value="Insertion Sort">Insertion Sort</option>
                  <option value="Merge Sort">Merge Sort</option>
                  <option value="Quick Sort">Quick Sort</option>
                </select>
                <button onClick={() => handleOperation('sort')} className="btn btn-secondary" disabled={isAnimating || arrayState.length === 0} title="Sort the array">
                  {operationIcons.sort} Sort
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (topicData.name === '2D Arrays') {
      return (
        <>
          <h3 className="text-lg font-semibold mb-4">2D Array Operations</h3>
          <div className="space-y-6">
            {/* Create Array Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Create Array</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="rows"
                  value={inputs.rows}
                  onChange={handleInputChange}
                  placeholder="Rows"
                  className="input"
                  disabled={isAnimating}
                />
                <input
                  type="number"
                  name="cols"
                  value={inputs.cols}
                  onChange={handleInputChange}
                  placeholder="Cols"
                  className="input"
                  disabled={isAnimating}
                />
              </div>
              <textarea
                name="customArray"
                value={inputs.customArray}
                onChange={handleInputChange}
                placeholder="Enter comma-separated values (optional). If empty, a random array will be created."
                className="input w-full font-mono mt-2"
                rows="3"
                disabled={isAnimating}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleCreateWithConfirmation({ isRandom: true })} className="btn btn-secondary flex-grow" disabled={isAnimating}>
                  <Dice5 size={16} className="mr-2" /> Create Random
                </button>
                <button onClick={() => handleCreateWithConfirmation()} className="btn btn-primary flex-grow" disabled={isAnimating || !inputs.customArray.trim()}>
                  <Plus size={16} className="mr-2" /> Create from Input
                </button>
                <Tippy content="Clear Array">
                  <button onClick={handleClearWithConfirmation} className={iconButtonClass()} disabled={isAnimating || arrayState.length === 0}>
                    <Trash2 size={20} />
                  </button>
                </Tippy>
              </div>
            </div>

            <hr />

            {/* Interact Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interact with Array</label>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" name="row" value={inputs.row} onChange={handleInputChange} placeholder="Row" className="input" disabled={isAnimating || arrayState.length === 0} />
                <input type="number" name="col" value={inputs.col} onChange={handleInputChange} placeholder="Col" className="input" disabled={isAnimating || arrayState.length === 0} />
                <input type="number" name="value" value={inputs.value} onChange={handleInputChange} placeholder="Value" className="input" disabled={isAnimating || arrayState.length === 0} />
              </div>
              <div className="flex justify-around items-center mt-3">
                <Tippy content="Access (uses Row, Col)">
                   <button onClick={() => handleOperation('access')} className={iconButtonClass()} disabled={isAnimating || arrayState.length === 0}>
                       {operationIcons.access}
                   </button>
                 </Tippy>
                <Tippy content="Update (uses Row, Col, Value)">
                  <button onClick={() => handleOperation('update')} className={iconButtonClass()} disabled={isAnimating || arrayState.length === 0}>
                     {operationIcons.update}
                  </button>
                </Tippy>
                <Tippy content="Search (uses Value)">
                    <button onClick={() => handleOperation('search')} className={iconButtonClass()} disabled={isAnimating || arrayState.length === 0}>
                        {operationIcons.search}
                    </button>
                </Tippy>
              </div>
            </div>

            <hr />

            {/* Traversal Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Traversal Algorithm</label>
              <div className="flex gap-2">
                <select
                  name="traversalAlgorithm"
                  value={selectedTraversalAlgorithm}
                  onChange={(e) => setSelectedTraversalAlgorithm(e.target.value)}
                  className="input flex-grow"
                  disabled={isAnimating || arrayState.length === 0}
                >
                  <option value="Row-Major Traversal">Row-Major</option>
                  <option value="Column-Major Traversal">Column-Major</option>
                  <option value="Spiral Traversal">Spiral</option>
                  <option value="Diagonal Traversal">Diagonal</option>
                </select>
                <button onClick={() => handleOperation('traverse')} className="btn btn-secondary" disabled={isAnimating || arrayState.length === 0}>
                  <Play size={16} className="mr-2" /> Traverse
                </button>
              </div>
            </div>
          </div>
        </>
      )
    }

    if (topicData.name === 'Stack') {
       return (
        <>
          <h3 className="text-lg font-semibold mb-4">Stack Operations</h3>
          <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <input type="number" name="value" value={inputs.value} onChange={handleInputChange} placeholder="Value" className="input-field w-24" disabled={isAnimating}/>
                <button onClick={() => handleOperation('push')} className="btn-primary" disabled={isAnimating}>
                  {operationIcons.push} Push
                </button>
              </div>
              <button onClick={() => handleOperation('pop')} className="btn-secondary flex items-center" disabled={isAnimating}>
                {operationIcons.pop} Pop
              </button>
              <button onClick={() => handleOperation('peek')} className="btn-secondary flex items-center" disabled={isAnimating}>
                {operationIcons.peek} Peek
              </button>
          </div>
        </>
      )
    }

    return null;
  }

  const renderLinearSearchControlsContent = () => {
    return (
      <>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Pencil size={20} className="mr-2" /> Linear Search Controls
        </h3>

        {/* Create Array Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Edit size={16} className="mr-2" /> Create Your Array
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="customArray"
              value={inputs.customArray}
              onChange={handleInputChange}
              placeholder="e.g., 5, 3, 8, 1"
              className="input flex-grow"
              disabled={isAnimating}
            />
            <Tippy content="Randomize">
              <button onClick={handleRandomArray} className="btn btn-secondary !p-2" disabled={isAnimating}>
                <Dice5 size={20} />
              </button>
            </Tippy>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={handleCreateWithConfirmation} className="btn btn-primary flex-grow" disabled={isAnimating}>
              <Plus size={16} className="mr-2" /> Create Array
            </button>
            <Tippy content="Clear Array">
              <button onClick={handleClearWithConfirmation} className="btn btn-secondary !p-2" disabled={isAnimating || arrayState.length === 0}>
                <Trash2 size={20} />
              </button>
            </Tippy>
          </div>
        </div>

        {/* Divider */}
        {arrayState.length > 0 && <hr className="my-6" />}

        {/* Search Section */}
        {arrayState.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 flex items-center mb-3">
              <Target className="mr-2 h-5 w-5 text-gray-500" />
              Search for a Target
            </h4>
            <div className="flex gap-2">
              <input
                type="number"
                name="value"
                value={inputs.value}
                onChange={handleInputChange}
                placeholder="Enter target..."
                className="input flex-grow"
                disabled={isAnimating}
              />
              <button
                onClick={() => handleOperation('search')}
                className="btn btn-primary !px-4"
                disabled={isAnimating || !inputs.value.trim()}
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  const renderBinarySearchControlsContent = () => {
    const isArraySorted = arrayState.length > 0 && arrayState.every((item, index) => 
      index === 0 || item === null || arrayState[index-1] === null || item.value >= arrayState[index-1].value
    );

    return (
      <>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Pencil size={20} className="mr-2" /> Binary Search Controls
        </h3>

        {/* Create Array Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Edit size={16} className="mr-2" /> Create Your Array
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="customArray"
              value={inputs.customArray}
              onChange={handleInputChange}
              placeholder="e.g., 5, 3, 8, 1"
              className="input flex-grow"
              disabled={isAnimating}
            />
            <Tippy content="Randomize">
              <button onClick={handleRandomArray} className="btn btn-secondary !p-2" disabled={isAnimating}>
                <Dice5 size={20} />
              </button>
            </Tippy>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={handleCreateWithConfirmation} className="btn btn-primary flex-grow" disabled={isAnimating}>
              <Plus size={16} className="mr-2" /> Create Array
            </button>
            <Tippy content="Clear Array">
              <button onClick={handleClearWithConfirmation} className="btn btn-secondary !p-2" disabled={isAnimating || arrayState.length === 0}>
                <Trash2 size={20} />
              </button>
            </Tippy>
          </div>
        </div>

        {/* Divider */}
        {arrayState.length > 0 && <hr className="my-6" />}


        {/* Sort or Search Section */}
        {arrayState.length > 0 && (
          !isArraySorted ? (
            <div>
              <h4 className="font-semibold text-gray-700 flex items-center mb-3">
                <ShieldCheck className="mr-2 h-5 w-5 text-gray-500" />
                Prepare for Search
              </h4>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-3 rounded-r-lg mb-4">
                <p className="font-bold">Action Required</p>
                <p>The array must be sorted. Click below to sort it.</p>
              </div>
              <button 
                onClick={() => handleOperation('sort')} 
                className="btn btn-primary w-full"
                disabled={isAnimating}
              >
                Sort Array
              </button>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-gray-700 flex items-center mb-3">
                <Target className="mr-2 h-5 w-5 text-gray-500" />
                Search for a Target
              </h4>
               <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-3 rounded-r-lg mb-4">
                 <p className="font-bold">Ready to Go!</p>
                 <p>Array is sorted. Enter a target value to find.</p>
               </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="value"
                  value={inputs.value}
                  onChange={handleInputChange}
                  placeholder="Enter target..."
                  className="input flex-grow"
                  disabled={isAnimating}
                />
                <button
                  onClick={() => handleOperation('search')}
                  className="btn btn-primary !px-4"
                  disabled={isAnimating || !inputs.value.trim()}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          )
        )}
      </>
    );
  }

  const renderBinarySearchProblemControlsContent = () => {
    if (topicData?.type !== 'binarySearchProblem') return null;

    const sharedButtonClass = (primary = false) => 
      `btn ${primary ? 'btn-primary' : 'btn-secondary'} flex items-center justify-center w-full h-10 disabled:opacity-50 disabled:cursor-not-allowed`;

    const iconButtonClass = () => 
      `btn btn-secondary flex items-center justify-center w-10 h-10 p-0 disabled:opacity-50 disabled:cursor-not-allowed`;

    return (
      <>
        <h3 className="text-lg font-semibold mb-4">{topicData.name}</h3>
        
        <div className="space-y-4">
          {/* Create Array */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {topicData.name === 'Sqrt(x)' ? 'Enter Number' : 'Create Array'}
            </label>
            
            {topicData.name === 'Sqrt(x)' ? (
              <div className="flex gap-2">
                <input
                  type="number"
                  name="value"
                  value={inputs.value}
                  onChange={handleInputChange}
                  placeholder="e.g., 16"
                  className="input flex-grow"
                  disabled={isAnimating}
                />
                <button 
                  onClick={() => handleOperation('search')} 
                  className={sharedButtonClass(true)} 
                  disabled={isAnimating || !inputs.value}
                >
                  <Search size={16} className="mr-2" /> Find Sqrt
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="customArray"
                    value={inputs.customArray}
                    onChange={handleInputChange}
                    placeholder={topicData.name === 'Peak Element' ? "e.g., 1, 3, 5, 4, 2" : 
                                 topicData.name === 'Find Minimum in Rotated Array' ? "e.g., 4, 5, 6, 7, 0, 1, 2" :
                                 "e.g., 1, 2, 2, 2, 3, 4, 5"}
                    className="input flex-grow"
                    disabled={isAnimating}
                  />
                  <Tippy content="Randomize">
                    <button onClick={handleRandomArray} className={iconButtonClass()} disabled={isAnimating}>
                      <Dice5 size={20} />
                    </button>
                  </Tippy>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={handleCreateWithConfirmation} className="btn btn-primary flex-grow" disabled={isAnimating}>
                    <Play size={16} className="mr-2" /> Create Array
                  </button>
                  <Tippy content="Clear Array">
                    <button onClick={handleClearWithConfirmation} className={iconButtonClass()} disabled={isAnimating || arrayState.length === 0}>
                      <Trash2 size={20} />
                    </button>
                  </Tippy>
                </div>
              </>
            )}
          </div>

          {/* Search Operation */}
          {topicData.name !== 'Sqrt(x)' && (
            <>
              <hr />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {topicData.name === 'Peak Element' ? 'Find Peak' :
                   topicData.name === 'Find Minimum in Rotated Array' ? 'Find Minimum' :
                   'Search Target'}
                </label>
                
                {topicData.name === 'Peak Element' || topicData.name === 'Find Minimum in Rotated Array' ? (
                  <button 
                    onClick={() => handleOperation('search')} 
                    className={sharedButtonClass(true)} 
                    disabled={isAnimating || arrayState.length === 0}
                  >
                    <Search size={16} className="mr-2" />
                    {topicData.name === 'Peak Element' ? 'Find Peak Element' : 'Find Minimum'}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="value"
                      value={inputs.value}
                      onChange={handleInputChange}
                      placeholder="Enter target"
                      className="input flex-grow"
                      disabled={isAnimating}
                    />
                    <button 
                      onClick={() => handleOperation('search')} 
                      className={sharedButtonClass(true)} 
                      disabled={isAnimating || !inputs.value || arrayState.length === 0}
                    >
                      <Search size={16} className="mr-2" /> Search
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* New Array Button */}
          {topicData.name !== 'Sqrt(x)' && (
            <>
              <hr />
              <div>
                <button onClick={handleNewArray} className={sharedButtonClass()} disabled={isAnimating}>
                  <Dice5 size={16} className="mr-2" /> New Array
                </button>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  const renderControlsContent = () => {
    if (topicData?.type === 'binarySearchProblem') return renderBinarySearchProblemControlsContent();
    if (dataStructures[decodedTopic]) return renderDataStructureControlsContent();
    if (decodedTopic === 'Linear Search') return renderLinearSearchControlsContent();
    if (decodedTopic === 'Binary Search') return renderBinarySearchControlsContent();
    return null;
  };

  if (!topicData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

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
                <h1 className="text-2xl font-bold text-gray-900">{decodedTopic}</h1>
                <p className="text-sm text-gray-600 capitalize">{topicData.type}</p>
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
                  <p className="text-gray-700 leading-relaxed">{topicData.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Complexity</h3>
                  <div className="space-y-2">
                    {Object.entries(topicData.complexity).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="font-mono font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  {topicData.operations && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Operations:</h4>
                      <div className="flex flex-wrap gap-2">
                        {topicData.operations.map((op) => (
                          <span
                            key={op}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          >
                            {op}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        
        {/* --- Mobile Controls (Top, Collapsible) --- */}
        <div className="lg:hidden mb-6">
          {renderControlsContent() && (
            <div className="card">
              <button
                onClick={() => setMobileControlsVisible(!mobileControlsVisible)}
                className="w-full flex justify-between items-center font-semibold text-lg"
              >
                <span>{topicData?.name} Controls</span>
                <motion.div animate={{ rotate: mobileControlsVisible ? 180 : 0 }}>
                   <ChevronDown size={24} />
                </motion.div>
              </button>
              <AnimatePresence>
                {mobileControlsVisible && (
                  <motion.div
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: 'auto', marginTop: '1.5rem' },
                      collapsed: { opacity: 0, height: 0, marginTop: 0 }
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    {renderControlsContent()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Left Column (Visualization) --- */}
          <div className="lg:w-2/3 space-y-8">
            <Visualizer 
              topic={decodedTopic} 
              isDataStructure={topicData.type === 'dataStructure'}
            />

            {/* Standalone Controls for Algorithms */}
            {(topicData?.type === 'algorithm' || topicData?.type === 'binarySearchProblem') && totalSteps > 1 && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Controls</h3>
                <div className="flex items-center gap-4">
                    <button onClick={handlePlayPause} className="btn btn-primary w-24" disabled={totalSteps <= 1}>
                        {isPlaying ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={handleReset} className="btn btn-secondary" disabled={totalSteps <= 1}>
                          <RotateCcw size={14} className="mr-1" /> Reset
                      </button>
                      <button onClick={handlePrevious} className="btn btn-secondary" disabled={stepIndex === 0}>
                          <ArrowLeft size={14} className="mr-1" /> Previous
                      </button>
                      <button onClick={handleNext} className="btn btn-secondary" disabled={stepIndex >= totalSteps - 1}>
                          Next <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Step {stepIndex + 1} of {totalSteps}</span>
                    <span>{Math.round(((stepIndex + 1) / (totalSteps || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      className="bg-primary-600 h-2.5 rounded-full"
                      animate={{ width: `${((stepIndex + 1) / (totalSteps || 1)) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <OperationDetails details={operationDetails} />
          </div>

          {/* --- Right Column (Controls) --- */}
          <div className="hidden lg:block lg:w-1/3 lg:sticky top-24 self-start">
            {renderControlsContent() && <div className="card">{renderControlsContent()}</div>}
          </div>
        </div>
      </div>

      {/* Floating AI Tutor */}
      <AITutorChat />
    </div>
  )
}

export default Visualize 