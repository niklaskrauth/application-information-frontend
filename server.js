import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for development
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting for upload endpoint - max 10 uploads per 15 minutes per IP
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many file uploads from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for POST jobs endpoint - max 60 requests per 15 minutes per IP
const postJobsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for GET jobs endpoint - max 100 requests per minute per IP
const getJobsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const JOBS_FILE_PATH = path.join(dataDir, 'jobs.json');

// Store jobs data in memory (fallback)
let jobsData = { rows: [] };

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dataDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'jobs.json');
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'));
    }
  }
});

// Load jobs from file on startup if it exists
if (fs.existsSync(JOBS_FILE_PATH)) {
  try {
    const fileContent = fs.readFileSync(JOBS_FILE_PATH, 'utf8');
    jobsData = JSON.parse(fileContent);
    console.log(`Loaded ${jobsData.rows?.length || 0} jobs from file`);
  } catch (error) {
    console.error('Error loading jobs from file:', error);
  }
}

// POST endpoint to upload JSON file
app.post('/api/upload', uploadLimiter, upload.single('file'), (req, res) => {
  console.log('Received file upload request');
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  try {
    // Read and validate the uploaded file
    const fileContent = fs.readFileSync(JOBS_FILE_PATH, 'utf8');
    const uploadedData = JSON.parse(fileContent);
    
    // Validate that it has the expected structure
    if (!uploadedData || typeof uploadedData !== 'object') {
      if (fs.existsSync(JOBS_FILE_PATH)) {
        fs.unlinkSync(JOBS_FILE_PATH); // Remove invalid file
      }
      return res.status(400).json({ success: false, message: 'Invalid JSON structure' });
    }
    
    if (!Array.isArray(uploadedData.rows)) {
      if (fs.existsSync(JOBS_FILE_PATH)) {
        fs.unlinkSync(JOBS_FILE_PATH); // Remove invalid file
      }
      return res.status(400).json({ success: false, message: 'JSON must contain a "rows" array' });
    }
    
    // Update in-memory data
    jobsData = uploadedData;
    console.log(`Uploaded and stored ${jobsData.rows.length} jobs`);
    
    res.json({ 
      success: true, 
      message: 'File uploaded successfully', 
      count: jobsData.rows.length 
    });
  } catch (error) {
    // Remove the file if parsing failed
    if (fs.existsSync(JOBS_FILE_PATH)) {
      fs.unlinkSync(JOBS_FILE_PATH);
    }
    console.error('Error processing uploaded file:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Invalid JSON file: ' + error.message 
    });
  }
});

// POST endpoint to receive jobs data from backend (legacy support)
app.post('/api/jobs', postJobsLimiter, (req, res) => {
  console.log('Received POST request with jobs data');
  
  // Validate request body
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid request body' });
  }
  
  if (!Array.isArray(req.body.rows)) {
    return res.status(400).json({ success: false, message: 'Request body must contain a "rows" array' });
  }
  
  // Validate that only expected properties are in the root object
  const allowedRootKeys = ['rows'];
  const receivedKeys = Object.keys(req.body);
  const unexpectedKeys = receivedKeys.filter(key => !allowedRootKeys.includes(key));
  
  if (unexpectedKeys.length > 0) {
    console.warn(`Received unexpected keys in request: ${unexpectedKeys.join(', ')}`);
  }
  
  // Store the data in memory and write to file
  jobsData = { rows: req.body.rows };
  
  try {
    fs.writeFileSync(JOBS_FILE_PATH, JSON.stringify(jobsData, null, 2));
    console.log(`Updated jobs data with ${jobsData.rows.length} jobs and saved to file`);
  } catch (error) {
    console.error('Error writing jobs to file:', error);
  }
  
  res.json({ success: true, message: 'Jobs data received', count: jobsData.rows.length });
});

// GET endpoint to retrieve current jobs data
app.get('/api/jobs', getJobsLimiter, (req, res) => {
  console.log('Sending jobs data to frontend');
  
  // Try to read from file first, fall back to in-memory data
  if (fs.existsSync(JOBS_FILE_PATH)) {
    try {
      const fileContent = fs.readFileSync(JOBS_FILE_PATH, 'utf8');
      const fileData = JSON.parse(fileContent);
      res.json(fileData);
      return;
    } catch (error) {
      console.error('Error reading jobs from file:', error);
    }
  }
  
  // Fallback to in-memory data
  res.json(jobsData);
});

// Serve static files from the React app - must come after API routes
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - send index.html for all other routes
app.use((req, res) => {
  // Only send index.html if no response has been sent yet
  if (!res.headersSent) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`POST jobs to http://localhost:${PORT}/api/jobs`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});