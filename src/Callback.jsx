import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Callback = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Wait a moment for Amplify to process the OAuth callback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Re-check authentication status
      await checkAuth();
      
      // Navigate to home page
      navigate('/');
    };

    handleCallback();
  }, [checkAuth, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ color: '#000000' }}>
        Signing you in...
      </Typography>
    </Box>
  );
};

export default Callback;
