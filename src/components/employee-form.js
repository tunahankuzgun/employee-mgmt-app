import {LitElement, html, css} from 'lit';

/**
 * Employee Form Component
 */
export class EmployeeForm extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
    }
  `;

  render() {
    return html`
      <div>
        <h2>Employee Form</h2>
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
