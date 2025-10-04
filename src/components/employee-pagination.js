import {LitElement, html, css} from 'lit';
import {t} from '../utils/i18n.js';

/**
 * Employee Pagination Component
 * Handles pagination logic and rendering for employee lists
 */
export class EmployeePagination extends LitElement {
  static properties = {
    currentPage: {type: Number},
    totalPages: {type: Number},
    totalItems: {type: Number},
    itemsPerPage: {type: Number},
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 0;
    this.totalItems = 0;
    this.itemsPerPage = 10;
  }

  static styles = css`
    :host {
      display: block;
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
      background: none;
      border: none;
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

    @media (max-width: 768px) {
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
      .pagination {
        max-width: 100%;
        overflow-x: auto;
        padding: 0.25rem 0;
      }
    }
  `;

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

  _handlePageChange(page) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.dispatchEvent(
        new CustomEvent('page-changed', {
          detail: {page},
          bubbles: true,
        })
      );
    }
  }

  render() {
    if (this.totalItems === 0) {
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
          <button
            class="pagination-prev"
            @click="${() =>
              this.currentPage !== 1
                ? this._handlePageChange(this.currentPage - 1)
                : null}"
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
              color="${this.currentPage === 1 ? 'gray' : '#ff6200'}"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
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
          <button
            @click="${() =>
              this.currentPage !== this.totalPages
                ? this._handlePageChange(this.currentPage + 1)
                : null}"
            class="pagination-next"
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
              color="${this.currentPage === this.totalPages
                ? 'gray'
                : '#ff6200'}"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('employee-pagination', EmployeePagination);
