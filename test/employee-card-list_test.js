import {EmployeeCardList} from '../src/components/employee-card-list.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {DEPARTMENTS, POSITIONS} from '../src/store/slices/employeesSlice.js';
import {initI18n} from '../src/utils/i18n.js';
import '../src/components/employee-card-list.js';

suite('EmployeeCardList', () => {
  suiteSetup(async () => {
    await initI18n();
  });

  /** @type {Array<Object>} */
  const mockEmployees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+(90) 532 123 45 67',
      department: DEPARTMENTS.TECH,
      position: POSITIONS.SENIOR,
      dateOfEmployment: '2023-01-15',
      dateOfBirth: '1990-05-12',
      salary: 75000,
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+(90) 532 123 45 68',
      department: DEPARTMENTS.ANALYTICS,
      position: POSITIONS.MEDIOR,
      dateOfEmployment: '2022-08-20',
      dateOfBirth: '1988-11-23',
      salary: 65000,
    },
  ];

  test('is defined', () => {
    const el = document.createElement('employee-card-list');
    assert.instanceOf(el, EmployeeCardList);
  });

  test('renders the component', async () => {
    const element = await fixture(
      html`<employee-card-list></employee-card-list>`
    );
    assert.isTrue(element !== null);
    assert.instanceOf(element, EmployeeCardList);
  });

  test('has default properties', async () => {
    const element = await fixture(
      html`<employee-card-list></employee-card-list>`
    );
    assert.isArray(element.employees);
    assert.equal(element.employees.length, 0);
  });

  test('renders correct number of employee cards', async () => {
    const element = await fixture(
      html`<employee-card-list></employee-card-list>`
    );
    element.employees = mockEmployees;
    await element.updateComplete;

    const cards = element.shadowRoot.querySelectorAll('.employee-card');
    assert.equal(cards.length, mockEmployees.length);
  });

  test('displays employee data in cards correctly', async () => {
    const element = await fixture(
      html`<employee-card-list
        .employees="${mockEmployees}"
      ></employee-card-list>`
    );
    await element.updateComplete;

    const firstCard = element.shadowRoot.querySelector('.employee-card');
    const cardContent = firstCard.textContent;

    assert.include(cardContent, 'John');
    assert.include(cardContent, 'Doe');
    assert.include(cardContent, 'john.doe@company.com');
  });

  test('renders action buttons for each card', async () => {
    const element = await fixture(
      html`<employee-card-list
        .employees="${mockEmployees}"
      ></employee-card-list>`
    );
    await element.updateComplete;

    const editButtons = element.shadowRoot.querySelectorAll('.btn-edit-list');
    const deleteButtons = element.shadowRoot.querySelectorAll('.btn-delete');

    assert.equal(editButtons.length, mockEmployees.length);
    assert.equal(deleteButtons.length, mockEmployees.length);
  });

  test('handles edit button click in card', async () => {
    let editedEmployee = null;
    const element = await fixture(
      html`<employee-card-list
        .employees="${mockEmployees}"
        @employee-edit="${(e) => {
          editedEmployee = e.detail.employee;
        }}"
      ></employee-card-list>`
    );
    await element.updateComplete;

    const editButton = element.shadowRoot.querySelector('.btn-edit-list');
    editButton.click();

    assert.isNotNull(editedEmployee);
    assert.equal(editedEmployee.id, mockEmployees[0].id);
  });

  test('handles delete button click in card', async () => {
    let deletedEmployee = null;
    const element = await fixture(
      html`<employee-card-list
        .employees="${mockEmployees}"
        @employee-delete="${(e) => {
          deletedEmployee = e.detail.employee;
        }}"
      ></employee-card-list>`
    );
    await element.updateComplete;

    const deleteButton = element.shadowRoot.querySelector('.btn-delete');
    deleteButton.click();

    assert.isNotNull(deletedEmployee);
    assert.equal(deletedEmployee.id, mockEmployees[0].id);
  });

  test('renders empty state when no employees', async () => {
    const element = await fixture(
      html`<employee-card-list .employees="${[]}"></employee-card-list>`
    );
    await element.updateComplete;

    const cards = element.shadowRoot.querySelectorAll('.employee-card');
    assert.equal(cards.length, 0);
  });

  test('displays all employee fields in card', async () => {
    const element = await fixture(
      html`<employee-card-list
        .employees="${mockEmployees}"
      ></employee-card-list>`
    );
    await element.updateComplete;

    const firstCard = element.shadowRoot.querySelector('.employee-card');
    const fieldGroups = firstCard.querySelectorAll('.field-group');

    assert.isTrue(fieldGroups.length >= 8);
  });

  test('formats dates correctly in cards', async () => {
    const element = await fixture(
      html`<employee-card-list
        .employees="${mockEmployees}"
      ></employee-card-list>`
    );
    await element.updateComplete;

    const cardContent =
      element.shadowRoot.querySelector('.employee-card').textContent;
    assert.isTrue(cardContent.includes('2023') || cardContent.includes('/'));
  });

  test('displays localized department and position names in cards', async () => {
    const element = await fixture(
      html`<employee-card-list
        .employees="${mockEmployees}"
      ></employee-card-list>`
    );
    await element.updateComplete;

    const cardContent =
      element.shadowRoot.querySelector('.employee-card').textContent;

    assert.isFalse(cardContent.includes('tech'));
    assert.isFalse(cardContent.includes('senior'));

    assert.isTrue(cardContent.length > 100);
  });

  test('has responsive grid layout', async () => {
    const element = await fixture(
      html`<employee-card-list
        .employees="${mockEmployees}"
      ></employee-card-list>`
    );
    await element.updateComplete;

    const computedStyle = getComputedStyle(element);
    assert.equal(computedStyle.display, 'grid');
  });

  test('has CSS styles defined', async () => {
    const element = await fixture(
      html`<employee-card-list></employee-card-list>`
    );
    assert.isTrue(element.constructor.styles !== undefined);
  });
});
