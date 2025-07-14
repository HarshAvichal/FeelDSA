import { deepCopy, createStep, isValidIndex } from '../helpers.js';
import { getUniqueId } from '../constants.js';

/**
 * Arrays Data Structure
 * A linear data structure that stores elements of the same data type in contiguous memory locations.
 */
export const arrays = {
  name: 'Arrays',
  description: 'A linear data structure that stores elements of the same data type in contiguous memory locations.',
  operations: ['create', 'access', 'insert', 'update', 'delete', 'search', 'sort'],
  complexity: {
    access: 'O(1)',
    search: 'O(n)',
    insert: 'O(n)',
    delete: 'O(n)',
  },
  operationDetails: {
    create: {
      complexity: { time: 'O(1) or O(n)', space: 'O(n)' },
      code: `// Creates an array of a given size.
// In C++, this can be a static or dynamic array.
int arr[10]; // Static
int* dynArr = new int[size]; // Dynamic`
    },
    update: {
      complexity: { time: 'O(1)', space: 'O(1)' },
      code: `// Updates an element at a given index.
void update(int arr[], int index, int value) {
  // Assuming index is valid
  arr[index] = value;
}`
    },
    insert: {
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: `// Inserts an element at a given index.
// This requires shifting elements to the right.
void insert(int arr[], int& size, int index, int value) {
  for (int i = size; i > index; i--) {
    arr[i] = arr[i - 1];
  }
  arr[index] = value;
  size++;
}`
    },
    delete: {
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: `// Deletes an element at a given index.
// This requires shifting elements to the left.
void remove(int arr[], int& size, int index) {
  for (int i = index; i < size - 1; i++) {
    arr[i] = arr[i + 1];
  }
  size--;
}`
    },
    access: {
      complexity: { time: 'O(1)', space: 'O(1)' },
      code: `// Accesses an element at a given index.
int access(int arr[], int index) {
  return arr[index];
}`
    },
    search: {
      complexity: { time: 'O(n)', space: 'O(1)' },
      code: `// Searches for a value in the array (Linear Search).
int search(int arr[], int size, int value) {
  for (int i = 0; i < size; i++) {
    if (arr[i] == value) {
      return i; // Found
    }
  }
  return -1; // Not found
}`
    },
    sort: {
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: `// Sorts the array using Bubble Sort.
void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1]);
      }
    }
  }`
    }
  },
  visualizations: {
    create: (currentState, customArray, capacityOverride) => {
      const steps = [];
      const capacity = capacityOverride || 10;
      const newArray = new Array(capacity).fill(null);
      const elementsToCreate = customArray.slice(0, capacity);
      elementsToCreate.forEach((val, i) => {
        newArray[i] = { id: getUniqueId(), value: val };
      });
      const description = capacityOverride
        ? `Created a new array with ${elementsToCreate.length} elements.`
        : `Created a new array with ${elementsToCreate.length} custom elements and a capacity of ${capacity}.`;
      steps.push({
        array: [...newArray],
        highlightedIndices: {},
        operationDescription: description
      });
      return steps;
    },
    update: (currentState, index, value) => {
      const steps = [];
      const state = deepCopy(currentState);
      if (index < 0 || index >= state.length || state[index] === null) {
        steps.push({ array: state, highlightedIndices: {}, operationDescription: `Error: Cannot update at index ${index}.` });
        return steps;
      }
      steps.push({
        array: deepCopy(state),
        highlightedIndices: { primary: [index] },
        operationDescription: `Preparing to update value at index ${index} to ${value}.`
      });
      state[index].value = value;
      steps.push({
        array: deepCopy(state),
        highlightedIndices: { primary: [index], success: [index] },
        operationDescription: `Successfully updated index ${index} to ${value}.`
      });
      return steps;
    },
    insert: (currentState, value, index) => {
      const steps = [];
      const state = deepCopy(currentState);
      const firstEmptyIndex = state.findIndex(v => v === null);
      if (firstEmptyIndex === -1) {
        steps.push({ array: state, highlightedIndices: {}, operationDescription: `Error: No capacity to insert. Array is full.` });
        return steps;
      }
      const isAppending = index === firstEmptyIndex;
      const opText = isAppending ? "append" : "insert";
      const opTextPast = isAppending ? "appended" : "inserted";
      steps.push({
        array: deepCopy(state),
        highlightedIndices: { primary: [index] },
        operationDescription: `Preparing to ${opText} value ${value}${isAppending ? '' : ` at index ${index}`}.`
      });
      const shiftedIndices = Array.from({length: firstEmptyIndex - index}, (_, i) => i + index);
      if (shiftedIndices.length > 0) {
        steps.push({
          array: deepCopy(state),
          highlightedIndices: { secondary: shiftedIndices },
          operationDescription: `Shifting elements from index ${index} to the right.`
        });
      }
      const finalState = deepCopy(currentState);
      finalState.splice(index, 0, { id: getUniqueId(), value });
      finalState.pop();
      steps.push({
        array: finalState,
        highlightedIndices: { primary: [index], success: [index] },
        operationDescription: `Successfully ${opTextPast} ${value}${isAppending ? ' to the end' : ` at index ${index}`}.`
      });
      return steps;
    },
    delete: (currentState, index) => {
      const steps = [];
      const state = deepCopy(currentState);
      if (state.length === 0 || index < 0 || index >= state.length || state[index] === null) {
        steps.push({ array: state, highlightedIndices: {}, operationDescription: `Error: Cannot delete at index ${index}.` });
        return steps;
      }
      const deletedValue = state[index].value;
      steps.push({
        array: deepCopy(state),
        highlightedIndices: { primary: [index] },
        operationDescription: `Preparing to delete element ${deletedValue} at index ${index}.`
      });
      const lastNotNullIndex = state.findLastIndex(v => v !== null);
      const shiftedIndices = Array.from({length: lastNotNullIndex - index}, (_, i) => i + index + 1);
      if (shiftedIndices.length > 0) {
        steps.push({
          array: deepCopy(state),
          highlightedIndices: { secondary: shiftedIndices },
          operationDescription: `Shifting elements to the left.`
        });
      }
      const finalState = deepCopy(currentState);
      finalState.splice(index, 1);
      finalState.push(null);
      steps.push({
        array: finalState,
        highlightedIndices: {},
        operationDescription: `Successfully deleted ${deletedValue} from index ${index}.`
      });
      return steps;
    },
    access: (currentState, index) => {
      const steps = [];
      if (index < 0 || index >= currentState.length || currentState[index] === null) {
        steps.push({ array: [...currentState], highlightedIndices: {}, operationDescription: `Error: Index ${index} is out of bounds or empty.` });
        return steps;
      }
      steps.push({
        array: [...currentState],
        highlightedIndices: { primary: [index] },
        operationDescription: `Accessed element at index ${index}. Value is ${currentState[index].value}.`
      });
      return steps;
    },
    search: (currentState, value) => {
      const steps = [];
      for (let i = 0; i < currentState.length; i++) {
        if (currentState[i] === null) continue;
        steps.push({
          array: [...currentState],
          highlightedIndices: { primary: [i] },
          operationDescription: `Searching... checking index ${i}. Is ${currentState[i].value} equal to ${value}?`
        });
        if (currentState[i].value === value) {
          steps.push({
            array: [...currentState],
            highlightedIndices: { success: [i] },
            operationDescription: `Value ${value} successfully found at index ${i}.`
          });
          return steps;
        }
      }
      steps.push({
        array: [...currentState],
        highlightedIndices: {},
        operationDescription: `Value ${value} not found in the array.`
      });
      return steps;
    },
    sort: (currentState, algorithmName = 'Bubble Sort') => {
      return [
        { array: [...currentState], highlightedIndices: {}, operationDescription: `Sorting operation will be handled by the algorithms module using ${algorithmName}.` }
      ];
    }
  }
}; 