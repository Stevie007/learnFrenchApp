// i18n utility functions
import de from './de';
import en from './en';

const languages = {
  de,
  en
};

// Default language
const DEFAULT_LANGUAGE = 'de';

// Get current language from localStorage or use default
export const getCurrentLanguage = () => {
  return localStorage.getItem('appLanguage') || DEFAULT_LANGUAGE;
};

// Set language
export const setLanguage = (lang) => {
  if (languages[lang]) {
    localStorage.setItem('appLanguage', lang);
    return true;
  }
  return false;
};

// Get translation strings for current language
export const getStrings = (lang = getCurrentLanguage()) => {
  return languages[lang] || languages[DEFAULT_LANGUAGE];
};

// Format string with parameters
// Example: formatString("Hello {name}!", {name: "World"}) => "Hello World!"
export const formatString = (template, params) => {
  if (!params) return template;
  
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match;
  });
};

// Hook for React components to use translations
export const useTranslation = (lang = getCurrentLanguage()) => {
  const strings = getStrings(lang);
  
  const t = (path, params) => {
    // Navigate through nested object using dot notation
    // Example: t('app.title') => strings.app.title
    const keys = path.split('.');
    let value = strings;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        console.warn(`Translation key not found: ${path}`);
        return path;
      }
    }
    
    // Format with parameters if provided
    return params ? formatString(value, params) : value;
  };
  
  return { t, strings };
};

export default {
  getCurrentLanguage,
  setLanguage,
  getStrings,
  formatString,
  useTranslation
};
