import {t} from '../utils/i18n.js';
import {LitElement, html, css} from 'lit';
import {ReduxMixin} from '../mixins/ReduxMixin.js';
import {
  selectEmployees,
  deleteEmployee,
} from '../store/slices/employeesSlice.js';
import {
  selectViewMode,
  selectCurrentPage,
  selectItemsPerPage,
  selectSearchQuery,
  setViewMode,
  setCurrentPage,
} from '../store/slices/uiSlice.js';
import {Router} from '@vaadin/router';
import './employee-table.js';
import './employee-card-list.js';
import './employee-pagination.js';
import './confirmation-dialog.js';
import './search-bar.js';

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
    showDeleteDialog: {type: Boolean},
    employeeToDelete: {type: Object},
    searchQuery: {type: String},
  };

  constructor() {
    super();
    /** @type {Array<Object>} */
    this.employees = [];
    this.viewMode = 'table';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalPages = 0;
    this.showDeleteDialog = false;
    this.employeeToDelete = null;
    this.searchQuery = '';
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.getState) {
      const state = this.getState();
      this.viewMode = selectViewMode(state);
      this.currentPage = selectCurrentPage(state);
      this.itemsPerPage = selectItemsPerPage(state);
    }
  }

  /**
   * Handle Redux state changes
   * @param {Object} state - Current Redux state
   */
  stateChanged(state) {
    const employees = selectEmployees(state);
    const viewMode = selectViewMode(state);
    const currentPage = selectCurrentPage(state);
    const itemsPerPage = selectItemsPerPage(state);
    const searchQuery = selectSearchQuery(state);

    if (searchQuery !== this.searchQuery) {
      this.searchQuery = searchQuery;
    }

    const filteredEmployees = this._getFilteredEmployees(
      employees,
      searchQuery
    );

    if (employees && employees !== this.employees) {
      this.employees = employees;
      this.totalPages = Math.ceil(filteredEmployees.length / this.itemsPerPage);
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = 1;
        this.dispatch(setCurrentPage(1));
      }
    }

    const itemsPerPageChanged = itemsPerPage !== this.itemsPerPage;
    const viewModeChanged = viewMode !== this.viewMode;

    if (itemsPerPageChanged || viewModeChanged) {
      const currentOffset = (this.currentPage - 1) * this.itemsPerPage;

      if (itemsPerPageChanged) {
        this.itemsPerPage = itemsPerPage;
        this.totalPages = Math.ceil(
          filteredEmployees.length / this.itemsPerPage
        );
      }

      if (viewModeChanged) {
        this.viewMode = viewMode;
      }

      if (filteredEmployees.length > 0) {
        const newPage = Math.floor(currentOffset / this.itemsPerPage) + 1;
        const validPage = Math.max(1, Math.min(newPage, this.totalPages));

        if (validPage !== this.currentPage) {
          this.dispatch(setCurrentPage(validPage));
          return;
        }
      }
    }

    if (currentPage !== this.currentPage) {
      this.currentPage = currentPage;
    }
  }

  _handleViewModeChange(mode) {
    this.dispatch(setViewMode(mode));
  }

  _handlePageChange(event) {
    const page = event.detail?.page || event;
    this.dispatch(setCurrentPage(page));
  }

  /**
   * Filter employees based on search query
   * @param {Array<Object>} employees - All employees
   * @param {string} query - Search query
   * @returns {Array<Object>} Filtered employee array
   */
  _getFilteredEmployees(employees, query) {
    if (!employees || !Array.isArray(employees)) {
      return [];
    }

    if (!query || query.trim() === '') {
      return employees;
    }

    const searchLower = query.toLowerCase().trim();

    return employees.filter((employee) => {
      const firstName = (employee.firstName || '').toLowerCase();
      const lastName = (employee.lastName || '').toLowerCase();
      const email = (employee.email || '').toLowerCase();
      const department = (employee.department || '').toLowerCase();
      const position = (employee.position || '').toLowerCase();
      const phone = (employee.phone || '').toLowerCase();

      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        email.includes(searchLower) ||
        department.includes(searchLower) ||
        position.includes(searchLower) ||
        phone.includes(searchLower)
      );
    });
  }

  /**
   * Get paginated employees for current page
   * @returns {Array<Object>} Paginated employee array
   */
  _getPaginatedEmployees() {
    const filteredEmployees = this._getFilteredEmployees(
      this.employees,
      this.searchQuery
    );

    if (!filteredEmployees || !Array.isArray(filteredEmployees)) {
      /** @type {Array<Object>} */
      return [];
    }

    this.totalPages = Math.ceil(filteredEmployees.length / this.itemsPerPage);

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filteredEmployees.slice(start, end);
  }

  _handleEdit(event) {
    const employee = event.detail?.employee || event;
    if (employee && employee.id) {
      Router.go(`/edit/${employee.id}`);
    }
  }

  _handleDelete(event) {
    const employee = event.detail?.employee || event;
    if (employee && employee.id) {
      this.employeeToDelete = employee;
      this.showDeleteDialog = true;
    }
  }

  _handleConfirmDelete() {
    if (this.employeeToDelete && this.employeeToDelete.id) {
      this.dispatch(deleteEmployee(this.employeeToDelete.id));
      this._handleCancelDelete();
    }
  }

  _handleCancelDelete() {
    this.showDeleteDialog = false;
    this.employeeToDelete = null;
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

    .header-right {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    .employee-list-actions {
      display: flex;
      cursor: pointer;
      gap: 1rem;
      align-items: center;
      justify-content: center;
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
    const filteredEmployees = this._getFilteredEmployees(
      this.employees,
      this.searchQuery
    );
    const totalItems = filteredEmployees ? filteredEmployees.length : 0;

    return html`
      <div class="employee-list-container">
        <div class="employee-list-header">
          <h2>${t('employeeList.title', 'Employee List')}</h2>
          <div class="header-right">
            <search-bar></search-bar>
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

        <confirmation-dialog
          ?open="${this.showDeleteDialog}"
          .title="${t('deleteDialog.title', 'Are you sure?')}"
          .message="${this.employeeToDelete
            ? `${t(
                'deleteDialog.messagePrefix',
                'Selected Employee record of'
              )} ${this.employeeToDelete.firstName} ${
                this.employeeToDelete.lastName
              } ${t('deleteDialog.messageSuffix', 'will be deleted.')}`
            : t(
                'deleteDialog.message',
                'Selected Employee record will be deleted.'
              )}"
          .confirmText="${t('deleteDialog.confirm', 'Delete')}"
          .cancelText="${t('deleteDialog.cancel', 'Cancel')}"
          confirmType="danger"
          @confirm="${this._handleConfirmDelete}"
          @cancel="${this._handleCancelDelete}"
        ></confirmation-dialog>
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
