import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

// Global configuration
const DEBUG_LEVEL = import.meta.env.VITE_DEBUG_LEVEL === 'true';

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

function backendGetAudio(url, payload) {
  // Returns a promise for the backend audio response
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: payload.text,
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const blob = await response.blob(); // Get audio as blob
    return URL.createObjectURL(blob); // Create URL for audio player
  });
}

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [translation, setTranslation] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const formatApiUrl = (url) => {
    if (!url) return '';
    if (url.length <= 33) return url; // 15 + 3 (dots) + 15
    return url.slice(0, 15) + '...' + url.slice(-15);
  };

  const handleGetTextFromUrl = async () => {
    // Example usage of backendGetTextFromUrl
    // Replace '/api/translate' with your backend endpoint
    setResult("Loading text from: " + input + " by calling backend: " + formatApiUrl(API_URL_GET_TEXT_FROM_URL));
    try {
      const data = await backendGetTextFromUrl(API_URL_GET_TEXT_FROM_URL, { text: input });
      console.log("Data received from backend:", data);
      setResult(data || 'No result returned');
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  const handleTranslate = async () => {
    setTranslation("translation started by calling backend: " + formatApiUrl(API_URL_TRANSLATE_TEXT));
    try {
      const data = await backendGetTextFromUrl(API_URL_TRANSLATE_TEXT, { text: result });
      console.log("Translation received from backend:", data);
      setTranslation(data || 'No translation returned');
    } catch (error) {
      setTranslation('Error: ' + error.message);
    }
  };

  const handleGetAudio = async () => {
    try {
      const url = await backendGetAudio(API_URL_GET_AUDIO_FOR_TEXT, { text: result });
      console.log("Audio URL created:", url);
      setAudioUrl(url);
    } catch (error) {
      console.error('Audio error: ' + error.message);
    }
  };


// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// ----- UI ELEMENTS -----------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h3" align="center" gutterBottom>
        On Parle Francais - 5 min par jour <br/>
        (Text Traininer französisch - bring your own text)
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Text Traininer französisch - bring your own text
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Enter URL"
          variant="outlined"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <Button variant="contained" onClick={handleGetTextFromUrl}>
          Get Text from URL ... or enter text in the box below
        </Button>
        <TextField
          label="Text for Translation"
          variant="outlined"
          value={result}
          onChange={e => setResult(e.target.value)}
          multiline
          minRows={4}
        />
        <Button variant="contained" onClick={handleTranslate}>
          Translate
        </Button>
        <TextField
          label="translation result"
          variant="outlined"
          value={translation}
          multiline
          minRows={4}
          InputProps={{ readOnly: true }}
        />
        <Button variant="contained" onClick={handleGetAudio}>
          Get Audio (Text-to-Speech)
        </Button>
        {audioUrl && (
          <Box sx={{ mt: 2 }}>
            <audio controls autoPlay src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </Box>
        )}
        {DEBUG_LEVEL && (
          <TextField
            label="Debug: Backend URLs"
            variant="outlined"
            value={`Get Text: ${API_URL_GET_TEXT_FROM_URL}\nTranslate: ${API_URL_TRANSLATE_TEXT}\nAudio: ${API_URL_GET_AUDIO_FOR_TEXT}`}
            multiline
            minRows={3}
            InputProps={{ readOnly: true }}
            sx={{ mt: 4, backgroundColor: '#f5f5f5' }}
          />
        )}
      </Box>
    </Container>
  );
}

export default App;
