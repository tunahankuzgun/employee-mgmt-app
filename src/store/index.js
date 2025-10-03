import {configureStore} from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice.js';

export const store = configureStore({
  reducer: {
    language: languageReducer,
  },
  devTools:
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__,
});

export default store;
