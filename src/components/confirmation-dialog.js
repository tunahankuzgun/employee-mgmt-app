import {LitElement, html, css} from 'lit';

/**
 * Confirmation Dialog Component
 */
export class ConfirmationDialog extends LitElement {
  static properties = {
    open: {type: Boolean, reflect: true},
    title: {type: String},
    message: {type: String},
    confirmText: {type: String},
    cancelText: {type: String},
  };

  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      display: none;
    }

    :host([open]) {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      animation: fadeIn 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dialog {
      position: relative;
      background: white;
      border-radius: 8px;
      padding: 1rem;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease;
      z-index: 1;
    }

    .dialog-header {
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #ff6200;
      font-weight: 600;
    }

    .close-button {
      color: #ff6200;
      cursor: pointer;
      line-height: 1;
    }

    .close-button:hover {
      color: #e55800;
    }

    .close-button svg {
      width: 20px;
      height: 20px;
    }

    .dialog-body {
      margin-bottom: 1.5rem;
      color: #666;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .dialog-footer {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    button {
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 80px;
    }

    .btn-cancel {
      background-color: white;
      color: #4f46e5;
      border: 1px solid #4f46e5;
    }

    .btn-cancel:hover {
      background: #e9ecef;
    }

    .btn-confirm {
      color: white;
    }

    .btn-confirm.primary {
      background: #ff6200;
    }

    .btn-confirm.primary:hover {
      background: #e55800;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.title = '';
    this.message = '';
    this.confirmText = 'Confirm';
    this.cancelText = 'Cancel';
  }

  _handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      this._handleCancel();
    }
  }

  _handleCancel() {
    this.dispatchEvent(
      new CustomEvent('cancel', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleConfirm() {
    this.dispatchEvent(
      new CustomEvent('confirm', {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="backdrop" @click=${this._handleBackdropClick}>
        <div class="dialog" @click=${(e) => e.stopPropagation()}>
          <div class="dialog-header">
            <h2>${this.title}</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="close-button"
              @click=${this._handleCancel}
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
          <div class="dialog-body">${this.message}</div>
          <div class="dialog-footer">
            <button class="btn-confirm primary" @click=${this._handleConfirm}>
              ${this.confirmText}
            </button>
            <button class="btn-cancel" @click=${this._handleCancel}>
              ${this.cancelText}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-dialog', ConfirmationDialog);
