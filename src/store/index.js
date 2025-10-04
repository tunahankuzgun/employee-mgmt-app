import {configureStore} from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice.js';
import employeesReducer from './slices/employeesSlice.js';
import {
  localStorageMiddleware,
  loadFromLocalStorage,
} from './middleware/localStorageMiddleware.js';

const persistedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    language: languageReducer,
    employees: employeesReducer,
  },
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
  devTools:
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__,
});

export default store;
