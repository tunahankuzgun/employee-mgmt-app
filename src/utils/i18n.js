import i18next from 'i18next';

/**
 * Initialize i18next
 */
export async function initI18n() {
  const language = document.documentElement.lang || 'en';
  
  const en = await import('../locales/en.js');
  const tr = await import('../locales/tr.js');
  
  await i18next.init({
    lng: language,
    fallbackLng: 'en',
    resources: {
      en: { translation: en.default },
      tr: { translation: tr.default }
    },
    interpolation: {
      escapeValue: false
    }
  });

  return i18next;
}

/**
 * Get translated text
 * @param {string} key - Translation key
 * @param {object} options - Interpolation options
 * @returns {string} Translated text
 */
export function t(key, options = {}) {
  return i18next.t(key, options);
}

/**
 * Change language
 * @param {string} language - Language code
 */
export function changeLanguage(language) {
  i18next.changeLanguage(language);
  document.documentElement.lang = language;
  
  document.dispatchEvent(new CustomEvent('language-changed', {
    detail: { language }
  }));
}

/**
 * Get current language
 */
export function getCurrentLanguage() {
  return i18next.language || 'en';
}