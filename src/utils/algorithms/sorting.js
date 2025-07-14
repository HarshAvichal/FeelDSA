import { deepCopy, createStep } from '../helpers.js';

/**
 * Bubble Sort Algorithm
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
export const bubbleSort = {
  name: 'Bubble Sort',
  description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)'
  },
  code: `// Bubble Sort in C++
void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}
`,
  steps: (array) => {
    const steps = [];
    const arr = deepCopy(array);
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push(createStep(
          arr,
          { primary: [j, j + 1] },
          `Comparing arr[${j}] (${arr[j].value}) and arr[${j + 1}] (${arr[j + 1].value})`
        ));
        
        if (arr[j].value > arr[j + 1].value) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push(createStep(
            arr,
            { primary: [j, j + 1], success: [j, j + 1] },
            `Swapped. New order for these two: [${arr[j].value}, ${arr[j + 1].value}]`
          ));
        }
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
  description: 'An in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist.',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)'
  },
  code: `// Selection Sort in C++
void selectionSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    int temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;
  }
}
`,
  steps: (array) => {
    const steps = [];
    const arr = deepCopy(array);
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      
      steps.push(createStep(
        arr,
        { primary: [i] },
        `Finding minimum element starting from index ${i}`
      ));
      
      for (let j = i + 1; j < n; j++) {
        steps.push(createStep(
          arr,
          { primary: [j], secondary: [minIndex] },
          `Comparing arr[${j}] (${arr[j].value}) with current minimum arr[${minIndex}] (${arr[minIndex].value})`
        ));
        
        if (arr[j].value < arr[minIndex].value) {
          minIndex = j;
          steps.push(createStep(
            arr,
            { primary: [j] },
            `New minimum found: arr[${j}] (${arr[j].value})`
          ));
        }
      }
      
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        steps.push(createStep(
          arr,
          { success: [i] },
          `Swapped. Element ${arr[i].value} is now in correct position.`
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
  description: 'A simple sorting algorithm that builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array.',
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
}
`,
  steps: (array) => {
    const steps = [];
    const arr = deepCopy(array);
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
      const key = deepCopy(arr[i]); // Deep copy to avoid reference issues
      let j = i - 1;
      
      steps.push(createStep(
        arr,
        { primary: [i] },
        `Selecting element ${key.value} to insert into sorted portion`
      ));
      
      while (j >= 0 && arr[j].value > key.value) {
        steps.push(createStep(
          arr,
          { primary: [j + 1], secondary: [j] },
          `Shifting ${arr[j].value} to the right since ${arr[j].value} > ${key.value}`
        ));
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
      steps.push(createStep(
        arr,
        { success: [j + 1] },
        `Inserted ${key.value} at position ${j + 1}.`
      ));
    }
    
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
}
`,
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
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}
`,
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