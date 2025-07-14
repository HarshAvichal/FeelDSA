import { deepCopy, createStep } from '../helpers.js';

/**
 * Fibonacci Dynamic Programming Algorithm
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export const fibonacciDP = {
  name: 'Fibonacci DP',
  description: 'Dynamic programming approach to calculate Fibonacci numbers using memoization to avoid redundant calculations.',
  complexity: {
    time: 'O(n)',
    space: 'O(n)'
  },
  steps: (array) => {
    const steps = [];
    const n = 8; // Calculate first 8 Fibonacci numbers
    const dp = new Array(n + 1).fill(0);
    
    steps.push(createStep(
      [...dp],
      {},
      `Initializing DP array with ${n + 1} elements for Fibonacci calculation`,
      { highlightedIndex: -1 }
    ));
    
    // Base cases
    dp[0] = 0;
    dp[1] = 1;
    
    steps.push(createStep(
      [...dp],
      {},
      `Setting base cases: dp[0] = 0, dp[1] = 1`,
      { highlightedIndex: 1 }
    ));
    
    for (let i = 2; i <= n; i++) {
      steps.push(createStep(
        [...dp],
        {},
        `Calculating dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]}`,
        { highlightedIndex: i }
      ));
      
      dp[i] = dp[i - 1] + dp[i - 2];
      
      steps.push(createStep(
        [...dp],
        {},
        `dp[${i}] = ${dp[i]} (Fibonacci number ${i})`,
        { highlightedIndex: i }
      ));
    }
    
    return steps;
  }
};

/**
 * Longest Common Subsequence Algorithm
 * Time Complexity: O(m×n)
 * Space Complexity: O(m×n)
 */
export const longestCommonSubsequence = {
  name: 'Longest Common Subsequence',
  description: 'Dynamic programming algorithm to find the longest subsequence present in two sequences in the same order.',
  complexity: {
    time: 'O(m×n)',
    space: 'O(m×n)'
  },
  steps: (array) => {
    const steps = [];
    const str1 = "ABCDGH";
    const str2 = "AEDFHR";
    const m = str1.length;
    const n = str2.length;
    
    // Create DP table
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    steps.push(createStep(
      [str1, str2],
      {},
      `Finding LCS of "${str1}" and "${str2}" using DP table`,
      { highlightedIndex: -1 }
    ));
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          steps.push(createStep(
            [str1, str2],
            {},
            `Characters match: ${str1[i - 1]} == ${str2[j - 1]}. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
            { highlightedIndex: i - 1 }
          ));
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          steps.push(createStep(
            [str1, str2],
            {},
            `Characters don't match. dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}`,
            { highlightedIndex: i - 1 }
          ));
        }
      }
    }
    
    steps.push(createStep(
      [str1, str2],
      {},
      `LCS length = ${dp[m][n]}. LCS = "ADH"`,
      { highlightedIndex: -1 }
    ));
    
    return steps;
  }
}; 