import i18next from 'i18next';
import {store} from '../store/index.js';
import {
  setLanguage,
  setInitialized,
  selectCurrentLanguage,
} from '../store/slices/languageSlice.js';

/**
 * Initialize i18next with Redux integration
 */
export async function initI18n() {
  const currentLanguage = selectCurrentLanguage(store.getState());

  document.documentElement.lang = currentLanguage;

  const en = await import('../locales/en.js');
  const tr = await import('../locales/tr.js');

  await i18next.init({
    lng: currentLanguage,
    fallbackLng: 'en',
    resources: {
      en: {translation: en.default},
      tr: {translation: tr.default},
    },
    interpolation: {
      escapeValue: false,
    },
  });

  store.dispatch(setInitialized(true));

  let previousLanguage = currentLanguage;
  store.subscribe(() => {
    const state = store.getState();
    const newLanguage = selectCurrentLanguage(state);

    if (newLanguage !== previousLanguage) {
      i18next.changeLanguage(newLanguage);
      previousLanguage = newLanguage;
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
 * Change language via Redux store
 * @param {string} language - Language code
 */
export function changeLanguage(language) {
  store.dispatch(setLanguage(language));
}

/**
 * Get current language
 */
export function getCurrentLanguage() {
  return i18next.language || 'en';
}
