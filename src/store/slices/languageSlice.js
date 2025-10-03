import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentLanguage: document.documentElement.lang || 'en',
  availableLanguages: ['en', 'tr'],
  isInitialized: false,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      document.documentElement.lang = action.payload;

      document.dispatchEvent(
        new CustomEvent('language-changed', {
          detail: {language: action.payload},
        })
      );
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    addLanguage: (state, action) => {
      if (!state.availableLanguages.includes(action.payload)) {
        state.availableLanguages.push(action.payload);
      }
    },
  },
});

export const {setLanguage, setInitialized, addLanguage} = languageSlice.actions;

export const selectCurrentLanguage = (state) => state.language.currentLanguage;
export const selectAvailableLanguages = (state) =>
  state.language.availableLanguages;
export const selectIsInitialized = (state) => state.language.isInitialized;

export default languageSlice.reducer;
