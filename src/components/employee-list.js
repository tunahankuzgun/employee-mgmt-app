import {t} from '../utils/i18n.js';
import {LitElement, html, css} from 'lit';
import {ReduxMixin} from '../mixins/ReduxMixin.js';
import {selectEmployees} from '../store/slices/employeesSlice.js';
import {Router} from '@vaadin/router';
import './employee-table.js';
import './employee-card-list.js';
import './employee-pagination.js';

/**
 * Employee List Component - Main container for employee display
 */
export class EmployeeList extends ReduxMixin(LitElement) {
  static properties = {
    /** @type {Array<Object>} */
    employees: {type: Array, attribute: false},
    viewMode: {type: String},
    currentPage: {type: Number},
    itemsPerPage: {type: Number},
    totalPages: {type: Number},
  };

  constructor() {
    super();
    /** @type {Array<Object>} */
    this.employees = [];
    this.viewMode = 'table';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalPages = 0;
  }

  /**
   * Handle Redux state changes
   * @param {Object} state - Current Redux state
   */
  stateChanged(state) {
    const employees = selectEmployees(state);

    if (employees && employees !== this.employees) {
      this.employees = employees;
      this.totalPages = Math.ceil(this.employees.length / this.itemsPerPage);
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = 1;
      }
    }
  }

  _handleViewModeChange(mode) {
    this.viewMode = mode;
    this.itemsPerPage = mode === 'list' ? 4 : 10;
    this.totalPages = Math.ceil(
      (this.employees?.length || 0) / this.itemsPerPage
    );
    this.currentPage = 1;
  }

  _handlePageChange(event) {
    this.currentPage = event.detail?.page || event;
  }

  /**
   * Get paginated employees for current page
   * @returns {Array<Object>} Paginated employee array
   */
  _getPaginatedEmployees() {
    if (!this.employees || !Array.isArray(this.employees)) {
      /** @type {Array<Object>} */
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.employees.slice(start, end);
  }

  _handleEdit(event) {
    const employee = event.detail?.employee || event;
    if (employee && employee.id) {
      Router.go(`/edit/${employee.id}`);
    }
  }

  _handleDelete(/* event */) {
    // TODO: Show confirmation and delete
  }

  _handleSelectAll(/* event */) {
    // TODO: Implement select all functionality
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
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .employee-list-actions button {
      color: #ff620040;
      background: none;
      border: none;
      cursor: pointer;
    }

    .employee-list-actions button.active {
      color: #ff6200;
    }

    .employee-list-actions button:hover {
      scale: 1.1;
    }

    @media (max-width: 768px) {
      :host {
        padding: 0 1rem;
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
    }
  `;

  render() {
    /** @type {Array<Object>} */
    const paginatedEmployees = this._getPaginatedEmployees();
    const totalItems = this.employees ? this.employees.length : 0;

    return html`
      <div class="employee-list-container">
        <div class="employee-list-header">
          <h2>${t('employeeList.title', 'Employee List')}</h2>
          <div class="employee-list-actions">
            <button
              @click="${() => this._handleViewModeChange('table')}"
              class="${this.viewMode === 'table' ? 'active' : ''}"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 5h18" />
                <path d="M3 12h18" />
                <path d="M3 19h18" />
              </svg>
            </button>
            <button
              @click="${() => this._handleViewModeChange('list')}"
              class="${this.viewMode === 'list' ? 'active' : ''}"
            >
              <svg
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
            </button>
          </div>
        </div>

        ${this.viewMode === 'table'
          ? html`
              <employee-table
                .employees="${/** @type {any} */ (paginatedEmployees)}"
                @employee-edit="${this._handleEdit}"
                @employee-delete="${this._handleDelete}"
                @select-all="${this._handleSelectAll}"
              ></employee-table>
            `
          : html`
              <employee-card-list
                .employees="${/** @type {any} */ (paginatedEmployees)}"
                @employee-edit="${this._handleEdit}"
                @employee-delete="${this._handleDelete}"
              ></employee-card-list>
            `}

        <employee-pagination
          .currentPage="${this.currentPage}"
          .totalPages="${this.totalPages}"
          .totalItems="${totalItems}"
          .itemsPerPage="${this.itemsPerPage}"
          @page-changed="${this._handlePageChange}"
        ></employee-pagination>
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
