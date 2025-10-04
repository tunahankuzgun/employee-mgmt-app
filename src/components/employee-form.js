import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import {ReduxMixin} from '../mixins/ReduxMixin.js';
import {
  addEmployee,
  updateEmployee,
  DEPARTMENTS,
  POSITIONS,
} from '../store/slices/employeesSlice.js';
import {t} from '../utils/i18n.js';

/**
 * Employee Form Component
 * Handles both Add and Edit modes based on route parameters
 */
export class EmployeeForm extends ReduxMixin(LitElement) {
  static properties = {
    employeeId: {type: String, attribute: false},
    employee: {type: Object, attribute: false},
    isEditMode: {type: Boolean, attribute: false},
    formData: {type: Object, attribute: false},
    errors: {type: Object, attribute: false},
    language: {type: String, attribute: false},
  };

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .form-container {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      margin-top: 0;
      color: #ff6200;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    input,
    select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: #ff6200;
    }

    input.error-input,
    select.error-input {
      border-color: #dc3545;
    }

    input.error-input:focus,
    select.error-input:focus {
      border-color: #dc3545;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #ff6200;
      color: white;
      flex: 1;
    }

    .btn-primary:hover {
      background-color: #e55800;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
      flex: 1;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
    }

    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `;

  constructor() {
    super();
    this.employeeId = null;
    this.employee = null;
    this.isEditMode = false;
    this.formData = this._getEmptyFormData();
    this.errors = {};
    this.language = null;
  }

  /**
   * Load employee data based on current route
   */
  _loadEmployeeData() {
    const path = window.location.pathname;
    const match = path.match(/\/edit\/(\d+)/);

    if (match && match[1]) {
      this.employeeId = match[1];
      this.isEditMode = true;

      const state = this.getState();
      const employees = state.employees?.employees || [];
      this.employee = employees.find(
        (emp) => emp.id === parseInt(this.employeeId)
      );

      if (this.employee) {
        this.formData = {...this.employee};
        this.requestUpdate();
      }
    } else {
      this.isEditMode = false;
      this.formData = this._getEmptyFormData();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadEmployeeData();
  }

  _getEmptyFormData() {
    return {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: DEPARTMENTS.ANALYTICS,
      position: POSITIONS.JUNIOR,
    };
  }

  /**
   * Format phone number as +90 (XXX) XXX XX XX
   */
  _formatPhoneNumber(value) {
    let cleaned = value.replace(/\D/g, '');

    const limited = cleaned.substring(0, 12);

    if (limited.length === 0) {
      return '';
    } else if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 5) {
      return `+${limited.slice(0, 2)} (${limited.slice(2)}`;
    } else if (limited.length <= 8) {
      return `+${limited.slice(0, 2)} (${limited.slice(2, 5)}) ${limited.slice(
        5
      )}`;
    } else if (limited.length <= 10) {
      return `+${limited.slice(0, 2)} (${limited.slice(2, 5)}) ${limited.slice(
        5,
        8
      )} ${limited.slice(8)}`;
    } else {
      return `+${limited.slice(0, 2)} (${limited.slice(2, 5)}) ${limited.slice(
        5,
        8
      )} ${limited.slice(8, 10)} ${limited.slice(10)}`;
    }
  }

  /**
   * Validate individual field
   */
  _validateField(name, value) {
    let error = '';

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          error = t('validationErrors.required');
        } else if (value.trim().length < 2) {
          error = t('validationErrors.minLength').replace('{min}', '2');
        } else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(value)) {
          error = t('validationErrors.lettersOnly');
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = t('validationErrors.required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = t('validationErrors.invalidEmail');
        }
        break;

      case 'phone': {
        const cleaned = value.replace(/\D/g, '');
        if (!cleaned) {
          error = t('validationErrors.required');
        } else if (cleaned.length !== 12) {
          error = t('validationErrors.phoneLength');
        } else if (!cleaned.startsWith('90')) {
          error = t('validationErrors.phoneCountryCode');
        }
        break;
      }

      case 'dateOfBirth': {
        if (!value) {
          error = t('validationErrors.required');
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18 || age > 100) {
            error = t('validationErrors.ageRange');
          }
        }
        break;
      }

      case 'dateOfEmployment': {
        if (!value) {
          error = t('validationErrors.required');
        } else {
          const empDate = new Date(value);
          const today = new Date();
          if (empDate > today) {
            error = t('validationErrors.futureDate');
          }
        }
        break;
      }

      default:
        if (!value) {
          error = t('validationErrors.required');
        }
    }

    return error;
  }

  /**
   * Validate all form fields
   */
  _validateForm() {
    const newErrors = {};
    let isValid = true;

    Object.keys(this.formData).forEach((key) => {
      const error = this._validateField(key, this.formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    this.errors = newErrors;
    return isValid;
  }

  /**
   * Maps Redux state to component properties
   */
  stateChanged(state) {
    const newLanguage = state.language?.currentLanguage || 'en';
    const previousLanguage = this.language;

    this.language = newLanguage;

    if (
      previousLanguage &&
      previousLanguage !== newLanguage &&
      Object.keys(this.errors).length > 0
    ) {
      const updatedErrors = {};

      Object.keys(this.errors).forEach((fieldName) => {
        if (this.errors[fieldName]) {
          const errorMessage = this._validateField(
            fieldName,
            this.formData[fieldName]
          );
          updatedErrors[fieldName] = errorMessage;
        }
      });

      this.errors = {...updatedErrors};
      this.requestUpdate();
    }
  }

  _handleInput(e) {
    const {name, value} = e.target;

    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '');

      if (cleaned.length > 12) {
        const truncated = cleaned.substring(0, 12);
        const formatted = this._formatPhoneNumber(truncated);
        e.target.value = formatted;
        this.formData = {
          ...this.formData,
          phone: formatted,
        };
        return;
      }

      const processedValue = this._formatPhoneNumber(value);
      this.formData = {
        ...this.formData,
        [name]: processedValue,
      };
    } else {
      this.formData = {
        ...this.formData,
        [name]: value,
      };
    }

    if (this.errors[name]) {
      this.errors = {
        ...this.errors,
        [name]: '',
      };
    }
  }

  _handleBlur(e) {
    const {name, value} = e.target;
    const error = this._validateField(name, value);

    if (error) {
      this.errors = {
        ...this.errors,
        [name]: error,
      };
    } else {
      const newErrors = {...this.errors};
      delete newErrors[name];
      this.errors = newErrors;
    }
  }

  _handleSubmit(e) {
    e.preventDefault();

    if (!this._validateForm()) {
      return;
    }

    if (this.isEditMode) {
      this.dispatch(
        updateEmployee({
          ...this.formData,
          id: parseInt(this.employeeId),
        })
      );
    } else {
      this.dispatch(addEmployee(this.formData));
    }

    Router.go('/');
  }

  _handleCancel() {
    Router.go('/');
  }

  render() {
    return html`
      <div class="form-container">
        <h2>
          ${this.isEditMode
            ? t('employeeForm.editEmployee')
            : t('employeeForm.addEmployee')}
        </h2>

        <form @submit=${this._handleSubmit}>
          <div class="form-group">
            <label for="firstName">${t('employeeForm.firstName')}</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              class="${this.errors.firstName ? 'error-input' : ''}"
              .value=${this.formData.firstName}
              @input=${this._handleInput}
              @blur=${this._handleBlur}
              required
            />
            ${this.errors.firstName
              ? html`<div class="error">${this.errors.firstName}</div>`
              : ''}
          </div>

          <div class="form-group">
            <label for="lastName">${t('employeeForm.lastName')}</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              class="${this.errors.lastName ? 'error-input' : ''}"
              .value=${this.formData.lastName}
              @input=${this._handleInput}
              @blur=${this._handleBlur}
              required
            />
            ${this.errors.lastName
              ? html`<div class="error">${this.errors.lastName}</div>`
              : ''}
          </div>

          <div class="form-group">
            <label for="dateOfEmployment"
              >${t('employeeForm.dateOfEmployment')}</label
            >
            <input
              type="date"
              id="dateOfEmployment"
              name="dateOfEmployment"
              class="${this.errors.dateOfEmployment ? 'error-input' : ''}"
              .value=${this.formData.dateOfEmployment}
              @input=${this._handleInput}
              @blur=${this._handleBlur}
              required
            />
            ${this.errors.dateOfEmployment
              ? html`<div class="error">${this.errors.dateOfEmployment}</div>`
              : ''}
          </div>

          <div class="form-group">
            <label for="dateOfBirth">${t('employeeForm.dateOfBirth')}</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              class="${this.errors.dateOfBirth ? 'error-input' : ''}"
              .value=${this.formData.dateOfBirth}
              @input=${this._handleInput}
              @blur=${this._handleBlur}
              required
            />
            ${this.errors.dateOfBirth
              ? html`<div class="error">${this.errors.dateOfBirth}</div>`
              : ''}
          </div>

          <div class="form-group">
            <label for="phone">${t('employeeForm.phone')}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              class="${this.errors.phone ? 'error-input' : ''}"
              .value=${this.formData.phone}
              @input=${this._handleInput}
              @blur=${this._handleBlur}
              placeholder="+90 (532) 123 45 67"
              maxlength="22"
              required
            />
            ${this.errors.phone
              ? html`<div class="error">${this.errors.phone}</div>`
              : ''}
          </div>

          <div class="form-group">
            <label for="email">${t('employeeForm.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              class="${this.errors.email ? 'error-input' : ''}"
              .value=${this.formData.email}
              @input=${this._handleInput}
              @blur=${this._handleBlur}
              required
            />
            ${this.errors.email
              ? html`<div class="error">${this.errors.email}</div>`
              : ''}
          </div>

          <div class="form-group">
            <label for="department">${t('employeeForm.department')}</label>
            <select
              id="department"
              name="department"
              @change=${this._handleInput}
              required
            >
              <option
                value="${DEPARTMENTS.ANALYTICS}"
                ?selected=${this.formData.department === DEPARTMENTS.ANALYTICS}
              >
                ${t('departments.analytics')}
              </option>
              <option
                value="${DEPARTMENTS.TECH}"
                ?selected=${this.formData.department === DEPARTMENTS.TECH}
              >
                ${t('departments.tech')}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="position">${t('employeeForm.position')}</label>
            <select
              id="position"
              name="position"
              @change=${this._handleInput}
              required
            >
              <option
                value="${POSITIONS.JUNIOR}"
                ?selected=${this.formData.position === POSITIONS.JUNIOR}
              >
                ${t('positions.junior')}
              </option>
              <option
                value="${POSITIONS.MEDIOR}"
                ?selected=${this.formData.position === POSITIONS.MEDIOR}
              >
                ${t('positions.medior')}
              </option>
              <option
                value="${POSITIONS.SENIOR}"
                ?selected=${this.formData.position === POSITIONS.SENIOR}
              >
                ${t('positions.senior')}
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn-secondary"
              @click=${this._handleCancel}
            >
              ${t('employeeForm.cancel')}
            </button>
            <button type="submit" class="btn-primary">
              ${this.isEditMode
                ? t('employeeForm.update')
                : t('employeeForm.add')}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
