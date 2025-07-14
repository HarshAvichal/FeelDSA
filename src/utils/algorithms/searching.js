import { deepCopy, createStep } from '../helpers.js';

/**
 * Linear Search Algorithm
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export const linearSearch = {
  name: 'Linear Search',
  description: 'A method for finding a target value within a list by checking each element in sequence until the target is found.',
  complexity: {
    time: 'O(n)',
    space: 'O(1)'
  },
  operationDetails: {
    search: {
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: `// Linear Search implementation
int linearSearch(int arr[], int n, int target) {
  for (int i = 0; i < n; i++) {
    if (arr[i] == target) {
      return i;  // Found!
    }
  }
  return -1;  // Not found
}

// Alternative implementation with early exit
int linearSearchOptimized(int arr[], int n, int target) {
  for (int i = 0; i < n; i++) {
    if (arr[i] == target) {
      return i;  // Found!
    }
    // Early exit if we've passed where the target could be
    // (useful if array is sorted)
    if (arr[i] > target) {
      break;
    }
  }
  return -1;  // Not found
}`
    }
  },
  steps: (array, target) => {
    const steps = [];
    const arr = [...array];
    
    steps.push({
      array: arr,
      highlightedPointers: {},
      operationDescription: `Starting Linear Search. Target: ${target}.`
    });

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === null) continue;

      steps.push({
        array: arr,
        highlightedPointers: { pointer: i },
        operationDescription: `Checking index ${i}. Is ${arr[i].value} equal to ${target}?`
      });
      
      if (arr[i].value === target) {
        steps.push({
          array: arr,
          highlightedPointers: { success: i },
          operationDescription: `Target ${target} found at index ${i}.`
        });
        return steps;
      }
    }
    
    steps.push({
      array: arr,
      highlightedPointers: {},
      operationDescription: `Target ${target} not found in the array. Search concluded.`
    });
    
    return steps;
  }
};

/**
 * Binary Search Algorithm
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
export const binarySearch = {
  name: 'Binary Search',
  description: 'A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
  complexity: {
    time: 'O(log n)',
    space: 'O(1)'
  },
  operationDetails: {
    search: {
      complexity: { time: 'O(log n)', space: 'O(1)' },
      code: `// Binary Search implementation
int binarySearch(int arr[], int n, int target) {
  int start = 0;
  int end = n - 1;
  
  while (start <= end) {
    int mid = start + (end - start) / 2;
    
    if (arr[mid] == target) {
      return mid;  // Found!
    }
    else if (arr[mid] < target) {
      start = mid + 1;  // Search right half
    }
    else {
      end = mid - 1;  // Search left half
    }
  }
  return -1;  // Not found
}`
    },
    sort: {
      complexity: { time: 'O(n log n)', space: 'O(1)' },
      code: `// Quick sort for preparing binary search
void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

int partition(int arr[], int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  
  for (int j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      swap(arr[i], arr[j]);
    }
  }
  swap(arr[i + 1], arr[high]);
  return i + 1;
}`
    }
  },
  steps: (array, target) => {
    const steps = [];
    const arr = [...array].filter(item => item !== null);
    
    // Binary search assumes a sorted array. The sorting is handled separately in the UI.
    const originalIndices = arr.map(item => array.findIndex(orig => orig && orig.id === item.id));

    let start = 0;
    let end = arr.length - 1;

    // Initial state
    steps.push({
      array: [...array],
      highlightedPointers: { start: originalIndices[start], end: originalIndices[end] },
      activeRange: originalIndices.slice(start, end + 1),
      operationDescription: `Starting Binary Search. Target: ${target}. Search range is from index ${start} to ${end}.`
    });

    while (start <= end) {
      let mid = Math.floor(start + (end - start) / 2);
      let originalMidIndex = originalIndices[mid];

      // Highlight mid calculation
      steps.push({
        array: [...array],
        highlightedPointers: { start: originalIndices[start], end: originalIndices[end], mid: originalMidIndex },
        activeRange: originalIndices.slice(start, end + 1),
        operationDescription: `Calculated mid = floor((${start} + ${end}) / 2) = ${mid}. Comparing target with value at mid: ${arr[mid].value}.`
      });

      if (arr[mid].value === target) {
        steps.push({
          array: [...array],
          highlightedPointers: { success: originalMidIndex },
          activeRange: [],
          operationDescription: `Target ${target} found at index ${mid} (original index ${originalMidIndex}).`
        });
        return steps;
      }

      if (arr[mid].value < target) {
        const oldStart = start;
        start = mid + 1;
        steps.push({
          array: [...array],
          highlightedPointers: { start: originalIndices[start], end: originalIndices[end] },
          activeRange: originalIndices.slice(start, end + 1),
          operationDescription: `Value at mid (${arr[mid].value}) < target (${target}). Discarding left half. New start is ${start}.`
        });
      } else {
        const oldEnd = end;
        end = mid - 1;
        steps.push({
          array: [...array],
          highlightedPointers: { start: originalIndices[start], end: originalIndices[end] },
          activeRange: originalIndices.slice(start, end + 1),
          operationDescription: `Value at mid (${arr[mid].value}) > target (${target}). Discarding right half. New end is ${end}.`
        });
      }
    }

    steps.push({
      array: [...array],
      highlightedPointers: {},
      activeRange: [],
      operationDescription: `Target ${target} not found in the array. Search concluded.`
    });

    return steps;
  }
}; 