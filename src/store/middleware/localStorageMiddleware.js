/**
 * LocalStorage Middleware for Redux
 * Automatically saves Redux state to localStorage on every state change
 */

const STORAGE_KEY = 'employee-mgmt-app-state';

/**
 * Save state to localStorage
 * @param {Object} state - Redux state to save
 */
const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load state from localStorage
 * @returns {Object|undefined} Loaded state or undefined if not found
 */
export const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return undefined;
  }
};

/**
 * LocalStorage Middleware
 * Listens to all Redux actions and saves state after each change
 */
export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const state = store.getState();

  const stateToSave = {
    employees: state.employees,
    language: state.language,
  };

  saveToLocalStorage(stateToSave);

  return result;
};
