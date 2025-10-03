import {LitElement, html, css} from 'lit';
import {changeLanguage} from '../utils/i18n.js';
import './navigation-menu.js';

/**
 * App Shell - Main application container with modern dashboard design
 */
export class AppShell extends LitElement {
  static properties = {
    currentPath: {type: String},
    currentLanguage: {type: String},
  };

  constructor() {
    super();
    this.currentPath = window.location.pathname;
    this.currentLanguage = document.documentElement.lang || 'en';

    window.addEventListener('vaadin-router-location-changed', (e) => {
      this.currentPath = e.detail.location.pathname;
    });
  }

  _toggleLanguage() {
    const newLang = this.currentLanguage === 'en' ? 'tr' : 'en';
    changeLanguage(newLang);
    this.currentLanguage = newLang;

    this.requestUpdate();
  }

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

    .language-flag {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 2px 4px;
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
          <div class="language-flag" @click="${this._toggleLanguage}">
            ${this.currentLanguage === 'tr'
              ? html`<svg
                  width="24"
                  height="24"
                  viewBox="0 0 36 36"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  class="iconify iconify--twemoji"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fill="#E30917"
                    d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v18z"
                  ></path>
                  <path
                    fill="#EEE"
                    d="M16 24a6 6 0 1 1 0-12c1.31 0 2.52.425 3.507 1.138A7.332 7.332 0 0 0 14 10.647A7.353 7.353 0 0 0 6.647 18A7.353 7.353 0 0 0 14 25.354c2.195 0 4.16-.967 5.507-2.492A5.963 5.963 0 0 1 16 24zm3.913-5.77l2.44.562l.22 2.493l1.288-2.146l2.44.561l-1.644-1.888l1.287-2.147l-2.303.98l-1.644-1.889l.22 2.494z"
                  ></path>
                </svg>`
              : html`<svg
                  width="24"
                  height="24"
                  viewBox="0 0 36 36"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  class="iconify iconify--twemoji"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fill="#B22334"
                    d="M35.445 7C34.752 5.809 33.477 5 32 5H18v2h17.445zM0 25h36v2H0zm18-8h18v2H18zm0-4h18v2H18zM0 21h36v2H0zm4 10h28c1.477 0 2.752-.809 3.445-2H.555c.693 1.191 1.968 2 3.445 2zM18 9h18v2H18z"
                  ></path>
                  <path
                    fill="#EEE"
                    d="M.068 27.679c.017.093.036.186.059.277c.026.101.058.198.092.296c.089.259.197.509.333.743L.555 29h34.89l.002-.004a4.22 4.22 0 0 0 .332-.741a3.75 3.75 0 0 0 .152-.576c.041-.22.069-.446.069-.679H0c0 .233.028.458.068.679zM0 23h36v2H0zm0-4v2h36v-2H18zm18-4h18v2H18zm0-4h18v2H18zM0 9zm.555-2l-.003.005L.555 7zM.128 8.044c.025-.102.06-.199.092-.297a3.78 3.78 0 0 0-.092.297zM18 9h18c0-.233-.028-.459-.069-.68a3.606 3.606 0 0 0-.153-.576A4.21 4.21 0 0 0 35.445 7H18v2z"
                  ></path>
                  <path
                    fill="#3C3B6E"
                    d="M18 5H4a4 4 0 0 0-4 4v10h18V5z"
                  ></path>
                  <path
                    fill="#FFF"
                    d="M2.001 7.726l.618.449l-.236.725L3 8.452l.618.448l-.236-.725L4 7.726h-.764L3 7l-.235.726zm2 2l.618.449l-.236.725l.617-.448l.618.448l-.236-.725L6 9.726h-.764L5 9l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L9 9l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L13 9l-.235.726zm-8 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L5 13l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L9 13l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L13 13l-.235.726zm-6-6l.618.449l-.236.725L7 8.452l.618.448l-.236-.725L8 7.726h-.764L7 7l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 7l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 7l-.235.726zm-12 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L3 11l-.235.726zM6.383 12.9L7 12.452l.618.448l-.236-.725l.618-.449h-.764L7 11l-.235.726h-.764l.618.449zm3.618-1.174l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 11l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 11l-.235.726zm-12 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L3 15l-.235.726zM6.383 16.9L7 16.452l.618.448l-.236-.725l.618-.449h-.764L7 15l-.235.726h-.764l.618.449zm3.618-1.174l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 15l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 15l-.235.726z"
                  ></path>
                </svg>`}
          </div>
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
