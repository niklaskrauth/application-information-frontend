import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import './App.css';

function App() {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh' }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
