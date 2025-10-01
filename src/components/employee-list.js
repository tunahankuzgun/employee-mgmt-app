import { LitElement, html, css } from 'lit';

/**
 * Employee List Component
 */
export class EmployeeList extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
    }
  `;

  render() {
    return html`
      <div>
        <h2>Employee List</h2>
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);