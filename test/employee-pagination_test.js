import {EmployeePagination} from '../src/components/employee-pagination.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {initI18n} from '../src/utils/i18n.js';
import '../src/components/employee-pagination.js';

suite('EmployeePagination', () => {
  suiteSetup(async () => {
    await initI18n();
  });

  test('is defined', () => {
    const el = document.createElement('employee-pagination');
    assert.instanceOf(el, EmployeePagination);
  });

  test('renders the component', async () => {
    const element = await fixture(
      html`<employee-pagination></employee-pagination>`
    );
    assert.isTrue(element !== null);
    assert.instanceOf(element, EmployeePagination);
  });

  test('has default properties', async () => {
    const element = await fixture(
      html`<employee-pagination></employee-pagination>`
    );
    assert.equal(element.currentPage, 1);
    assert.equal(element.totalPages, 0);
    assert.equal(element.totalItems, 0);
    assert.equal(element.itemsPerPage, 10);
  });

  test('renders pagination when totalItems > 0', async () => {
    const element = await fixture(
      html`<employee-pagination
        .currentPage="${1}"
        .totalPages="${5}"
        .totalItems="${50}"
        .itemsPerPage="${10}"
      ></employee-pagination>`
    );
    await element.updateComplete;

    const pagination = element.shadowRoot.querySelector('.pagination');
    assert.isNotNull(pagination);
  });

  test('renders no employees message when totalItems = 0', async () => {
    const element = await fixture(
      html`<employee-pagination
        .currentPage="${1}"
        .totalPages="${0}"
        .totalItems="${0}"
        .itemsPerPage="${10}"
      ></employee-pagination>`
    );
    await element.updateComplete;

    const paginationInfo = element.shadowRoot.querySelector('.pagination-info');
    assert.isNotNull(paginationInfo);
    assert.include(paginationInfo.textContent, 'No employees found');
  });

  test('renders page numbers correctly', async () => {
    const element = await fixture(
      html`<employee-pagination
        .currentPage="${3}"
        .totalPages="${10}"
        .totalItems="${100}"
        .itemsPerPage="${10}"
      ></employee-pagination>`
    );
    await element.updateComplete;

    const pageItems = element.shadowRoot.querySelectorAll('.pagination-item');
    assert.isTrue(pageItems.length > 0);
  });

  test('highlights current page', async () => {
    const element = await fixture(
      html`<employee-pagination
        .currentPage="${3}"
        .totalPages="${10}"
        .totalItems="${100}"
        .itemsPerPage="${10}"
      ></employee-pagination>`
    );
    await element.updateComplete;

    const activePage = element.shadowRoot.querySelector(
      '.pagination-item.active'
    );
    assert.isNotNull(activePage);
    assert.equal(activePage.textContent.trim(), '3');
  });

  test('handles page click', async () => {
    let clickedPage = null;
    const element = await fixture(
      html`<employee-pagination
        .currentPage="${1}"
        .totalPages="${5}"
        .totalItems="${50}"
        .itemsPerPage="${10}"
        @page-changed="${(e) => {
          clickedPage = e.detail.page;
        }}"
      ></employee-pagination>`
    );
    await element.updateComplete;

    const pageItems = element.shadowRoot.querySelectorAll('.pagination-item');
    const secondPage = Array.from(pageItems).find(
      (item) => item.textContent.trim() === '2'
    );
    if (secondPage) {
      secondPage.click();
      assert.equal(clickedPage, 2);
    }
  });

  test('handles previous button click', async () => {
    let clickedPage = null;
    const element = await fixture(
      html`<employee-pagination
        .currentPage="${3}"
        .totalPages="${5}"
        .totalItems="${50}"
        .itemsPerPage="${10}"
        @page-changed="${(e) => {
          clickedPage = e.detail.page;
        }}"
      ></employee-pagination>`
    );
    await element.updateComplete;

    const prevButton = element.shadowRoot.querySelector('.pagination-prev');
    prevButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));

    assert.equal(clickedPage, 2);
  });

  test('handles next button click', async () => {
    let clickedPage = null;
    const element = await fixture(
      html`<employee-pagination
        .currentPage="${3}"
        .totalPages="${5}"
        .totalItems="${50}"
        .itemsPerPage="${10}"
        @page-changed="${(e) => {
          clickedPage = e.detail.page;
        }}"
      ></employee-pagination>`
    );
    await element.updateComplete;

    const nextButton = element.shadowRoot.querySelector('.pagination-next');
    nextButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));

    assert.equal(clickedPage, 4);
  });

  test('disables previous button on first page', async () => {
    const element = await fixture(
      html`<employee-pagination
        .currentPage="${1}"
        .totalPages="${5}"
        .totalItems="${50}"
        .itemsPerPage="${10}"
      ></employee-pagination>`
    );
    await element.updateComplete;

    const prevButton = element.shadowRoot.querySelector('.pagination-prev');
    const color = prevButton.getAttribute('color');
    assert.equal(color, 'gray');
  });

  test('disables next button on last page', async () => {
    const element = await fixture(
      html`<employee-pagination
        .currentPage="${5}"
        .totalPages="${5}"
        .totalItems="${50}"
        .itemsPerPage="${10}"
      ></employee-pagination>`
    );
    await element.updateComplete;

    const nextButton = element.shadowRoot.querySelector('.pagination-next');
    const color = nextButton.getAttribute('color');
    assert.equal(color, 'gray');
  });

  test('generates correct pagination for large page count', async () => {
    const element = await fixture(
      html`<employee-pagination
        .currentPage="${10}"
        .totalPages="${20}"
        .totalItems="${200}"
        .itemsPerPage="${10}"
      ></employee-pagination>`
    );
    await element.updateComplete;

    const ellipsis = element.shadowRoot.querySelectorAll(
      '.pagination-ellipsis'
    );
    assert.isTrue(ellipsis.length > 0);
  });

  test('generates simple pagination for small page count', async () => {
    const element = await fixture(
      html`<employee-pagination
        .currentPage="${2}"
        .totalPages="${4}"
        .totalItems="${40}"
        .itemsPerPage="${10}"
      ></employee-pagination>`
    );
    await element.updateComplete;

    const pageItems = element.shadowRoot.querySelectorAll('.pagination-item');
    const ellipsis = element.shadowRoot.querySelectorAll(
      '.pagination-ellipsis'
    );

    assert.equal(pageItems.length, 4);
    assert.equal(ellipsis.length, 0);
  });

  test('has CSS styles defined', async () => {
    const element = await fixture(
      html`<employee-pagination></employee-pagination>`
    );
    assert.isTrue(element.constructor.styles !== undefined);
  });
});
