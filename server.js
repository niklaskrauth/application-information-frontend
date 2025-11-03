import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for development
app.use(cors());
app.use(express.json());

// Store jobs data in memory
let jobsData = { rows: [] };

// POST endpoint to receive jobs data from backend
app.post('/api/jobs', (req, res) => {
  console.log('Received POST request with jobs data');
  
  // Validate request body
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid request body' });
  }
  
  if (!Array.isArray(req.body.rows)) {
    return res.status(400).json({ success: false, message: 'Request body must contain a "rows" array' });
  }
  
  jobsData = req.body;
  console.log(`Updated jobs data with ${jobsData.rows.length} jobs`);
  res.json({ success: true, message: 'Jobs data received', count: jobsData.rows.length });
});

// GET endpoint to retrieve current jobs data
app.get('/api/jobs', (req, res) => {
  console.log('Sending jobs data to frontend');
  res.json(jobsData);
});

// Serve static files from the React app - must come after API routes
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - send index.html for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`POST jobs to http://localhost:${PORT}/api/jobs`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});