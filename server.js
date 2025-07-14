import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tutorHandler from './api/tutor.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API route
app.post('/api/tutor', tutorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
}); 