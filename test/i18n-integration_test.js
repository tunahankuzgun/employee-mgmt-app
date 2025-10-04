import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {store} from '../src/store/index.js';
import {
  setLanguage,
  selectCurrentLanguage,
} from '../src/store/slices/languageSlice.js';
import {initI18n} from '../src/utils/i18n.js';
import '../src/components/navigation-menu.js';
import '../src/components/language-selector.js';

/* global Promise */

suite('I18n Integration', () => {
  suiteSetup(async () => {
    await initI18n();
  });

  test('navigation menu updates when language changes', async () => {
    const element = await fixture(html`<navigation-menu></navigation-menu>`);
    await element.updateComplete;

    store.dispatch(setLanguage('en'));
    await element.updateComplete;

    const spanText1 = element.shadowRoot.querySelector('.text');
    const englishText = spanText1.textContent;

    store.dispatch(setLanguage('tr'));
    await element.updateComplete;

    const spanText2 = element.shadowRoot.querySelector('.text');
    const turkishText = spanText2.textContent;

    assert.notEqual(
      englishText,
      turkishText,
      'Language change should update the displayed text'
    );

    console.log('English text:', englishText);
    console.log('Turkish text:', turkishText);
  });

  test('language selector triggers component updates', async () => {
    const navElement = await fixture(html`<navigation-menu></navigation-menu>`);
    const langElement = await fixture(
      html`<language-selector></language-selector>`
    );

    await navElement.updateComplete;
    await langElement.updateComplete;

    const initialLang = selectCurrentLanguage(store.getState());
    const initialText =
      navElement.shadowRoot.querySelector('.text').textContent;

    langElement._toggleLanguage();

    await navElement.updateComplete;
    await langElement.updateComplete;

    const newLang = selectCurrentLanguage(store.getState());
    const newText = navElement.shadowRoot.querySelector('.text').textContent;

    assert.notEqual(initialLang, newLang, 'Language should change');
    console.log('Initial language:', initialLang, 'Text:', initialText);
    console.log('New language:', newLang, 'Text:', newText);
  });

  test('HTML lang attribute updates when language changes', async () => {
    store.dispatch(setLanguage('en'));
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(
      document.documentElement.lang,
      'en',
      'HTML lang should be "en"'
    );

    store.dispatch(setLanguage('tr'));
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(
      document.documentElement.lang,
      'tr',
      'HTML lang should be "tr"'
    );

    store.dispatch(setLanguage('en'));
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(
      document.documentElement.lang,
      'en',
      'HTML lang should be "en" again'
    );
  });

  test('HTML lang attribute is set on i18n initialization', async () => {
    const currentLang = selectCurrentLanguage(store.getState());
    assert.equal(
      document.documentElement.lang,
      currentLang,
      'HTML lang should match current language after initialization'
    );
  });
});
