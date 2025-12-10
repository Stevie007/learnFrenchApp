import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { createVocabulary, getVocabularies, updateVocabulary, deleteVocabulary } from './vocabularyApi';
import { useTranslation } from './locales/i18n';

function VocabularyModule({ vocabularyList, setVocabularyList, username, currentTranslationUrl, developerMode }) {
  const { t } = useTranslation();
  // State for Add Vocabulary form
  const [textFr, setTextFr] = useState('');
  const [textDe, setTextDe] = useState('');
  const [source, setSource] = useState('');
  const [sourceManuallyEdited, setSourceManuallyEdited] = useState(false); // Track if user manually changed source
  
  // State for Review Vocabulary controls
  const [filterOption, setFilterOption] = useState('onlyNew');
  const [countValue, setCountValue] = useState('20');
  
  // State for Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  
  // State for tracking thumb feedback
  const [thumbFeedback, setThumbFeedback] = useState({}); // { vocID: 'up' | 'down' }
  
  // Update source when translation URL changes, but only if source hasn't been manually edited
  useEffect(() => {
    if (currentTranslationUrl && !sourceManuallyEdited) {
      setSource(currentTranslationUrl);
    }
  }, [currentTranslationUrl, sourceManuallyEdited]);

  const handleSave = async () => {
    if (!textFr.trim() || !textDe.trim()) {
      alert(t('vocabulary.fillBothFields'));
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
        setSourceManuallyEdited(false); // Reset manual edit flag
        
        console.log(t('vocabulary.console.vocabularySaved'), newVocab);
      } else {
        alert(t('vocabulary.saveFailed', { error: response.error || 'Unknown error' }));
      }
    } catch (error) {
      console.error('Error saving vocabulary:', error);
      alert(t('vocabulary.saveError'));
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
        console.log(t('vocabulary.console.vocabularyUpdated'), editingVocab);
      } else {
        alert(t('vocabulary.updateFailed', { error: response.error || 'Unknown error' }));
      }
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      alert(t('vocabulary.updateError'));
    }
  };

  const handleDeleteEdit = async () => {
    if (!confirm(t('vocabulary.confirmDelete'))) return;
    
    try {
      const response = await deleteVocabulary(editingVocab.userid, editingVocab.vocID);
      
      if (response.success) {
        const updatedList = vocabularyList.filter(v => v.vocID !== editingVocab.vocID);
        setVocabularyList(updatedList);
        localStorage.setItem('learnFrenchVocabulary', JSON.stringify(updatedList));
        handleCloseEditDialog();
        console.log(t('vocabulary.console.vocabularyDeleted'), editingVocab.vocID);
      } else {
        alert(t('vocabulary.deleteFailed', { error: response.error || 'Unknown error' }));
      }
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      alert(t('vocabulary.deleteError'));
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
        console.log(t('vocabulary.console.stageIncreased'), updatedVocab);
      } else {
        alert(t('vocabulary.updateFailed', { error: response.error || 'Unknown error' }));
      }
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      alert(t('vocabulary.updateError'));
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
        console.log(t('vocabulary.console.stageDecreased'), updatedVocab);
      } else {
        alert(t('vocabulary.updateFailed', { error: response.error || 'Unknown error' }));
      }
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      alert(t('vocabulary.updateError'));
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
    console.log(t('vocabulary.console.loadButtonCalled'), filterOption, 'count:', countValue);
    
    try {
      // Call backend API with filter and count parameters
      const response = await getVocabularies(username || 'unknown', filterOption, countValue);
      
      if (response.success) {
        setVocabularyList(response.data);
        localStorage.setItem('learnFrenchVocabulary', JSON.stringify(response.data));
        console.log(t('vocabulary.console.loadedFromBackend'), response.data.length, t('common.items'));
      } else {
        alert(t('vocabulary.loadFailed', { error: response.error || 'Unknown error' }));
      }
    } catch (error) {
      console.error('Error loading vocabularies:', error);
      alert(t('vocabulary.loadError'));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Upper Part: Add Vocabulary */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mt: '10px' }}>
          {t('vocabulary.addVocabulary')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('vocabulary.textFrench')}
              variant="outlined"
              value={textFr}
              onChange={e => setTextFr(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label={t('vocabulary.textGerman')}
              variant="outlined"
              value={textDe}
              onChange={e => setTextDe(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', minWidth: '50px' }}>
              {t('vocabulary.source')}:
            </Typography>
            <TextField
              variant="outlined"
              value={source}
              onChange={e => {
                setSource(e.target.value);
                setSourceManuallyEdited(true); // Mark as manually edited
              }}
              size="small"
              fullWidth
              placeholder={t('vocabulary.sourcePlaceholder')}
              InputProps={{ style: { fontSize: '0.75rem', height: '32px' } }}
              InputLabelProps={{ style: { fontSize: '0.75rem' } }}
            />
          </Box>
          <Box sx={{ mb: '10px' }}>
            <Button variant="contained" size="small" onClick={handleSave}>
              {t('vocabulary.saveButton')}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Middle Part: Review Vocabulary */}
      <Box>
        <Typography variant="h5" gutterBottom>
          {t('vocabulary.reviewVocabulary')}
        </Typography>
        
        {/* Filter Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>{t('vocabulary.filter')}</InputLabel>
            <Select
              value={filterOption}
              label={t('vocabulary.filter')}
              onChange={e => setFilterOption(e.target.value)}
            >
              <MenuItem value="onlyNew">{t('vocabulary.filterOptions.today')}</MenuItem>
              <MenuItem value="yesterday">{t('vocabulary.filterOptions.yesterday')}</MenuItem>
              <MenuItem value="lastweek">{t('vocabulary.filterOptions.lastWeek')}</MenuItem>
              <MenuItem value="stage1">{t('vocabulary.filterOptions.stage1')}</MenuItem>
              <MenuItem value="stage2">{t('vocabulary.filterOptions.stage2')}</MenuItem>
              <MenuItem value="stage3">{t('vocabulary.filterOptions.stage3')}</MenuItem>
              <MenuItem value="stage4">{t('vocabulary.filterOptions.stage4')}</MenuItem>
              <MenuItem value="stage5">{t('vocabulary.filterOptions.stage5')}</MenuItem>
              <MenuItem value="stage6">{t('vocabulary.filterOptions.stage6')}</MenuItem>
              <MenuItem value="stage7">{t('vocabulary.filterOptions.stage7')}</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>{t('vocabulary.count')}</InputLabel>
            <Select
              value={countValue}
              label={t('vocabulary.count')}
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
          
          <Button variant="contained" size="small" onClick={handleLoad}>
            {t('vocabulary.loadButton')}
          </Button>
        </Box>

        {/* Vocabulary List */}
        {vocabularyList.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '8%', textAlign: 'center' }}>{t('vocabulary.table.order')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>{t('vocabulary.table.french')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>{t('vocabulary.table.german')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%', textAlign: 'center' }}>{t('vocabulary.table.review')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '6%', textAlign: 'center' }}>{t('vocabulary.table.stage')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '16%' }}>{t('vocabulary.table.actions')}</TableCell>
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
                          title={t('vocabulary.tooltips.moveUp')}
                        >
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleMoveDown(index)}
                          disabled={index === vocabularyList.length - 1}
                          title={t('vocabulary.tooltips.moveDown')}
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
                          title={t('vocabulary.tooltips.correct')}
                          sx={{ 
                            color: thumbFeedback[vocab.vocID] === 'up' ? 'green' : 'inherit'
                          }}
                        >
                          <ThumbUpIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleThumbDown(vocab)}
                          title={t('vocabulary.tooltips.practiceAgain')}
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
                          title={t('vocabulary.tooltips.edit')}
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
            {t('vocabulary.noVocabulary')}
          </Typography>
        )}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>{t('vocabulary.editDialog.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label={t('vocabulary.textFrench')}
              variant="outlined"
              value={editingVocab?.textFr || ''}
              onChange={e => setEditingVocab({ ...editingVocab, textFr: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('vocabulary.textGerman')}
              variant="outlined"
              value={editingVocab?.textDe || ''}
              onChange={e => setEditingVocab({ ...editingVocab, textDe: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('vocabulary.source')}
              variant="outlined"
              value={editingVocab?.source || ''}
              onChange={e => setEditingVocab({ ...editingVocab, source: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('vocabulary.tags')}
              variant="outlined"
              value={editingVocab?.tags || ''}
              onChange={e => setEditingVocab({ ...editingVocab, tags: e.target.value })}
              fullWidth
              placeholder={t('vocabulary.tagsPlaceholder')}
            />
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', my: 2 }}>
              <Button onClick={handleCloseEditDialog} size="small" variant="outlined">
                {t('vocabulary.cancelButton')}
              </Button>
              <Button onClick={handleSaveEdit} size="small" variant="contained" sx={{ minWidth: 120 }}>
                {t('vocabulary.saveButton')}
              </Button>
              <Button onClick={handleDeleteEdit} size="small" color="error" variant="outlined" startIcon={<DeleteIcon />}>
                {t('vocabulary.deleteButton')}
              </Button>
            </Box>
            
            {/* Developer fields - only show when developer mode is on */}
            {developerMode && (
              <>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label={t('vocabulary.stage')}
                    type="number"
                    variant="outlined"
                    value={editingVocab?.stage || 1}
                    onChange={e => setEditingVocab({ ...editingVocab, stage: parseInt(e.target.value) || 1 })}
                    sx={{ flex: 1 }}
                    inputProps={{ min: 1, max: 7 }}
                  />
                  <TextField
                    label={t('vocabulary.reviewCount')}
                    type="number"
                    variant="outlined"
                    value={editingVocab?.reviewCount || 0}
                    onChange={e => setEditingVocab({ ...editingVocab, reviewCount: parseInt(e.target.value) || 0 })}
                    sx={{ flex: 1 }}
                    inputProps={{ min: 0 }}
                  />
                </Box>
                <TextField
                  label={t('vocabulary.vocabId')}
                  variant="outlined"
                  value={editingVocab?.vocID || ''}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  size="small"
                />
                <TextField
                  label={t('vocabulary.dateAdded')}
                  variant="outlined"
                  value={editingVocab?.dateAdded || ''}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  size="small"
                />
                <TextField
                  label={t('vocabulary.lastReviewed')}
                  variant="outlined"
                  value={editingVocab?.lastReviewed || ''}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  size="small"
                />
                <TextField
                  label={t('vocabulary.userId')}
                  variant="outlined"
                  value={editingVocab?.userid || ''}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default VocabularyModule;
