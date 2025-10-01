import { LitElement, html, css } from 'lit';

/**
 * App Shell - Main application container with modern dashboard design
 */
export class AppShell extends LitElement {
  static properties = {
    currentPath: { type: String },
    currentLanguage: { type: String }
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
    this.currentLanguage = newLang;
    document.documentElement.lang = newLang;
    
    document.dispatchEvent(new CustomEvent('language-changed', {
      detail: { language: newLang }
    }));
  }

  firstUpdated() {
    const outlet = this.shadowRoot.querySelector('#router-outlet');
    
    if (outlet) {
      import('../router.js').then(module => {
        module.AppRouter.init(outlet);
      });
    } else {
      console.error('Router outlet not found in shadow DOM');
    }
  }
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f5f5f5;
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

    .employees-text {
      color: #FF6200;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .language-flag {
      font-size: 1.2rem;
      cursor: pointer;
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 2px 4px;
    }

    .add-new-btn {
      background-color: #FF6200;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.85rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      font-weight: 500;
    }

    .add-new-btn:hover {
      background-color: #FF6200;
    }

    .container {
      padding: 0;
      max-width: none;
      margin: 0;
    }

    main {
      min-height: calc(100vh - 70px);
    }

    #router-outlet {
      background-color: white;
      margin: 0;
      min-height: calc(100vh - 70px);
    }

    @media (max-width: 768px) {
      header {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 1.5rem;
      }

      .employees-text {
        font-size: 0.8rem;
      }

      .add-new-btn {
        font-size: 0.8rem;
        padding: 0.4rem 0.8rem;
      }
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
          <div class="employees-text">
             Employees
          </div>
          <a href="/add" class="add-new-btn">+ Add New</a>
          <div class="language-flag" @click="${this._toggleLanguage}">
            ${this.currentLanguage === 'tr' ? '🇹🇷' : '🇺🇸'}
          </div>
        </div>
      </header>

      <main>
        <div class="container">
          <div id="router-outlet">
          </div>
        </div>
      </main>
    `;
  }
}

customElements.define('app-shell', AppShell);