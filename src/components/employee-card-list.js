import {LitElement, html, css} from 'lit';
import {t} from '../utils/i18n.js';
import {getDepartmentName, getPositionName} from '../utils/employeeHelpers.js';

/**
 * Employee Card List Component
 * Handles card/list view rendering for employee lists
 */
export class EmployeeCardList extends LitElement {
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
      display: grid;
      grid-template-columns: auto auto;
      width: 85%;
      gap: 6rem 8rem;
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
      :host {
        gap: 2rem !important;
      }
    }

    @media (max-width: 768px) {
      :host {
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
    }

    @media (max-width: 480px) {
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
    }
  `;

  _formatDate(dateString) {
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateString));
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
      ${this.employees.map(
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
                  <span>${getDepartmentName(emp.department)}</span>
                </div>
                <div class="field-group">
                  <label>${t('employeeList.position', 'Position')}</label>
                  <span>${getPositionName(emp.position)}</span>
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
    `;
  }
}

customElements.define('employee-card-list', EmployeeCardList);
