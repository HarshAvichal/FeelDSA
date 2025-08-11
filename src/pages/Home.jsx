import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Code, Brain, Cpu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DsaCard from '../components/DsaCard'
import { algorithms, dataStructures } from '../utils/algorithms'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Data Structure')
  const navigate = useNavigate()

  // Combine algorithms and data structures
  const allTopics = useMemo(() => {
    const algorithmTopics = Object.entries(algorithms).map(([name, data]) => {
      let category = 'Algorithm'
      if (name.includes('DP') || name.includes('Dynamic Programming')) {
        category = 'Dynamic Programming'
      }
      return {
        topic: name,
        description: data.description,
        category: category,
        complexity: data.complexity
      }
    })

    const dataStructureTopics = Object.entries(dataStructures).map(([name, data]) => ({
      topic: name,
      description: data.description,
      category: 'Data Structure',
      complexity: data.complexity
    }))

    return [...algorithmTopics, ...dataStructureTopics]
  }, [])

  const filteredTopics = useMemo(() => {
    return allTopics.filter(topic => {
      const matchesSearch = topic.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           topic.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allTopics, searchTerm, selectedCategory])

  const categories = [
    { id: 'Data Structure', name: 'Data Structures', icon: Brain },
    { id: 'Algorithm', name: 'Algorithms', icon: Code },
    { id: 'all', name: 'All', icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              FeelDSA
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Visual Data Structures & Algorithms Learning Platform
            </p>
            <p className="text-lg text-primary-200 max-w-2xl mx-auto">
              Master DSA concepts through interactive visualizations, step-by-step animations, 
              and AI-powered tutoring. Learn by seeing, not just reading.
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
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="flex space-x-2">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Topics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.topic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {topic.topic === 'Bubble Sort' ? (
                <DsaCard
                  topic={topic.topic}
                  description={topic.description}
                  category={topic.category}
                  complexity={topic.complexity}
                  onClick={() => navigate('/enhanced-bubble-sort')}
                />
              ) : topic.topic === 'Popular Binary Search Problems' ? (
                <DsaCard
                  topic={topic.topic}
                  description={topic.description}
                  category={topic.category}
                  complexity={topic.complexity}
                  onClick={() => navigate('/binary-search-problems')}
                />
              ) : (
                <DsaCard
                  topic={topic.topic}
                  description={topic.description}
                  category={topic.category}
                  complexity={topic.complexity}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredTopics.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No topics found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or category filter.
            </p>
          </motion.div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FeelDSA?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines the power of visual learning with AI assistance 
              to make DSA concepts crystal clear.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual Learning</h3>
              <p className="text-gray-600">
                See algorithms in action with step-by-step animations that highlight 
                exactly what's happening at each stage.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Tutor</h3>
              <p className="text-gray-600">
                Get personalized help from our context-aware AI tutor that understands 
                what you're currently learning.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Practice</h3>
              <p className="text-gray-600">
                Control the pace of your learning with play, pause, and step-by-step 
                navigation through algorithms.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 