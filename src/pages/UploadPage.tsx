import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Upload from '../Upload';

function UploadPage() {
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    // Redirect to dashboard after successful upload
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          📤 Upload Jobs Data
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Upload a JSON file to share job data with everyone
        </Typography>
      </Box>

      <Upload onUploadSuccess={handleUploadSuccess} />
    </Container>
  );
}

export default UploadPage;
