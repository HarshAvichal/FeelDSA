/**
 * Sorting Algorithms
 * This file contains implementations of various sorting algorithms
 * with step-by-step visualization support.
 */

import { deepCopy, createStep } from '../helpers.js';

/**
 * Bubble Sort Algorithm
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
export const bubbleSort = {
  name: 'Bubble Sort',
  description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The largest elements "bubble up" to their correct positions.',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  explanation: {
    overview: 'Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. The pass through the list is repeated until no swaps are needed.',
    howItWorks: [
      'Start from the first element and compare it with the next element',
      'If the first element is greater than the second, swap them',
      'Move to the next pair and repeat the comparison',
      'After the first pass, the largest element will be in the last position',
      'Repeat the process for the remaining elements (excluding the last sorted element)',
      'Continue until no more swaps are needed'
    ],
    advantages: [
      'Simple to understand and implement',
      'Stable sorting algorithm',
      'In-place sorting (no extra memory needed)',
      'Good for small datasets or nearly sorted data'
    ],
    disadvantages: [
      'Very inefficient for large datasets',
      'Time complexity of O(n²) makes it impractical for large lists',
      'Many unnecessary comparisons and swaps'
    ],
    optimizations: [
      'Early termination: Stop if no swaps occur in a pass',
      'Track the last swap position to reduce unnecessary comparisons',
      'Use a flag to detect if the array is already sorted'
    ]
  },
  code: `// Enhanced Bubble Sort in C++ with optimizations
void bubbleSort(int arr[], int n) {
  bool swapped;
  int lastUnsorted = n - 1;
  
  for (int i = 0; i < n - 1; i++) {
    swapped = false;
    
    for (int j = 0; j < lastUnsorted; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if they are in wrong order
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    
    // If no swapping occurred, array is sorted
    if (!swapped) {
      break;
    }
    
    // Reduce the range for next pass
    lastUnsorted--;
  }
}`,
  // Predefined datasets for demonstration
  predefinedDatasets: {
    'Random': [8, 3, 15, 6, 12, 1, 9, 4],
    'Nearly Sorted': [1, 2, 4, 3, 5, 6, 8, 7],
    'Reversed': [8, 7, 6, 5, 4, 3, 2, 1],
    'Duplicates': [3, 1, 4, 1, 5, 9, 2, 6],
    'Small': [5, 2, 8, 1, 9],
    'Large': [23, 45, 12, 67, 89, 34, 56, 78, 90, 123, 45, 67, 89, 12, 34, 56, 78, 90, 123, 45]
  },

  // Comparison data for educational purposes
  comparisonData: {
    'Bubble Sort': { time: 'O(n²)', space: 'O(1)', stability: 'Stable' },
    'Selection Sort': { time: 'O(n²)', space: 'O(1)', stability: 'Unstable' },
    'Insertion Sort': { time: 'O(n²)', space: 'O(1)', stability: 'Stable' },
    'Merge Sort': { time: 'O(n log n)', space: 'O(n)', stability: 'Stable' },
    'Quick Sort': { time: 'O(n log n)', space: 'O(log n)', stability: 'Unstable' }
  },

  steps: (array) => {
    const steps = [];
    const arr = deepCopy(array);
    const n = arr.length;
    let totalComparisons = 0;
    let totalSwaps = 0;
    let totalPasses = 0;
    
    for (let i = 0; i < n - 1; i++) {
      totalPasses++;
      let swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        totalComparisons++;
        
        steps.push(createStep(
          deepCopy(arr),
          { primary: [j], secondary: [j + 1] },
          `Comparing ${arr[j].value} with ${arr[j + 1].value}`,
          {
            pass: totalPasses,
            comparisons: totalComparisons,
            swaps: totalSwaps
          }
        ));
        
        if (arr[j].value > arr[j + 1].value) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          totalSwaps++;
          swapped = true;
          
          steps.push(createStep(
            deepCopy(arr),
            { success: [j, j + 1] },
            `Swapped ${arr[j].value} and ${arr[j + 1].value}`,
            {
              pass: totalPasses,
              comparisons: totalComparisons,
              swaps: totalSwaps
            }
          ));
        }
      }
      
      if (!swapped) {
        steps.push(createStep(
          deepCopy(arr),
          { success: Array.from({length: n}, (_, i) => i) },
          `No swaps in this pass - array is sorted!`,
          {
            pass: totalPasses,
            comparisons: totalComparisons,
            swaps: totalSwaps
          }
        ));
        break;
      }
    }
    
    return steps;
  }
};

/**
 * Selection Sort Algorithm
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
export const selectionSort = {
  name: 'Selection Sort',
  description: 'A simple sorting algorithm that divides the input list into two parts: a sorted sublist of items which is built up from left to right and a sublist of the remaining unsorted items.',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)'
  },
  code: `// Selection Sort in C++
void selectionSort(int arr[], int n) {
  for (int i = 0; i < n-1; i++) {
    int min_idx = i;
    for (int j = i+1; j < n; j++) {
      if (arr[j] < arr[min_idx]) {
        min_idx = j;
      }
    }
    int temp = arr[min_idx];
    arr[min_idx] = arr[i];
    arr[i] = temp;
  }
}`,
  steps: (array) => {
    const steps = [];
    const arr = deepCopy(array);
    const n = arr.length;
    let totalComparisons = 0;
    let totalSwaps = 0;
    let totalPasses = 0;
    
    for (let i = 0; i < n - 1; i++) {
      totalPasses++;
      let minIndex = i;
      
      steps.push(createStep(
        deepCopy(arr),
        { primary: [i] },
        `Starting pass ${totalPasses}: looking for minimum element from position ${i}`,
        {
          pass: totalPasses,
          comparisons: totalComparisons,
          swaps: totalSwaps
        }
      ));
      
      for (let j = i + 1; j < n; j++) {
        totalComparisons++;
        
        steps.push(createStep(
          deepCopy(arr),
          { primary: [minIndex], secondary: [j] },
          `Comparing ${arr[minIndex].value} with ${arr[j].value}`,
          {
            pass: totalPasses,
            comparisons: totalComparisons,
            swaps: totalSwaps
          }
        ));
        
        if (arr[j].value < arr[minIndex].value) {
          minIndex = j;
          
          steps.push(createStep(
            deepCopy(arr),
            { primary: [minIndex], secondary: [j] },
            `New minimum found: ${arr[minIndex].value} at position ${minIndex}`,
            {
              pass: totalPasses,
              comparisons: totalComparisons,
              swaps: totalSwaps
            }
          ));
        }
      }
      
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        totalSwaps++;
        
        steps.push(createStep(
          deepCopy(arr),
          { success: [i, minIndex] },
          `Swapped ${arr[i].value} with ${arr[minIndex].value}`,
          {
            pass: totalPasses,
            comparisons: totalComparisons,
            swaps: totalSwaps
          }
        ));
      } else {
        steps.push(createStep(
          deepCopy(arr),
          { success: [i] },
          `No swap needed - ${arr[i].value} is already in correct position`,
          {
            pass: totalPasses,
            comparisons: totalComparisons,
            swaps: totalSwaps
          }
        ));
      }
    }
    
    return steps;
  }
};

/**
 * Insertion Sort Algorithm
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
export const insertionSort = {
  name: 'Insertion Sort',
  description: 'A simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)'
  },
  code: `// Insertion Sort in C++
void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
  steps: (array) => {
    const steps = [];
    const arr = deepCopy(array);
    const n = arr.length;
    let totalComparisons = 0;
    let totalSwaps = 0;
    let totalPasses = 0;
    
    // Add initial state
    steps.push(createStep(
      deepCopy(arr),
      {},
      `Starting Insertion Sort with ${n} elements`,
      {
        pass: 0,
        comparisons: 0,
        swaps: 0
      }
    ));
    
    for (let i = 1; i < n; i++) {
      totalPasses++;
      const key = arr[i];
      let j = i - 1;
      
      // Show the key element being considered
      steps.push(createStep(
        deepCopy(arr),
        { primary: [i] },
        `Considering element ${key.value} at position ${i}`,
        {
          pass: totalPasses,
          comparisons: totalComparisons,
          swaps: totalSwaps
        }
      ));
      
      // Shift elements to the right while key is smaller
      while (j >= 0 && arr[j].value > key.value) {
        totalComparisons++;
        
        // Show the comparison
        steps.push(createStep(
          deepCopy(arr),
          { primary: [i], secondary: [j] },
          `Comparing ${arr[j].value} > ${key.value} - shifting ${arr[j].value} right`,
          {
            pass: totalPasses,
            comparisons: totalComparisons,
            swaps: totalSwaps
          }
        ));
        
        // Shift element to the right
        arr[j + 1] = arr[j];
        j--;
        
        // Show the shift
        steps.push(createStep(
          deepCopy(arr),
          { primary: [i], secondary: [j + 1] },
          `Shifted ${arr[j + 1].value} to position ${j + 1}`,
          {
            pass: totalPasses,
            comparisons: totalComparisons,
            swaps: totalSwaps
          }
        ));
      }
      
      // Insert the key at the correct position
      arr[j + 1] = key;
      totalSwaps++;
      
      // Show the insertion
      steps.push(createStep(
        deepCopy(arr),
        { success: [j + 1] },
        `Inserted ${key.value} at position ${j + 1}`,
        {
          pass: totalPasses,
          comparisons: totalComparisons,
          swaps: totalSwaps
        }
      ));
    }
    
    // Add final sorted state
    steps.push(createStep(
      deepCopy(arr),
      { success: Array.from({length: n}, (_, i) => i) },
      `Insertion Sort Complete! Array is now sorted in ascending order`,
      {
        pass: totalPasses,
        comparisons: totalComparisons,
        swaps: totalSwaps
      }
    ));
    
    return steps;
  }
};

/**
 * Merge Sort Algorithm
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
export const mergeSort = {
  name: 'Merge Sort',
  description: 'A divide-and-conquer algorithm that recursively breaks down a problem into two or more sub-problems until they become simple enough to solve directly.',
  complexity: {
    time: 'O(n log n)',
    space: 'O(n)'
  },
  code: `// Merge Sort in C++
void merge(int arr[], int l, int m, int r) {
  int n1 = m - l + 1;
  int n2 = r - m;
  int* L = new int[n1];
  int* R = new int[n2];
  for (int i = 0; i < n1; i++)
    L[i] = arr[l + i];
  for (int j = 0; j < n2; j++)
    R[j] = arr[m + 1 + j];
  int i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else arr[k++] = R[j++];
  }
  while (i < n1) arr[k++] = L[i++];
  while (j < n2) arr[k++] = R[j++];
  delete[] L;
  delete[] R;
}
void mergeSort(int arr[], int l, int r) {
  if (l < r) {
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}`,
  steps: (array) => {
    const steps = [];
    const arr = deepCopy(array);
    
    const merge = (left, right, startIndex) => {
      const result = [];
      let i = 0, j = 0;
      
      while (i < left.length && j < right.length) {
        steps.push(createStep(
          arr,
          { primary: [startIndex + i], secondary: [startIndex + left.length + j] },
          `Comparing left (${left[i].value}) with right (${right[j].value})`
        ));
        
        if (left[i].value <= right[j].value) {
          result.push(left[i]);
          i++;
        } else {
          result.push(right[j]);
          j++;
        }
      }
      
      while (i < left.length) {
        result.push(left[i]);
        i++;
      }
      
      while (j < right.length) {
        result.push(right[j]);
        j++;
      }
      
      // Update the original array with merged result
      for (let k = 0; k < result.length; k++) {
        arr[startIndex + k] = result[k];
      }
      
      steps.push(createStep(
        arr,
        { success: Array.from({length: result.length}, (_, i) => i + startIndex) },
        `Merged subarrays into: [${result.map(i => i.value).join(', ')}]`
      ));
    };
    
    const mergeSortRecursive = (start, end) => {
      if (end - start <= 1) return;
      
      const mid = Math.floor((start + end) / 2);
      
      steps.push(createStep(
        arr,
        {},
        `Dividing array from index ${start} to ${end - 1} into two halves.`
      ));
      
      mergeSortRecursive(start, mid);
      mergeSortRecursive(mid, end);
      
      const left = arr.slice(start, mid);
      const right = arr.slice(mid, end);
      
      steps.push(createStep(
        arr,
        {},
        `Merging sorted subarrays: left=[${left.map(i => i.value).join(', ')}], right=[${right.map(i => i.value).join(', ')}]`
      ));
      
      merge(left, right, start);
    };
    
    steps.push(createStep(
      arr,
      {},
      `Starting Merge Sort on array [${arr.map(i => i.value).join(', ')}]`
    ));
    
    mergeSortRecursive(0, arr.length);
    
    return steps;
  }
};

/**
 * Quick Sort Algorithm
 * Time Complexity: O(n log n) average, O(n²) worst case
 * Space Complexity: O(log n)
 */
export const quickSort = {
  name: 'Quick Sort',
  description: 'A highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy with a pivot element.',
  complexity: {
    time: 'O(n log n) average, O(n²) worst case',
    space: 'O(log n)'
  },
  code: `// Quick Sort in C++
int partition(int arr[], int low, int high) {
  int pivot = arr[high];
  int i = (low - 1);
  for (int j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      int temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  int temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  return (i + 1);
}
void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int pi = partition(low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}`,
  steps: (array) => {
    const steps = [];
    const arr = deepCopy(array);
    
    const partition = (low, high) => {
      const pivot = arr[high];
      let i = low - 1;
      
      steps.push(createStep(
        arr,
        { primary: [high] },
        `Selecting pivot: ${pivot.value}`
      ));
      
      for (let j = low; j < high; j++) {
        steps.push(createStep(
          arr,
          { primary: [j], secondary: [high] },
          `Comparing ${arr[j].value} with pivot ${pivot.value}`
        ));
        
        if (arr[j].value <= pivot.value) {
          i++;
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push(createStep(
              arr,
              { primary: [i, j] },
              `Swapped ${arr[i].value} and ${arr[j].value}.`
            ));
          }
        }
      }
      
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push(createStep(
        arr,
        { success: [i + 1] },
        `Placed pivot ${pivot.value} at final position ${i + 1}.`
      ));
      
      return i + 1;
    };
    
    const quickSortRecursive = (low, high) => {
      if (low < high) {
        steps.push(createStep(
          arr,
          {},
          `Quick sorting subarray from index ${low} to ${high}: [${arr.slice(low, high + 1).map(i => i.value).join(', ')}]`
        ));
        
        const pi = partition(low, high);
        
        quickSortRecursive(low, pi - 1);
        quickSortRecursive(pi + 1, high);
      }
    };
    
    steps.push(createStep(
      arr,
      {},
      `Starting Quick Sort on array [${arr.map(i => i.value).join(', ')}]`
    ));
    
    quickSortRecursive(0, arr.length - 1);
    
    return steps;
  }
};