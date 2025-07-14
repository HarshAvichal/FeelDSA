// Import all sorting algorithms
export { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort } from './sorting.js';

// Import all searching algorithms
export { linearSearch, binarySearch } from './searching.js';

// Import all dynamic programming algorithms
export { fibonacciDP, longestCommonSubsequence } from './dynamicProgramming.js';

// Create a combined algorithms object for backward compatibility
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort } from './sorting.js';
import { linearSearch, binarySearch } from './searching.js';
import { fibonacciDP, longestCommonSubsequence } from './dynamicProgramming.js';

export const algorithms = {
  'Bubble Sort': bubbleSort,
  'Selection Sort': selectionSort,
  'Insertion Sort': insertionSort,
  'Merge Sort': mergeSort,
  'Quick Sort': quickSort,
  'Linear Search': linearSearch,
  'Binary Search': binarySearch,
  'Fibonacci DP': fibonacciDP,
  'Longest Common Subsequence': longestCommonSubsequence
}; 