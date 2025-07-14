// Import all data structure modules
export { arrays } from './arrays.js';
export { stack } from './stack.js';
export { twoDArrays } from './twoDArrays.js';

// Create a combined dataStructures object for backward compatibility
import { arrays } from './arrays.js';
import { stack } from './stack.js';
import { twoDArrays } from './twoDArrays.js';

export const dataStructures = {
  'Arrays': arrays,
  'Stack': stack,
  'Queue': {
    description: 'A linear data structure that follows the First In First Out (FIFO) principle.',
    operations: ['enqueue', 'dequeue', 'front', 'isEmpty'],
    complexity: {
      enqueue: 'O(1)',
      dequeue: 'O(1)',
      front: 'O(1)',
      isEmpty: 'O(1)'
    }
  },
  'Linked List': {
    description: 'A linear data structure where elements are stored in nodes, and each node points to the next node in the sequence.',
    operations: ['insert', 'delete', 'search', 'traverse'],
    complexity: {
      insert: 'O(1) at beginning, O(n) at end',
      delete: 'O(1) at beginning, O(n) at end',
      search: 'O(n)',
      traverse: 'O(n)'
    }
  },
  'Binary Tree': {
    description: 'A hierarchical data structure where each node has at most two children, referred to as left child and right child.',
    operations: ['insert', 'delete', 'search', 'traverse'],
    complexity: {
      insert: 'O(log n) average, O(n) worst',
      delete: 'O(log n) average, O(n) worst',
      search: 'O(log n) average, O(n) worst',
      traverse: 'O(n)'
    }
  },
  'Graphs': {
    description: 'A non-linear data structure consisting of vertices (nodes) and edges that connect these vertices.',
    operations: ['addVertex', 'addEdge', 'removeVertex', 'removeEdge', 'traverse'],
    complexity: {
      addVertex: 'O(1)',
      addEdge: 'O(1)',
      removeVertex: 'O(V + E)',
      removeEdge: 'O(1)',
      traverse: 'O(V + E)'
    }
  },
  '2D Arrays': twoDArrays
}; 