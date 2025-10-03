import {LitElement, html, css} from 'lit';
import {ReduxMixin} from '../mixins/ReduxMixin.js';
import {t} from '../utils/i18n.js';

/**
 * Navigation Menu - Navigation component for app routing
 */
export class NavigationMenu extends ReduxMixin(LitElement) {
  static properties = {
    currentPath: {type: String},
  };

  constructor() {
    super();
    this.currentPath = window.location.pathname;

    window.addEventListener('vaadin-router-location-changed', (e) => {
      this.currentPath = e.detail.location.pathname;
    });
  }

  /**
   * Handle Redux state changes
   * @param {Object} state - Current Redux state
   */
  // eslint-disable-next-line no-unused-vars
  stateChanged(state) {}

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-link {
      color: #ff620070;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      padding: 0.5rem;
      transition: all 0.2s ease;
    }

    .nav-link:hover {
      scale: 1.05;
    }

    .nav-link.active {
      color: #ff6200;
    }

    .text {
      margin-left: 0.25rem;
    }

    @media (max-width: 768px) {
      .nav-link {
        font-size: 0.8rem;
        padding: 0.4rem 0.8rem;
      }
    }

    @media (max-width: 425px) {
      .text {
        display: none;
      }
      :host {
        gap: 0;
      }
    }
  `;

  _isActive(path) {
    if (path === '/') {
      return this.currentPath === '/' || this.currentPath === '';
    }
    return this.currentPath.startsWith(path);
  }

  render() {
    return html`
      <a class="nav-link ${this._isActive('/') ? 'active' : ''}" href="/">
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
          class="lucide lucide-user-icon lucide-user"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span class="text">${t('header.employees')}</span>
      </a>

      <a class="nav-link ${this._isActive('/add') ? 'active' : ''}" href="/add">
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
          class="lucide lucide-plus-icon lucide-plus"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        <span class="text">${t('header.addEmployee')}</span>
      </a>
    `;
  }
}

customElements.define('navigation-menu', NavigationMenu);
