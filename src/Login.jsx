import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { signInWithRedirect } from 'aws-amplify/auth';
import { useTranslation } from './locales/i18n';

const Login = () => {
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f5f5f5',
        gap: 3,
        margin: 0,
        padding: 0,
      }}
    >
      <Typography variant="h4" sx={{ color: '#000000' }}>
        {t('auth.welcome')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleLogin}
      >
        {t('auth.loginButton')}
      </Button>
    </Box>
  );
};

export default Login;
