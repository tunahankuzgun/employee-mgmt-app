import {configureStore} from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice.js';
import employeesReducer from './slices/employeesSlice.js';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    employees: employeesReducer,
  },
  devTools:
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__,
});

export default store;
