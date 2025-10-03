import {t} from 'i18next';
import {LitElement, html, css} from 'lit';

/**
 * Employee List Component
 */
export class EmployeeList extends LitElement {
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

  _getMockData() {
    return [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+(90) 532 123 45 67',
        department: 'Engineering',
        position: 'Senior Developer',
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
        department: 'Marketing',
        position: 'Marketing Manager',
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
        department: 'HR',
        position: 'HR Specialist',
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
        department: 'Engineering',
        position: 'DevOps Engineer',
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
        department: 'Finance',
        position: 'Financial Analyst',
        dateOfEmployment: '2022-12-15',
        dateOfBirth: '1991-04-27',
        salary: 60000,
      },
      ...Array.from({length: 50}, (_, i) => ({
        id: i + 7,
        firstName: 'Ahmet',
        lastName: 'Sourtimes',
        email: 'ahmet@sourtimes.org',
        phone: '+(90) 532 123 45 67',
        department: 'Analytics',
        position: 'Junior',
        dateOfEmployment: '2023-09-23',
        dateOfBirth: '1995-03-15',
        salary: 45000 + i * 1000,
      })),
    ];
  }

  _handleViewModeChange(mode) {
    this.viewMode = mode;
  }

  _handlePageChange(page) {
    this.currentPage = page;
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
          <h2>Employee List</h2>
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
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date of Employment</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Actions</th>
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
                          class="btn btn-delete"
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

    const pages = Array.from({length: this.totalPages}, (_, i) => i + 1);

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
          ${pages.map(
            (page) => html`
              <div
                class="${page === this.currentPage
                  ? 'active'
                  : ''} pagination-item"
                @click="${() => this._handlePageChange(page)}"
              >
                ${page}
              </div>
            `
          )}
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
                    <label>${t('employeeList.lastName', 'Last Name')}:</label>
                    <span>${emp.lastName}</span>
                  </div>
                </div>

                <div class="card-row">
                  <div class="field-group">
                    <label
                      >${t(
                        'employeeList.dateOfEmployment',
                        'Date of Employment'
                      )}:</label
                    >
                    <span>${this._formatDate(emp.dateOfEmployment)}</span>
                  </div>
                  <div class="field-group">
                    <label
                      >${t('employeeList.dateOfBirth', 'Date of Birth')}:</label
                    >
                    <span>${this._formatDate(emp.dateOfBirth)}</span>
                  </div>
                </div>

                <div class="card-row">
                  <div class="field-group">
                    <label>${t('employeeList.phone', 'Phone')}:</label>
                    <span>${emp.phone}</span>
                  </div>
                  <div class="field-group">
                    <label>${t('employeeList.email', 'Email')}:</label>
                    <span>${emp.email}</span>
                  </div>
                </div>

                <div class="card-row">
                  <div class="field-group">
                    <label
                      >${t('employeeList.department', 'Department')}:</label
                    >
                    <span>${emp.department}</span>
                  </div>
                  <div class="field-group">
                    <label>${t('employeeList.position', 'Position')}:</label>
                    <span>${emp.position}</span>
                  </div>
                </div>

                <div class="card-actions">
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
                  <button
                    class="btn btn-delete"
                    @click="${() => this._handleDelete(emp)}"
                  >
                    🗑️ ${t('employeeList.delete', 'Delete')}
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
