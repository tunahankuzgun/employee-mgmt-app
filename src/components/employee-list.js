import {t} from '../utils/i18n.js';
import {LitElement, html, css} from 'lit';
import {ReduxMixin} from '../mixins/ReduxMixin.js';

/**
 * Employee List Component
 */
export class EmployeeList extends ReduxMixin(LitElement) {
  static properties = {
    employees: {type: Array},
    filteredEmployees: {type: Array},
    viewMode: {type: String},
    currentPage: {type: Number},
    itemsPerPage: {type: Number},
    totalPages: {type: Number},
  };

  constructor() {
    super();
    this.employees = this._getMockData();
    this.filteredEmployees = [...this.employees];
    this.viewMode = 'table';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalPages = Math.ceil(
      this.filteredEmployees.length / this.itemsPerPage
    );
  }

  /**
   * Handle Redux state changes
   * @param {Object} state - Current Redux state
   */
  // eslint-disable-next-line no-unused-vars
  stateChanged(state) {}

  _getMockData() {
    const departments = ['Analytics', 'Tech'];
    const positions = ['Junior', 'Medior', 'Senior'];

    return [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+(90) 532 123 45 67',
        department: 'Tech',
        position: 'Senior',
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
        department: 'Analytics',
        position: 'Medior',
        dateOfEmployment: '2022-08-20',
        dateOfBirth: '1988-11-23',
        salary: 65000,
      },
      {
        id: 3,
        firstName: 'Ahmet',
        lastName: 'Sourtimes',
        email: 'ahmet@sourtimes.org',
        phone: '+(90) 532 123 45 67',
        department: 'Analytics',
        position: 'Junior',
        dateOfEmployment: '2023-09-23',
        dateOfBirth: '1995-03-15',
        salary: 50000,
      },
      {
        id: 4,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@company.com',
        phone: '+(90) 532 123 45 69',
        department: 'Tech',
        position: 'Junior',
        dateOfEmployment: '2022-11-05',
        dateOfBirth: '1992-07-08',
        salary: 55000,
      },
      {
        id: 5,
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@company.com',
        phone: '+(90) 532 123 45 70',
        department: 'Tech',
        position: 'Senior',
        dateOfEmployment: '2023-06-01',
        dateOfBirth: '1987-12-19',
        salary: 70000,
      },
      {
        id: 6,
        firstName: 'Ayşe',
        lastName: 'Kaya',
        email: 'ayse.kaya@company.com',
        phone: '+(90) 532 123 45 71',
        department: 'Analytics',
        position: 'Medior',
        dateOfEmployment: '2022-12-15',
        dateOfBirth: '1991-04-27',
        salary: 60000,
      },
      ...Array.from({length: 50}, (_, i) => ({
        id: i + 7,
        firstName: 'Employee',
        lastName: `${i + 7}`,
        email: `employee${i + 7}@company.com`,
        phone: `+(90) 532 123 ${String(45 + i).padStart(2, '0')} ${String(
          67 + i
        ).padStart(2, '0')}`,
        department: departments[i % departments.length],
        position: positions[i % positions.length],
        dateOfEmployment: '2023-09-23',
        dateOfBirth: '1995-03-15',
        salary: 45000 + i * 1000,
      })),
    ];
  }

  _handleViewModeChange(mode) {
    this.viewMode = mode;
    this.itemsPerPage = mode === 'list' ? 4 : 10;
    this.totalPages = Math.ceil(
      this.filteredEmployees.length / this.itemsPerPage
    );
    this.currentPage = 1;
  }

  _handlePageChange(page) {
    this.currentPage = page;
  }

  _getPagination() {
    const current = this.currentPage;
    const total = this.totalPages;

    if (total <= 6) {
      return Array.from({length: total}, (_, i) => i + 1);
    }

    const pages = [];

    pages.push(1);

    if (current <= 3) {
      for (let i = 2; i <= 4; i++) {
        pages.push(i);
      }
      if (total > 5) {
        pages.push('...');
      }
      pages.push(total);
    } else if (current >= total - 2) {
      pages.push('...');
      for (let i = total - 3; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }

    return pages;
  }

  _getPaginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredEmployees.slice(start, end);
  }

  _handleEdit(employee) {
    // TODO: Navigate to edit form
    console.log('Edit employee:', employee);
  }

  _handleDelete(employee) {
    //TODO: Show confirmation and delete
    console.log('Delete employee:', employee);
  }

  _handleSelectAll(e) {
    console.log('Select all:', e.target.checked);
  }

  _formatDate(dateString) {
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateString));
  }

  static styles = css`
    :host {
      display: block;
      padding: 0 4rem;
      height: calc(100vh - 140px);
    }

    .employee-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0;
    }
    .employee-list-header h2 {
      color: #ff6200;
      gap: 0.5rem;
    }
    .employee-list-actions {
      display: flex;
      cursor: pointer;
      color: #ff620040;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .employee-list-actions svg.active {
      color: #ff6200;
    }

    .employee-list-actions svg:hover {
      scale: 1.1;
    }

    .employee-list-body {
      background-color: #fff;
      display: flex;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;
      overflow: auto;
      width: 100%;
      height: 100%;
    }

    .list-container {
      display: grid;
      grid-template-columns: auto auto;
      width: 85%;
      gap: 6rem 2rem;
      padding: 1rem;
      margin: 0 auto;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .employee-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .card-row {
      display: flex;
      gap: 0.75rem;
    }

    .field-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .field-group label {
      font-size: 0.75rem;
      font-weight: 600;
      color: gray;
      letter-spacing: 0.05em;
    }

    .field-group span {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .card-actions {
      display: flex;
      justify-content: start;
      gap: 0.75rem;
      align-items: center;
      margin-top: 0.75rem;
    }

    .card-actions svg {
      cursor: pointer;
      width: 20px;
      height: 20px;
    }

    .card-actions .btn:hover {
      scale: 1.1;
    }

    .btn-delete {
      background-color: #ff6200;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .btn-edit-list {
      background-color: #4f46e5;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    @media (max-width: 1440px) {
      .employee-table .table-body td {
        padding: 14.4px 0.5rem !important;
      }
      .list-container {
        gap: 2rem !important;
      }
    }

    @media (max-width: 768px) {
      :host {
        padding: 0 1rem;
        overflow-x: hidden;
      }

      .employee-list-header {
        margin-bottom: 1rem;
      }

      .employee-list-header h2 {
        font-size: 1.25rem;
      }

      .employee-list-actions {
        gap: 0.5rem;
      }

      .employee-list-actions svg {
        width: 28px;
        height: 28px;
      }

      .employee-list-body {
        overflow-x: auto;
        border-radius: 8px;
        margin-bottom: 2rem;
      }

      .employee-list-body::after {
        display: block;
      }

      .employee-table {
        min-width: 750px;
        font-size: 0.75rem;
      }

      .table-header th {
        padding: 0.5rem 0.25rem;
        font-size: 0.75rem;
      }

      .table-body td {
        padding: 0.75rem 0.25rem;
        font-size: 0.75rem;
      }

      th:nth-child(1),
      td:nth-child(1) {
        width: 35px;
      }
      th:nth-child(2),
      td:nth-child(2) {
        width: 65px;
        max-width: 65px;
      }
      th:nth-child(3),
      td:nth-child(3) {
        width: 65px;
        max-width: 65px;
      }
      th:nth-child(4),
      td:nth-child(4) {
        width: 80px;
        max-width: 80px;
      }
      th:nth-child(5),
      td:nth-child(5) {
        width: 80px;
        max-width: 80px;
      }
      th:nth-child(6),
      td:nth-child(6) {
        width: 105px;
        max-width: 105px;
      }
      th:nth-child(7),
      td:nth-child(7) {
        width: 150px;
        max-width: 150px;
      }
      th:nth-child(8),
      td:nth-child(8) {
        width: 75px;
        max-width: 75px;
      }
      th:nth-child(9),
      td:nth-child(9) {
        width: 75px;
        max-width: 75px;
      }
      th:nth-child(10),
      td:nth-child(10) {
        width: 70px;
        max-width: 70px;
      }

      .actions {
        gap: 0.25rem;
      }

      .actions svg {
        width: 18px;
        height: 18px;
      }

      .list-container {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 0.4rem;
        width: 100%;
        margin-left: -0.5rem;
      }

      .employee-card {
        padding: 0.75rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .card-content {
        gap: 0.5rem;
      }

      .card-row {
        flex-direction: column;
        gap: 0.25rem;
      }

      .field-group {
        gap: 0.125rem;
      }

      .field-group label {
        font-size: 0.6875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .field-group span {
        font-size: 0.8125rem;
        word-break: break-word;
      }

      .card-actions {
        flex-direction: row;
        gap: 0.5rem;
        margin-top: 0.5rem;
        justify-content: space-between;
      }

      .btn-delete,
      .btn-edit-list {
        flex: 1;
        padding: 0.4rem 0.75rem;
        font-size: 0.75rem;
        border-radius: 6px;
        justify-content: center;
      }

      .btn-delete svg,
      .btn-edit-list svg {
        width: 16px;
        height: 16px;
      }

      .pagination {
        gap: 0.25rem;
        flex-wrap: wrap;
        justify-content: center;
      }

      .pagination-item {
        padding: 0.25rem 0.5rem;
        text-align: center;
      }

      .pagination svg {
        width: 20px;
        height: 20px;
      }
    }

    @media (max-width: 480px) {
      :host {
        padding: 0 0.5rem;
      }

      .employee-list-header {
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
      }

      .employee-list-header h2 {
        font-size: 1.125rem;
        margin: 0;
      }

      .employee-list-actions {
        justify-content: center;
      }

      .employee-table {
        min-width: 650px;
        font-size: 0.6875rem;
      }

      .table-header th {
        padding: 0.375rem 0.125rem;
        font-size: 0.6875rem;
      }

      .table-body td {
        padding: 0.5rem 0.125rem;
        font-size: 0.6875rem;
      }

      .employee-card {
        padding: 0.5rem;
      }

      .card-actions {
        flex-direction: column;
        gap: 0.5rem;
      }

      .btn-delete,
      .btn-edit-list {
        flex: none;
        width: 100%;
      }

      .pagination {
        max-width: 100%;
        overflow-x: auto;
        padding: 0.25rem 0;
      }
    }

    .employee-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 0;
      font-size: 0.875rem;
    }

    .table-body tr:hover {
      background: #f8f9fa;
    }

    th:nth-child(1),
    td:nth-child(1) {
      width: 40px;
    } /* Checkbox */
    th:nth-child(2),
    td:nth-child(2) {
      width: 80px;
      max-width: 80px;
    } /* First Name */
    th:nth-child(3),
    td:nth-child(3) {
      width: 80px;
      max-width: 80px;
    } /* Last Name */
    th:nth-child(4),
    td:nth-child(4) {
      width: 90px;
      max-width: 90px;
    } /* Date Employment */
    th:nth-child(5),
    td:nth-child(5) {
      width: 90px;
      max-width: 90px;
    } /* Date Birth */
    th:nth-child(6),
    td:nth-child(6) {
      width: 120px;
      max-width: 120px;
    } /* Phone */
    th:nth-child(7),
    td:nth-child(7) {
      width: 180px;
      max-width: 180px;
    } /* Email */
    th:nth-child(8),
    td:nth-child(8) {
      width: 80px;
      max-width: 80px;
    } /* Department */
    th:nth-child(9),
    td:nth-child(9) {
      width: 80px;
      max-width: 80px;
    } /* Position */
    th:nth-child(10),
    td:nth-child(10) {
      width: 80px;
      max-width: 80px;
    }

    .table-header th {
      padding: 0.75rem 0.5rem;
      text-align: center;
      background: transparent;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #ff6200;
    }

    .table-body td {
      padding: 1.25rem 0.5rem;
      text-align: center;
      border-top: 1px solid #eee;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .table-firstname,
    .table-lastname {
      font-weight: 600;
    }

    input[type='checkbox'] {
      transform: scale(1.2);
      cursor: pointer;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      align-items: center;
      color: #ff6200;
    }

    .actions svg {
      cursor: pointer;
      &:hover {
        scale: 1.1;
      }
    }

    .pagination-section {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .pagination {
      display: flex;
      gap: 0.5rem;
    }

    .pagination div.active {
      background-color: #ff6200;
      color: #fff;
      border-radius: 100%;
    }

    .pagination-next,
    .pagination-prev {
      height: 100%;
    }

    .pagination-item {
      padding: 0.25rem 0.6rem;
      cursor: pointer;
    }

    .pagination-ellipsis {
      padding: 0.25rem 0.6rem;
      color: #666;
      cursor: default;
    }

    .pagination svg {
      cursor: pointer;
    }
  `;

  render() {
    const paginatedEmployees = this._getPaginatedEmployees();
    const totalItems = this.filteredEmployees.length;
    return html`
      <div class="employee-list-container">
        <div class="employee-list-header">
          <h2>${t('employeeList.title', 'Employee List')}</h2>
          <div class="employee-list-actions">
            <div>
              <svg
                @click="${() => this._handleViewModeChange('table')}"
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="${this.viewMode === 'table' ? 'active' : ''}"
              >
                <path d="M3 5h18" />
                <path d="M3 12h18" />
                <path d="M3 19h18" />
              </svg>
            </div>
            <div>
              <svg
                @click="${() => this._handleViewModeChange('list')}"
                class="${this.viewMode === 'list' ? 'active' : ''}"
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-grid3x3-icon lucide-grid-3x3"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
            </div>
          </div>
        </div>
        ${this.viewMode === 'table'
          ? this._renderTableView(paginatedEmployees)
          : this._renderListView(paginatedEmployees)}
        <div class="employee-list-footer">
          ${this._renderPagination(totalItems)}
        </div>
      </div>
    `;
  }

  _renderTableView(employees) {
    return html`
      <div class="employee-list-body">
        <table class="employee-table">
          <thead class="table-header">
            <tr class="employee-table-row">
              <th>
                <input type="checkbox" @change="${this._handleSelectAll}" />
              </th>
              <th>${t('employeeList.firstName', 'First Name')}</th>
              <th>${t('employeeList.lastName', 'Last Name')}</th>
              <th>
                ${t('employeeList.dateOfEmployment', 'Date of Employment')}
              </th>
              <th>${t('employeeList.dateOfBirth', 'Date of Birth')}</th>
              <th>${t('employeeList.phone', 'Phone')}</th>
              <th>${t('employeeList.email', 'Email')}</th>
              <th>${t('employeeList.department', 'Department')}</th>
              <th>${t('employeeList.position', 'Position')}</th>
              <th>${t('employeeList.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody class="table-body">
            ${employees.map(
              (emp) => html`
                <tr>
                  <td><input type="checkbox" .value="${emp.id}" /></td>
                  <td class="table-firstname">${emp.firstName}</td>
                  <td class="table-lastname">${emp.lastName}</td>
                  <td>${this._formatDate(emp.dateOfEmployment)}</td>
                  <td>${this._formatDate(emp.dateOfBirth)}</td>
                  <td>${emp.phone}</td>
                  <td>${emp.email}</td>
                  <td>${emp.department}</td>
                  <td>${emp.position}</td>
                  <td>
                    <div class="actions">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="btn btn-edit"
                          @click="${() => this._handleEdit(emp)}"
                        >
                          <path
                            d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                          />
                          <path
                            d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                          />
                        </svg>
                      </div>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="#ff6200"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="btn btn-delete-table"
                          @click="${() => this._handleDelete(emp)}"
                        >
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M3 6h18" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  _renderPagination(totalItems) {
    if (totalItems === 0) {
      return html`
        <div class="pagination-section">
          <div class="pagination-info">
            ${t('employeeList.noEmployees', 'No employees found')}
          </div>
        </div>
      `;
    }

    const pages = this._getPagination();

    return html`
      <div class="pagination-section">
        <div class="pagination">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              color="${this.currentPage === 1 ? 'gray' : '#ff6200'}"
              class="pagination-prev"
              @click="${() =>
                this.currentPage !== 1
                  ? this._handlePageChange(this.currentPage - 1)
                  : null}"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
          ${pages.map((page) => {
            if (page === '...') {
              return html` <div class="pagination-ellipsis">...</div> `;
            }
            return html`
              <div
                class="${page === this.currentPage
                  ? 'active'
                  : ''} pagination-item"
                @click="${() => this._handlePageChange(page)}"
              >
                ${page}
              </div>
            `;
          })}
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              color="${this.currentPage === this.totalPages
                ? 'gray'
                : '#ff6200'}"
              class="pagination-next"
              @click="${() =>
                this.currentPage !== this.totalPages
                  ? this._handlePageChange(this.currentPage + 1)
                  : null}"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    `;
  }

  _renderListView(employees) {
    return html`
      <div class="list-container">
        ${employees.map(
          (emp) => html`
            <div class="employee-card">
              <div class="card-content">
                <div class="card-row">
                  <div class="field-group">
                    <label>${t('employeeList.firstName', 'First Name')}:</label>
                    <span>${emp.firstName}</span>
                  </div>
                  <div class="field-group">
                    <label>${t('employeeList.lastName', 'Last Name')}</label>
                    <span>${emp.lastName}</span>
                  </div>
                </div>

                <div class="card-row">
                  <div class="field-group">
                    <label
                      >${t(
                        'employeeList.dateOfEmployment',
                        'Date of Employment'
                      )}</label
                    >
                    <span>${this._formatDate(emp.dateOfEmployment)}</span>
                  </div>
                  <div class="field-group">
                    <label
                      >${t('employeeList.dateOfBirth', 'Date of Birth')}</label
                    >
                    <span>${this._formatDate(emp.dateOfBirth)}</span>
                  </div>
                </div>

                <div class="card-row">
                  <div class="field-group">
                    <label>${t('employeeList.phone', 'Phone')}</label>
                    <span>${emp.phone}</span>
                  </div>
                  <div class="field-group">
                    <label>${t('employeeList.email', 'Email')}</label>
                    <span>${emp.email}</span>
                  </div>
                </div>

                <div class="card-row">
                  <div class="field-group">
                    <label>${t('employeeList.department', 'Department')}</label>
                    <span>${emp.department}</span>
                  </div>
                  <div class="field-group">
                    <label>${t('employeeList.position', 'Position')}</label>
                    <span>${emp.position}</span>
                  </div>
                </div>

                <div class="card-actions">
                  <button
                    @click="${() => this._handleEdit(emp)}"
                    class="btn btn-edit-list"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      />
                      <path
                        d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                      />
                    </svg>
                    ${t('employeeList.edit', 'Edit')}
                  </button>
                  <button
                    class="btn btn-delete"
                    @click="${() => this._handleDelete(emp)}"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="#ffffff"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    ${t('employeeList.delete', 'Delete')}
                  </button>
                </div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
