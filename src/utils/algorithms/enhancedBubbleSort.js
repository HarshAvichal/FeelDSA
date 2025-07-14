import { deepCopy, createStep } from '../helpers.js';
import { getUniqueId } from '../constants.js';

/**
 * Enhanced Bubble Sort Algorithm with Advanced Features
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
export const enhancedBubbleSort = {
  name: 'Bubble Sort',
  description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The largest elements "bubble up" to their correct positions.',
  category: 'Sorting Algorithm',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  
  // Educational content
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

  // Enhanced code with comments
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

  // Performance tracking
  performanceMetrics: {
    comparisons: 0,
    swaps: 0,
    passes: 0,
    startTime: null,
    endTime: null
  },

  // Enhanced steps with detailed tracking
  steps: (array, options = {}) => {
    const {
      showOptimization = true,
      speed = 'normal',
      viewMode = 'array'
    } = options;

    const steps = [];
    const arr = deepCopy(array);
    const n = arr.length;
    let totalComparisons = 0;
    let totalSwaps = 0;
    let totalPasses = 0;
    let swapped = false;

    // Add initial state
    steps.push(createStep(
      deepCopy(arr),
      { 
        primary: [],
        secondary: [],
        sorted: [],
        unsorted: Array.from({ length: n }, (_, i) => i)
      },
      `Starting Bubble Sort with ${n} elements. The largest elements will "bubble up" to the end.`,
      {
        pass: 0,
        comparisons: 0,
        swaps: 0,
        viewMode
      }
    ));

    for (let i = 0; i < n - 1; i++) {
      swapped = false;
      totalPasses++;
      
      steps.push(createStep(
        deepCopy(arr),
        { 
          primary: [],
          secondary: [],
          sorted: Array.from({ length: i }, (_, j) => n - 1 - j),
          unsorted: Array.from({ length: n - i }, (_, j) => j)
        },
        `Pass ${totalPasses}: Comparing adjacent elements. ${i} elements are already sorted.`,
        {
          pass: totalPasses,
          comparisons: totalComparisons,
          swaps: totalSwaps,
          viewMode
        }
      ));

      for (let j = 0; j < n - i - 1; j++) {
        totalComparisons++;
        
        // Show comparison step with two different highlights
        steps.push(createStep(
          deepCopy(arr),
          { 
            primary: [j], // left
            secondary: [j + 1], // right
            sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
            unsorted: Array.from({ length: n - i }, (_, k) => k).filter(k => k !== j && k !== j + 1)
          },
          `Comparing arr[${j}] (${arr[j].value}) and arr[${j + 1}] (${arr[j + 1].value})`,
          {
            pass: totalPasses,
            comparisons: totalComparisons,
            swaps: totalSwaps,
            viewMode
          }
        ));

        if (arr[j].value > arr[j + 1].value) {
          // Show swap step
          steps.push(createStep(
            deepCopy(arr),
            { 
              primary: [j],
              secondary: [j + 1],
              sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
              unsorted: Array.from({ length: n - i }, (_, k) => k).filter(k => k !== j && k !== j + 1),
              success: [j, j + 1]
            },
            `${arr[j].value} > ${arr[j + 1].value}, swapping elements`,
            {
              pass: totalPasses,
              comparisons: totalComparisons,
              swaps: totalSwaps,
              viewMode
            }
          ));

          // Perform swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          totalSwaps++;
          swapped = true;

          // Show after swap
          steps.push(createStep(
            deepCopy(arr),
            { 
              primary: [j],
              secondary: [j + 1],
              sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
              unsorted: Array.from({ length: n - i }, (_, k) => k).filter(k => k !== j && k !== j + 1),
              success: [j, j + 1]
            },
            `Swapped! New order: [${arr[j].value}, ${arr[j + 1].value}]`,
            {
              pass: totalPasses,
              comparisons: totalComparisons,
              swaps: totalSwaps,
              viewMode
            }
          ));
        }
      }

      // Show end of pass
      steps.push(createStep(
        deepCopy(arr),
        { 
          primary: [],
          secondary: [],
          sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
          unsorted: Array.from({ length: n - i - 1 }, (_, k) => k)
        },
        `End of Pass ${totalPasses}: ${totalSwaps} swaps made. ${i + 1} elements are now sorted.`,
        {
          pass: totalPasses,
          comparisons: totalComparisons,
          swaps: totalSwaps,
          viewMode
        }
      ));

      // Early termination optimization
      if (showOptimization && !swapped) {
        steps.push(createStep(
          deepCopy(arr),
          { 
            primary: [],
            secondary: [],
            sorted: Array.from({ length: n }, (_, k) => k),
            unsorted: []
          },
          `Optimization: No swaps in this pass! Array is already sorted. Terminating early.`,
          {
            pass: totalPasses,
            comparisons: totalComparisons,
            swaps: totalSwaps,
            viewMode,
            optimized: true
          }
        ));
        break;
      }
    }

    // Final sorted state
    steps.push(createStep(
      deepCopy(arr),
      { 
        primary: [],
        secondary: [],
        sorted: Array.from({ length: n }, (_, k) => k),
        unsorted: []
      },
      `Bubble Sort Complete! Array is now sorted in ascending order.`,
      {
        pass: totalPasses,
        comparisons: totalComparisons,
        swaps: totalSwaps,
        viewMode,
        complete: true
      }
    ));

    return steps;
  },

  // Predefined datasets for demonstration
  predefinedDatasets: {
    'Random': [8, 3, 15, 6, 12, 1, 9, 4],
    'Nearly Sorted': [1, 2, 4, 3, 5, 6, 8, 7],
    'Reverse Sorted': [9, 8, 7, 6, 5, 4, 3, 2],
    'Already Sorted': [1, 2, 3, 4, 5, 6, 7, 8],
    'With Duplicates': [5, 2, 5, 8, 2, 1, 5, 8],
    'Small Dataset': [4, 2, 1, 3],
    'Large Dataset': [23, 45, 12, 67, 34, 89, 56, 78, 90, 12, 34, 56, 78, 90, 23, 45, 67, 89, 12, 34]
  },

  // Comparison with other algorithms
  comparisonData: {
    'Bubble Sort': {
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      stability: 'Stable',
      inPlace: 'Yes',
      bestCase: 'O(n)',
      averageCase: 'O(n²)',
      worstCase: 'O(n²)'
    },
    'Selection Sort': {
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      stability: 'Unstable',
      inPlace: 'Yes',
      bestCase: 'O(n²)',
      averageCase: 'O(n²)',
      worstCase: 'O(n²)'
    },
    'Insertion Sort': {
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      stability: 'Stable',
      inPlace: 'Yes',
      bestCase: 'O(n)',
      averageCase: 'O(n²)',
      worstCase: 'O(n²)'
    },
    'Merge Sort': {
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      stability: 'Stable',
      inPlace: 'No',
      bestCase: 'O(n log n)',
      averageCase: 'O(n log n)',
      worstCase: 'O(n log n)'
    },
    'Quick Sort': {
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      stability: 'Unstable',
      inPlace: 'Yes',
      bestCase: 'O(n log n)',
      averageCase: 'O(n log n)',
      worstCase: 'O(n²)'
    }
  }
};

export default enhancedBubbleSort; 