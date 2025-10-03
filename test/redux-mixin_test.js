import {ReduxMixin} from '../src/mixins/ReduxMixin.js';
import {LitElement} from 'lit';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

class TestReduxComponent extends ReduxMixin(LitElement) {
  render() {
    return html`<div>Test Component</div>`;
  }
}

customElements.define('test-redux-component', TestReduxComponent);

suite('ReduxMixin', () => {
  test('mixin can be applied to LitElement', async () => {
    const element = await fixture(
      html`<test-redux-component></test-redux-component>`
    );
    assert.isNotNull(element);
    assert.instanceOf(element, TestReduxComponent);
  });

  test('provides Redux integration methods', async () => {
    const element = await fixture(
      html`<test-redux-component></test-redux-component>`
    );

    assert.isFunction(element.getState);
    assert.isFunction(element.dispatch);
    assert.isFunction(element.getCurrentLanguage);
    assert.isFunction(element.changeLanguage);
  });

  test('can access Redux state', async () => {
    const element = await fixture(
      html`<test-redux-component></test-redux-component>`
    );

    const state = element.getState();
    assert.isObject(state);
    assert.property(state, 'language');
  });
});
