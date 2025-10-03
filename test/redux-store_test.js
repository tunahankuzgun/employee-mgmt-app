import {store} from '../src/store/index.js';
import {
  setLanguage,
  selectCurrentLanguage,
  selectAvailableLanguages,
} from '../src/store/slices/languageSlice.js';
import {assert} from '@open-wc/testing';

suite('Redux Store', () => {
  test('store is defined and has initial state', () => {
    assert.isNotNull(store);
    assert.isObject(store.getState());
  });

  test('store has language slice in state', () => {
    const state = store.getState();
    assert.property(state, 'language');
  });
});

suite('Language Slice', () => {
  let initialState;

  setup(() => {
    initialState = store.getState();
  });

  teardown(() => {
    const currentState = store.getState();
    if (
      currentState.language.currentLanguage !==
      initialState.language.currentLanguage
    ) {
      store.dispatch(setLanguage(initialState.language.currentLanguage));
    }
  });

  test('has initial language state', () => {
    const state = store.getState();
    assert.property(state.language, 'currentLanguage');
    assert.property(state.language, 'availableLanguages');
  });

  test('selectCurrentLanguage returns current language', () => {
    const state = store.getState();
    const currentLanguage = selectCurrentLanguage(state);
    assert.isString(currentLanguage);
    assert.isTrue(['en', 'tr'].includes(currentLanguage));
  });

  test('selectAvailableLanguages returns available languages array', () => {
    const state = store.getState();
    const availableLanguages = selectAvailableLanguages(state);
    assert.isArray(availableLanguages);
    assert.include(availableLanguages, 'en');
    assert.include(availableLanguages, 'tr');
  });

  test('setLanguage action changes current language to Turkish', () => {
    store.dispatch(setLanguage('tr'));
    const state = store.getState();
    const currentLanguage = selectCurrentLanguage(state);
    assert.equal(currentLanguage, 'tr');
  });

  test('setLanguage action changes current language to English', () => {
    store.dispatch(setLanguage('en'));
    const state = store.getState();
    const currentLanguage = selectCurrentLanguage(state);
    assert.equal(currentLanguage, 'en');
  });

  test('setLanguage with any language sets the value (no validation)', () => {
    store.dispatch(setLanguage('invalid'));

    const currentLang = selectCurrentLanguage(store.getState());
    assert.equal(currentLang, 'invalid');

    store.dispatch(setLanguage('en'));
  });

  test('language state changes trigger store subscription', (done) => {
    const initialLang = selectCurrentLanguage(store.getState());
    const newLang = initialLang === 'en' ? 'tr' : 'en';

    const unsubscribe = store.subscribe(() => {
      const currentLang = selectCurrentLanguage(store.getState());
      if (currentLang === newLang) {
        assert.equal(currentLang, newLang);
        unsubscribe();
        done();
      }
    });

    store.dispatch(setLanguage(newLang));
  });
});
