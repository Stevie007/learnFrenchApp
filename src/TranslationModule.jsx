import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, Switch, FormControlLabel, RadioGroup, Radio, FormLabel, CircularProgress } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createVocabulary } from './vocabularyApi';
import { useTranslation } from './locales/i18n';

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

function TranslationModule({ onUrlChange, input, setInput, result, setResult, translation, setTranslation, translationTripple, setTranslationTripple, audioUrl, setAudioUrl, vocabularyList, setVocabularyList, username, addedVocabIndex, setAddedVocabIndex, translatePressed, setTranslatePressed, developerMode, setDeveloperMode }) {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [inputMode, setInputMode] = useState('url'); // 'url' or 'text'
  const [textLoaded, setTextLoaded] = useState(false); // Track if text was loaded from URL
  const [loadingUrl, setLoadingUrl] = useState(false); // Loading state for URL button
  const [loadingTranslate, setLoadingTranslate] = useState(false); // Loading state for translate button
  const [loadingAudio, setLoadingAudio] = useState(false); // Loading state for audio button
  
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

  const handleAddVocabulary = async (vocabPair, trippleIndex, vocabIndex) => {
    const [vocFr, vocDe] = vocabPair;
    const uniqueKey = `${trippleIndex}-${vocabIndex}`;
    
    try {
      const vocabularyData = {
        userid: username,
        textFr: vocFr.trim(),
        textDe: vocDe.trim(),
        source: input.trim() || '',
        tags: ''
      };
      
      // Call backend API
      const response = await createVocabulary(vocabularyData);
      
      if (response.success) {
        const newVocab = {
          ...vocabularyData,
          vocID: response.data.vocID,
          dateAdded: new Date().toISOString(),
          lastReviewed: new Date(0).toISOString(), // Jan 1, 1970
          reviewCount: 0,
          stage: 1
        };

        const updatedList = [...vocabularyList, newVocab];
        setVocabularyList(updatedList);
        localStorage.setItem('learnFrenchVocabulary', JSON.stringify(updatedList));
        
        // Show visual feedback - add to Set of added items
        setAddedVocabIndex(prev => new Set([...prev, uniqueKey]));
        setSnackbarMessage(t('translation.addedVocabulary', { vocFr, vocDe }));
        setSnackbarOpen(true);
        
        console.log('Vocabulary added from translation:', newVocab);
      } else {
        alert('Failed to add vocabulary: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding vocabulary:', error);
      alert('Error adding vocabulary. Check console for details.');
    }
  };

  const handleGetTextFromUrl = async () => {
    setLoadingUrl(true);
    try {
      const data = await backendGetTextFromUrl(API_URL_GET_TEXT_FROM_URL, { text: input });
      console.log("Data received from backend:", data);
      setResult(data || '');
      setTextLoaded(true);
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoadingUrl(false);
    }
  };

  const handleTransVocab = async () => {
    setTranslatePressed(true);
    setLoadingTranslate(true);
    setTranslation('');
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
      setTranslation(data || '');
      
      const tripple = parseTranslationResponseTripple(data);
      setTranslationTripple(tripple);
    } catch (error) {
      setTranslation('Error: ' + error.message);
      setTranslationTripple([]);
    } finally {
      setLoadingTranslate(false);
    }
  };

  const handleGetAudio = async () => {
    setLoadingAudio(true);
    try {
      const url = await backendGetAudio(API_URL_GET_AUDIO_FOR_TEXT, { text: result });
      console.log("Audio URL created:", url);
      setAudioUrl(url);
    } catch (error) {
      console.error('Audio error: ' + error.message);
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: '0.875rem' }}>
      {/* Input Mode Toggle */}
      <Box sx={{ mb: 1 }}>
        <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem' }}>
          {t('translation.inputModeLabel')}
        </FormLabel>
        <RadioGroup
          row
          value={inputMode}
          onChange={(e) => {
            setInputMode(e.target.value);
            if (e.target.value === 'text') {
              setTextLoaded(true); // Show text field immediately when switching to text mode
            }
          }}
        >
          <FormControlLabel 
            value="url" 
            control={<Radio size="small" />} 
            label={t('translation.inputModeUrl')} 
          />
          <FormControlLabel 
            value="text" 
            control={<Radio size="small" />} 
            label={t('translation.inputModeText')} 
          />
        </RadioGroup>
      </Box>

      {/* URL Input - only show when mode is 'url' */}
      {inputMode === 'url' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', minWidth: '40px' }}>
            URL:
          </Typography>
          <TextField
            label={t('translation.urlInput')}
            variant="outlined"
            value={input}
            onChange={e => setInput(e.target.value)}
            size="small"
            fullWidth
            InputLabelProps={{ style: { fontSize: '0.875rem' } }}
            inputProps={{ style: { fontSize: '0.875rem' } }}
          />
        </Box>
      )}

      {/* Load from URL Button - only show when URL mode is active and valid URL is entered */}
      {inputMode === 'url' && input && (input.startsWith('http://') || input.startsWith('https://')) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ minWidth: '40px' }} />
          <Button variant="contained" size="small" onClick={handleGetTextFromUrl} disabled={loadingUrl} sx={{ width: 'fit-content' }}>
            {loadingUrl ? <CircularProgress size={20} color="inherit" /> : t('translation.getTextButton')}
          </Button>
        </Box>
      )}

      {/* Text for Translation - show when: */}
      {/* 1. Text mode is selected, OR */}
      {/* 2. URL mode and text was loaded, OR */}
      {/* 3. There's already text in result field */}
      {(inputMode === 'text' || (inputMode === 'url' && textLoaded) || (result && result.trim() !== '')) && (
        <TextField
          label={t('translation.textForTranslation')}
          variant="outlined"
          value={result}
          onChange={e => setResult(e.target.value)}
          multiline
          minRows={4}
        />
      )}
      
      {/* Translate and Audio buttons - only show when text field has content */}
      {result && result.trim() !== '' && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" size="small" onClick={handleTransVocab} disabled={loadingTranslate}>
            {loadingTranslate ? <CircularProgress size={20} color="inherit" /> : t('translation.translateButton')}
          </Button>
          <Button variant="contained" size="small" onClick={handleGetAudio} disabled={loadingAudio}>
            {loadingAudio ? <CircularProgress size={20} color="inherit" /> : t('translation.getAudioButton')}
          </Button>
        </Box>
      )}
      
      {translatePressed && translationTripple.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>{t('translation.table.vocabulary')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>{t('translation.table.original')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>{t('translation.table.translated')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {translationTripple.map((tripple, trippleIndex) => (
                <TableRow key={trippleIndex} sx={{ '& td': { borderBottom: '1px solid #e0e0e0' } }}>
                  <TableCell sx={{ fontSize: '0.875rem', backgroundColor: '#e6f2ff' }}>
                    {tripple.VOCABULARY && tripple.VOCABULARY.map((vocab, vIndex) => {
                      const uniqueKey = `${trippleIndex}-${vIndex}`;
                      const isAdded = addedVocabIndex.has(uniqueKey);
                      return (
                        <Box key={vIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleAddVocabulary(vocab, trippleIndex, vIndex)}
                            sx={{ 
                              color: isAdded ? 'green' : 'gray',
                              padding: '2px'
                            }}
                            title={t('translation.addToVocabularyList')}
                          >
                            {isAdded ? <CheckCircleIcon fontSize="small" /> : <AddCircleOutlineIcon fontSize="small" />}
                          </IconButton>
                          <span>{vocab[0]} → {vocab[1]}</span>
                        </Box>
                      );
                    })}
                  </TableCell>
                  <TableCell sx={{ fontSize: '1rem', backgroundColor: '#ffffff' }}>{tripple.ORG}</TableCell>
                  <TableCell sx={{ backgroundColor: '#ffe6e6' }}>{tripple.TRANSLATED}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : translatePressed && translation && translation.trim() !== '' ? (
        <TextField
          label={t('translation.translationResult')}
          variant="outlined"
          value={translation}
          multiline
          minRows={4}
          InputProps={{ readOnly: true }}
        />
      ) : null}
      
      {/* Snackbar for add vocabulary feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      
      {audioUrl && (
        <Box sx={{ mt: 2 }}>
          <audio controls autoPlay src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}
      
      {/* Developer Mode Toggle */}
      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
        <FormControlLabel
          control={
            <Switch
              checked={developerMode}
              onChange={(e) => setDeveloperMode(e.target.checked)}
              color="primary"
            />
          }
          label={t('translation.developerExtensions')}
        />
      </Box>
      
      {/* Backend URLs Debug Info - only show when developer mode is on */}
      {developerMode && (
        <TextField
          label={t('translation.debugBackendUrls')}
          variant="outlined"
          value={`Get Text: ${API_URL_GET_TEXT_FROM_URL}\nTranslate: ${API_URL_TRANSLATE_VOCAB}\nAudio: ${API_URL_GET_AUDIO_FOR_TEXT}`}
          multiline
          minRows={3}
          InputProps={{ readOnly: true }}
          sx={{ mt: 2, backgroundColor: '#f5f5f5' }}
        />
      )}
    </Box>
  );
}

export default TranslationModule;
