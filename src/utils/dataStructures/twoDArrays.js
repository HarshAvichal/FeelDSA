import { deepCopy, createStep } from '../helpers.js';
import { getUniqueId } from '../constants.js';

/**
 * 2D Arrays Data Structure
 * A data structure that stores elements in a grid-like format with rows and columns.
 */
export const twoDArrays = {
    name: '2D Arrays',
    description: 'A data structure that stores elements in a grid-like format with rows and columns, providing a way to represent matrices or tables.',
    operations: ['create', 'access', 'update', 'search', 'traverse'],
    complexity: {
        access: 'O(1)',
        search: 'O(m×n)',
        insert: 'N/A',
        delete: 'N/A'
    },
    operationDetails: {
        create: {
            complexity: { time: 'O(m×n)', space: 'O(m×n)' },
            code: `// Creates a 2D array (matrix) of given dimensions.
int matrix[3][4]; // Static
int** dynMatrix = new int*[rows]; // Dynamic
for(int i = 0; i < rows; ++i) {
    dynMatrix[i] = new int[cols];
}`
        },
        access: {
            complexity: { time: 'O(1)', space: 'O(1)' },
            code: `// Accesses an element at a given row and column.
int access(int** matrix, int row, int col) {
  return matrix[row][col];
}`
        },
        update: {
            complexity: { time: 'O(1)', space: 'O(1)' },
            code: `// Updates an element at a given row and column.
void update(int** matrix, int row, int col, int value) {
  matrix[row][col] = value;
}`
        },
        search: {
            complexity: { time: 'O(m×n)', space: 'O(1)' },
            code: `// Searches for a value in the 2D array.
pair<int, int> search(int** matrix, int rows, int cols, int value) {
  for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
      if (matrix[i][j] == value) {
        return {i, j}; // Found
      }
    }
  }
  return {-1, -1}; // Not found
}`
        },
        traverse: {
            'Row-Major Traversal': {
                complexity: { time: 'O(m×n)', space: 'O(1)' },
                code: `// Visit every cell from left to right, top to bottom.
void rowMajor(int matrix[R][C]) {
    for (int i = 0; i < R; i++) {
        for (int j = 0; j < C; j++) {
            cout << matrix[i][j] << " ";
        }
    }
}`
            },
            'Column-Major Traversal': {
                complexity: { time: 'O(m×n)', space: 'O(1)' },
                code: `// Visit every cell from top to bottom, left to right.
void columnMajor(int matrix[R][C]) {
    for (int j = 0; j < C; j++) {
        for (int i = 0; i < R; i++) {
            cout << matrix[i][j] << " ";
        }
    }
}`
            },
            'Spiral Traversal': {
                complexity: { time: 'O(m×n)', space: 'O(1)' },
                code: `// Visit cells in a spiral pattern, moving inwards.
void spiral(int matrix[R][C]) {
    int top = 0, bottom = R - 1;
    int left = 0, right = C - 1;

    while (top <= bottom && left <= right) {
        for (int i = left; i <= right; i++)
            cout << matrix[top][i] << " ";
        top++;

        for (int i = top; i <= bottom; i++)
            cout << matrix[i][right] << " ";
        right--;

        if (top <= bottom) {
            for (int i = right; i >= left; i--)
                cout << matrix[bottom][i] << " ";
            bottom--;
        }

        if (left <= right) {
            for (int i = bottom; i >= top; i--)
                cout << matrix[i][left] << " ";
            left++;
        }
    }
}`
            },
            'Diagonal Traversal': {
                complexity: { time: 'O(m×n)', space: 'O(m*n)' },
                code: `// Visit cells in diagonal stripes.
void diagonal(int matrix[R][C]) {
    for (int d = 0; d < R + C - 1; d++) {
        int row_start = max(0, d - C + 1);
        int col_start = min(d, C - 1);

        for (int r = row_start, c = col_start; r <= d && r < R && c >= 0; r++, c--) {
             cout << matrix[r][c] << " ";
        }
    }
}`
            }
        }
    },
    visualizations: {
        create: (currentState, rows, cols, customInputString) => {
            if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0 || rows > 10 || cols > 10) {
                return [{ array: [], highlightedIndices: {}, operationDescription: "Error: Please provide valid dimensions (1-10 for rows/cols)." }];
            }

            // Handle custom input string if provided
            if (customInputString && customInputString.trim()) {
                try {
                    const numbers = customInputString.trim().split(/[\s,]+/).map(s => {
                        if (s === '') return null;
                        const num = parseInt(s, 10);
                        if (isNaN(num)) throw new Error(`Invalid number found: "${s}"`);
                        return num;
                    }).filter(n => n !== null);

                    if (numbers.length !== rows * cols) {
                        throw new Error(`Number of elements (${numbers.length}) does not match dimensions ${rows}x${cols}.`);
                    }

                    const newMatrix = [];
                    for (let i = 0; i < rows; i++) {
                        const row = [];
                        for (let j = 0; j < cols; j++) {
                            row.push({ id: getUniqueId(), value: numbers[i * cols + j] });
                        }
                        newMatrix.push(row);
                    }

                    return [{ array: newMatrix, highlightedIndices: {}, operationDescription: `Created a new ${rows}x${cols} 2D array from custom input.` }];

                } catch (e) {
                    return [{ array: [], highlightedIndices: {}, operationDescription: `Error: ${e.message}` }];
                }
            }

            // Handle creation of random array from dimensions
            const newMatrix = Array.from({ length: rows }, () =>
                Array.from({ length: cols }, () => ({ id: getUniqueId(), value: Math.floor(Math.random() * 90) + 10 }))
            );
            return [{ array: newMatrix, highlightedIndices: {}, operationDescription: `Created a new ${rows}x${cols} random 2D array.` }];
        },
        access: (currentState, row, col) => {
            const steps = [];
            if (row < 0 || row >= currentState.length || col < 0 || col >= currentState[0].length) {
                steps.push({ array: [...currentState], highlightedIndices: {}, operationDescription: `Error: Index [${row}][${col}] is out of bounds.` });
                return steps;
            }

            steps.push({ array: [...currentState], highlightedIndices: { spotlight: { row, col } }, operationDescription: `Focusing on row ${row} and column ${col}.` });

            steps.push({ array: [...currentState], highlightedIndices: { primary: [[row, col]] }, operationDescription: `Accessed element at [${row}][${col}]. Value is ${currentState[row][col].value}.` });
            return steps;
        },
        update: (currentState, row, col, value) => {
            const steps = [];
            const state = deepCopy(currentState);
            if (row < 0 || row >= state.length || col < 0 || col >= state[0].length) {
                steps.push({ array: state, highlightedIndices: {}, operationDescription: `Error: Index [${row}][${col}] is out of bounds.` });
                return steps;
            }

            steps.push({ array: deepCopy(state), highlightedIndices: { spotlight: { row, col } }, operationDescription: `Preparing to update value at [${row}][${col}] to ${value}.` });

            state[row][col].value = value;
            steps.push({ array: deepCopy(state), highlightedIndices: { success: [[row, col]] }, operationDescription: `Successfully updated index [${row}][${col}] to ${value}.` });
            return steps;
        },
        search: (currentState, value) => {
            const steps = [];
            steps.push({ array: [...currentState], highlightedIndices: {}, operationDescription: `Searching for value ${value} in the 2D array.` });

            for (let i = 0; i < currentState.length; i++) {
                for (let j = 0; j < currentState[i].length; j++) {
                    steps.push({ array: [...currentState], highlightedIndices: { secondary: [[i, j]] }, operationDescription: `Checking cell [${i}][${j}]... Value is ${currentState[i][j].value}.` });

                    if (currentState[i][j].value === value) {
                        steps.push({ array: [...currentState], highlightedIndices: { success: [[i, j]] }, operationDescription: `Value ${value} found at index [${i}][${j}].` });
                        return steps;
                    }
                }
            }

            steps.push({ array: [...currentState], highlightedIndices: {}, operationDescription: `Value ${value} not found in the array.` });
            return steps;
        },
        traverse: (currentState, algorithmName) => {
            const steps = [];
            const rows = currentState.length;
            if (rows === 0) return [];
            const cols = currentState[0].length;
            const visited = [];

            steps.push({ array: [...currentState], highlightedIndices: {}, operationDescription: `Starting ${algorithmName}.` });

            const addStep = (r, c) => {
                visited.push([r, c]);
                steps.push({ array: [...currentState], highlightedIndices: { primary: [[r, c]], secondary: [...visited] }, operationDescription: `Visiting cell [${r}][${c}].` });
            };

            switch (algorithmName) {
                case 'Row-Major Traversal':
                    for (let i = 0; i < rows; i++) {
                        for (let j = 0; j < cols; j++) {
                            addStep(i, j);
                        }
                    }
                    break;

                case 'Column-Major Traversal':
                    for (let j = 0; j < cols; j++) {
                        for (let i = 0; i < rows; i++) {
                            addStep(i, j);
                        }
                    }
                    break;

                case 'Spiral Traversal':
                    let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
                    while (top <= bottom && left <= right) {
                        for (let i = left; i <= right; i++) addStep(top, i);
                        top++;
                        for (let i = top; i <= bottom; i++) addStep(i, right);
                        right--;
                        if (top <= bottom) {
                            for (let i = right; i >= left; i--) addStep(bottom, i);
                            bottom--;
                        }
                        if (left <= right) {
                            for (let i = bottom; i >= top; i--) addStep(i, left);
                            left++;
                        }
                    }
                    break;

                case 'Diagonal Traversal':
                    const map = new Map();

                    for (let i = 0; i < rows; i++) {
                        for (let j = 0; j < cols; j++) {
                            const sum = i + j;
                            if (!map.has(sum)) {
                                map.set(sum, []);
                            }
                            // For even-indexed diagonals, we traverse up, so add to front
                            // For odd-indexed diagonals, we traverse down, so add to back
                            if (sum % 2 === 0) {
                                map.get(sum).unshift([i, j]);
                            } else {
                                map.get(sum).push([i, j]);
                            }
                        }
                    }

                    const sortedDiagonals = [...map.entries()].sort((a, b) => a[0] - b[0]);

                    for (const [sum, coords] of sortedDiagonals) {
                        for (const [r, c] of coords) {
                            addStep(r, c);
                        }
                    }
                    break;

                default:
                    steps.push({ array: [...currentState], highlightedIndices: {}, operationDescription: `Unknown traversal algorithm: ${algorithmName}` });
            }

            steps.push({ array: [...currentState], highlightedIndices: { success: visited }, operationDescription: `${algorithmName} complete. All cells visited.` });

            return steps;
        }
    }
}; 