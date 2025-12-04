import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import TranslationModule from './TranslationModule';
import VocabularyModule from './VocabularyModule';

// Global configuration
const MAX_TEXT_LENGTH = parseInt(import.meta.env.VITE_MAX_TEXT_LENGTH) || 4000;
const MAX_TEXT_TO_AUDIO_LENGTH = parseInt(import.meta.env.VITE_MAX_TEXT_TO_AUDIO_LENGTH) || 4000;

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [vocabularyList, setVocabularyList] = useState([]);
  const [username, setUsername] = useState('');

  // Extract username from Basic Auth header
  useEffect(() => {
    const extractUsername = async () => {
      try {
        // Try to get from a test request with credentials
        const response = await fetch(window.location.href, {
          method: 'HEAD',
          credentials: 'include'
        });
        
        // Check if Authorization header is available (won't work in browser due to CORS)
        // Alternative: Parse from a cookie or session if AWS Amplify sets one
        
        // For Basic Auth, we need to decode from the request
        // Since browsers don't expose auth headers to JS, we'll use a backend endpoint
        // Or store in localStorage after first login
        
        // Fallback: Check localStorage
        const storedUser = localStorage.getItem('learnFrenchUser');
        if (storedUser) {
          setUsername(storedUser);
        } else {
          // Prompt user to enter username (will be saved for future sessions)
          const user = prompt('Please enter your username:');
          if (user) {
            setUsername(user);
            localStorage.setItem('learnFrenchUser', user);
          }
        }
      } catch (error) {
        console.error('Failed to extract username:', error);
        // Fallback to prompt
        const storedUser = localStorage.getItem('learnFrenchUser');
        if (storedUser) {
          setUsername(storedUser);
        } else {
          const user = prompt('Please enter your username:');
          if (user) {
            setUsername(user);
            localStorage.setItem('learnFrenchUser', user);
          }
        }
      }
    };
    
    extractUsername();
  }, []);

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
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" gutterBottom>
        On Parle Français - 5 min par jour
        <Typography variant="subtitle1" align="center" gutterBottom sx={{ fontSize: '0.9rem' }}>
          Text Trainer französisch - Limit(Zeichen): {MAX_TEXT_LENGTH}/Übersetzung, {MAX_TEXT_TO_AUDIO_LENGTH}/Audio
          - {username && <span style={{ fontWeight: 'bold', color: '#0055A4' }}>User: {username} </span>}
        </Typography>
      </Typography>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Text Translation" />
          <Tab label="Vocabulary Training" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && <TranslationModule vocabularyList={vocabularyList} username={username} />}
      {activeTab === 1 && (
        <VocabularyModule 
          vocabularyList={vocabularyList} 
          setVocabularyList={setVocabularyList}
          username={username}
        />
      )}
    </Container>
  );
}

export default App;
