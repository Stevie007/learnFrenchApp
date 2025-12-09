import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { createVocabulary, getVocabularies, updateVocabulary, deleteVocabulary } from './vocabularyApi';

function VocabularyModule({ vocabularyList, setVocabularyList, username, currentTranslationUrl }) {
  // State for Add Vocabulary form
  const [textFr, setTextFr] = useState('');
  const [textDe, setTextDe] = useState('');
  const [source, setSource] = useState('');
  
  // State for Review Vocabulary controls
  const [filterOption, setFilterOption] = useState('onlyNew');
  const [countValue, setCountValue] = useState('20');
  
  // State for Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  
  // State for tracking thumb feedback
  const [thumbFeedback, setThumbFeedback] = useState({}); // { vocID: 'up' | 'down' }
  
  // Update source when translation URL changes
  useEffect(() => {
    if (currentTranslationUrl) {
      setSource(currentTranslationUrl);
    }
  }, [currentTranslationUrl]);

  const handleSave = async () => {
    if (!textFr.trim() || !textDe.trim()) {
      alert('Please fill both French and German text');
      return;
    }

    try {
      const vocabularyData = {
        userid: username || 'unknown',
        textFr: textFr.trim(),
        textDe: textDe.trim(),
        source: source.trim() || 'manual',
        tags: ''
      };
      
      // Call backend API
      const response = await createVocabulary(vocabularyData);
      
      if (response.success) {
        const newVocab = {
          ...vocabularyData,
          vocID: response.data.vocID, // Use vocID from backend
          dateAdded: new Date().toISOString(),
          lastReviewed: null,
          reviewCount: 0,
          stage: 1
        };

        const updatedList = [...vocabularyList, newVocab];
        setVocabularyList(updatedList);
        localStorage.setItem('learnFrenchVocabulary', JSON.stringify(updatedList));
        
        // Clear form
        setTextFr('');
        setTextDe('');
        setSource(currentTranslationUrl || '');
        
        console.log('Vocabulary saved:', newVocab);
      } else {
        alert('Failed to save vocabulary: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving vocabulary:', error);
      alert('Error saving vocabulary to backend. Check console for details.');
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return; // Can't move first item up
    const newList = [...vocabularyList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setVocabularyList(newList);
    localStorage.setItem('learnFrenchVocabulary', JSON.stringify(newList));
  };

  const handleMoveDown = (index) => {
    if (index === vocabularyList.length - 1) return; // Can't move last item down
    const newList = [...vocabularyList];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setVocabularyList(newList);
    localStorage.setItem('learnFrenchVocabulary', JSON.stringify(newList));
  };

  const handleEdit = (vocab) => {
    setEditingVocab({ ...vocab });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingVocab(null);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await updateVocabulary(editingVocab);
      
      if (response.success) {
        const updatedList = vocabularyList.map(v => 
          v.vocID === editingVocab.vocID ? editingVocab : v
        );
        setVocabularyList(updatedList);
        localStorage.setItem('learnFrenchVocabulary', JSON.stringify(updatedList));
        handleCloseEditDialog();
        console.log('Vocabulary updated:', editingVocab);
      } else {
        alert('Failed to update vocabulary: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      alert('Error updating vocabulary. Check console for details.');
    }
  };

  const handleDeleteEdit = async () => {
    if (!confirm('Are you sure you want to delete this vocabulary?')) return;
    
    try {
      const response = await deleteVocabulary(editingVocab.userid, editingVocab.vocID);
      
      if (response.success) {
        const updatedList = vocabularyList.filter(v => v.vocID !== editingVocab.vocID);
        setVocabularyList(updatedList);
        localStorage.setItem('learnFrenchVocabulary', JSON.stringify(updatedList));
        handleCloseEditDialog();
        console.log('Vocabulary deleted:', editingVocab.vocID);
      } else {
        alert('Failed to delete vocabulary: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      alert('Error deleting vocabulary. Check console for details.');
    }
  };

  const handleThumbUp = async (vocab) => {
    const updatedVocab = {
      ...vocab,
      stage: Math.min(vocab.stage + 1, 7) // Increase stage, max 7
    };
    
    // Show green feedback - keep it for the session
    setThumbFeedback({ ...thumbFeedback, [vocab.vocID]: 'up' });
    
    try {
      const response = await updateVocabulary(updatedVocab);
      
      if (response.success) {
        const updatedList = vocabularyList.map(v => 
          v.vocID === vocab.vocID ? updatedVocab : v
        );
        setVocabularyList(updatedList);
        localStorage.setItem('learnFrenchVocabulary', JSON.stringify(updatedList));
        console.log('Vocabulary stage increased:', updatedVocab);
      } else {
        alert('Failed to update vocabulary: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      alert('Error updating vocabulary. Check console for details.');
    }
  };

  const handleThumbDown = async (vocab) => {
    const updatedVocab = {
      ...vocab,
      stage: Math.max(vocab.stage - 1, 1) // Decrease stage, min 1
    };
    
    // Show yellow feedback - keep it for the session
    setThumbFeedback({ ...thumbFeedback, [vocab.vocID]: 'down' });
    
    try {
      const response = await updateVocabulary(updatedVocab);
      
      if (response.success) {
        const updatedList = vocabularyList.map(v => 
          v.vocID === vocab.vocID ? updatedVocab : v
        );
        setVocabularyList(updatedList);
        localStorage.setItem('learnFrenchVocabulary', JSON.stringify(updatedList));
        console.log('Vocabulary stage decreased:', updatedVocab);
      } else {
        alert('Failed to update vocabulary: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      alert('Error updating vocabulary. Check console for details.');
    }
  };

  const handleLoad = async () => {
    /*
    * Load vocabulary from backend based on filterOption and countValue
    * countValue: number of vocabularies to load or '-' for default
    * filterOption: key to backend / Text in interface  
    *    'onlyNew' / Neue Vokabeln, 
    *    'yesterday' / Gestern, 
    *    'lastweek' / Letzte Woche, 
    *    'stage1'..'stage7' / Phase 1(neu)..7(gelernt),
    * Todo - later: 'repetition' / Wiederholung, 'random' / Zufällig
    */ 
    console.log('Load button called with filter:', filterOption, 'count:', countValue);
    
    try {
      // Call backend API with filter and count parameters
      const response = await getVocabularies(username || 'unknown', filterOption, countValue);
      
      if (response.success) {
        setVocabularyList(response.data);
        localStorage.setItem('learnFrenchVocabulary', JSON.stringify(response.data));
        console.log('Loaded vocabularies from backend:', response.data.length, 'items');
      } else {
        alert('Failed to load vocabularies: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading vocabularies:', error);
      alert('Error loading vocabularies from backend. Check console for details.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Upper Part: Add Vocabulary */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Add Vocabulary
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Source (URL or description)"
              variant="outlined"
              value={source}
              onChange={e => setSource(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
              placeholder="Current translation URL or 'manual'"
            />
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
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
              <MenuItem value="onlyNew">Heute</MenuItem>
              <MenuItem value="yesterday">Gestern</MenuItem>
              <MenuItem value="lastweek">Letzte 7 Tage</MenuItem>
              <MenuItem value="stage1">Phase 1 (neu)</MenuItem>
              <MenuItem value="stage2">Phase 2</MenuItem>
              <MenuItem value="stage3">Phase 3</MenuItem>
              <MenuItem value="stage4">Phase 4</MenuItem>
              <MenuItem value="stage5">Phase 5</MenuItem>
              <MenuItem value="stage6">Phase 6</MenuItem>
              <MenuItem value="stage7">Phase 7 (gelernt)</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Count</InputLabel>
            <Select
              value={countValue}
              label="Count"
              onChange={e => setCountValue(e.target.value)}
            >
              <MenuItem value="100">-</MenuItem>
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
                  <TableCell sx={{ fontWeight: 'bold', width: '8%', textAlign: 'center' }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Français</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Deutsch</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%', textAlign: 'center' }}>Review</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '6%', textAlign: 'center' }}>Stage</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '16%' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vocabularyList.map((vocab, index) => (
                  <TableRow key={vocab.vocID}>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleMoveDown(index)}
                          disabled={index === vocabularyList.length - 1}
                          title="Move down"
                        >
                          <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{vocab.textFr}</TableCell>
                    <TableCell>{vocab.textDe}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleThumbUp(vocab)}
                          title="Richtig"
                          sx={{ 
                            color: thumbFeedback[vocab.vocID] === 'up' ? 'green' : 'inherit'
                          }}
                        >
                          <ThumbUpIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleThumbDown(vocab)}
                          title="Erneut üben"
                          sx={{ 
                            color: thumbFeedback[vocab.vocID] === 'down' ? 'orange' : 'inherit'
                          }}
                        >
                          <ThumbDownIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{vocab.stage || 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(vocab)}
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Vocabulary</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Text (Français)"
              variant="outlined"
              value={editingVocab?.textFr || ''}
              onChange={e => setEditingVocab({ ...editingVocab, textFr: e.target.value })}
              fullWidth
            />
            <TextField
              label="Text (Deutsch)"
              variant="outlined"
              value={editingVocab?.textDe || ''}
              onChange={e => setEditingVocab({ ...editingVocab, textDe: e.target.value })}
              fullWidth
            />
            <TextField
              label="Source"
              variant="outlined"
              value={editingVocab?.source || ''}
              onChange={e => setEditingVocab({ ...editingVocab, source: e.target.value })}
              fullWidth
            />
            <TextField
              label="Tags"
              variant="outlined"
              value={editingVocab?.tags || ''}
              onChange={e => setEditingVocab({ ...editingVocab, tags: e.target.value })}
              fullWidth
              placeholder="e.g., greetings, travel, food"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Stage"
                type="number"
                variant="outlined"
                value={editingVocab?.stage || 1}
                onChange={e => setEditingVocab({ ...editingVocab, stage: parseInt(e.target.value) || 1 })}
                sx={{ flex: 1 }}
                inputProps={{ min: 1, max: 7 }}
              />
              <TextField
                label="Review Count"
                type="number"
                variant="outlined"
                value={editingVocab?.reviewCount || 0}
                onChange={e => setEditingVocab({ ...editingVocab, reviewCount: parseInt(e.target.value) || 0 })}
                sx={{ flex: 1 }}
                inputProps={{ min: 0 }}
              />
            </Box>
            <TextField
              label="Vocabulary ID"
              variant="outlined"
              value={editingVocab?.vocID || ''}
              fullWidth
              disabled
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>
            Cancel
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={handleSaveEdit} variant="contained" sx={{ minWidth: 120 }}>
            Save
          </Button>
          <Box sx={{ width: 80 }} />
          <Button onClick={handleDeleteEdit} color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VocabularyModule;
