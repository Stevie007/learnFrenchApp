// English language resources (for future use)
const en = {
  // App.jsx - Main application
  app: {
    title: 'On Parle Français - 5 min per day',
    subtitle: 'French Text Trainer - Limit(Characters): {maxText}/Translation, {maxAudio}/Audio',
    userLabel: 'User: {username}',
    tabs: {
      translation: 'Text Translation',
      vocabulary: 'Vocabulary Training'
    }
  },

  // Authentication
  auth: {
    welcome: 'Welcome',
    loginPrompt: 'Please sign in to continue',
    loginButton: 'Sign In',
    logoutButton: 'Sign Out'
  },

  // TranslationModule.jsx
  translation: {
    urlInput: 'URL or text to translate',
    textForTranslation: 'Text for Translation',
    translateButton: 'Translate',
    getAudioButton: 'Create Audio',
    getTextButton: 'Get Text from URL',
    translationResult: 'Translation Result',
    developerExtensions: 'Show Developer Extensions',
    debugBackendUrls: 'Debug: Backend URLs',
    inputModeLabel: 'Input Mode',
    inputModeUrl: 'URL',
    inputModeText: 'Text',
    
    // Table headers
    table: {
      vocabulary: 'VOCABULARY',
      original: 'ORIGINAL (Français)',
      translated: 'TRANSLATED (Deutsch)'
    },
    
    // Feedback messages
    addedVocabulary: 'Added: {vocFr} → {vocDe}',
    addToVocabularyList: 'Add to vocabulary list',
    loadingText: 'Loading text from: {url} by calling backend: {api}',
    translationStarted: 'Translation started by calling backend: {api}'
  },

  // VocabularyModule.jsx
  vocabulary: {
    // Section titles
    addVocabulary: 'Add Vocabulary',
    reviewVocabulary: 'Review Vocabulary',
    trainVocabulary: 'Train Vocabulary',
    
    // Form labels
    textFrench: 'Text (Français)',
    textGerman: 'Text (Deutsch)',
    source: 'Source (URL or description)',
    sourcePlaceholder: 'Current translation URL or "manual"',
    tags: 'Tags',
    tagsPlaceholder: 'e.g., greetings, travel, food',
    stage: 'Stage',
    reviewCount: 'Review Count',
    vocabId: 'Vocabulary ID',
    dateAdded: 'Date Added',
    lastReviewed: 'Last Reviewed',
    userId: 'User ID',
    
    // Buttons
    saveButton: 'Save',
    loadButton: 'Load',
    cancelButton: 'Cancel',
    deleteButton: 'Delete',
    
    // Filter options
    filter: 'Filter',
    count: 'Count',
    filterOptions: {
      today: 'Today',
      yesterday: 'Yesterday',
      lastWeek: 'Last 7 Days',
      stage1: 'Stage 1 (new)',
      stage2: 'Stage 2',
      stage3: 'Stage 3',
      stage4: 'Stage 4',
      stage5: 'Stage 5',
      stage6: 'Stage 6',
      stage7: 'Stage 7 (learned)'
    },
    
    // Table headers
    table: {
      order: 'Order',
      french: 'Français',
      german: 'Deutsch',
      review: 'Review',
      stage: 'Stage',
      actions: 'Actions'
    },
    
    // Tooltips
    tooltips: {
      moveUp: 'Move up',
      moveDown: 'Move down',
      correct: 'Correct',
      practiceAgain: 'Practice again',
      edit: 'Edit'
    },
    
    // Edit dialog
    editDialog: {
      title: 'Edit Vocabulary'
    },
    
    // Messages
    noVocabulary: 'No vocabulary added yet. Add your first vocabulary above!',
    trainPlaceholder: 'Training functionality will be implemented here later.',
    fillBothFields: 'Please fill both French and German text',
    confirmDelete: 'Are you sure you want to delete this vocabulary?',
    saveFailed: 'Failed to save vocabulary: {error}',
    updateFailed: 'Failed to update vocabulary: {error}',
    deleteFailed: 'Failed to delete vocabulary: {error}',
    loadFailed: 'Failed to load vocabularies: {error}',
    saveError: 'Error saving vocabulary to backend. Check console for details.',
    updateError: 'Error updating vocabulary. Check console for details.',
    deleteError: 'Error deleting vocabulary. Check console for details.',
    loadError: 'Error loading vocabularies from backend. Check console for details.',
    
    // Console messages
    console: {
      vocabularySaved: 'Vocabulary saved:',
      vocabularyUpdated: 'Vocabulary updated:',
      vocabularyDeleted: 'Vocabulary deleted:',
      stageIncreased: 'Vocabulary stage increased:',
      stageDecreased: 'Vocabulary stage decreased:',
      loadedFromBackend: 'Loaded vocabularies from backend:',
      loadButtonCalled: 'Load button called with filter:'
    }
  },

  // Common
  common: {
    error: 'Error',
    success: 'Success',
    loading: 'Loading...',
    items: 'items'
  }
};

export default en;
