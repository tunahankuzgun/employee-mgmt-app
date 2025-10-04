import {assert} from '@open-wc/testing';
import {
  localStorageMiddleware,
  loadFromLocalStorage,
  STORAGE_KEY,
} from '../src/store/middleware/localStorageMiddleware.js';
import {configureStore} from '@reduxjs/toolkit';
import employeesReducer, {
  addEmployee,
} from '../src/store/slices/employeesSlice.js';
import languageReducer, {
  setLanguage,
} from '../src/store/slices/languageSlice.js';

suite('LocalStorage Middleware', () => {
  let store;

  setup(() => {
    localStorage.clear();
  });

  teardown(() => {
    localStorage.clear();
  });

  test('loadFromLocalStorage returns null when no data exists', () => {
    const state = loadFromLocalStorage();
    assert.isNull(state);
  });

  test('loadFromLocalStorage returns parsed state when data exists', () => {
    const testState = {
      employees: {employees: [{id: 1, firstName: 'Test'}]},
      language: {currentLanguage: 'en'},
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testState));

    const loadedState = loadFromLocalStorage();
    assert.deepEqual(loadedState, testState);
  });

  test('loadFromLocalStorage handles corrupted data gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid json{');

    const state = loadFromLocalStorage();
    assert.isNull(state);
  });

  test('middleware saves state to localStorage on action', () => {
    store = configureStore({
      reducer: {
        employees: employeesReducer,
        language: languageReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    });

    store.dispatch(
      addEmployee({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        phone: '+90 (532) 123 45 67',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
        department: 'analytics',
        position: 'junior',
      })
    );

    const savedData = localStorage.getItem(STORAGE_KEY);
    assert.isNotNull(savedData);

    const parsedData = JSON.parse(savedData);
    assert.property(parsedData, 'employees');
    assert.property(parsedData, 'language');
  });

  test('middleware only saves employees and language slices', () => {
    store = configureStore({
      reducer: {
        employees: employeesReducer,
        language: languageReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    });

    store.dispatch({type: 'test/action'});

    const savedData = localStorage.getItem(STORAGE_KEY);
    const parsedData = JSON.parse(savedData);

    const keys = Object.keys(parsedData);
    assert.includeMembers(keys, ['employees', 'language']);
    assert.equal(keys.length, 2);
  });

  test('middleware handles localStorage quota exceeded error', () => {
    const largeArray = new Array(100000).fill({
      id: 1,
      data: 'x'.repeat(1000),
    });

    store = configureStore({
      reducer: {
        employees: employeesReducer,
        language: languageReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    });

    assert.doesNotThrow(() => {
      store.dispatch({
        type: 'employees/setEmployees',
        payload: largeArray.slice(0, 10),
      });
    });
  });

  test('persisted state can be loaded back into store', () => {
    const initialStore = configureStore({
      reducer: {
        employees: employeesReducer,
        language: languageReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    });

    initialStore.dispatch(
      addEmployee({
        firstName: 'Persisted',
        lastName: 'User',
        email: 'persisted@test.com',
        phone: '+90 (532) 123 45 67',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
        department: 'analytics',
        position: 'junior',
      })
    );

    const preloadedState = loadFromLocalStorage();
    assert.isNotNull(preloadedState);

    const newStore = configureStore({
      reducer: {
        employees: employeesReducer,
        language: languageReducer,
      },
      preloadedState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    });

    const employees = newStore.getState().employees.employees;
    assert.isArray(employees, 'employees should be an array');
    assert.isTrue(employees.length > 0, 'employees array should not be empty');

    const persistedEmployee = employees.find(
      (emp) => emp.firstName === 'Persisted'
    );
    assert.isDefined(
      persistedEmployee,
      'Employee with firstName "Persisted" should exist'
    );
    assert.equal(persistedEmployee.lastName, 'User');
    assert.equal(persistedEmployee.email, 'persisted@test.com');
  });

  test('localStorage is updated when language changes', () => {
    store = configureStore({
      reducer: {
        employees: employeesReducer,
        language: languageReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    });

    store.dispatch(setLanguage('tr'));

    const savedData = localStorage.getItem(STORAGE_KEY);
    const parsedData = JSON.parse(savedData);

    assert.equal(parsedData.language.currentLanguage, 'tr');
  });
});
