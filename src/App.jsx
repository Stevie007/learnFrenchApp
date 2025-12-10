import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Typography, Box, Tabs, Tab, Button, CircularProgress } from '@mui/material';
import TranslationModule from './TranslationModule';
import VocabularyModule from './VocabularyModule';
import Login from './Login';
import Callback from './Callback';
import { useTranslation } from './locales/i18n';
import { useAuth } from './AuthContext';

// Global configuration
const MAX_TEXT_LENGTH = parseInt(import.meta.env.VITE_MAX_TEXT_LENGTH) || 4000;
const MAX_TEXT_TO_AUDIO_LENGTH = parseInt(import.meta.env.VITE_MAX_TEXT_TO_AUDIO_LENGTH) || 4000;
const TOP_MARGIN = '25px'; // Adjust this value to change the app's vertical position

function MainApp() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [vocabularyList, setVocabularyList] = useState([]);
  const username = user?.attributes?.email || user?.attributes?.name || user?.signInDetails?.loginId || 'User';
  const [currentTranslationUrl, setCurrentTranslationUrl] = useState('');
  
  // Global developer mode state
  const [developerMode, setDeveloperMode] = useState(() => {
    const saved = localStorage.getItem('developerMode');
    return saved === 'true';
  });
  
  // Translation module state (lifted to persist across tab switches)
  const [translationInput, setTranslationInput] = useState('');
  const [translationResult, setTranslationResult] = useState('');
  const [translation, setTranslation] = useState('');
  const [translationTripple, setTranslationTripple] = useState([]);
  const [audioUrl, setAudioUrl] = useState('');
  const [addedVocabIndex, setAddedVocabIndex] = useState(new Set()); // Track which vocabulary items were added (multi-select)
  const [translatePressed, setTranslatePressed] = useState(false); // Track if translate button was pressed

  // Username now comes from Cognito authentication

  // Persist developer mode to localStorage
  useEffect(() => {
    localStorage.setItem('developerMode', developerMode.toString());
  }, [developerMode]);

  // Load vocabulary from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('learnFrenchVocabulary');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setVocabularyList(parsed);
        console.log('Loaded vocabulary from localStorage:', parsed.length, 'items');
      } catch (error) {
        console.error('Failed to parse vocabulary from localStorage:', error);
      }
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: TOP_MARGIN, mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          size="small" 
          variant="outlined" 
          onClick={logout}
        >
          {t('auth.logoutButton')}
        </Button>
      </Box>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: '#000000' }}>
        {t('app.title')}
        <Typography variant="subtitle1" align="center" gutterBottom sx={{ fontSize: '0.9rem' }}>
          {t('app.subtitle', { maxText: MAX_TEXT_LENGTH, maxAudio: MAX_TEXT_TO_AUDIO_LENGTH })}
          - {username && <span style={{ fontWeight: 'bold', color: '#0055A4' }}>{t('app.userLabel', { username })} </span>}
        </Typography>
      </Typography>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab 
            label={t('app.tabs.translation')}
            sx={{ 
              backgroundColor: '#e6f2ff',
              '&.Mui-selected': { 
                backgroundColor: '#cce5ff',
                fontWeight: 'bold'
              }
            }} 
          />
          <Tab 
            label={t('app.tabs.vocabulary')}
            sx={{ 
              backgroundColor: '#fff4e6',
              '&.Mui-selected': { 
                backgroundColor: '#ffe8cc',
                fontWeight: 'bold'
              }
            }} 
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <TranslationModule 
          vocabularyList={vocabularyList}
          setVocabularyList={setVocabularyList}
          username={username}
          onUrlChange={setCurrentTranslationUrl}
          input={translationInput}
          setInput={setTranslationInput}
          result={translationResult}
          setResult={setTranslationResult}
          translation={translation}
          setTranslation={setTranslation}
          translationTripple={translationTripple}
          setTranslationTripple={setTranslationTripple}
          audioUrl={audioUrl}
          setAudioUrl={setAudioUrl}
          addedVocabIndex={addedVocabIndex}
          setAddedVocabIndex={setAddedVocabIndex}
          translatePressed={translatePressed}
          setTranslatePressed={setTranslatePressed}
          developerMode={developerMode}
          setDeveloperMode={setDeveloperMode}
        />
      )}
      {activeTab === 1 && (
        <VocabularyModule 
          vocabularyList={vocabularyList}
          setVocabularyList={setVocabularyList}
          username={username}
          currentTranslationUrl={currentTranslationUrl}
          developerMode={developerMode}
        />
      )}
    </Container>
  );
}

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/callback" element={<Callback />} />
      <Route
        path="/"
        element={isAuthenticated ? <MainApp /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
