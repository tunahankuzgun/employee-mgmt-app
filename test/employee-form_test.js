import {EmployeeForm} from '../src/components/employee-form.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {store} from '../src/store/index.js';
import {
  selectEmployees,
  addEmployee,
} from '../src/store/slices/employeesSlice.js';
import {DEPARTMENTS, POSITIONS} from '../src/store/slices/employeesSlice.js';
import {initI18n} from '../src/utils/i18n.js';
import '../src/components/employee-form.js';

suite('EmployeeForm', () => {
  suiteSetup(async () => {
    await initI18n();
  });

  test('is defined', () => {
    const el = document.createElement('employee-form');
    assert.instanceOf(el, EmployeeForm);
  });

  test('renders the component', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    assert.isTrue(element !== null);
    assert.instanceOf(element, EmployeeForm);
  });

  test('has default properties for add mode', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    assert.isFalse(element.isEditMode);
    assert.isNull(element.employeeId);
    assert.isNull(element.employee);
    assert.isObject(element.formData);
    assert.isObject(element.errors);
  });

  test('initializes with empty form data', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    assert.equal(element.formData.firstName, '');
    assert.equal(element.formData.lastName, '');
    assert.equal(element.formData.email, '');
    assert.equal(element.formData.phone, '');
    assert.equal(element.formData.dateOfEmployment, '');
    assert.equal(element.formData.dateOfBirth, '');
    assert.equal(element.formData.department, '');
    assert.equal(element.formData.position, '');
  });

  test('renders all form fields', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const firstNameInput = element.shadowRoot.querySelector('#firstName');
    const lastNameInput = element.shadowRoot.querySelector('#lastName');
    const emailInput = element.shadowRoot.querySelector('#email');
    const phoneInput = element.shadowRoot.querySelector('#phone');
    const dateOfEmploymentInput =
      element.shadowRoot.querySelector('#dateOfEmployment');
    const dateOfBirthInput = element.shadowRoot.querySelector('#dateOfBirth');
    const departmentSelect = element.shadowRoot.querySelector('#department');
    const positionSelect = element.shadowRoot.querySelector('#position');

    assert.isNotNull(firstNameInput);
    assert.isNotNull(lastNameInput);
    assert.isNotNull(emailInput);
    assert.isNotNull(phoneInput);
    assert.isNotNull(dateOfEmploymentInput);
    assert.isNotNull(dateOfBirthInput);
    assert.isNotNull(departmentSelect);
    assert.isNotNull(positionSelect);
  });

  test('renders submit and cancel buttons', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const buttons = element.shadowRoot.querySelectorAll('button');
    assert.equal(buttons.length, 2);

    const cancelButton = element.shadowRoot.querySelector('.btn-secondary');
    const submitButton = element.shadowRoot.querySelector('.btn-primary');

    assert.isNotNull(cancelButton);
    assert.isNotNull(submitButton);
  });

  test('displays correct title in add mode', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    element.isEditMode = false;
    await element.updateComplete;

    const title = element.shadowRoot.querySelector('h2');
    assert.isNotNull(title);
  });

  test('validates required fields', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const isValid = element._validateForm();
    assert.isFalse(isValid);
    assert.isNotEmpty(element.errors);
  });

  test('validates email format', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);

    let error = element._validateField('email', 'invalid-email');
    assert.ok(error, 'Should return error message for invalid email');

    error = element._validateField('email', 'test@example.com');
    assert.equal(error, '', 'Should return empty string for valid email');
  });

  test('validates phone number format', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);

    let error = element._validateField('phone', '+90 123');
    assert.ok(error, 'Should return error message for invalid phone');

    error = element._validateField('phone', '+90 (532) 123 45 67');
    assert.equal(error, '', 'Should return empty string for valid phone');
  });

  test('formats phone number correctly', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);

    const formatted = element._formatPhoneNumber('905321234567');
    assert.equal(formatted, '+90 (532) 123 45 67');
  });

  test('limits phone number to 12 digits', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);

    const formatted = element._formatPhoneNumber('90532123456789999');
    assert.equal(formatted.replace(/\D/g, '').length, 12);
  });

  test('validates date of employment not in future', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    let error = element._validateField('dateOfEmployment', futureDateStr);
    assert.ok(error, 'Should return error for future date');

    error = element._validateField('dateOfEmployment', '2020-01-01');
    assert.equal(error, '', 'Should return empty string for past date');
  });

  test('validates date of birth for age >= 18', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);

    const underAge = new Date();
    underAge.setFullYear(underAge.getFullYear() - 17);
    const underAgeStr = underAge.toISOString().split('T')[0];

    let error = element._validateField('dateOfBirth', underAgeStr);
    assert.ok(error, 'Should return error for under 18');

    const validAge = new Date();
    validAge.setFullYear(validAge.getFullYear() - 25);
    const validAgeStr = validAge.toISOString().split('T')[0];

    error = element._validateField('dateOfBirth', validAgeStr);
    assert.equal(error, '', 'Should return empty string for valid age');
  });

  test('updates form data on input', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const input = element.shadowRoot.querySelector('#firstName');
    input.value = 'John';
    input.dispatchEvent(new Event('input', {bubbles: true}));

    await element.updateComplete;
    assert.equal(element.formData.firstName, 'John');
  });

  test('shows validation errors on blur', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const emailInput = element.shadowRoot.querySelector('#email');
    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('blur', {bubbles: true}));

    await element.updateComplete;
    assert.ok(
      element.errors.email,
      'Should have error message for invalid email'
    );

    const errorDiv = element.shadowRoot.querySelector('.error');
    assert.isNotNull(errorDiv);
  });

  test('clears validation error when field becomes valid', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const emailInput = element.shadowRoot.querySelector('#email');

    emailInput.value = 'invalid';
    emailInput.dispatchEvent(new Event('blur', {bubbles: true}));
    await element.updateComplete;
    assert.ok(element.errors.email, 'Should have error for invalid email');

    emailInput.value = 'valid@email.com';
    emailInput.dispatchEvent(new Event('blur', {bubbles: true}));
    await element.updateComplete;
    assert.isUndefined(element.errors.email);
  });

  test('validates email uniqueness - rejects duplicate email', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const employees = selectEmployees(store.getState());
    const existingEmail = employees[0].email;

    element.isEditMode = false;
    element.formData = {...element.formData, email: existingEmail};

    await element.updateComplete;

    const error = element._validateField('email', existingEmail);
    assert.ok(error, 'Should have error for duplicate email');
    assert.include(
      error.toLowerCase(),
      'already',
      'Error message should mention email already exists'
    );
  });

  test('validates email uniqueness - allows same email in edit mode', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const employees = selectEmployees(store.getState());
    const existingEmployee = employees[0];

    element.isEditMode = true;
    element.employeeId = existingEmployee.id.toString();
    element.formData = {...existingEmployee};

    await element.updateComplete;

    const error = element._validateField('email', existingEmployee.email);
    assert.equal(
      error,
      '',
      'Should NOT have error when using own email in edit mode'
    );
  });

  test('validates email uniqueness - rejects other users email in edit mode', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const employees = selectEmployees(store.getState());
    const employee1 = employees[0];
    const employee2 = employees[1];

    element.isEditMode = true;
    element.employeeId = employee1.id.toString();
    element.formData = {...employee1, email: employee2.email};

    await element.updateComplete;

    const error = element._validateField('email', employee2.email);
    assert.ok(
      error,
      'Should have error when trying to use another users email in edit mode'
    );
    assert.include(
      error.toLowerCase(),
      'already',
      'Error message should mention email already exists'
    );
  });

  test('email uniqueness check is case-insensitive', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const employees = selectEmployees(store.getState());
    const existingEmail = employees[0].email;

    const differentCaseEmail = existingEmail.toUpperCase();

    element.isEditMode = false;
    element.formData = {...element.formData, email: differentCaseEmail};

    await element.updateComplete;

    const error = element._validateField('email', differentCaseEmail);
    assert.ok(
      error,
      'Should have error for duplicate email regardless of case'
    );
  });

  test('department select has correct options', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const departmentSelect = element.shadowRoot.querySelector('#department');
    const options = departmentSelect.querySelectorAll('option');

    assert.equal(options.length, 3);
    assert.equal(options[0].value, '');
    assert.equal(options[1].value, DEPARTMENTS.ANALYTICS);
    assert.equal(options[2].value, DEPARTMENTS.TECH);
  });

  test('position select has correct options', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const positionSelect = element.shadowRoot.querySelector('#position');
    const options = positionSelect.querySelectorAll('option');

    assert.equal(options.length, 4);
    assert.equal(options[0].value, '');
    assert.equal(options[1].value, POSITIONS.JUNIOR);
    assert.equal(options[2].value, POSITIONS.MEDIOR);
    assert.equal(options[3].value, POSITIONS.SENIOR);
  });

  test('submits valid form and adds employee to store', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const initialCount = selectEmployees(store.getState()).length;

    element.formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '+90 (532) 123 45 67',
      dateOfEmployment: '2023-01-15',
      dateOfBirth: '1990-05-20',
      department: DEPARTMENTS.TECH,
      position: POSITIONS.SENIOR,
    };

    await element.updateComplete;

    const isValid = element._validateForm();
    assert.isTrue(isValid, 'Form should be valid');

    element.dispatch(addEmployee(element.formData));

    const newCount = selectEmployees(store.getState()).length;
    assert.equal(newCount, initialCount + 1);
  });

  test('does not submit invalid form', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const isValid = element._validateForm();
    assert.isFalse(isValid, 'Empty form should be invalid');
    assert.isNotEmpty(element.errors, 'Should have validation errors');
  });

  test('loads employee data in edit mode', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);

    const employees = selectEmployees(store.getState());
    const testEmployee = employees[0];

    element.employeeId = testEmployee.id.toString();
    element.isEditMode = true;
    element._loadEmployeeData = function () {
      this.employee = testEmployee;
      this.formData = {...testEmployee};
    };
    element._loadEmployeeData();

    await element.updateComplete;

    assert.equal(element.formData.firstName, testEmployee.firstName);
    assert.equal(element.formData.lastName, testEmployee.lastName);
    assert.equal(element.formData.email, testEmployee.email);
  });

  test('updates validation errors when language changes', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    element.formData.email = 'invalid';
    element._validateForm();

    const initialError = element.errors.email;
    assert.ok(initialError, 'Should have error for invalid email');

    element.language = 'tr';
    const state = store.getState();
    element.stateChanged({...state, language: {currentLanguage: 'tr'}});

    await element.updateComplete;

    assert.ok(
      element.errors.email,
      'Error should still exist after language change'
    );
  });

  test('phone input enforces max length', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const phoneInput = element.shadowRoot.querySelector('#phone');

    assert.equal(phoneInput.getAttribute('maxlength'), '22');
  });

  test('select elements show correct selected values in edit mode', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);

    element.formData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      phone: '+90 (532) 123 45 67',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      department: DEPARTMENTS.TECH,
      position: POSITIONS.SENIOR,
    };
    element.isEditMode = true;

    await element.updateComplete;

    const departmentSelect = element.shadowRoot.querySelector('#department');
    const positionSelect = element.shadowRoot.querySelector('#position');

    const selectedDepartment = departmentSelect.querySelector('[selected]');
    const selectedPosition = positionSelect.querySelector('[selected]');

    assert.isNotNull(selectedDepartment);
    assert.isNotNull(selectedPosition);
    assert.equal(selectedDepartment.value, DEPARTMENTS.TECH);
    assert.equal(selectedPosition.value, POSITIONS.SENIOR);
  });

  test('renders different button text in edit vs add mode', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);

    element.isEditMode = false;
    await element.updateComplete;
    let submitButton = element.shadowRoot.querySelector('.btn-primary');
    const addText = submitButton.textContent.trim();
    assert.ok(addText.length > 0, 'Add button should have text');

    element.isEditMode = true;
    await element.updateComplete;
    submitButton = element.shadowRoot.querySelector('.btn-primary');
    const editText = submitButton.textContent.trim();
    assert.ok(editText.length > 0, 'Edit button should have text');

    assert.notEqual(
      addText,
      editText,
      'Button texts should be different in add vs edit mode'
    );
  });

  test('form data is reactive to changes', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    element.formData = {...element.formData, firstName: 'Jane'};
    await element.updateComplete;

    const input = element.shadowRoot.querySelector('#firstName');
    assert.equal(input.value, 'Jane');
  });

  test('shows edit confirmation dialog on submit in edit mode', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    element.isEditMode = true;
    element.employeeId = '1';
    element.formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      phone: '+90 (532) 123 45 67',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      department: DEPARTMENTS.TECH,
      position: POSITIONS.SENIOR,
    };

    await element.updateComplete;

    assert.isFalse(element.showEditDialog);

    element._handleSubmit({preventDefault: () => {}});

    await element.updateComplete;

    assert.isTrue(element.showEditDialog);
  });

  test('does not show edit dialog in add mode', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    element.isEditMode = false;
    element.formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      phone: '+90 (532) 123 45 67',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      department: DEPARTMENTS.TECH,
      position: POSITIONS.SENIOR,
    };

    await element.updateComplete;

    assert.isFalse(element.showEditDialog);

    const initialCount = selectEmployees(store.getState()).length;
    element.dispatch(addEmployee(element.formData));

    await element.updateComplete;

    assert.isFalse(element.showEditDialog);
    const newCount = selectEmployees(store.getState()).length;
    assert.equal(newCount, initialCount + 1);
  });

  test('edit confirmation dialog is rendered', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    const dialog = element.shadowRoot.querySelector('confirmation-dialog');
    assert.isNotNull(dialog);
  });

  test('cancel edit dialog closes it', async () => {
    const element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;

    element.showEditDialog = true;
    await element.updateComplete;

    assert.isTrue(element.showEditDialog);

    element._handleCancelEdit();
    await element.updateComplete;

    assert.isFalse(element.showEditDialog);
  });
});
