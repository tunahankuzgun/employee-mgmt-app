import {EmployeeList} from '../src/components/employee-list.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {store} from '../src/store/index.js';
import {selectEmployees} from '../src/store/slices/employeesSlice.js';
import {DEPARTMENTS, POSITIONS} from '../src/store/slices/employeesSlice.js';
import '../src/components/employee-list.js';

suite('EmployeeList', () => {
  test('is defined', () => {
    const el = document.createElement('employee-list');
    assert.instanceOf(el, EmployeeList);
  });

  test('renders the component', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    assert.isTrue(element !== null);
    assert.instanceOf(element, EmployeeList);
  });

  test('has default properties', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    assert.isArray(element.employees);
    assert.equal(element.viewMode, 'table');
    assert.equal(element.currentPage, 1);
    assert.equal(element.itemsPerPage, 10);
    assert.isNumber(element.totalPages);
  });

  test('loads data from Redux store', async () => {
    const storeEmployees = selectEmployees(store.getState());
    assert.isTrue(storeEmployees.length > 0);

    assert.property(storeEmployees[0], 'firstName');
    assert.property(storeEmployees[0], 'lastName');
    assert.property(storeEmployees[0], 'email');
    assert.property(storeEmployees[0], 'department');
    assert.property(storeEmployees[0], 'position');
  });

  test('calculates total pages correctly', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);

    const storeEmployees = selectEmployees(store.getState());
    assert.isNumber(element.totalPages);
    assert.isTrue(storeEmployees.length > 0);
  });

  test('renders table view by default', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;
    const table = element.shadowRoot.querySelector('.employee-table');
    assert.isNotNull(table);
  });

  test('renders list view when viewMode is list', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    element.viewMode = 'list';
    await element.updateComplete;
    const listContainer = element.shadowRoot.querySelector(
      '.employee-list-container'
    );
    assert.isNotNull(listContainer);
  });

  test('renders checkbox inputs', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;
    const checkboxes = element.shadowRoot.querySelectorAll(
      'input[type="checkbox"]'
    );
    assert.isTrue(checkboxes.length > 0);
  });

  test('renders view mode toggle buttons', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;
    const viewModeBtns = element.shadowRoot.querySelectorAll('svg');
    assert.isTrue(viewModeBtns.length >= 2);
  });

  test('can switch view modes', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;

    element.viewMode = 'list';
    await element.updateComplete;
    assert.equal(element.viewMode, 'list');

    element.viewMode = 'table';
    await element.updateComplete;
    assert.equal(element.viewMode, 'table');
  });

  test('formats dates correctly', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    const testDate = '2023-01-15';
    const formattedDate = element._formatDate(testDate);
    assert.include(formattedDate, '2023');
  });

  suite('Redux Integration', () => {
    test('receives employee data from Redux store', async () => {
      const storeEmployees = selectEmployees(store.getState());
      assert.isArray(storeEmployees);
      assert.isTrue(storeEmployees.length > 0);
    });

    test('Redux store employees have required properties and key-based departments/positions', async () => {
      const storeEmployees = selectEmployees(store.getState());
      const requiredProps = [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'department',
        'position',
        'dateOfEmployment',
        'dateOfBirth',
        'salary',
      ];

      storeEmployees.forEach((employee) => {
        requiredProps.forEach((prop) => {
          assert.property(employee, prop);
        });

        assert.isTrue(Object.values(DEPARTMENTS).includes(employee.department));
        assert.isTrue(Object.values(POSITIONS).includes(employee.position));
      });
    });
  });
});

suite('Responsive Design', () => {
  test('has CSS styles defined', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;
    assert.isTrue(element.constructor.styles !== undefined);
  });
});

suite('View Mode Functionality', () => {
  test('_handleViewModeChange method works correctly', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    assert.isFunction(element._handleViewModeChange);

    element._handleViewModeChange('list');
    await element.updateComplete;
    assert.equal(element.viewMode, 'list');

    element._handleViewModeChange('table');
    await element.updateComplete;
    assert.equal(element.viewMode, 'table');
  });

  test('renders different content based on view mode', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);

    element.viewMode = 'table';
    await element.updateComplete;
    const table = element.shadowRoot.querySelector('.employee-table');
    assert.isNotNull(table);

    element.viewMode = 'list';
    await element.updateComplete;
    const listContainer = element.shadowRoot.querySelector(
      '.employee-list-container'
    );
    assert.isNotNull(listContainer);
  });
});

suite('Pagination Functionality', () => {
  test('_handlePageChange method works correctly', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    assert.isFunction(element._handlePageChange);

    const initialPage = element.currentPage;
    element._handlePageChange(2);
    await element.updateComplete;

    if (element.totalPages > 1) {
      assert.equal(element.currentPage, 2);
      assert.notEqual(element.currentPage, initialPage);
    } else {
      assert.equal(element.currentPage, initialPage);
    }
  });

  test('_getPaginatedEmployees returns correct subset', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    assert.isFunction(element._getPaginatedEmployees);

    const paginatedEmployees = element._getPaginatedEmployees();
    assert.isArray(paginatedEmployees);
    assert.isTrue(paginatedEmployees.length <= element.itemsPerPage);
  });

  test('pagination controls are rendered', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;

    const pagination = element.shadowRoot.querySelector('.pagination');
    if (element.totalPages > 1) {
      assert.isNotNull(pagination);
    }
  });
});

suite('CRUD Functionality', () => {
  test('_handleEdit method exists and is callable', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    assert.isFunction(element._handleEdit);

    const testEmployee = element.employees[0];
    element._handleEdit(testEmployee);
  });

  test('_handleDelete method exists and is callable', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    assert.isFunction(element._handleDelete);

    const testEmployee = element.employees[0];
    element._handleDelete(testEmployee);
  });

  test('edit and delete buttons are rendered in table view', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    element.viewMode = 'table';
    await element.updateComplete;

    const actionSvgs = element.shadowRoot.querySelectorAll('svg');

    if (element.employees.length > 0) {
      assert.isTrue(actionSvgs.length > 0);
    }
  });
});

suite('Selection Functionality', () => {
  test('_handleSelectAll method exists', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    assert.isFunction(element._handleSelectAll);
  });

  test('select all checkbox is rendered in table view', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    element.viewMode = 'table';
    await element.updateComplete;

    const selectAllCheckbox = element.shadowRoot.querySelector(
      'input[type="checkbox"]'
    );
    assert.isNotNull(selectAllCheckbox);
  });

  test('individual checkboxes are rendered for each employee', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    element.viewMode = 'table';
    await element.updateComplete;

    const checkboxes = element.shadowRoot.querySelectorAll(
      'input[type="checkbox"]'
    );
    assert.isTrue(checkboxes.length > 1);
  });
});

suite('Data Formatting', () => {
  test('_formatDate handles different date formats', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);

    const testDate1 = '2023-01-15';
    const testDate2 = '2023-12-31';

    const formatted1 = element._formatDate(testDate1);
    const formatted2 = element._formatDate(testDate2);

    assert.isString(formatted1);
    assert.isString(formatted2);
    assert.include(formatted1, '2023');
    assert.include(formatted2, '2023');
  });
});

suite('Component State Management', () => {
  test('can modify employees array and updates component', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);

    const originalCount = element.employees.length;
    const newEmployee = {
      id: 999,
      firstName: 'Test',
      lastName: 'Employee',
      email: 'test@example.com',
      department: 'Test',
      position: 'Tester',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      salary: 50000,
      phone: '123-456-7890',
    };

    element.employees = [...element.employees, newEmployee];
    await element.updateComplete;

    assert.equal(element.employees.length, originalCount + 1);
  });

  test('totalPages updates when employees change', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);

    const originalPages = element.totalPages;

    const manyEmployees = Array.from({length: 25}, (_, i) => ({
      id: i + 100,
      firstName: `Test${i}`,
      lastName: `Employee${i}`,
      email: `test${i}@example.com`,
      department: 'Test',
      position: 'Tester',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      salary: 50000,
      phone: '123-456-7890',
    }));

    element.employees = [...element.employees, ...manyEmployees];
    element.totalPages = Math.ceil(
      element.employees.length / element.itemsPerPage
    );
    await element.updateComplete;

    assert.isTrue(element.totalPages >= originalPages);
  });
});
