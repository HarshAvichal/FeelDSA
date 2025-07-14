import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart3, 
  GitBranch, 
  Layers, 
  Network, 
  Search, 
  SortAsc, 
  Box, 
  TreePine,
  Hash,
  Cpu
} from 'lucide-react'

const topicIcons = {
  'Bubble Sort': SortAsc,
  'Selection Sort': SortAsc,
  'Insertion Sort': SortAsc,
  'Linear Search': Search,
  'Binary Search': Search,
  'Fibonacci DP': Cpu,
  'Longest Common Subsequence': Hash,
  'Stack': Box,
  'Queue': Layers,
  'Linked List': GitBranch,
  'Binary Tree': TreePine,
  'Arrays': BarChart3,
  'Graphs': Network
}

const DsaCard = ({ topic, description, category, complexity, onClick }) => {
  const navigate = useNavigate()
  const IconComponent = topicIcons[topic] || BarChart3

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(`/visualize/${encodeURIComponent(topic)}`)
    }
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="card cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
            <IconComponent className="w-6 h-6 text-primary-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              {topic}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {category}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
          
          {complexity && (
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Time: <span className="font-mono font-medium">{complexity.time}</span></span>
              <span>Space: <span className="font-mono font-medium">{complexity.space}</span></span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-sm text-primary-600 font-medium group-hover:text-primary-700 transition-colors duration-200">
        <span>Start Learning</span>
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
          className="ml-1"
        >
          →
        </motion.div>
      </div>
    </motion.div>
  )
}

export default DsaCard 