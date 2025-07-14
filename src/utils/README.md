# Algorithms and Data Structures - Modular Architecture

This directory contains a modular, industry-standard implementation of algorithms and data structures for the FeelDSA application.

## Architecture Overview

The codebase has been refactored from a monolithic `algorithms.js` file into a modular structure that follows industry best practices:

```
src/utils/
├── constants.js              # Shared constants and configuration
├── helpers.js                # Utility functions and helpers
├── algorithms.js             # Main entry point (backward compatible)
├── algorithms/               # Algorithm implementations
│   ├── index.js             # Algorithm exports
│   ├── sorting.js           # Sorting algorithms
│   ├── searching.js         # Searching algorithms
│   └── dynamicProgramming.js # Dynamic programming algorithms
└── dataStructures/          # Data structure implementations
    ├── index.js             # Data structure exports
    ├── arrays.js            # Array data structure
    ├── stack.js             # Stack data structure
    └── twoDArrays.js        # 2D Arrays data structure
```

## Key Features

### 1. **Modular Design**
- Each algorithm and data structure is in its own module
- Clear separation of concerns
- Easy to add new algorithms or data structures
- Better maintainability and testability

### 2. **Industry Standards**
- ES6 modules with proper imports/exports
- JSDoc documentation for all functions
- Consistent naming conventions
- Separation of logic and visualization

### 3. **Backward Compatibility**
- The main `algorithms.js` file maintains the same API
- All existing functionality is preserved
- No breaking changes to the application

### 4. **Enhanced Maintainability**
- Shared utilities in `helpers.js`
- Constants in `constants.js`
- Reusable step creation with `createStep()`
- Consistent error handling

## Module Structure

### Algorithms Module (`algorithms/`)

#### Sorting Algorithms (`sorting.js`)
- **Bubble Sort**: O(n²) time complexity
- **Selection Sort**: O(n²) time complexity  
- **Insertion Sort**: O(n²) time complexity
- **Merge Sort**: O(n log n) time complexity
- **Quick Sort**: O(n log n) average, O(n²) worst case

#### Searching Algorithms (`searching.js`)
- **Linear Search**: O(n) time complexity
- **Binary Search**: O(log n) time complexity

#### Dynamic Programming (`dynamicProgramming.js`)
- **Fibonacci DP**: O(n) time complexity
- **Longest Common Subsequence**: O(m×n) time complexity

### Data Structures Module (`dataStructures/`)

#### Arrays (`arrays.js`)
- Operations: create, access, insert, update, delete, search, sort
- Full visualization support for all operations
- Integration with sorting algorithms

#### Stack (`stack.js`)
- Operations: push, pop, peek, isEmpty
- LIFO (Last In First Out) principle
- Complete visualization support

#### 2D Arrays (`twoDArrays.js`)
- Operations: create, access, update, search, traverse
- Multiple traversal algorithms (Row-Major, Column-Major, Spiral, Diagonal)
- Matrix visualization support

## Usage

### Importing Algorithms
```javascript
// Import specific algorithms
import { bubbleSort, quickSort } from './algorithms/sorting.js';
import { linearSearch, binarySearch } from './algorithms/searching.js';

// Import all algorithms
import { algorithms } from './algorithms/index.js';
```

### Importing Data Structures
```javascript
// Import specific data structures
import { arrays } from './dataStructures/arrays.js';
import { stack } from './dataStructures/stack.js';

// Import all data structures
import { dataStructures } from './dataStructures/index.js';
```

### Using the Main API (Backward Compatible)
```javascript
import { 
  algorithms, 
  dataStructures, 
  getAlgorithmSteps, 
  getOperationSteps 
} from './algorithms.js';

// Get algorithm steps
const steps = getAlgorithmSteps('Bubble Sort', array);

// Get data structure operation steps
const steps = getOperationSteps('Arrays', 'insert', currentState, value, index);
```

## Adding New Algorithms

1. Create a new file in the appropriate subdirectory
2. Export the algorithm object with required properties:
   ```javascript
   export const newAlgorithm = {
     name: 'Algorithm Name',
     description: 'Algorithm description',
     complexity: { time: 'O(n)', space: 'O(1)' },
     steps: (array) => { /* implementation */ }
   };
   ```
3. Add the export to the corresponding `index.js` file
4. Update the main `algorithms.js` file if needed

## Adding New Data Structures

1. Create a new file in `dataStructures/`
2. Export the data structure object with required properties:
   ```javascript
   export const newDataStructure = {
     name: 'Data Structure Name',
     description: 'Description',
     operations: ['op1', 'op2'],
     complexity: { op1: 'O(1)', op2: 'O(n)' },
     visualizations: {
       op1: (currentState, ...args) => { /* implementation */ }
     }
   };
   ```
3. Add the export to `dataStructures/index.js`
4. Update the main `algorithms.js` file if needed

## Benefits of This Refactoring

1. **Maintainability**: Each algorithm/data structure is isolated
2. **Testability**: Individual modules can be tested independently
3. **Scalability**: Easy to add new features without affecting existing code
4. **Readability**: Clear structure and documentation
5. **Reusability**: Shared utilities and consistent patterns
6. **Performance**: Better tree-shaking and code splitting
7. **Collaboration**: Multiple developers can work on different modules

## Migration Notes

- All existing functionality is preserved
- The main `algorithms.js` file serves as the entry point
- No changes needed in the application code
- All animations and visualizations work exactly as before
- Performance is maintained or improved

This modular architecture provides a solid foundation for future development while maintaining all existing functionality and user experience. 