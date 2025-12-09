import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Global configuration (from App.jsx)
const DEBUG_LEVEL = import.meta.env.VITE_DEBUG_LEVEL === 'true';
const MAX_TEXT_LENGTH = parseInt(import.meta.env.VITE_MAX_TEXT_LENGTH) || 4000;
const MAX_TEXT_TO_AUDIO_LENGTH = parseInt(import.meta.env.VITE_MAX_TEXT_TO_AUDIO_LENGTH) || 4000;

// Global backend API URL
const API_URL_GET_TEXT_FROM_URL = import.meta.env.VITE_BACKEND_GET_TEXT_FROM_URL;
const API_URL_TRANSLATE_VOCAB = import.meta.env.VITE_BACKEND_TRANSLATE_VOCAB;
const API_URL_GET_AUDIO_FOR_TEXT = import.meta.env.VITE_BACKEND_GET_AUDIO_FOR_TEXT;

function backendGetTextFromUrl(url, payload) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: payload.text,
  }).then(response => {
    return (async () => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      const text = await response.text();
      return text;
    })();
  });
}

function backendGetAudio(url, payload) {
  let payloadText = payload.text;
  
  if (payloadText.length > MAX_TEXT_TO_AUDIO_LENGTH) {
    console.error(`Payload length (${payloadText.length}) exceeds maximum (${MAX_TEXT_TO_AUDIO_LENGTH}). Truncating.`);
    const warningMsg = " ... MAXIMUM LENGHT EXEEDED - STOP HERE";
    payloadText = payloadText.substring(0, MAX_TEXT_TO_AUDIO_LENGTH - warningMsg.length) + warningMsg;
  }
  
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: payloadText,
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  });
}

function TranslationModule({ onUrlChange, input, setInput, result, setResult, translation, setTranslation, translationTripple, setTranslationTripple, audioUrl, setAudioUrl }) {
  
  // Notify parent when URL changes
  useEffect(() => {
    if (onUrlChange) {
      onUrlChange(input);
    }
  }, [input, onUrlChange]);

  const formatApiUrl = (url) => {
    if (!url) return '';
    if (url.length <= 33) return url;
    return url.slice(0, 15) + '...' + url.slice(-15);
  };

  const parseTranslationResponseTripple = (response) => {
    try {
      const tripples = JSON.parse(response);
      return tripples;
    } catch (error) {
      console.error('Failed to parse vocabulary response:', error);
      return [];
    }
  };

  const handleGetTextFromUrl = async () => {
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
      let textToTranslate = result;
      const warningMessage = ` ... SEULEMENT ${MAX_TEXT_LENGTH} CHAR SONT TRADUIT!`;
      if (textToTranslate.length > MAX_TEXT_LENGTH) {
        textToTranslate = textToTranslate.substring(0, MAX_TEXT_LENGTH - warningMessage.length) + warningMessage;
      }
      console.log("transvocab - length of text to translate:", textToTranslate.length);
      
      const data = await backendGetTextFromUrl(API_URL_TRANSLATE_VOCAB, { text: textToTranslate });
      console.log("Transvocab received from backend:", data);
      setTranslation(data || 'No translation returned');
      
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: '0.875rem' }}>
      <TextField
        label="Enter URL"
        variant="outlined"
        value={input}
        onChange={e => setInput(e.target.value)}
        size="small"
        InputLabelProps={{ style: { fontSize: '0.875rem' } }}
        inputProps={{ style: { fontSize: '0.875rem' } }}
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
                <TableRow key={index} sx={{ '& td': { borderBottom: '1px solid #e0e0e0' } }}>
                  <TableCell sx={{ fontSize: '0.875rem', backgroundColor: '#e6f2ff' }}>
                    {tripple.VOCABULARY && tripple.VOCABULARY.map((vocab, vIndex) => (
                      <div key={vIndex}>
                        {vocab[0]} → {vocab[1]}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell sx={{ fontSize: '1rem', backgroundColor: '#ffffff' }}>{tripple.ORG}</TableCell>
                  <TableCell sx={{ backgroundColor: '#ffe6e6' }}>{tripple.TRANSLATED}</TableCell>
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
          value={`Get Text: ${API_URL_GET_TEXT_FROM_URL}\nTranslate: ${API_URL_TRANSLATE_VOCAB}\nAudio: ${API_URL_GET_AUDIO_FOR_TEXT}`}
          multiline
          minRows={3}
          InputProps={{ readOnly: true }}
          sx={{ mt: 4, backgroundColor: '#f5f5f5' }}
        />
      )}
    </Box>
  );
}

export default TranslationModule;
