import {LitElement, html, css} from 'lit';
import {ReduxMixin} from '../mixins/ReduxMixin.js';
import './navigation-menu.js';
import './language-selector.js';

/**
 * App Shell - Main application container with modern dashboard design
 */
export class AppShell extends ReduxMixin(LitElement) {
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

  firstUpdated() {
    const outlet = this.shadowRoot.querySelector('#router-outlet');

    if (outlet) {
      import('../router.js').then((module) => {
        module.AppRouter.init(outlet);
      });
    } else {
      console.error('Router outlet not found in shadow DOM');
    }
  }
  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
      background-color: #f5f5f5;
      min-width: 100%;
      min-height: 100vh;
    }

    header {
      background-color: #ffffff;
      padding: 0.75rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-section {
      display: flex;
      align-items: center;
      font-weight: 600;
      gap: 0.5rem;
    }

    .logo {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    @media (max-width: 425px) {
      .header-actions span {
        display: none;
      }
    }

    .container {
      padding: 0;
      max-width: none;
      margin: 0;
    }

    #router-outlet {
      margin: 0;
    }
  `;

  render() {
    return html`
      <header>
        <div class="logo-section">
          <div class="logo">
            <img src="./src/assets/ing-logo.svg" alt="ING Logo" />
            <div>ING</div>
          </div>
        </div>
        <div class="header-actions">
          <navigation-menu .currentPath="${this.currentPath}"></navigation-menu>
          <language-selector></language-selector>
        </div>
      </header>

      <main>
        <div class="container">
          <div id="router-outlet"></div>
        </div>
      </main>
    `;
  }
}

customElements.define('app-shell', AppShell);
