import { createStep } from '../helpers.js';

// Helper function to create array with unique IDs
const createArrayWithIds = (values) => {
  return values.map((value, index) => ({
    id: `item-${index}`,
    value: value
  }));
};

// First Occurrence of Target in Sorted Array
export const firstOccurrence = {
  name: 'First Occurrence',
  description: 'Find the first occurrence of target in sorted array with duplicates',
  complexity: 'O(log n)',
  category: 'Binary Search Problems',
  difficulty: 'Medium',
  example: {
    input: '[1, 2, 2, 2, 3, 4, 5]',
    target: 2,
    output: 'Index 1 (first occurrence of 2)'
  },
  steps: (array, target) => {
    const steps = [];
    const arr = array.map(item => item.value);
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    steps.push(createStep(
      array,
      { start: left, end: right },
      `Starting first occurrence search for target ${target}. Initial range: [${left}, ${right}]`
    ));

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push(createStep(
        array,
        { start: left, end: right, mid: mid },
        `Checking middle element at index ${mid} (value: ${arr[mid]})`
      ));

      if (arr[mid] === target) {
        result = mid;
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid, success: mid },
          `Found target ${target} at index ${mid}. Checking if this is the first occurrence by searching left half.`
        ));
        right = mid - 1; // Continue searching left half
      } else if (arr[mid] < target) {
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid },
          `Target ${target} is greater than ${arr[mid]}. Searching right half.`
        ));
        left = mid + 1;
      } else {
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid },
          `Target ${target} is less than ${arr[mid]}. Searching left half.`
        ));
        right = mid - 1;
      }
    }

    if (result !== -1) {
      steps.push(createStep(
        array,
        { success: result },
        `First occurrence of ${target} found at index ${result}!`
      ));
    } else {
      steps.push(createStep(
        array,
        {},
        `Target ${target} not found in the array.`
      ));
    }

    return steps;
  }
};

// Last Occurrence of Target in Sorted Array
export const lastOccurrence = {
  name: 'Last Occurrence',
  description: 'Find the last occurrence of target in sorted array with duplicates',
  complexity: 'O(log n)',
  category: 'Binary Search Problems',
  difficulty: 'Medium',
  example: {
    input: '[1, 2, 2, 2, 3, 4, 5]',
    target: 2,
    output: 'Index 3 (last occurrence of 2)'
  },
  steps: (array, target) => {
    const steps = [];
    const arr = array.map(item => item.value);
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    steps.push(createStep(
      array,
      { start: left, end: right },
      `Starting last occurrence search for target ${target}. Initial range: [${left}, ${right}]`
    ));

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push(createStep(
        array,
        { start: left, end: right, mid: mid },
        `Checking middle element at index ${mid} (value: ${arr[mid]})`
      ));

      if (arr[mid] === target) {
        result = mid;
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid, success: mid },
          `Found target ${target} at index ${mid}. Checking if this is the last occurrence by searching right half.`
        ));
        left = mid + 1; // Continue searching right half
      } else if (arr[mid] < target) {
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid },
          `Target ${target} is greater than ${arr[mid]}. Searching right half.`
        ));
        left = mid + 1;
      } else {
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid },
          `Target ${target} is less than ${arr[mid]}. Searching left half.`
        ));
        right = mid - 1;
      }
    }

    if (result !== -1) {
      steps.push(createStep(
        array,
        { success: result },
        `Last occurrence of ${target} found at index ${result}!`
      ));
    } else {
      steps.push(createStep(
        array,
        {},
        `Target ${target} not found in the array.`
      ));
    }

    return steps;
  }
};

// Peak Element in Mountain Array
export const peakElement = {
  name: 'Peak Element',
  description: 'Find peak element in mountain array (strictly increasing then decreasing)',
  complexity: 'O(log n)',
  category: 'Binary Search Problems',
  difficulty: 'Medium',
  example: {
    input: '[1, 3, 5, 4, 2]',
    output: 'Index 2 (value: 5)'
  },
  steps: (array) => {
    const steps = [];
    const arr = array.map(item => item.value);
    let left = 0;
    let right = arr.length - 1;

    steps.push(createStep(
      array,
      { start: left, end: right },
      `Starting peak element search in mountain array. Initial range: [${left}, ${right}]`
    ));

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push(createStep(
        array,
        { start: left, end: right, mid: mid },
        `Checking middle element at index ${mid} (value: ${arr[mid]})`
      ));

      if (arr[mid] > arr[mid + 1]) {
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid },
          `Element at ${mid} (${arr[mid]}) > element at ${mid + 1} (${arr[mid + 1]}). Peak is in left half.`
        ));
        right = mid;
      } else {
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid },
          `Element at ${mid} (${arr[mid]}) < element at ${mid + 1} (${arr[mid + 1]}). Peak is in right half.`
        ));
        left = mid + 1;
      }
    }

    steps.push(createStep(
      array,
      { success: left },
      `Peak element found at index ${left} with value ${arr[left]}!`
    ));

    return steps;
  }
};

// Search in Rotated Sorted Array
export const searchRotatedArray = {
  name: 'Search in Rotated Array',
  description: 'Find target in rotated sorted array (no duplicates)',
  complexity: 'O(log n)',
  category: 'Binary Search Problems',
  difficulty: 'Medium',
  example: {
    input: '[4, 5, 6, 7, 0, 1, 2]',
    target: 0,
    output: 'Index 4'
  },
  steps: (array, target) => {
    const steps = [];
    const arr = array.map(item => item.value);
    let left = 0;
    let right = arr.length - 1;

    steps.push(createStep(
      array,
      { start: left, end: right },
      `Starting search for target ${target} in rotated sorted array. Initial range: [${left}, ${right}]`
    ));

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push(createStep(
        array,
        { start: left, end: right, mid: mid },
        `Checking middle element at index ${mid} (value: ${arr[mid]})`
      ));

      if (arr[mid] === target) {
        steps.push(createStep(
          array,
          { success: mid },
          `Target ${target} found at index ${mid}!`
        ));
        return steps;
      }

      // Check if left half is sorted
      if (arr[left] <= arr[mid]) {
        if (target >= arr[left] && target < arr[mid]) {
          steps.push(createStep(
            array,
            { start: left, end: right, mid: mid },
            `Left half [${left}, ${mid-1}] is sorted and target ${target} is in range [${arr[left]}, ${arr[mid-1]}]. Searching left half.`
          ));
          right = mid - 1;
        } else {
          steps.push(createStep(
            array,
            { start: left, end: right, mid: mid },
            `Left half is sorted but target ${target} is not in range. Searching right half.`
          ));
          left = mid + 1;
        }
      } else {
        // Right half is sorted
        if (target > arr[mid] && target <= arr[right]) {
          steps.push(createStep(
            array,
            { start: left, end: right, mid: mid },
            `Right half [${mid+1}, ${right}] is sorted and target ${target} is in range [${arr[mid+1]}, ${arr[right]}]. Searching right half.`
          ));
          left = mid + 1;
        } else {
          steps.push(createStep(
            array,
            { start: left, end: right, mid: mid },
            `Right half is sorted but target ${target} is not in range. Searching left half.`
          ));
          right = mid - 1;
        }
      }
    }

    steps.push(createStep(
      array,
      {},
      `Target ${target} not found in the rotated array.`
    ));

    return steps;
  }
};

// Find Minimum in Rotated Sorted Array
export const findMinRotated = {
  name: 'Find Minimum in Rotated Array',
  description: 'Find minimum element in rotated sorted array',
  complexity: 'O(log n)',
  category: 'Binary Search Problems',
  difficulty: 'Medium',
  example: {
    input: '[4, 5, 6, 7, 0, 1, 2]',
    output: 'Index 4 (value: 0)'
  },
  steps: (array) => {
    const steps = [];
    const arr = array.map(item => item.value);
    let left = 0;
    let right = arr.length - 1;

    steps.push(createStep(
      array,
      { start: left, end: right },
      `Starting minimum element search in rotated sorted array. Initial range: [${left}, ${right}]`
    ));

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push(createStep(
        array,
        { start: left, end: right, mid: mid },
        `Checking middle element at index ${mid} (value: ${arr[mid]})`
      ));

      if (arr[mid] > arr[right]) {
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid },
          `Element at ${mid} (${arr[mid]}) > element at ${right} (${arr[right]}). Minimum is in right half.`
        ));
        left = mid + 1;
      } else {
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid },
          `Element at ${mid} (${arr[mid]}) <= element at ${right} (${arr[right]}). Minimum is in left half (including mid).`
        ));
        right = mid;
      }
    }

    steps.push(createStep(
      array,
      { success: left },
      `Minimum element found at index ${left} with value ${arr[left]}!`
    ));

    return steps;
  }
};

// Sqrt(x) using Binary Search
export const sqrtBinarySearch = {
  name: 'Sqrt(x)',
  description: 'Find square root of x using binary search',
  complexity: 'O(log x)',
  category: 'Binary Search Problems',
  difficulty: 'Easy',
  example: {
    input: 'x = 16',
    output: '4'
  },
  steps: (array, target) => {
    const steps = [];
    const x = target || 16; // Default to 16 if no target provided
    let left = 0;
    let right = x;
    let result = 0;

    steps.push(createStep(
      array,
      { start: left, end: right },
      `Finding square root of ${x} using binary search. Initial range: [${left}, ${right}]`
    ));

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push(createStep(
        array,
        { start: left, end: right, mid: mid },
        `Checking if ${mid}² = ${mid * mid} <= ${x}`
      ));

      if (mid * mid <= x) {
        result = mid;
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid, success: mid },
          `${mid}² = ${mid * mid} <= ${x}. This could be the answer. Checking right half for better approximation.`
        ));
        left = mid + 1;
      } else {
        steps.push(createStep(
          array,
          { start: left, end: right, mid: mid },
          `${mid}² = ${mid * mid} > ${x}. Square root must be in left half.`
        ));
        right = mid - 1;
      }
    }

    steps.push(createStep(
      array,
      { success: result },
      `Square root of ${x} is ${result}! (${result}² = ${result * result} <= ${x})`
    ));

    return steps;
  }
};

// Export all binary search problems
export const binarySearchProblems = {
  'First Occurrence': firstOccurrence,
  'Last Occurrence': lastOccurrence,
  'Peak Element': peakElement,
  'Search in Rotated Array': searchRotatedArray,
  'Find Minimum in Rotated Array': findMinRotated,
  'Sqrt(x)': sqrtBinarySearch
}; 