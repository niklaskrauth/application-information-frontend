import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface UploadProps {
  onUploadSuccess: () => void;
}

function Upload({ onUploadSuccess }: UploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a JSON file to upload');
      return;
    }

    // Validate file is JSON
    if (!selectedFile.name.endsWith('.json')) {
      setError('Only JSON files are allowed');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
      }

      const data = await response.json();
      setSuccess(`Successfully uploaded ${data.count} jobs`);
      setSelectedFile(null);
      
      // Reset file input using ref
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Notify parent component to refresh data
      onUploadSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Jobs Data
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload a JSON file with job data to share it with everyone
      </Typography>

      <Stack spacing={2}>
        <Box>
          <input
            accept="application/json,.json"
            style={{ display: 'none' }}
            id="json-file-input"
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <label htmlFor="json-file-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Select JSON File
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Stack>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          Expected JSON format:
          {'\n'}
          {JSON.stringify({
            rows: [
              {
                location: "City, Country",
                website: "https://company.com",
                websiteToJobs: "https://company.com/careers",
                hasJob: true,
                name: "Job Title",
                salary: "Salary Range",
                homeOfficeOption: true,
                period: "Full-time",
                employmentType: "Permanent",
                applicationDate: "2025-01-01",
                comments: "Notes",
                foundOn: "Source",
                occupyStart: "2025-02-01"
              }
            ]
          }, null, 2)}
        </Typography>
      </Box>
    </Paper>
  );
}

export default Upload;
