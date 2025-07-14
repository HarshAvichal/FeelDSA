import { createContext, useContext, useReducer } from 'react'

const VisualizerContext = createContext()

const initialState = {
  currentTopic: '',
  stepIndex: 0,
  arrayState: [],
  highlightedIndex: -1,
  highlightedIndices: {},
  highlightedPointers: {},
  activeRange: [],
  operationDescription: '',
  isPlaying: false,
  speed: 1000,
  totalSteps: 0,
  operationDetails: {
    complexity: null,
    code: null,
  },
}

const visualizerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOPIC':
      return {
        ...state,
        currentTopic: action.payload,
        stepIndex: 0,
        arrayState: [],
        highlightedIndex: -1,
        highlightedIndices: {},
        operationDescription: ''
      }
    
    case 'SET_ARRAY_STATE':
      return {
        ...state,
        arrayState: action.payload
      }
    
    case 'SET_STEP':
      return {
        ...state,
        arrayState: action.payload.array || state.arrayState,
        stepIndex: action.payload.stepIndex,
        highlightedIndex: action.payload.highlightedIndex || -1,
        highlightedIndices: action.payload.highlightedIndices || {},
        highlightedPointers: action.payload.highlightedPointers || {},
        activeRange: action.payload.activeRange || [],
        operationDescription: action.payload.operationDescription || ''
      }
    
    case 'SET_HIGHLIGHTED_INDEX':
      return {
        ...state,
        highlightedIndex: action.payload
      }
    
    case 'SET_OPERATION_DESCRIPTION':
      return {
        ...state,
        operationDescription: action.payload
      }
    
    case 'SET_PLAYING':
      return {
        ...state,
        isPlaying: action.payload
      }
    
    case 'SET_SPEED':
      return {
        ...state,
        speed: action.payload
      }
    
    case 'SET_TOTAL_STEPS':
      return {
        ...state,
        totalSteps: action.payload,
        isPlaying: false,
      }
    
    case 'SET_OPERATION_DETAILS':
      return {
        ...state,
        operationDetails: action.payload,
      };

    case 'CLEAR_ARRAY':
      return { 
        ...state, 
        arrayState: [], 
        stepIndex: 0, 
        totalSteps: 1, 
        highlightedIndices: {}, 
        highlightedPointers: {},
        activeRange: [],
        operationDescription: 'Array cleared. Ready for a new operation.',
        operationDetails: null,
      };

    case 'RESET':
      return {
        ...initialState,
        currentTopic: state.currentTopic,
        arrayState: state.arrayState,
      }
    
    default:
      return state
  }
}

export const VisualizerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(visualizerReducer, initialState)

  const value = {
    ...state,
    dispatch
  }

  return (
    <VisualizerContext.Provider value={value}>
      {children}
    </VisualizerContext.Provider>
  )
}

export const useVisualizer = () => {
  const context = useContext(VisualizerContext)
  if (!context) {
    throw new Error('useVisualizer must be used within a VisualizerProvider')
  }
  return context
} 