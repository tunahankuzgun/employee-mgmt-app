import {LitElement, html, css} from 'lit';
import {t} from '../utils/i18n.js';
import {ReduxMixin} from '../mixins/ReduxMixin.js';
import {selectSearchQuery, setSearchQuery} from '../store/slices/uiSlice.js';

/**
 * Search Bar Component
 * Provides a search input field for filtering employees
 */
export class SearchBar extends ReduxMixin(LitElement) {
  static properties = {
    searchQuery: {type: String},
  };

  static styles = css`
    :host {
      display: flex;
    }

    .search-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .search-input {
      width: 310px;
      padding: 10px 40px 10px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: #ff6200;
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }

    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #ff6200;
      pointer-events: none;
    }

    .clear-button {
      position: absolute;
      right: 35px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
    }

    .clear-button:hover {
      color: red;
    }

    .clear-button:focus {
      outline: none;
    }

    .search-info {
      font-size: 13px;
      color: #666;
      margin-left: 10px;
    }

    @media (max-width: 600px) {
      .search-input {
        width: 100%;
      }
    }
  `;

  constructor() {
    super();
    this.searchQuery = '';
  }

  /**
   * Handle Redux state changes
   * @param {Object} state - Current Redux state
   */
  stateChanged(state) {
    this.searchQuery = selectSearchQuery(state);
  }

  _handleInput(e) {
    const value = e.target.value;
    this.dispatch(setSearchQuery(value));
  }

  _handleClear() {
    this.dispatch(setSearchQuery(''));
  }

  render() {
    return html`
      <div class="search-container">
        <div class="search-input-wrapper">
          <input
            type="text"
            class="search-input"
            .value=${this.searchQuery}
            @input=${this._handleInput}
            placeholder="${t(
              'employeeList.search_placeholder',
              'Search by name, email, department...'
            )}"
            aria-label="${t('employeeList.search_label', 'Search employees')}"
          />
          ${this.searchQuery
            ? html`
                <svg
                  class="clear-button"
                  @click=${this._handleClear}
                  aria-label="${t('employeeList.clear_search', 'Clear search')}"
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-x-icon lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              `
            : ''}
          <span class="search-icon">
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
              class="lucide lucide-search-icon lucide-search"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
          </span>
        </div>
      </div>
    `;
  }
}

customElements.define('search-bar', SearchBar);
