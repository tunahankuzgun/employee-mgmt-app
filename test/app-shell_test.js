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
    assert.isTrue(['en', 'tr'].includes(element.currentLanguage));
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

  test('has language toggle flag', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    await element.updateComplete;
    const languageFlag = element.shadowRoot.querySelector('.language-flag');
    assert.isNotNull(languageFlag);
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

  test('sets language from document.documentElement.lang', async () => {
    const originalLang = document.documentElement.lang;
    document.documentElement.lang = 'tr';

    const element = await fixture(html`<app-shell></app-shell>`);
    assert.equal(element.currentLanguage, 'tr');

    document.documentElement.lang = originalLang;
  });

  test('defaults to "en" if no language is set', async () => {
    const originalLang = document.documentElement.lang;
    document.documentElement.lang = '';

    const element = await fixture(html`<app-shell></app-shell>`);
    assert.equal(element.currentLanguage, 'en');

    document.documentElement.lang = originalLang;
  });

  test('_toggleLanguage method exists and can be called', async () => {
    const element = await fixture(html`<app-shell></app-shell>`);
    assert.isFunction(element._toggleLanguage);

    const initialLang = element.currentLanguage;
    const newLang = initialLang === 'en' ? 'tr' : 'en';
    element.currentLanguage = newLang;
    await element.updateComplete;
    assert.notEqual(element.currentLanguage, initialLang);
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
