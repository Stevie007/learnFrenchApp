// German language resources (default)
const de = {
  // App.jsx - Main application
  app: {
    title: 'On Parle Français - 5 min par Jour',
    subtitle: 'Text Trainer französisch - Limit(Zeichen): {maxText}/Übersetzung, {maxAudio}/Audio',
    userLabel: 'User: {username}',
    tabs: {
      translation: 'Textübersetzung',
      vocabulary: 'Vokabeltraining'
    }
  },

  // TranslationModule.jsx
  translation: {
    urlInput: 'URL oder Text zum Übersetzen',
    textForTranslation: 'Text zur Übersetzung',
    translateButton: 'Übersetzen',
    getAudioButton: 'Audio erstellen',
    getTextButton: 'Text von URL laden',
    translationResult: 'Übersetzungsergebnis',
    developerExtensions: 'Entwickler-Erweiterungen anzeigen',
    debugBackendUrls: 'Debug: Backend URLs',
    inputModeLabel: 'Textwahl via URL oder Direkteingabe: ',
    inputModeUrl: 'URL',
    inputModeText: 'Text',
    
    // Table headers
    table: {
      vocabulary: 'VOKABULAR',
      original: 'ORIGINAL (Français)',
      translated: 'ÜBERSETZT (Deutsch)'
    },
    
    // Feedback messages
    addedVocabulary: 'Hinzugefügt: {vocFr} → {vocDe}',
    addToVocabularyList: 'Zur Vokabelliste hinzufügen',
    loadingText: 'Lade Text von: {url} durch Backend-Aufruf: {api}',
    translationStarted: 'Übersetzung gestartet durch Backend-Aufruf: {api}'
  },

  // VocabularyModule.jsx
  vocabulary: {
    // Section titles
    addVocabulary: 'Vokabel hinzufügen',
    reviewVocabulary: 'Vokabeln trainieren',
    trainVocabulary: 'Vokabeln trainieren',
    
    // Form labels
    textFrench: 'Text (Français)',
    textGerman: 'Text (Deutsch)',
    source: 'Quelle/URL',
    sourcePlaceholder: 'Aktuelle Übersetzungs-URL oder "manual"',
    tags: 'Tags',
    tagsPlaceholder: 'z.B. Begrüßungen, Reisen, Essen',
    stage: 'Phase',
    reviewCount: 'Anzahl Wiederholungen',
    vocabId: 'Vokabel-ID',
    dateAdded: 'Hinzugefügt am',
    lastReviewed: 'Zuletzt überprüft',
    userId: 'Benutzer-ID',
    
    // Buttons
    saveButton: 'Speichern',
    loadButton: 'Laden',
    cancelButton: 'Abbrechen',
    deleteButton: 'Löschen',
    
    // Filter options
    filter: 'Filter',
    count: 'Anzahl',
    filterOptions: {
      today: 'Heute',
      yesterday: 'Gestern',
      lastWeek: 'Letzte 7 Tage',
      stage1: 'Phase 1 (neu)',
      stage2: 'Phase 2',
      stage3: 'Phase 3',
      stage4: 'Phase 4',
      stage5: 'Phase 5',
      stage6: 'Phase 6',
      stage7: 'Phase 7 (gelernt)'
    },
    
    // Table headers
    table: {
      order: 'Reihenfolge',
      french: 'Français',
      german: 'Deutsch',
      review: 'Bewertung',
      stage: 'Phase',
      actions: 'Aktionen'
    },
    
    // Tooltips
    tooltips: {
      moveUp: 'Nach oben',
      moveDown: 'Nach unten',
      correct: 'Richtig',
      practiceAgain: 'Erneut üben',
      edit: 'Bearbeiten'
    },
    
    // Edit dialog
    editDialog: {
      title: 'Vokabel bearbeiten'
    },
    
    // Messages
    noVocabulary: 'Noch keine Vokabeln hinzugefügt. Füge deine erste Vokabel oben hinzu!',
    trainPlaceholder: 'Trainingsfunktion wird später implementiert.',
    fillBothFields: 'Bitte fülle sowohl französischen als auch deutschen Text aus',
    confirmDelete: 'Bist du sicher, dass du diese Vokabel löschen möchtest?',
    saveFailed: 'Fehler beim Speichern der Vokabel: {error}',
    updateFailed: 'Fehler beim Aktualisieren der Vokabel: {error}',
    deleteFailed: 'Fehler beim Löschen der Vokabel: {error}',
    loadFailed: 'Fehler beim Laden der Vokabeln: {error}',
    saveError: 'Fehler beim Speichern der Vokabel zum Backend. Siehe Konsole für Details.',
    updateError: 'Fehler beim Aktualisieren der Vokabel. Siehe Konsole für Details.',
    deleteError: 'Fehler beim Löschen der Vokabel. Siehe Konsole für Details.',
    loadError: 'Fehler beim Laden der Vokabeln vom Backend. Siehe Konsole für Details.',
    
    // Console messages
    console: {
      vocabularySaved: 'Vokabel gespeichert:',
      vocabularyUpdated: 'Vokabel aktualisiert:',
      vocabularyDeleted: 'Vokabel gelöscht:',
      stageIncreased: 'Vokabel-Phase erhöht:',
      stageDecreased: 'Vokabel-Phase verringert:',
      loadedFromBackend: 'Vokabeln vom Backend geladen:',
      loadButtonCalled: 'Laden-Button aufgerufen mit Filter:'
    }
  },

  // Common
  common: {
    error: 'Fehler',
    success: 'Erfolg',
    loading: 'Lädt...',
    items: 'Einträge'
  }
};

export default de;
