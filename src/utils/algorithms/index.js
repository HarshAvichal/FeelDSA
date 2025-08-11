// Import all sorting algorithms
export { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort } from './sorting.js';

// Import all searching algorithms
export { linearSearch, binarySearch } from './searching.js';

// Import all dynamic programming algorithms
export { fibonacciDP, longestCommonSubsequence } from './dynamicProgramming.js';

// Import binary search problems
export { binarySearchProblems } from './binarySearchProblems.js';

// Create a combined algorithms object for backward compatibility
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort } from './sorting.js';
import { linearSearch, binarySearch } from './searching.js';
import { fibonacciDP, longestCommonSubsequence } from './dynamicProgramming.js';
import { binarySearchProblems } from './binarySearchProblems.js';

export const algorithms = {
  'Bubble Sort': bubbleSort,
  'Selection Sort': selectionSort,
  'Insertion Sort': insertionSort,
  'Merge Sort': mergeSort,
  'Quick Sort': quickSort,
  'Linear Search': linearSearch,
  'Binary Search': binarySearch,
  'Fibonacci DP': fibonacciDP,
  'Longest Common Subsequence': longestCommonSubsequence,
  'Popular Binary Search Problems': {
    name: 'Popular Binary Search Problems',
    description: 'Master common interview questions using binary search',
    complexity: 'O(log n)',
    category: 'Problem Variations',
    difficulty: 'Medium',
    isProblemCategory: true,
    problems: binarySearchProblems
  }
}; 