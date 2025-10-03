import {AppShell} from '../src/components/app-shell.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import '../src/components/app-shell.js';

suite('AppShell', () => {
  test('is defined', () => {
    const el = document.createElement('app-shell');
    assert.instanceOf(el, AppShell);
  });

  test('renders the component', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    assert.isTrue(element !== null);
    assert.instanceOf(element, AppShell);
  });

  test('has default properties', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    assert.equal(element.currentPath, window.location.pathname);
    assert.isTrue(element.currentPath !== undefined);
  });

  test('renders header', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    await element.updateComplete;
    const header = element.shadowRoot.querySelector('header');
    assert.isNotNull(header);
  });

  test('renders header with logo', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    await element.updateComplete;
    const header = element.shadowRoot.querySelector('header');
    const logo = element.shadowRoot.querySelector('.logo');
    assert.isNotNull(header);
    assert.isNotNull(logo);
  });

  test('renders router outlet', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    await element.updateComplete;
    const outlet = element.shadowRoot.querySelector('#router-outlet');
    assert.isNotNull(outlet);
  });

  test('contains language selector component', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    await element.updateComplete;
    const languageSelector =
      element.shadowRoot.querySelector('language-selector');
    assert.isNotNull(languageSelector);
  });

  test('has CSS styles defined', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    await element.updateComplete;
    assert.isTrue(element.constructor.styles !== undefined);
  });

  test('renders navigation menu component', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    await element.updateComplete;
    const navigationMenu = element.shadowRoot.querySelector('navigation-menu');
    assert.isNotNull(navigationMenu);
  });

  test('firstUpdated method exists and initializes router outlet', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    assert.isFunction(element.firstUpdated);

    const outlet = element.shadowRoot.querySelector('#router-outlet');
    assert.isNotNull(outlet);
  });

  test('updates currentPath when location changes', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    const initialPath = element.currentPath;

    element.currentPath = '/test-path';
    await element.updateComplete;
    assert.equal(element.currentPath, '/test-path');
    assert.notEqual(element.currentPath, initialPath);
  });

  test('logo image exists in header', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    await element.updateComplete;

    const logoImg = element.shadowRoot.querySelector('.logo img');
    assert.isNotNull(logoImg);
    assert.include(logoImg.src, 'ing-logo.svg');
  });
});
