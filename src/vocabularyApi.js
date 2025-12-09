// Vocabulary API helper functions

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_BACKEND_VOCABULARY_API;

/**
 * Get single vocabulary by vocID
 */
export async function getVocabulary(userid, vocID) {
  try {
    const response = await fetch(`${API_BASE_URL}/vocabulary?userid=${userid}&vocID=${vocID}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    throw error;
  }
}

/**
 * Get bulk vocabularies with filtering
 * @param {string} userid - User ID
 * @param {string} mode - Filter mode: 'new', 'yesterday', 'lastweek', 'repetition', 'random'
 * @param {number} count - Number of vocabularies to fetch
 */
export async function getVocabularies(userid, mode, count) {
  try {
    const countParam = count === '-' ? '' : `&count=${count}`;
    const response = await fetch(`${API_BASE_URL}/vocabularies?userid=${userid}&mode=${mode}${countParam}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vocabularies:', error);
    throw error;
  }
}

/**
 * Create new vocabulary
 * @returns {Object} Response with vocID
 */
export async function createVocabulary(vocabularyData) {
  try {
    const response = await fetch(`${API_BASE_URL}/vocabulary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: vocabularyData.userid,
        textFr: vocabularyData.textFr,
        textDe: vocabularyData.textDe,
        source: vocabularyData.source,
        tags: vocabularyData.tags
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating vocabulary:', error);
    throw error;
  }
}

/**
 * Update existing vocabulary
 */
export async function updateVocabulary(vocabularyData) {
  try {
    const response = await fetch(`${API_BASE_URL}/vocabulary`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: vocabularyData.userid,
        vocID: vocabularyData.vocID,
        textFr: vocabularyData.textFr,
        textDe: vocabularyData.textDe,
        source: vocabularyData.source,
        tags: vocabularyData.tags,
        reviewCount: vocabularyData.reviewCount,
        lastReviewed: vocabularyData.lastReviewed,
        stage: vocabularyData.stage
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating vocabulary:', error);
    throw error;
  }
}

/**
 * Delete vocabulary by vocID
 */
export async function deleteVocabulary(userid, vocID) {
  try {
    const response = await fetch(`${API_BASE_URL}/vocabulary?userid=${userid}&vocID=${vocID}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting vocabulary:', error);
    throw error;
  }
}
