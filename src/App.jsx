import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Global configuration
const DEBUG_LEVEL = import.meta.env.VITE_DEBUG_LEVEL === 'true';

// Global backend API URL
//const API_URL = 'http://localhost:5555/api/translate';
const API_URL_GET_TEXT_FROM_URL = import.meta.env.VITE_BACKEND_GET_TEXT_FROM_URL;
const API_URL_TRANSLATE_TEXT = import.meta.env.VITE_BACKEND_TRANSLATE_TEXT;
const API_URL_TRANSLATE_VOCAB = import.meta.env.VITE_BACKEND_TRANSLATE_VOCAB;
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
  const [translationTripple, setTranslationTripple] = useState([]);
  const [audioUrl, setAudioUrl] = useState('');

  const formatApiUrl = (url) => {
    if (!url) return '';
    if (url.length <= 33) return url; // 15 + 3 (dots) + 15
    return url.slice(0, 15) + '...' + url.slice(-15);
  };

  const parseTranslationResponseTripple = (response) => {
    // Parse JSON response with ORG, TRANSLATED, and VOCABULARY fields
    try {
      const tripples = JSON.parse(response);
      return tripples;
    } catch (error) {
      console.error('Failed to parse vocabulary response:', error);
      return [];
    }
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

  const handleTransVocab = async () => {
    setTranslation("transvocab started by calling backend: " + formatApiUrl(API_URL_TRANSLATE_VOCAB));
    setTranslationTripple([]);
    try {
      const data = await backendGetTextFromUrl(API_URL_TRANSLATE_VOCAB, { text: result });
      console.log("Transvocab received from backend:", data);
      setTranslation(data || 'No translation returned');
      
      // Parse the response into tripple
      const tripple = parseTranslationResponseTripple(data);
      setTranslationTripple(tripple);
    } catch (error) {
      setTranslation('Error: ' + error.message);
      setTranslationTripple([]);
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
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" gutterBottom>
        On Parle Francais - 5 min par jour
        <Typography variant="subtitle1" align="center" gutterBottom sx={{ fontSize: '0.9rem' }}>
          Text Trainer französisch - bring your own text
        </Typography>
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleTransVocab} sx={{ flex: 1 }}>
            Translate
          </Button>
          <Button variant="contained" onClick={handleGetAudio} sx={{ flex: 1 }}>
            Get Audio (Text-to-Speech)
          </Button>
        </Box>
        
        {translationTripple.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>VOCABULARY</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>ORG (Français)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>TRANSLATED (Deutsch)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {translationTripple.map((tripple, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: '0.875rem' }}>
                      {tripple.VOCABULARY && tripple.VOCABULARY.map((vocab, vIndex) => (
                        <div key={vIndex}>
                          {vocab[0]} → {vocab[1]}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>{tripple.ORG}</TableCell>
                    <TableCell>{tripple.TRANSLATED}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TextField
            label="translation result"
            variant="outlined"
            value={translation}
            multiline
            minRows={4}
            InputProps={{ readOnly: true }}
          />
        )}
        
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
