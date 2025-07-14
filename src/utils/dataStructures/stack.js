import { deepCopy, createStep } from '../helpers.js';
import { getUniqueId } from '../constants.js';

/**
 * Stack Data Structure
 * A linear data structure that follows the Last In First Out (LIFO) principle.
 */
export const stack = {
  name: 'Stack',
  description: 'A linear data structure that follows the Last In First Out (LIFO) principle.',
  operations: ['push', 'pop', 'peek', 'isEmpty'],
  complexity: {
    push: 'O(1)',
    pop: 'O(1)',
    peek: 'O(1)',
    isEmpty: 'O(1)'
  },
  operationDetails: {
    push: {
      complexity: { time: 'O(1)', space: 'O(1)' },
      code: `// Pushes an element onto the stack.
void push(int value) {
  if (top >= MAX_SIZE - 1) {
    // Stack Overflow
  } else {
    stack[++top] = value;
  }
}`
    },
    pop: {
      complexity: { time: 'O(1)', space: 'O(1)' },
      code: `// Removes the top element from the stack.
int pop() {
  if (top < 0) {
    // Stack Underflow
    return 0;
  } else {
    return stack[top--];
  }
}`
    },
    peek: {
      complexity: { time: 'O(1)', space: 'O(1)' },
      code: `// Returns the top element of the stack without removing it.
int peek() {
  if (top < 0) {
    // Stack is empty
    return 0;
  } else {
    return stack[top];
  }
}`
    }
  },
  visualizations: {
    push: (currentState, value) => {
      const steps = [];
      const state = deepCopy(currentState);
      
      steps.push(createStep(
        state,
        {},
        `Preparing to push ${value} onto the stack.`
      ));
      
      state.push({ id: getUniqueId(), value });
      
      steps.push(createStep(
        state,
        { success: [state.length - 1] },
        `Successfully pushed ${value} onto the stack.`
      ));
      
      return steps;
    },
    pop: (currentState) => {
      const steps = [];
      const state = deepCopy(currentState);
      
      if (state.length === 0) {
        steps.push(createStep(
          state,
          {},
          `Error: Cannot pop from empty stack.`
        ));
        return steps;
      }
      
      const poppedValue = state[state.length - 1].value;
      steps.push(createStep(
        state,
        { primary: [state.length - 1] },
        `Preparing to pop ${poppedValue} from the stack.`
      ));
      
      state.pop();
      
      steps.push(createStep(
        state,
        {},
        `Successfully popped ${poppedValue} from the stack.`
      ));
      
      return steps;
    },
    peek: (currentState) => {
      const steps = [];
      
      if (currentState.length === 0) {
        steps.push(createStep(
          [...currentState],
          {},
          `Error: Cannot peek empty stack.`
        ));
        return steps;
      }
      
      steps.push(createStep(
        [...currentState],
        { primary: [currentState.length - 1] },
        `Peeking at the top element: ${currentState[currentState.length - 1].value}.`
      ));
      
      return steps;
    },
    isEmpty: (currentState) => {
      const steps = [];
      const isEmpty = currentState.length === 0;
      
      steps.push(createStep(
        [...currentState],
        {},
        `Stack is ${isEmpty ? 'empty' : 'not empty'}.`
      ));
      
      return steps;
    }
  }
}; 