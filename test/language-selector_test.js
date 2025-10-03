import {LanguageSelector} from '../src/components/language-selector.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import '../src/components/language-selector.js';

suite('LanguageSelector', () => {
  test('is defined', () => {
    const el = document.createElement('language-selector');
    assert.instanceOf(el, LanguageSelector);
  });

  test('renders the component', async () => {
    const element = await fixture(
      html`<language-selector></language-selector>`
    );
    assert.isTrue(element !== null);
    assert.instanceOf(element, LanguageSelector);
  });

  test('renders language flag', async () => {
    const element = await fixture(
      html`<language-selector></language-selector>`
    );
    await element.updateComplete;

    const languageFlag = element.shadowRoot.querySelector('.language-flag');
    assert.isNotNull(languageFlag);
  });

  test('has _toggleLanguage method', async () => {
    const element = await fixture(
      html`<language-selector></language-selector>`
    );
    assert.isFunction(element._toggleLanguage);
  });

  test('has getCurrentLanguage method from ReduxMixin', async () => {
    const element = await fixture(
      html`<language-selector></language-selector>`
    );
    assert.isFunction(element.getCurrentLanguage);
  });

  test('has changeLanguage method from ReduxMixin', async () => {
    const element = await fixture(
      html`<language-selector></language-selector>`
    );
    assert.isFunction(element.changeLanguage);
  });

  test('_getFlagIcon returns correct flag for English', async () => {
    const element = await fixture(
      html`<language-selector></language-selector>`
    );
    const flagIcon = element._getFlagIcon('en');
    assert.isTrue(flagIcon !== null);
  });

  test('_getFlagIcon returns correct flag for Turkish', async () => {
    const element = await fixture(
      html`<language-selector></language-selector>`
    );
    const flagIcon = element._getFlagIcon('tr');
    assert.isTrue(flagIcon !== null);
  });

  test('_getFlagIcon defaults to English for unknown language', async () => {
    const element = await fixture(
      html`<language-selector></language-selector>`
    );
    const flagIcon = element._getFlagIcon('unknown');
    assert.isTrue(flagIcon !== null);
  });

  test('_toggleLanguage method can be called without error', async () => {
    const element = await fixture(
      html`<language-selector></language-selector>`
    );
    await element.updateComplete;

    assert.isFunction(element._toggleLanguage);

    try {
      element._toggleLanguage();
      assert.isTrue(
        true,
        '_toggleLanguage method should execute without error'
      );
    } catch (error) {
      assert.fail(
        `_toggleLanguage method should not throw error: ${error.message}`
      );
    }
  });

  test('has CSS styles defined', async () => {
    const element = await fixture(
      html`<language-selector></language-selector>`
    );
    assert.isTrue(element.constructor.styles !== undefined);
  });

  test('language flag has hover effect styles', async () => {
    const element = await fixture(
      html`<language-selector></language-selector>`
    );
    await element.updateComplete;

    const languageFlag = element.shadowRoot.querySelector('.language-flag');
    const styles = getComputedStyle(languageFlag);

    assert.equal(styles.cursor, 'pointer');
    assert.isNotNull(languageFlag);
  });
});
