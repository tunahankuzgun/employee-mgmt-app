import {store} from '../store/index.js';
import {
  setLanguage,
  selectCurrentLanguage,
} from '../store/slices/languageSlice.js';

/**
 * Redux Store Mixin for LitElement components
 * Provides Redux store integration with automatic re-rendering on state changes
 */
export const ReduxMixin = (superClass) =>
  class extends superClass {
    constructor() {
      super();
      this._storeUnsubscribe = null;
      this._previousState = null;
    }

    connectedCallback() {
      super.connectedCallback();

      this._storeUnsubscribe = store.subscribe(() => {
        const currentState = store.getState();

        if (this._previousState !== currentState) {
          this._previousState = currentState;
          this.stateChanged(currentState);
          this.requestUpdate();
        }
      });

      this._previousState = store.getState();
      this.stateChanged(this._previousState);
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      if (this._storeUnsubscribe) {
        this._storeUnsubscribe();
      }
    }

    /**
     * Called when Redux store state changes
     * Override this method in components to handle state changes
     * @param {Object} state - Current Redux state
     */
    // eslint-disable-next-line no-unused-vars
    stateChanged(state) {}

    /**
     * Get current Redux store state
     * @returns {Object} Current Redux state
     */
    getState() {
      return store.getState();
    }

    /**
     * Dispatch action to Redux store
     * @param {Object} action - Redux action to dispatch
     */
    dispatch(action) {
      store.dispatch(action);
    }

    /**
     * Get current language from Redux store
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
      return selectCurrentLanguage(this.getState());
    }

    /**
     * Change language via Redux store
     * @param {string} language - Language code to change to
     */
    changeLanguage(language) {
      this.dispatch(setLanguage(language));
    }
  };
