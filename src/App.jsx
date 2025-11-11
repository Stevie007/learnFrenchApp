import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

// Global backend API URL
//const API_URL = 'http://localhost:5555/api/translate';
const API_URL_GET_TEXT_FROM_URL = import.meta.env.VITE_BACKEND_GET_TEXT_FROM_URL;
const API_URL_TRANSLATE_TEXT = import.meta.env.VITE_BACKEND_TRANSLATE_TEXT;
const API_URL_GET_AUDIO_FOR_TEXT = import.meta.env.VITE_BACKEND_GET_AUDIO_FOR_TEXT;

function backendGetTextFromUrl(url, payload) {
  // Returns a promise for the backend response
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain', // Sending plain text
    },
    body: payload.text, // Sending the raw text
  }).then(response => {
    return (async () => { // IIFE
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      const text = await response.text(); // Await the promise
      return text; // Return the actual text
    })(); // Immediately invoke the async function
  });
}

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [translation, setTranslation] = useState('');

  const formatApiUrl = (url) => {
    if (!url) return '';
    if (url.length <= 33) return url; // 15 + 3 (dots) + 15
    return url.slice(0, 15) + '...' + url.slice(-15);
  };

  const handleGetTextFromUrl = async () => {
    // Example usage of backendGetTextFromUrl
    // Replace '/api/translate' with your backend endpoint
    try {
      const data = await backendGetTextFromUrl(API_URL_GET_TEXT_FROM_URL, { text: input });
      console.log("Data received from backend:", data);
      setResult(data || 'No result returned');
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  const handleTranslate = async () => {
    try {
      const data = await backendGetTextFromUrl(API_URL_TRANSLATE_TEXT, { text: result });
      console.log("Translation received from backend:", data);
      setTranslation(data || 'No translation returned');
    } catch (error) {
      setTranslation('Error: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        French Translator & Text-to-Speech {formatApiUrl(API_URL_GET_TEXT_FROM_URL)}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Enter URL"
          variant="outlined"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <Button variant="contained" onClick={handleGetTextFromUrl}>
          Get Text from URL - or enter text in the textbox below directly
        </Button>
        <TextField
          label="Text for Translation"
          variant="outlined"
          value={result}
          multiline
          minRows={4}
          InputProps={{ readOnly: false }}
        />
        <Button variant="contained" onClick={handleTranslate}>
          Translate
        </Button>
        <TextField
          label="Translation"
          variant="outlined"
          value={translation}
          multiline
          minRows={4}
          InputProps={{ readOnly: true }}
        />
      </Box>
    </Container>
  );
}

export default App;
