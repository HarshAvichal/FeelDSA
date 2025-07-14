// Import from modular structure
import { algorithms } from './algorithms/index.js';
import { dataStructures } from './dataStructures/index.js';
import { generateRandomArray, getSortedArray, createStep } from './helpers.js';

// Re-export everything for backward compatibility
export { algorithms, dataStructures, generateRandomArray, getSortedArray };

// Export individual algorithms for direct access
export * from './algorithms/index.js';

// Export individual data structures for direct access
export * from './dataStructures/index.js';

// Export helper functions
export * from './helpers.js';

// Export constants
export * from './constants.js';

/**
 * Get algorithm steps for a specific algorithm
 * @param {string} algorithmName - Name of the algorithm
 * @param {Array} array - Input array
 * @param {number} target - Target value for search algorithms
 * @returns {Array} Array of steps for visualization
 */
export const getAlgorithmSteps = (algorithmName, array, target = null) => {
  const algorithm = algorithms[algorithmName];
  if (!algorithm) return [];
  
  if (algorithmName === 'Linear Search' || algorithmName === 'Binary Search') {
    return algorithm.steps(array, target || Math.floor(Math.random() * Math.max(...array.map(i => i.value))) + 1);
  }
  
  return algorithm.steps(array);
};

/**
 * Get operation steps for a specific data structure operation
 * @param {string} structureName - Name of the data structure
 * @param {string} operation - Name of the operation
 * @param {any} currentState - Current state of the data structure
 * @param {...any} args - Additional arguments for the operation
 * @returns {Array} Array of steps for visualization
 */
export const getOperationSteps = (structureName, operation, currentState, ...args) => {
  const structure = dataStructures[structureName];
  if (!structure || !structure.visualizations || !structure.visualizations[operation]) {
    return [];
  }

  // Special handling for array sorting to integrate with algorithms
  if (structureName === 'Arrays' && operation === 'sort') {
    const algorithmName = args[0] || 'Bubble Sort';
    
    if (!algorithms[algorithmName] || !algorithms[algorithmName].steps) {
      console.error(`Sorting algorithm "${algorithmName}" not found or has no steps function.`);
      return [createStep(
        [...currentState],
        {},
        `Error: Algorithm ${algorithmName} not found.`
      )];
    }

    const elementsToSort = currentState.filter(val => val !== null && val !== undefined);
    const capacity = currentState.length;
    
    const sortSteps = algorithms[algorithmName].steps(elementsToSort);
    
    const finalSteps = sortSteps.map(step => {
      const newArray = [...step.array, ...Array(capacity - step.array.length).fill(null)];
      return {
        ...step,
        array: newArray,
      };
    });

    finalSteps.unshift(createStep(
      [...currentState],
      {},
      `Starting ${algorithmName} on the array elements.`
    ));

    finalSteps.push(createStep(
      finalSteps[finalSteps.length - 1].array,
      {},
      `Array sorting complete using ${algorithmName}.`
    ));

    return finalSteps;
  }

  return structure.visualizations[operation](currentState, ...args);
}; 