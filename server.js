import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple tutor endpoint that won't crash without OpenAI config
app.post('/api/tutor', (req, res) => {
  try {
    const { userQuestion, context } = req.body;
    
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API not configured',
        message: 'Please create a .env file with your OPENAI_API_KEY'
      });
    }
    
    // Import tutor handler dynamically to avoid crashes
    import('./api/tutor.js').then(module => {
      const tutorHandler = module.default;
      tutorHandler(req, res);
    }).catch(err => {
      console.error('Error importing tutor handler:', err);
      res.status(500).json({
        error: 'Tutor service unavailable',
        message: 'Please check your OpenAI configuration'
      });
    });
    
  } catch (error) {
    console.error('Error in tutor endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log(`[server]: Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.OPENAI_API_KEY) {
    console.log(`[server]: OpenAI API configured with model: ${process.env.OPENAI_MODEL || 'gpt-4'}`);
  } else {
    console.log(`[server]: ⚠️  OpenAI API not configured. Create a .env file with OPENAI_API_KEY`);
    console.log(`[server]: ⚠️  AI Tutor will not work until configured`);
  }
}); 