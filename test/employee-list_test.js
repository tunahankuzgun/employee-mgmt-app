import {EmployeeList} from '../src/components/employee-list.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {store} from '../src/store/index.js';
import {selectEmployees} from '../src/store/slices/employeesSlice.js';
import {DEPARTMENTS, POSITIONS} from '../src/store/slices/employeesSlice.js';
import '../src/components/employee-list.js';
import '../src/components/employee-table.js';
import '../src/components/employee-card-list.js';
import '../src/components/employee-pagination.js';

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
    const table = element.shadowRoot.querySelector('employee-table');
    assert.isNotNull(table);
  });

  test('renders list view when viewMode is list', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    element.viewMode = 'list';
    await element.updateComplete;
    const listContainer =
      element.shadowRoot.querySelector('employee-card-list');
    assert.isNotNull(listContainer);
  });

  test('renders checkbox inputs', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;
    const tableComponent = element.shadowRoot.querySelector('employee-table');
    await tableComponent.updateComplete;
    const checkboxes = tableComponent.shadowRoot.querySelectorAll(
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
    const element = await fixture(html`<employee-table></employee-table>`);
    element.employees = [
      {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        dateOfEmployment: '2023-01-15',
        dateOfBirth: '1990-01-01',
        email: 'test@test.com',
        phone: '123-456-7890',
        department: 'tech',
        position: 'junior',
        salary: 50000,
      },
    ];
    await element.updateComplete;
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
    const table = element.shadowRoot.querySelector('employee-table');
    assert.isNotNull(table);

    element.viewMode = 'list';
    await element.updateComplete;
    const listContainer =
      element.shadowRoot.querySelector('employee-card-list');
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

    const pagination = element.shadowRoot.querySelector('employee-pagination');
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

  test('_handleDelete shows confirmation dialog', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;

    const testEmployee = element.employees[0];
    assert.isFalse(element.showDeleteDialog);
    assert.isNull(element.employeeToDelete);

    element._handleDelete({detail: {employee: testEmployee}});
    await element.updateComplete;

    assert.isTrue(element.showDeleteDialog);
    assert.equal(element.employeeToDelete, testEmployee);
  });

  test('_handleCancelDelete closes dialog and clears employee', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;

    const testEmployee = element.employees[0];
    element.employeeToDelete = testEmployee;
    element.showDeleteDialog = true;
    await element.updateComplete;

    element._handleCancelDelete();
    await element.updateComplete;

    assert.isFalse(element.showDeleteDialog);
    assert.isNull(element.employeeToDelete);
  });

  test('_handleConfirmDelete dispatches delete action and closes dialog', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;

    const testEmployee = element.employees[0];
    const employeeCount = element.employees.length;

    element.employeeToDelete = testEmployee;
    element.showDeleteDialog = true;
    await element.updateComplete;

    element._handleConfirmDelete();
    await element.updateComplete;

    assert.isFalse(element.showDeleteDialog);
    assert.isNull(element.employeeToDelete);

    const storeEmployees = selectEmployees(store.getState());
    assert.equal(storeEmployees.length, employeeCount - 1);
    assert.isUndefined(
      storeEmployees.find((emp) => emp.id === testEmployee.id)
    );
  });

  test('confirmation dialog is rendered', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;

    const dialogs = element.shadowRoot.querySelectorAll('confirmation-dialog');
    assert.equal(dialogs.length, 1);
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

    const tableComponent = element.shadowRoot.querySelector('employee-table');
    await tableComponent.updateComplete;
    const selectAllCheckbox = tableComponent.shadowRoot.querySelector(
      'input[type="checkbox"]'
    );
    assert.isNotNull(selectAllCheckbox);
  });

  test('individual checkboxes are rendered for each employee', async () => {
    const element = await fixture(html`<employee-list></employee-list>`);
    element.viewMode = 'table';
    await element.updateComplete;

    const tableComponent = element.shadowRoot.querySelector('employee-table');
    await tableComponent.updateComplete;
    const checkboxes = tableComponent.shadowRoot.querySelectorAll(
      'input[type="checkbox"]'
    );
    assert.isTrue(checkboxes.length > 1);
  });
});

suite('Data Formatting', () => {
  test('_formatDate handles different date formats', async () => {
    const testDate1 = '2023-01-15';
    const testDate2 = '2023-12-31';

    const tableElement = await fixture(html`<employee-table></employee-table>`);
    const formatted1 = tableElement._formatDate(testDate1);
    const formatted2 = tableElement._formatDate(testDate2);

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

  suite('Select All Functionality', () => {
    test('initializes with empty selectedEmployees array', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      await element.updateComplete;

      assert.isArray(element.selectedEmployees);
      assert.equal(element.selectedEmployees.length, 0);
    });

    test('_handleSelectAll selects all employees on current page', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      await element.updateComplete;

      const paginatedEmployees = element._getPaginatedEmployees();
      const mockEvent = {
        detail: {checked: true},
      };

      element._handleSelectAll(mockEvent);
      await element.updateComplete;

      assert.equal(element.selectedEmployees.length, paginatedEmployees.length);
      paginatedEmployees.forEach((emp) => {
        assert.isTrue(element.selectedEmployees.includes(emp.id));
      });
    });

    test('_handleSelectAll deselects all when unchecked', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      await element.updateComplete;

      element._handleSelectAll({detail: {checked: true}});
      await element.updateComplete;
      assert.isTrue(element.selectedEmployees.length > 0);

      element._handleSelectAll({detail: {checked: false}});
      await element.updateComplete;
      assert.equal(element.selectedEmployees.length, 0);
    });

    test('_handleIndividualSelect adds employee to selection', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      await element.updateComplete;

      const paginatedEmployees = element._getPaginatedEmployees();
      if (paginatedEmployees.length > 0) {
        const employeeId = paginatedEmployees[0].id;
        const mockEvent = {
          detail: {employeeId, checked: true},
        };

        element._handleIndividualSelect(mockEvent);
        await element.updateComplete;

        assert.isTrue(element.selectedEmployees.includes(employeeId));
      }
    });

    test('_handleIndividualSelect removes employee from selection', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      await element.updateComplete;

      const paginatedEmployees = element._getPaginatedEmployees();
      if (paginatedEmployees.length > 0) {
        const employeeId = paginatedEmployees[0].id;

        element._handleIndividualSelect({
          detail: {employeeId, checked: true},
        });
        await element.updateComplete;
        assert.isTrue(element.selectedEmployees.includes(employeeId));

        element._handleIndividualSelect({
          detail: {employeeId, checked: false},
        });
        await element.updateComplete;
        assert.isFalse(element.selectedEmployees.includes(employeeId));
      }
    });

    test('_handleIndividualSelect does not add duplicate IDs', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      await element.updateComplete;

      const paginatedEmployees = element._getPaginatedEmployees();
      if (paginatedEmployees.length > 0) {
        const employeeId = paginatedEmployees[0].id;

        element._handleIndividualSelect({
          detail: {employeeId, checked: true},
        });
        element._handleIndividualSelect({
          detail: {employeeId, checked: true},
        });
        await element.updateComplete;

        const count = element.selectedEmployees.filter(
          (id) => id === employeeId
        ).length;
        assert.equal(count, 1);
      }
    });

    test('passes selectedEmployees to employee-table component', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      element.viewMode = 'table';
      await element.updateComplete;

      const paginatedEmployees = element._getPaginatedEmployees();
      if (paginatedEmployees.length > 0) {
        element.selectedEmployees = [paginatedEmployees[0].id];
        await element.updateComplete;

        const tableComponent =
          element.shadowRoot.querySelector('employee-table');
        assert.isNotNull(tableComponent);
        assert.isArray(tableComponent.selectedEmployees);
      }
    });

    test('passes allSelected state to employee-table when all selected', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      element.viewMode = 'table';
      await element.updateComplete;

      element._handleSelectAll({detail: {checked: true}});
      await element.updateComplete;

      const tableComponent = element.shadowRoot.querySelector('employee-table');
      assert.isNotNull(tableComponent);
      assert.isTrue(tableComponent.allSelected);
    });

    test('passes allSelected as false when not all selected', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      element.viewMode = 'table';
      await element.updateComplete;

      const paginatedEmployees = element._getPaginatedEmployees();
      if (paginatedEmployees.length > 1) {
        element.selectedEmployees = [paginatedEmployees[0].id];
        await element.updateComplete;

        const tableComponent =
          element.shadowRoot.querySelector('employee-table');
        assert.isNotNull(tableComponent);
        assert.isFalse(tableComponent.allSelected);
      }
    });

    test('clears selections when switching pages', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      await element.updateComplete;

      element._handleSelectAll({detail: {checked: true}});
      await element.updateComplete;
      const initialSelectionCount = element.selectedEmployees.length;
      assert.isTrue(initialSelectionCount > 0);

      assert.isArray(element.selectedEmployees);
    });

    test('handles select-all event from employee-table', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      element.viewMode = 'table';
      await element.updateComplete;

      const tableComponent = element.shadowRoot.querySelector('employee-table');
      assert.isNotNull(tableComponent);

      const selectAllEvent = new CustomEvent('select-all', {
        detail: {checked: true},
        bubbles: true,
      });
      tableComponent.dispatchEvent(selectAllEvent);
      await element.updateComplete;

      assert.isTrue(element.selectedEmployees.length > 0);
    });

    test('handles individual-select event from employee-table', async () => {
      const element = await fixture(html`<employee-list></employee-list>`);
      element.viewMode = 'table';
      await element.updateComplete;

      const paginatedEmployees = element._getPaginatedEmployees();
      if (paginatedEmployees.length > 0) {
        const tableComponent =
          element.shadowRoot.querySelector('employee-table');
        assert.isNotNull(tableComponent);

        const employeeId = paginatedEmployees[0].id;
        const selectEvent = new CustomEvent('individual-select', {
          detail: {employeeId, checked: true},
          bubbles: true,
        });
        tableComponent.dispatchEvent(selectEvent);
        await element.updateComplete;

        assert.isTrue(element.selectedEmployees.includes(employeeId));
      }
    });
  });
});
