import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function VocabularyModule({ vocabularyList, setVocabularyList }) {
  // State for Add Vocabulary form
  const [textFr, setTextFr] = useState('');
  const [textDe, setTextDe] = useState('');
  
  // State for Review Vocabulary controls
  const [filterOption, setFilterOption] = useState('new');
  const [countValue, setCountValue] = useState('-');

  const handleSave = () => {
    if (!textFr.trim() || !textDe.trim()) {
      alert('Please fill both fields');
      return;
    }

    const newVocab = {
      vocID: Date.now().toString(), // Simple timestamp-based ID
      textFr: textFr.trim(),
      textDe: textDe.trim(),
      dateAdded: new Date().toISOString(),
      lastReviewed: null,
      reviewCount: 0
    };

    const updatedList = [...vocabularyList, newVocab];
    setVocabularyList(updatedList);
    
    // Save to localStorage
    localStorage.setItem('learnFrenchVocabulary', JSON.stringify(updatedList));
    
    // Clear form
    setTextFr('');
    setTextDe('');
    
    console.log('Vocabulary saved:', newVocab);
  };

  const handleLoad = () => {
    console.log('Load button called with filter:', filterOption, 'count:', countValue);
    
    // Interim hack: Load 5 dummy vocabularies when "lastweek" is selected
    if (filterOption === 'lastweek') {
      const dummyVocabularies = [
        {
          vocID: Date.now().toString() + '-1',
          textFr: 'Bonjour',
          textDe: 'Guten Tag',
          dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          lastReviewed: null,
          reviewCount: 0
        },
        {
          vocID: Date.now().toString() + '-2',
          textFr: 'Merci beaucoup',
          textDe: 'Vielen Dank',
          dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          lastReviewed: null,
          reviewCount: 0
        },
        {
          vocID: Date.now().toString() + '-3',
          textFr: 'Au revoir',
          textDe: 'Auf Wiedersehen',
          dateAdded: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
          lastReviewed: null,
          reviewCount: 0
        },
        {
          vocID: Date.now().toString() + '-4',
          textFr: "S'il vous plaît",
          textDe: 'Bitte',
          dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          lastReviewed: null,
          reviewCount: 0
        },
        {
          vocID: Date.now().toString() + '-5',
          textFr: 'Comment allez-vous?',
          textDe: 'Wie geht es Ihnen?',
          dateAdded: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
          lastReviewed: null,
          reviewCount: 0
        }
      ];
      
      setVocabularyList(dummyVocabularies);
      localStorage.setItem('learnFrenchVocabulary', JSON.stringify(dummyVocabularies));
      console.log('Loaded 5 dummy vocabularies');
    }
    
    // TODO: Implement other filtering logic later
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Upper Part: Add Vocabulary */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Add Vocabulary
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Text (Français)"
            variant="outlined"
            value={textFr}
            onChange={e => setTextFr(e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Text (Deutsch)"
            variant="outlined"
            value={textDe}
            onChange={e => setTextDe(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>

      {/* Middle Part: Review Vocabulary */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Review Vocabulary
        </Typography>
        
        {/* Filter Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterOption}
              label="Filter"
              onChange={e => setFilterOption(e.target.value)}
            >
              <MenuItem value="new">Only show new vocabulary</MenuItem>
              <MenuItem value="yesterday">Yesterday's vocabulary</MenuItem>
              <MenuItem value="lastweek">Last week's vocabulary</MenuItem>
              <MenuItem value="repetition">Repetition based vocabulary set</MenuItem>
              <MenuItem value="random">Random vocabulary</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Count</InputLabel>
            <Select
              value={countValue}
              label="Count"
              onChange={e => setCountValue(e.target.value)}
            >
              <MenuItem value="-">-</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="15">15</MenuItem>
              <MenuItem value="20">20</MenuItem>
              <MenuItem value="25">25</MenuItem>
              <MenuItem value="30">30</MenuItem>
            </Select>
          </FormControl>
          
          <Button variant="contained" onClick={handleLoad}>
            Load
          </Button>
        </Box>

        {/* Vocabulary List */}
        {vocabularyList.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '45%' }}>Français</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '45%' }}>Deutsch</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vocabularyList.map((vocab) => (
                  <TableRow key={vocab.vocID}>
                    <TableCell>{vocab.textFr}</TableCell>
                    <TableCell>{vocab.textDe}</TableCell>
                    <TableCell>
                      {/* TODO: Add edit/delete buttons later */}
                      -
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No vocabulary added yet. Add your first vocabulary above!
          </Typography>
        )}
      </Box>

      {/* Lower Part: Train Vocabulary (Placeholder) */}
      <Box sx={{ mt: 4, p: 3, border: '1px dashed #ccc', borderRadius: 1 }}>
        <Typography variant="h5" gutterBottom>
          Train Vocabulary
        </Typography>
        <Typography color="text.secondary">
          Training functionality will be implemented here later.
        </Typography>
      </Box>
    </Box>
  );
}

export default VocabularyModule;
