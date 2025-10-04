import {SearchBar} from '../src/components/search-bar.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {store} from '../src/store/index.js';
import {
  setSearchQuery,
  selectSearchQuery,
} from '../src/store/slices/uiSlice.js';
import {initI18n} from '../src/utils/i18n.js';
import '../src/components/search-bar.js';

suite('SearchBar', () => {
  suiteSetup(async () => {
    await initI18n('en');
  });

  test('is defined', () => {
    const el = document.createElement('search-bar');
    assert.instanceOf(el, SearchBar);
  });

  test('renders the component', async () => {
    const element = await fixture(html`<search-bar></search-bar>`);
    assert.isTrue(element !== null);
    assert.instanceOf(element, SearchBar);
  });

  test('has default properties', async () => {
    const element = await fixture(html`<search-bar></search-bar>`);
    assert.equal(element.searchQuery, '');
  });

  test('renders search input', async () => {
    const element = await fixture(html`<search-bar></search-bar>`);
    await element.updateComplete;
    const input = element.shadowRoot.querySelector('.search-input');
    assert.isNotNull(input);
    assert.equal(input.type, 'text');
  });

  test('updates Redux store when typing', async () => {
    const element = await fixture(html`<search-bar></search-bar>`);
    await element.updateComplete;

    const input = element.shadowRoot.querySelector('.search-input');
    input.value = 'John';
    input.dispatchEvent(new Event('input'));

    await element.updateComplete;

    const searchQuery = selectSearchQuery(store.getState());
    assert.equal(searchQuery, 'John');
  });

  test('shows clear button when there is text', async () => {
    const element = await fixture(html`<search-bar></search-bar>`);

    store.dispatch(setSearchQuery('test'));
    await element.updateComplete;

    const clearButton = element.shadowRoot.querySelector('.clear-button');
    assert.isNotNull(clearButton);

    store.dispatch(setSearchQuery(''));
    await element.updateComplete;

    const clearButtonAfter = element.shadowRoot.querySelector('.clear-button');
    assert.isNull(clearButtonAfter);
  });

  test('clears search when clear button is clicked', async () => {
    const element = await fixture(html`<search-bar></search-bar>`);
    await element.updateComplete;

    store.dispatch(setSearchQuery('test query'));
    await element.updateComplete;

    const clearButton = element.shadowRoot.querySelector('.clear-button');
    assert.isNotNull(clearButton);

    clearButton.dispatchEvent(
      new MouseEvent('click', {bubbles: true, composed: true})
    );
    await element.updateComplete;

    const searchQuery = selectSearchQuery(store.getState());
    assert.equal(searchQuery, '');
  });

  test('displays search icon', async () => {
    const element = await fixture(html`<search-bar></search-bar>`);
    await element.updateComplete;

    const searchIcon = element.shadowRoot.querySelector('.search-icon');
    assert.isNotNull(searchIcon, 'Search icon container should exist');

    const svgIcon = searchIcon.querySelector('svg');
    assert.isNotNull(svgIcon, 'SVG icon should exist inside search-icon');
    assert.isTrue(
      svgIcon.classList.contains('lucide-search'),
      'SVG should have lucide-search class'
    );
  });

  test('has proper placeholder text', async () => {
    const element = await fixture(html`<search-bar></search-bar>`);
    await element.updateComplete;

    const input = element.shadowRoot.querySelector('.search-input');
    assert.isNotNull(input, 'Input element should exist');

    const placeholder = input.getAttribute('placeholder');
    assert.exists(placeholder, 'Placeholder attribute should exist');
    assert.isString(placeholder, 'Placeholder should be a string');
    assert.isAtLeast(
      placeholder.trim().length,
      1,
      'Placeholder should have content'
    );
  });

  test('syncs with Redux state changes', async () => {
    const element = await fixture(html`<search-bar></search-bar>`);
    await element.updateComplete;

    store.dispatch(setSearchQuery('Redux Test'));
    await element.updateComplete;

    assert.equal(element.searchQuery, 'Redux Test');

    const input = element.shadowRoot.querySelector('.search-input');
    assert.equal(input.value, 'Redux Test');
  });
});
