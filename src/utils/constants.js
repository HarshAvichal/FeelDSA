// Unique ID generator for elements
let nextId = 1;
export const getUniqueId = () => nextId++;

// Common step types for visualizations
export const STEP_TYPES = {
  COMPARISON: 'comparison',
  SWAP: 'swap',
  INSERT: 'insert',
  DELETE: 'delete',
  ACCESS: 'access',
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info'
};

// Highlight types for visualization
export const HIGHLIGHT_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  ERROR: 'error',
  SPOTLIGHT: 'spotlight'
};

// Default configuration
export const DEFAULT_CONFIG = {
  ARRAY_SIZE: 8,
  MIN_VALUE: 1,
  MAX_VALUE: 100,
  MATRIX_MAX_DIMENSION: 10
}; 