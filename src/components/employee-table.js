import {LitElement, html, css} from 'lit';
import {t} from '../utils/i18n.js';
import {getDepartmentName, getPositionName} from '../utils/employeeHelpers.js';

/**
 * Employee Table Component
 * Handles table view rendering for employee lists
 */
export class EmployeeTable extends LitElement {
  static properties = {
    employees: {type: Array},
  };

  constructor() {
    super();
    /** @type {Array<Object>} */
    this.employees = [];
  }

  static styles = css`
    :host {
      display: block;
      background-color: #fff;
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

    @media (max-width: 1440px) {
      .table-body td {
        padding: 14.4px 0.5rem !important;
      }
    }

    @media (max-width: 768px) {
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
    }

    @media (max-width: 480px) {
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
    }
  `;

  _formatDate(dateString) {
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateString));
  }

  _handleSelectAll(e) {
    this.dispatchEvent(
      new CustomEvent('select-all', {
        detail: {checked: e.target.checked},
        bubbles: true,
      })
    );
  }

  _handleEdit(employee) {
    this.dispatchEvent(
      new CustomEvent('employee-edit', {
        detail: {employee},
        bubbles: true,
      })
    );
  }

  _handleDelete(employee) {
    this.dispatchEvent(
      new CustomEvent('employee-delete', {
        detail: {employee},
        bubbles: true,
      })
    );
  }

  render() {
    return html`
      <table class="employee-table">
        <thead class="table-header">
          <tr class="employee-table-row">
            <th>
              <input type="checkbox" @change="${this._handleSelectAll}" />
            </th>
            <th>${t('employeeList.firstName', 'First Name')}</th>
            <th>${t('employeeList.lastName', 'Last Name')}</th>
            <th>${t('employeeList.dateOfEmployment', 'Date of Employment')}</th>
            <th>${t('employeeList.dateOfBirth', 'Date of Birth')}</th>
            <th>${t('employeeList.phone', 'Phone')}</th>
            <th>${t('employeeList.email', 'Email')}</th>
            <th>${t('employeeList.department', 'Department')}</th>
            <th>${t('employeeList.position', 'Position')}</th>
            <th>${t('employeeList.actions', 'Actions')}</th>
          </tr>
        </thead>
        <tbody class="table-body">
          ${this.employees.map(
            (emp) => html`
              <tr>
                <td><input type="checkbox" .value="${emp.id}" /></td>
                <td class="table-firstname">${emp.firstName}</td>
                <td class="table-lastname">${emp.lastName}</td>
                <td>${this._formatDate(emp.dateOfEmployment)}</td>
                <td>${this._formatDate(emp.dateOfBirth)}</td>
                <td>${emp.phone}</td>
                <td>${emp.email}</td>
                <td>${getDepartmentName(emp.department)}</td>
                <td>${getPositionName(emp.position)}</td>
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
    `;
  }
}

customElements.define('employee-table', EmployeeTable);
