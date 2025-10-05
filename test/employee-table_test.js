import {EmployeeTable} from '../src/components/employee-table.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {DEPARTMENTS, POSITIONS} from '../src/store/slices/employeesSlice.js';
import {initI18n} from '../src/utils/i18n.js';
import '../src/components/employee-table.js';

suite('EmployeeTable', () => {
  suiteSetup(async () => {
    await initI18n();
  });

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
    const el = document.createElement('employee-table');
    assert.instanceOf(el, EmployeeTable);
  });

  test('renders the component', async () => {
    const element = await fixture(html`<employee-table></employee-table>`);
    assert.isTrue(element !== null);
    assert.instanceOf(element, EmployeeTable);
  });

  test('has default properties', async () => {
    const element = await fixture(html`<employee-table></employee-table>`);
    assert.isArray(element.employees);
    assert.equal(element.employees.length, 0);
  });

  test('renders table structure with headers', async () => {
    const element = await fixture(
      html`<employee-table .employees="${mockEmployees}"></employee-table>`
    );
    await element.updateComplete;

    const table = element.shadowRoot.querySelector('.employee-table');
    const thead = element.shadowRoot.querySelector('.table-header');
    const tbody = element.shadowRoot.querySelector('.table-body');

    assert.isNotNull(table);
    assert.isNotNull(thead);
    assert.isNotNull(tbody);
  });

  test('renders correct number of employee rows', async () => {
    const element = await fixture(
      html`<employee-table .employees="${mockEmployees}"></employee-table>`
    );
    await element.updateComplete;

    const rows = element.shadowRoot.querySelectorAll('.table-body tr');
    assert.equal(rows.length, mockEmployees.length);
  });

  test('displays employee data correctly', async () => {
    const element = await fixture(
      html`<employee-table .employees="${mockEmployees}"></employee-table>`
    );
    await element.updateComplete;

    const firstRow = element.shadowRoot.querySelector('.table-body tr');
    const cells = firstRow.querySelectorAll('td');

    assert.include(cells[1].textContent, 'John');
    assert.include(cells[2].textContent, 'Doe');
    assert.include(cells[6].textContent, 'john.doe@company.com');
  });

  test('renders action buttons for each employee', async () => {
    const element = await fixture(
      html`<employee-table .employees="${mockEmployees}"></employee-table>`
    );
    await element.updateComplete;

    const editButtons = element.shadowRoot.querySelectorAll('.btn-edit');
    const deleteButtons =
      element.shadowRoot.querySelectorAll('.btn-delete-table');

    assert.equal(editButtons.length, mockEmployees.length);
    assert.equal(deleteButtons.length, mockEmployees.length);
  });

  test('handles edit button click', async () => {
    let editedEmployee = null;
    const element = await fixture(
      html`<employee-table
        .employees="${mockEmployees}"
        @employee-edit="${(e) => {
          editedEmployee = e.detail.employee;
        }}"
      ></employee-table>`
    );
    await element.updateComplete;

    const editButton = element.shadowRoot.querySelector('.btn-edit');
    editButton.dispatchEvent(new Event('click'));

    assert.isNotNull(editedEmployee);
    assert.equal(editedEmployee.id, mockEmployees[0].id);
  });

  test('handles delete button click', async () => {
    let deletedEmployee = null;
    const element = await fixture(
      html`<employee-table
        .employees="${mockEmployees}"
        @employee-delete="${(e) => {
          deletedEmployee = e.detail.employee;
        }}"
      ></employee-table>`
    );
    await element.updateComplete;

    const deleteButton = element.shadowRoot.querySelector('.btn-delete-table');
    deleteButton.dispatchEvent(new Event('click'));

    assert.isNotNull(deletedEmployee);
    assert.equal(deletedEmployee.id, mockEmployees[0].id);
  });

  test('handles select all checkbox', async () => {
    let selectAllChecked = null;
    const element = await fixture(
      html`<employee-table
        .employees="${mockEmployees}"
        @select-all="${(e) => {
          selectAllChecked = e.detail.checked;
        }}"
      ></employee-table>`
    );
    await element.updateComplete;

    const selectAllCheckbox = element.shadowRoot.querySelector(
      'input[type="checkbox"]'
    );
    selectAllCheckbox.checked = true;
    selectAllCheckbox.dispatchEvent(new Event('change'));

    assert.isTrue(selectAllChecked);
  });

  test('select all checkbox is checked when allSelected prop is true', async () => {
    const element = await fixture(
      html`<employee-table
        .employees="${mockEmployees}"
        .allSelected="${true}"
      ></employee-table>`
    );
    await element.updateComplete;

    const selectAllCheckbox = element.shadowRoot.querySelector(
      'thead input[type="checkbox"]'
    );
    assert.isTrue(selectAllCheckbox.checked);
  });

  test('select all checkbox is unchecked when allSelected prop is false', async () => {
    const element = await fixture(
      html`<employee-table
        .employees="${mockEmployees}"
        .allSelected="${false}"
      ></employee-table>`
    );
    await element.updateComplete;

    const selectAllCheckbox = element.shadowRoot.querySelector(
      'thead input[type="checkbox"]'
    );
    assert.isFalse(selectAllCheckbox.checked);
  });

  test('handles individual checkbox selection', async () => {
    let selectedEmployeeId = null;
    let selectedChecked = null;
    const element = await fixture(
      html`<employee-table
        .employees="${mockEmployees}"
        @individual-select="${(e) => {
          selectedEmployeeId = e.detail.employeeId;
          selectedChecked = e.detail.checked;
        }}"
      ></employee-table>`
    );
    await element.updateComplete;

    const firstRowCheckbox = element.shadowRoot.querySelector(
      '.table-body tr:first-child input[type="checkbox"]'
    );
    firstRowCheckbox.checked = true;
    firstRowCheckbox.dispatchEvent(new Event('change'));

    assert.equal(selectedEmployeeId, mockEmployees[0].id);
    assert.isTrue(selectedChecked);
  });

  test('individual checkboxes reflect selectedEmployees prop', async () => {
    const selectedIds = [mockEmployees[0].id];
    const element = await fixture(
      html`<employee-table
        .employees="${mockEmployees}"
        .selectedEmployees="${selectedIds}"
      ></employee-table>`
    );
    await element.updateComplete;

    const firstRowCheckbox = element.shadowRoot.querySelector(
      '.table-body tr:first-child input[type="checkbox"]'
    );
    const secondRowCheckbox = element.shadowRoot.querySelector(
      '.table-body tr:nth-child(2) input[type="checkbox"]'
    );

    assert.isTrue(firstRowCheckbox.checked);
    assert.isFalse(secondRowCheckbox.checked);
  });

  test('_isEmployeeSelected returns true for selected employee', async () => {
    const selectedIds = [mockEmployees[0].id];
    const element = await fixture(
      html`<employee-table
        .employees="${mockEmployees}"
        .selectedEmployees="${selectedIds}"
      ></employee-table>`
    );
    await element.updateComplete;

    assert.isTrue(element._isEmployeeSelected(mockEmployees[0].id));
    assert.isFalse(element._isEmployeeSelected(mockEmployees[1].id));
  });

  test('renders correct number of checkboxes (header + rows)', async () => {
    const element = await fixture(
      html`<employee-table .employees="${mockEmployees}"></employee-table>`
    );
    await element.updateComplete;

    const allCheckboxes = element.shadowRoot.querySelectorAll(
      'input[type="checkbox"]'
    );
    assert.equal(allCheckboxes.length, mockEmployees.length + 1);
  });

  test('select all checkbox has aria-label', async () => {
    const element = await fixture(
      html`<employee-table .employees="${mockEmployees}"></employee-table>`
    );
    await element.updateComplete;

    const selectAllCheckbox = element.shadowRoot.querySelector(
      'thead input[type="checkbox"]'
    );
    const ariaLabel = selectAllCheckbox.getAttribute('aria-label');
    assert.isNotNull(ariaLabel);
    assert.isTrue(ariaLabel.length > 0);
  });

  test('renders empty state when no employees', async () => {
    const element = await fixture(
      html`<employee-table .employees="${[]}"></employee-table>`
    );
    await element.updateComplete;

    const rows = element.shadowRoot.querySelectorAll('.table-body tr');
    assert.equal(rows.length, 0);
  });

  test('formats dates correctly', async () => {
    const element = await fixture(
      html`<employee-table .employees="${mockEmployees}"></employee-table>`
    );
    await element.updateComplete;

    const dateCell = element.shadowRoot.querySelector(
      '.table-body tr td:nth-child(4)'
    );
    assert.isTrue(
      dateCell.textContent.includes('2023') ||
        dateCell.textContent.includes('/')
    );
  });

  test('displays localized department and position names', async () => {
    const element = await fixture(
      html`<employee-table .employees="${mockEmployees}"></employee-table>`
    );
    await element.updateComplete;

    const deptCell = element.shadowRoot.querySelector(
      '.table-body tr td:nth-child(8)'
    );
    const posCell = element.shadowRoot.querySelector(
      '.table-body tr td:nth-child(9)'
    );

    assert.notEqual(deptCell.textContent.trim(), 'tech');
    assert.notEqual(posCell.textContent.trim(), 'senior');

    assert.isTrue(deptCell.textContent.length > 0);
    assert.isTrue(posCell.textContent.length > 0);
  });

  test('has CSS styles defined', async () => {
    const element = await fixture(html`<employee-table></employee-table>`);
    assert.isTrue(element.constructor.styles !== undefined);
  });
});
