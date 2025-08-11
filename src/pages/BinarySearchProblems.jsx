import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Code, Target, TrendingUp, RotateCcw, Minus, Calculator } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DsaCard from '../components/DsaCard'
import { binarySearchProblems } from '../utils/algorithms/binarySearchProblems'

const BinarySearchProblems = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const navigate = useNavigate()

  // Convert problems object to array format
  const problemsList = useMemo(() => {
    return Object.entries(binarySearchProblems).map(([key, problem]) => ({
      topic: key,
      description: problem.description,
      category: problem.category,
      complexity: problem.complexity,
      difficulty: problem.difficulty,
      example: problem.example
    }))
  }, [])

  const filteredProblems = useMemo(() => {
    return problemsList.filter(problem => {
      const matchesSearch = problem.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty.toLowerCase() === selectedDifficulty
      return matchesSearch && matchesDifficulty
    })
  }, [problemsList, searchTerm, selectedDifficulty])

  const difficulties = [
    { id: 'all', name: 'All Difficulties', color: 'bg-gray-500' },
    { id: 'easy', name: 'Easy', color: 'bg-green-500' },
    { id: 'medium', name: 'Medium', color: 'bg-yellow-500' },
    { id: 'hard', name: 'Hard', color: 'bg-red-500' }
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProblemIcon = (topic) => {
    switch (topic) {
      case 'First Occurrence':
      case 'Last Occurrence':
        return Target
      case 'Peak Element':
        return TrendingUp
      case 'Search in Rotated Array':
      case 'Find Minimum in Rotated Array':
        return RotateCcw
      case 'Sqrt(x)':
        return Calculator
      default:
        return Code
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Binary Search Problems
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Master Common Interview Questions
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Practice popular binary search variations with step-by-step visualizations. 
              Perfect for interview preparation and understanding advanced binary search concepts.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex space-x-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${difficulty.color}`}></div>
                  <span className="hidden sm:inline">{difficulty.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Problems Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProblems.map((problem, index) => {
            const IconComponent = getProblemIcon(problem.topic)
            return (
              <motion.div
                key={problem.topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{problem.topic}</h3>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{problem.description}</p>
                  </div>

                  {/* Example */}
                  {problem.example && (
                    <div className="px-6 py-4 bg-gray-50">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Example:</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><span className="font-medium">Input:</span> {problem.example.input}</p>
                        {problem.example.target && (
                          <p><span className="font-medium">Target:</span> {problem.example.target}</p>
                        )}
                        <p><span className="font-medium">Output:</span> {problem.example.output}</p>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="px-6 py-4 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-mono">{problem.complexity}</span>
                      <button
                        onClick={() => navigate(`/visualize/binary-search-problems/${problem.topic.toLowerCase().replace(/\s+/g, '-')}`)}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        Practice
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Empty State */}
        {filteredProblems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No problems found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or difficulty filter.
            </p>
          </motion.div>
        )}
      </div>

      {/* Learning Tips Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tips for Binary Search Problems
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Master these common patterns to ace your technical interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Identify the Pattern</h3>
              <p className="text-gray-600">
                Look for sorted arrays, monotonic functions, or problems that can be divided into two parts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Handle Edge Cases</h3>
              <p className="text-gray-600">
                Pay attention to duplicates, empty arrays, and boundary conditions in your implementation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Practice Variations</h3>
              <p className="text-gray-600">
                Master different binary search variations to handle various problem types confidently.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BinarySearchProblems 