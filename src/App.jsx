import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

// Global backend API URL
//const API_URL = 'http://localhost:5555/api/translate';
const API_URL = import.meta.env.VITE_BACKEND_URL;

function callBackend(url, payload) {
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

  const handleTranslate = async () => {
    // Example usage of callBackend
    // Replace '/api/translate' with your backend endpoint
    try {
      const data = await callBackend(API_URL, { text: input });
      console.log("Data received from backend:", data);
      setResult(data || 'No result returned');
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        French Translator & Text-to-Speech {API_URL}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Enter your Text or URL Here"
          variant="outlined"
          value={input}
          onChange={e => setInput(e.target.value)}
          multiline
          minRows={2}
        />
        <Button variant="contained" onClick={handleTranslate}>
          Translate
        </Button>
        <TextField
          label="Result"
          variant="outlined"
          value={result}
          multiline
          minRows={4}
          InputProps={{ readOnly: true }}
        />
      </Box>
    </Container>
  );
}

export default App;
