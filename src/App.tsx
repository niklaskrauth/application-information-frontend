import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Stack,
  Link,
} from '@mui/material';
import type { Job, JobsResponse } from './types';
import './App.css';

// Backend URL - can be configured via environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    // Filter jobs based on search term
    const filtered = jobs.filter((job) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        job.name.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower) ||
        job.website.toLowerCase().includes(searchLower) ||
        job.salary.toLowerCase().includes(searchLower) ||
        job.employmentType.toLowerCase().includes(searchLower) ||
        job.period.toLowerCase().includes(searchLower) ||
        job.comments.toLowerCase().includes(searchLower)
      );
    });
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BACKEND_URL}/jobs`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
      }
      
      const data: JobsResponse = await response.json();
      setJobs(data.rows);
      setFilteredJobs(data.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderMobileCard = (job: Job, index: number) => (
    <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {job.name}
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            <strong>Location:</strong> {job.location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Website:</strong>{' '}
            <Link href={job.website} target="_blank" rel="noopener noreferrer">
              {job.website}
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Salary:</strong> {job.salary}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Employment Type:</strong> {job.employmentType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Period:</strong> {job.period}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Application Date:</strong> {new Date(job.applicationDate).toLocaleDateString()}
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {job.homeOfficeOption && (
              <Chip label="Home Office" color="primary" size="small" />
            )}
          </Box>
          {job.comments && (
            <Typography variant="body2" color="text.secondary">
              <strong>Comments:</strong> {job.comments}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Job Applications Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Track and manage your job applications
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search jobs"
          placeholder="Search by name, location, salary, type, period, or comments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </Typography>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : filteredJobs.length === 0 ? (
        <Alert severity="info">
          {jobs.length === 0 ? 'No jobs found. Start by adding some jobs!' : 'No jobs match your search criteria.'}
        </Alert>
      ) : isMobile ? (
        <Box>
          {filteredJobs.map((job, index) => renderMobileCard(job, index))}
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="jobs table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Website</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Salary</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Period</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Home Office</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobs.map((job, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    '&:hover': { backgroundColor: 'action.selected' },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {job.name}
                  </TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Link href={job.website} target="_blank" rel="noopener noreferrer" sx={{ maxWidth: 150, display: 'inline-block' }}>
                      {job.website}
                    </Link>
                  </TableCell>
                  <TableCell>{job.salary}</TableCell>
                  <TableCell>{job.employmentType}</TableCell>
                  <TableCell>{job.period}</TableCell>
                  <TableCell>{new Date(job.applicationDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {job.homeOfficeOption && (
                      <Chip label="Home Office" color="primary" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {job.comments || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default App;
