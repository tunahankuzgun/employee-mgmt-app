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
});
