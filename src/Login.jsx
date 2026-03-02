import React from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { signInWithRedirect } from 'aws-amplify/auth';
import { SESSION_EXPIRED_STORAGE_KEY } from './authFetch';
import { useTranslation } from './locales/i18n';

const Login = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [sessionExpired, setSessionExpired] = React.useState(false);

  React.useEffect(() => {
    const queryExpired = new URLSearchParams(location.search).get('reason') === 'expired';
    const storageExpired = sessionStorage.getItem(SESSION_EXPIRED_STORAGE_KEY) === '1';

    if (storageExpired) {
      sessionStorage.removeItem(SESSION_EXPIRED_STORAGE_KEY);
    }

    setSessionExpired(queryExpired || storageExpired);
  }, [location.search]);

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
      {sessionExpired && (
        <Alert severity="warning" sx={{ maxWidth: 480 }}>
          {t('auth.sessionExpired')}
        </Alert>
      )}
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
