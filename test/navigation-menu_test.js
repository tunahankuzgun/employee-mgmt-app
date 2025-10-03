import {NavigationMenu} from '../src/components/navigation-menu.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import '../src/components/navigation-menu.js';

suite('NavigationMenu', () => {
  test('is defined', () => {
    const el = document.createElement('navigation-menu');
    assert.instanceOf(el, NavigationMenu);
  });

  test('renders the component', async () => {
    const element = await fixture(html`<navigation-menu></navigation-menu>`);
    assert.isTrue(element !== null);
    assert.instanceOf(element, NavigationMenu);
  });

  test('has default properties', async () => {
    const element = await fixture(html`<navigation-menu></navigation-menu>`);
    assert.equal(element.currentPath, window.location.pathname);
  });

  test('renders navigation links', async () => {
    const element = await fixture(html`<navigation-menu></navigation-menu>`);
    await element.updateComplete;

    const employeeListLink = element.shadowRoot.querySelector('a[href="/"]');
    const addEmployeeLink = element.shadowRoot.querySelector('a[href="/add"]');

    assert.isNotNull(employeeListLink);
    assert.isNotNull(addEmployeeLink);
  });

  test('has CSS styles defined', async () => {
    const element = await fixture(html`<navigation-menu></navigation-menu>`);
    await element.updateComplete;
    assert.isTrue(element.constructor.styles !== undefined);
  });

  test('_isActive method works correctly for root path', async () => {
    const element = await fixture(html`<navigation-menu></navigation-menu>`);

    element.currentPath = '/';
    assert.isTrue(element._isActive('/'));

    element.currentPath = '';
    assert.isTrue(element._isActive('/'));

    element.currentPath = '/add';
    assert.isFalse(element._isActive('/'));
  });

  test('_isActive method works correctly for add path', async () => {
    const element = await fixture(html`<navigation-menu></navigation-menu>`);

    element.currentPath = '/add';
    assert.isTrue(element._isActive('/add'));

    element.currentPath = '/add/employee';
    assert.isTrue(element._isActive('/add'));

    element.currentPath = '/';
    assert.isFalse(element._isActive('/add'));
  });

  test('applies active class to current route', async () => {
    const element = await fixture(
      html`<navigation-menu currentPath="/"></navigation-menu>`
    );
    await element.updateComplete;

    const homeLink = element.shadowRoot.querySelector('a[href="/"]');
    const addLink = element.shadowRoot.querySelector('a[href="/add"]');

    assert.isTrue(homeLink.classList.contains('active'));
    assert.isFalse(addLink.classList.contains('active'));
  });

  test('applies active class to add route', async () => {
    const element = await fixture(
      html`<navigation-menu currentPath="/add"></navigation-menu>`
    );
    await element.updateComplete;

    const homeLink = element.shadowRoot.querySelector('a[href="/"]');
    const addLink = element.shadowRoot.querySelector('a[href="/add"]');

    assert.isFalse(homeLink.classList.contains('active'));
    assert.isTrue(addLink.classList.contains('active'));
  });

  test('renders SVG icons in navigation links', async () => {
    const element = await fixture(html`<navigation-menu></navigation-menu>`);
    await element.updateComplete;

    const userIcon = element.shadowRoot.querySelector('.lucide-user');
    const plusIcon = element.shadowRoot.querySelector('.lucide-plus');

    assert.isNotNull(userIcon);
    assert.isNotNull(plusIcon);
  });

  test('renders text spans in navigation links', async () => {
    const element = await fixture(html`<navigation-menu></navigation-menu>`);
    await element.updateComplete;

    const textSpans = element.shadowRoot.querySelectorAll('.text');
    assert.equal(textSpans.length, 2);
  });

  test('updates currentPath when property changes', async () => {
    const element = await fixture(html`<navigation-menu></navigation-menu>`);

    element.currentPath = '/test-path';
    await element.updateComplete;

    assert.equal(element.currentPath, '/test-path');
  });

  test('listens for route change events', async () => {
    const element = await fixture(html`<navigation-menu></navigation-menu>`);
    const initialPath = element.currentPath;

    const event = new CustomEvent('vaadin-router-location-changed', {
      detail: {
        location: {
          pathname: '/new-path',
        },
      },
    });

    window.dispatchEvent(event);

    assert.equal(element.currentPath, '/new-path');
    assert.notEqual(element.currentPath, initialPath);
  });
});
