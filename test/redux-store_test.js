import {store} from '../src/store/index.js';
import {
  setLanguage,
  selectCurrentLanguage,
  selectAvailableLanguages,
} from '../src/store/slices/languageSlice.js';
import {
  selectEmployees,
  selectEmployeeById,
  addEmployee,
  DEPARTMENTS,
  POSITIONS,
} from '../src/store/slices/employeesSlice.js';
import {assert} from '@open-wc/testing';

suite('Redux Store', () => {
  test('store is defined and has initial state', () => {
    assert.isNotNull(store);
    assert.isObject(store.getState());
  });

  test('store has language slice in state', () => {
    const state = store.getState();
    assert.property(state, 'language');
  });

  test('store has employees slice in state', () => {
    const state = store.getState();
    assert.property(state, 'employees');
  });
});

suite('Language Slice', () => {
  let initialState;

  setup(() => {
    initialState = store.getState();
  });

  teardown(() => {
    const currentState = store.getState();
    if (
      currentState.language.currentLanguage !==
      initialState.language.currentLanguage
    ) {
      store.dispatch(setLanguage(initialState.language.currentLanguage));
    }
  });

  test('has initial language state', () => {
    const state = store.getState();
    assert.property(state.language, 'currentLanguage');
    assert.property(state.language, 'availableLanguages');
  });

  test('selectCurrentLanguage returns current language', () => {
    const state = store.getState();
    const currentLanguage = selectCurrentLanguage(state);
    assert.isString(currentLanguage);
    assert.isTrue(['en', 'tr'].includes(currentLanguage));
  });

  test('selectAvailableLanguages returns available languages array', () => {
    const state = store.getState();
    const availableLanguages = selectAvailableLanguages(state);
    assert.isArray(availableLanguages);
    assert.include(availableLanguages, 'en');
    assert.include(availableLanguages, 'tr');
  });

  test('setLanguage action changes current language to Turkish', () => {
    store.dispatch(setLanguage('tr'));
    const state = store.getState();
    const currentLanguage = selectCurrentLanguage(state);
    assert.equal(currentLanguage, 'tr');
  });

  test('setLanguage action changes current language to English', () => {
    store.dispatch(setLanguage('en'));
    const state = store.getState();
    const currentLanguage = selectCurrentLanguage(state);
    assert.equal(currentLanguage, 'en');
  });

  test('setLanguage with any language sets the value (no validation)', () => {
    store.dispatch(setLanguage('invalid'));

    const currentLang = selectCurrentLanguage(store.getState());
    assert.equal(currentLang, 'invalid');

    store.dispatch(setLanguage('en'));
  });

  test('language state changes trigger store subscription', (done) => {
    const initialLang = selectCurrentLanguage(store.getState());
    const newLang = initialLang === 'en' ? 'tr' : 'en';

    const unsubscribe = store.subscribe(() => {
      const currentLang = selectCurrentLanguage(store.getState());
      if (currentLang === newLang) {
        assert.equal(currentLang, newLang);
        unsubscribe();
        done();
      }
    });

    store.dispatch(setLanguage(newLang));
  });
});

suite('Employees Slice', () => {
  test('has initial employees state', () => {
    const state = store.getState();
    assert.property(state.employees, 'employees');
    assert.property(state.employees, 'isLoading');
    assert.property(state.employees, 'error');
  });

  test('selectEmployees returns employees array', () => {
    const state = store.getState();
    const employees = selectEmployees(state);
    assert.isArray(employees);
    assert.isTrue(employees.length > 0);
  });

  test('employees have expected structure with key-based departments/positions', () => {
    const state = store.getState();
    const employees = selectEmployees(state);
    const firstEmployee = employees[0];

    assert.property(firstEmployee, 'id');
    assert.property(firstEmployee, 'firstName');
    assert.property(firstEmployee, 'lastName');
    assert.property(firstEmployee, 'email');
    assert.property(firstEmployee, 'department');
    assert.property(firstEmployee, 'position');

    assert.isTrue(
      Object.values(DEPARTMENTS).includes(firstEmployee.department)
    );
    assert.isTrue(Object.values(POSITIONS).includes(firstEmployee.position));
  });

  test('selectEmployeeById returns correct employee', () => {
    const state = store.getState();
    const employees = selectEmployees(state);
    const firstEmployee = employees[0];
    const selectedEmployee = selectEmployeeById(firstEmployee.id)(state);

    assert.deepEqual(selectedEmployee, firstEmployee);
  });

  test('addEmployee action adds new employee', () => {
    const initialEmployees = selectEmployees(store.getState());
    const initialCount = initialEmployees.length;

    const newEmployee = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+(90) 532 123 45 99',
      department: DEPARTMENTS.TECH,
      position: POSITIONS.JUNIOR,
      dateOfEmployment: '2023-10-04',
      dateOfBirth: '1995-01-01',
      salary: 50000,
    };

    store.dispatch(addEmployee(newEmployee));

    const updatedEmployees = selectEmployees(store.getState());
    assert.equal(updatedEmployees.length, initialCount + 1);

    const addedEmployee = updatedEmployees.find(
      (emp) => emp.firstName === 'Test'
    );
    assert.isNotNull(addedEmployee);
    assert.property(addedEmployee, 'id');
  });

  test('DEPARTMENTS constant has expected values', () => {
    assert.property(DEPARTMENTS, 'ANALYTICS');
    assert.property(DEPARTMENTS, 'TECH');
    assert.equal(DEPARTMENTS.ANALYTICS, 'analytics');
    assert.equal(DEPARTMENTS.TECH, 'tech');
  });

  test('POSITIONS constant has expected values', () => {
    assert.property(POSITIONS, 'JUNIOR');
    assert.property(POSITIONS, 'MEDIOR');
    assert.property(POSITIONS, 'SENIOR');
    assert.equal(POSITIONS.JUNIOR, 'junior');
    assert.equal(POSITIONS.MEDIOR, 'medior');
    assert.equal(POSITIONS.SENIOR, 'senior');
  });
});
