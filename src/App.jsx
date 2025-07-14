import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { VisualizerProvider } from './context/VisualizerContext'
import Home from './pages/Home'
import Visualize from './pages/Visualize'
import EnhancedBubbleSort from './pages/EnhancedBubbleSort'
import './App.css'

function App() {
  return (
    <VisualizerProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 font-sans">
          <Toaster 
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visualize/:topic" element={<Visualize />} />
            <Route path="/enhanced-bubble-sort" element={<EnhancedBubbleSort />} />
          </Routes>
        </div>
      </Router>
    </VisualizerProvider>
  )
}

export default App 