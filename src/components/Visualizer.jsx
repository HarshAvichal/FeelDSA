import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useVisualizer } from '../context/VisualizerContext'
import { getAlgorithmSteps, generateRandomArray } from '../utils/algorithms'

const Visualizer = ({ topic, isDataStructure }) => {
  const { 
    arrayState, 
    highlightedIndices,
    highlightedPointers,
    activeRange,
    operationDescription,
  } = useVisualizer()

  const getHighlightColor = (index) => {
    if (highlightedPointers?.success === index || highlightedIndices?.success?.includes(index)) return '#22c55e'; // Green-500 for success
    if (highlightedPointers?.mid === index) return '#60a5fa'; // Blue-400 for mid
    if (highlightedIndices?.primary?.includes(index)) return '#60a5fa'; // Blue-400 for primary
    if (highlightedPointers?.start === index) return '#4ade80'; // Green-400 for start
    if (highlightedPointers?.end === index) return '#f87171'; // Red-400 for end
    if (highlightedPointers?.pointer === index) return '#8b5cf6'; // Purple-500 for linear search pointer
    if (highlightedIndices?.secondary?.includes(index)) return '#f59e0b'; // Amber-500 for secondary
    if (activeRange?.includes(index)) return '#dbeafe'; // Light blue for active search range
    if (highlightedIndices?.eliminated?.includes(index)) return '#cbd5e1'; // Slate-300 for eliminated
    return '#e5e7eb'; // Default gray
  }

  const getTextColor = (index) => {
    if (
      highlightedPointers?.success === index ||
      highlightedPointers?.mid === index ||
      highlightedPointers?.start === index ||
      highlightedPointers?.end === index ||
      highlightedPointers?.pointer === index ||
      highlightedIndices?.success?.includes(index) ||
      highlightedIndices?.primary?.includes(index) ||
      highlightedIndices?.secondary?.includes(index)
    ) {
      return 'white';
    }
    if (highlightedIndices?.eliminated?.includes(index)) {
      return '#64748b'; // Slate-500 text for eliminated elements
    }
    if (activeRange?.includes(index)) {
      return '#1e40af'; // Darker blue text for active range
    }
    return '#374151';
  }

  const getHighlightIndicesFor2D = (rowIndex, colIndex) => {
    const { primary, secondary, success, eliminated, spotlight } = highlightedIndices || {};

    // Highest priority: primary, success, eliminated
    if (primary && primary[0][0] === rowIndex && primary[0][1] === colIndex) {
      return { background: '#3b82f6', color: 'white', scale: 1.1, shadow: '0 5px 15px rgba(59, 130, 246, 0.5)' };
    }
    if (success && success[0][0] === rowIndex && success[0][1] === colIndex) {
      return { background: '#22c55e', color: 'white', scale: 1.1, shadow: '0 5px 15px rgba(34, 197, 94, 0.5)' };
    }
    if (eliminated && eliminated.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) {
      return { background: '#9ca3af', color: '#6b7280' }; // Gray for eliminated
    }

    // Spotlight effect
    if (spotlight) {
      if (spotlight.row === rowIndex && spotlight.col === colIndex) {
        return { background: '#a5b4fc', color: '#1e3a8a' }; // Indigo, intersection
      }
      if (spotlight.row === rowIndex || spotlight.col === colIndex) {
        return { background: '#e0e7ff', color: '#3730a3' }; // Lighter Indigo, row/col
      }
    }

    // Secondary highlight
    if (secondary && secondary.some(coord => coord[0] === rowIndex && coord[1] === colIndex)) {
      return { background: '#f59e0b', color: 'white' }; // Amber
    }

    // Default
    return { background: '#e5e7eb', color: '#374151' }; // Default gray
  }

  const renderArrayElement = (item, index) => {
    const isNull = item === null;
    const value = isNull ? null : item.value;
    const key = isNull ? `null-${index}` : item.id;

    const pointers = [];
    if (highlightedPointers?.start === index) pointers.push({ label: 'Start', color: 'bg-green-500' });
    if (highlightedPointers?.end === index) pointers.push({ label: 'End', color: 'bg-red-500' });
    if (highlightedPointers?.mid === index) pointers.push({ label: 'Mid', color: 'bg-blue-500' });
    if (highlightedPointers?.success === index) pointers.push({ label: 'Found', color: 'bg-green-500' });
    if (highlightedPointers?.pointer === index) pointers.push({ label: 'Checking', color: 'bg-purple-500' });

    // Check if this element has been searched (for linear search progress)
    const hasBeenSearched = highlightedPointers?.pointer !== undefined && index < highlightedPointers.pointer;
    const isCurrentlySearching = highlightedPointers?.pointer === index;

    return (
      <motion.div
        key={key}
        layout
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex flex-col items-center space-y-1"
      >
        {/* Search Progress Indicator */}
        {hasBeenSearched && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-gray-400 rounded-full mb-1"
            transition={{ delay: 0.2 }}
          />
        )}
        
        <motion.div
          animate={{
            backgroundColor: isNull ? '#f9fafb' : getHighlightColor(index),
            color: isNull ? 'transparent' : getTextColor(index),
            scale: (highlightedPointers?.mid === index || highlightedPointers?.pointer === index || highlightedIndices?.primary?.includes(index)) ? [1, 1.15, 1] : 1,
            boxShadow: highlightedPointers?.mid === index || highlightedIndices?.primary?.includes(index)
              ? '0 10px 25px rgba(96, 165, 250, 0.4)'
              : highlightedPointers?.pointer === index
              ? '0 10px 25px rgba(139, 92, 246, 0.4)'
              : highlightedPointers?.start === index
              ? '0 8px 20px rgba(74, 222, 128, 0.3)'
              : highlightedPointers?.end === index
              ? '0 8px 20px rgba(248, 113, 113, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.1)',
            rotate: (highlightedPointers?.success === index || highlightedIndices?.success?.includes(index)) ? [0, -5, 5, -5, 0] : 0,
            y: (highlightedPointers?.mid === index || highlightedIndices?.primary?.includes(index)) ? [0, -8, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            scale: {
              type: "spring",
              stiffness: 400,
              damping: 10,
              repeat: (highlightedPointers?.mid === index || highlightedPointers?.pointer === index || highlightedIndices?.primary?.includes(index)) ? Infinity : 0,
              repeatDelay: 1
            },
            rotate: {
              duration: 0.6,
              repeat: (highlightedPointers?.success === index || highlightedIndices?.success?.includes(index)) ? 2 : 0,
            },
            y: {
              duration: 0.8,
              repeat: (highlightedPointers?.mid === index || highlightedIndices?.primary?.includes(index)) ? Infinity : 0,
              repeatDelay: 1.5
            }
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
          }}
          className={`relative w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-colors duration-300 ${
            isNull ? 'border-dashed border-gray-300' : 'border-gray-400'
          } ${hasBeenSearched ? 'opacity-60' : ''} ${highlightedPointers?.success === index || highlightedIndices?.success?.includes(index) ? 'ring-4 ring-green-300 ring-opacity-50' : ''} ${
            activeRange?.includes(index) ? 'border-blue-300 border-opacity-50' : ''
          }`}
        >
          {isNull ? '' : value}
          
          {/* Success Celebration Effect */}
          {(highlightedPointers?.success === index || highlightedIndices?.success?.includes(index)) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: 2 }}
              className="absolute inset-0 rounded-lg bg-green-300 bg-opacity-20 pointer-events-none"
            />
          )}
          
          {/* Mid Calculation / Primary Highlight Effect */}
          {(highlightedPointers?.mid === index || highlightedIndices?.primary?.includes(index)) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="absolute inset-0 rounded-lg bg-blue-300 bg-opacity-30 pointer-events-none"
            />
          )}
          
          {/* Range Transition Effect */}
          {activeRange?.includes(index) && !highlightedPointers?.start && !highlightedPointers?.end && !highlightedPointers?.mid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-lg bg-blue-200 bg-opacity-20 pointer-events-none"
            />
          )}
          
          {/* Range Change Effect for Binary Search */}
          {activeRange?.includes(index) && (highlightedPointers?.start === index || highlightedPointers?.end === index) && (
            <motion.div
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-lg bg-blue-400 bg-opacity-30 pointer-events-none"
            />
          )}
        </motion.div>
        <motion.div 
          className="w-16 text-center font-mono text-sm text-gray-500"
          animate={{
            color: highlightedIndices?.primary?.includes(index) ? '#1f2937' : '#6b7280',
            fontWeight: highlightedIndices?.primary?.includes(index) ? 'bold' : 'normal'
          }}
        >
          {index}
        </motion.div>
        <div className="h-8 mt-1 flex flex-col items-center justify-start space-y-1">
          {pointers.map(p => (
            <span key={p.label} className={`px-2 py-0.5 text-xs font-semibold text-white ${p.color} rounded-full`}>
              {p.label}
            </span>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Array Visualization</h3>
        
        {/* Search Progress Bar for Linear Search */}
        {highlightedPointers?.pointer !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Search Progress</span>
              <span>{Math.round(((highlightedPointers.pointer + 1) / arrayState.filter(item => item !== null).length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((highlightedPointers.pointer + 1) / arrayState.filter(item => item !== null).length) * 100}%` 
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
        
        {/* Binary Search Range Indicator */}
        {activeRange && activeRange.length > 0 && highlightedPointers?.start !== undefined && highlightedPointers?.end !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Search Range</span>
              <span>{activeRange.length} elements remaining</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 relative">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(activeRange.length / arrayState.filter(item => item !== null).length) * 100}%`,
                  x: `${(activeRange[0] / arrayState.filter(item => item !== null).length) * 100}%`
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ 
                  position: 'absolute',
                  left: 0,
                  transform: `translateX(${(activeRange[0] / arrayState.filter(item => item !== null).length) * 100}%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Start: {highlightedPointers.start}</span>
              <span>End: {highlightedPointers.end}</span>
              {highlightedPointers.mid !== undefined && <span>Mid: {highlightedPointers.mid}</span>}
            </div>
          </div>
        )}
        
        <div className={`min-h-[150px] bg-gray-50 p-4 rounded-lg border flex items-center justify-center`}>
          {isDataStructure && topic === 'Stack' ? (
            // Stack Visualization
            <div className="flex items-end justify-center w-full">
              <div className="flex flex-col-reverse space-y-2 space-y-reverse w-1/4">
                <AnimatePresence>
                  {arrayState.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0, backgroundColor: getHighlightColor(index), color: getTextColor(index) }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="w-full h-16 rounded-lg border-2 border-gray-300 flex items-center justify-center font-bold text-lg"
                    >
                      {item.value}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : isDataStructure && topic === '2D Arrays' ? (
            // 2D Array Visualization
            <div className="flex flex-col space-y-2 items-center">
               <AnimatePresence>
                 {arrayState.map((row, rowIndex) => (
                   <motion.div
                     key={rowIndex}
                     layout
                     className="flex space-x-2"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ delay: rowIndex * 0.1 }}
                   >
                     {row.map((item, colIndex) => {
                       const { background, color, scale = 1, shadow = 'none' } = getHighlightIndicesFor2D(rowIndex, colIndex);
                       const isNull = item === null;
                       const value = isNull ? null : item.value;
                       const key = isNull ? `null-${rowIndex}-${colIndex}` : item.id;

                       return (
                          <div key={key} className="flex flex-col items-center space-y-1">
                           <motion.div
                             layout
                             initial={{ scale: 0 }}
                             animate={{ scale: scale, backgroundColor: isNull ? '#f9fafb' : background, color: isNull ? 'transparent' : color, boxShadow: shadow }}
                             exit={{ scale: 0 }}
                             transition={{ duration: 0.4, type: 'spring' }}
                             className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-lg ${
                               isNull ? 'border-dashed border-gray-300' : 'border-gray-400'
                             }`}
                           >
                             {value}
                           </motion.div>
                            <div className="w-16 text-center font-mono text-sm text-gray-500">
                             {`[${rowIndex}][${colIndex}]`}
                           </div>
                         </div>
                       );
                     })}
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>
          ) : (
            // Default Array Visualization
            <div className="w-full flex justify-center">
               <div className="w-full overflow-x-auto">
                <div className="flex justify-center space-x-2 py-2 min-w-max px-4">
                    <AnimatePresence>
                      {arrayState.map((item, index) => renderArrayElement(item, index))}
                    </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Current Operation</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 min-h-[100px]">
          <p className="text-blue-800 font-medium whitespace-pre-line">{operationDescription}</p>
        </div>
      </div>
    </div>
  )
}

export default Visualizer 