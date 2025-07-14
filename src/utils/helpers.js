import { getUniqueId } from './constants.js';

/**
 * Creates a deep copy of an array or object
 * @param {any} obj - Object to copy
 * @returns {any} Deep copy of the object
 */
export const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Generates a random array with specified parameters
 * @param {number} size - Size of the array
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Array} Array of objects with id and value properties
 */
export const generateRandomArray = (size = 8, min = 1, max = 100) => {
  return Array.from({ length: size }, () => ({ 
    id: getUniqueId(), 
    value: Math.floor(Math.random() * (max - min + 1)) + min 
  }));
};

/**
 * Creates a step object for visualization
 * @param {Array} array - Current state of the array
 * @param {Object} highlightedIndices - Indices to highlight
 * @param {string} operationDescription - Description of the operation
 * @param {Object} additionalProps - Additional properties for the step
 * @returns {Object} Step object
 */
export const createStep = (array, highlightedIndices = {}, operationDescription = '', additionalProps = {}) => ({
  array: deepCopy(array),
  highlightedIndices,
  operationDescription,
  ...additionalProps
});

/**
 * Validates array bounds
 * @param {Array} array - Array to check
 * @param {number} index - Index to validate
 * @returns {boolean} True if index is valid
 */
export const isValidIndex = (array, index) => {
  return index >= 0 && index < array.length && array[index] !== null;
};

/**
 * Gets a sorted array without generating steps
 * @param {Array} array - Array to sort
 * @returns {Array} Sorted array
 */
export const getSortedArray = (array) => {
  const arr = deepCopy(array);
  if (arr.length <= 1) return arr;
  
  // Separate non-null and null elements
  const nonNulls = arr.filter(item => item !== null);
  const nulls = arr.filter(item => item === null);

  // Sort the non-null elements
  nonNulls.sort((a, b) => a.value - b.value);

  // Combine them back, keeping nulls at the end
  return [...nonNulls, ...nulls];
}; 