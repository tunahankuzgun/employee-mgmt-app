import {assert} from '@open-wc/testing';
import {
  default as uiReducer,
  setViewMode,
  setCurrentPage,
  setItemsPerPage,
  resetPagination,
  setSearchQuery,
  selectViewMode,
  selectCurrentPage,
  selectItemsPerPage,
  selectSearchQuery,
} from '../src/store/slices/uiSlice.js';

suite('UI Slice', () => {
  suite('Reducers', () => {
    test('should return the initial state', () => {
      const state = uiReducer(undefined, {type: 'unknown'});
      assert.deepEqual(state, {
        viewMode: 'table',
        currentPage: 1,
        itemsPerPage: 10,
        searchQuery: '',
      });
    });

    test('should handle setViewMode to list', () => {
      const initialState = {
        viewMode: 'table',
        currentPage: 5,
        itemsPerPage: 10,
      };
      const state = uiReducer(initialState, setViewMode('list'));
      assert.equal(state.viewMode, 'list');
      assert.equal(state.itemsPerPage, 4);
      assert.equal(state.currentPage, 1);
    });

    test('should handle setViewMode to table', () => {
      const initialState = {
        viewMode: 'list',
        currentPage: 3,
        itemsPerPage: 4,
      };
      const state = uiReducer(initialState, setViewMode('table'));
      assert.equal(state.viewMode, 'table');
      assert.equal(state.itemsPerPage, 10);
      assert.equal(state.currentPage, 1);
    });

    test('should handle setCurrentPage', () => {
      const initialState = {
        viewMode: 'table',
        currentPage: 1,
        itemsPerPage: 10,
      };
      const state = uiReducer(initialState, setCurrentPage(3));
      assert.equal(state.currentPage, 3);
    });

    test('should handle setItemsPerPage', () => {
      const initialState = {
        viewMode: 'table',
        currentPage: 1,
        itemsPerPage: 10,
      };
      const state = uiReducer(initialState, setItemsPerPage(20));
      assert.equal(state.itemsPerPage, 20);
    });

    test('should handle resetPagination', () => {
      const initialState = {
        viewMode: 'table',
        currentPage: 5,
        itemsPerPage: 10,
      };
      const state = uiReducer(initialState, resetPagination());
      assert.equal(state.currentPage, 1);
      assert.equal(state.viewMode, 'table');
      assert.equal(state.itemsPerPage, 10);
    });

    test('should handle setSearchQuery', () => {
      const initialState = {
        viewMode: 'table',
        currentPage: 5,
        itemsPerPage: 10,
        searchQuery: '',
      };
      const state = uiReducer(initialState, setSearchQuery('test search'));
      assert.equal(state.searchQuery, 'test search');
      assert.equal(state.currentPage, 1);
    });

    test('should reset to page 1 when search query changes', () => {
      const initialState = {
        viewMode: 'table',
        currentPage: 3,
        itemsPerPage: 10,
        searchQuery: '',
      };
      const state = uiReducer(initialState, setSearchQuery('new search'));
      assert.equal(state.currentPage, 1);
    });
  });

  suite('Selectors', () => {
    test('should select viewMode', () => {
      const state = {
        ui: {
          viewMode: 'list',
          currentPage: 2,
          itemsPerPage: 4,
        },
      };
      assert.equal(selectViewMode(state), 'list');
    });

    test('should select currentPage', () => {
      const state = {
        ui: {
          viewMode: 'table',
          currentPage: 3,
          itemsPerPage: 10,
        },
      };
      assert.equal(selectCurrentPage(state), 3);
    });

    test('should select itemsPerPage', () => {
      const state = {
        ui: {
          viewMode: 'table',
          currentPage: 1,
          itemsPerPage: 10,
        },
      };
      assert.equal(selectItemsPerPage(state), 10);
    });

    test('should return default values when state is undefined', () => {
      const state = {};
      assert.equal(selectViewMode(state), 'table');
      assert.equal(selectCurrentPage(state), 1);
      assert.equal(selectItemsPerPage(state), 10);
      assert.equal(selectSearchQuery(state), '');
    });

    test('should select searchQuery', () => {
      const state = {
        ui: {
          viewMode: 'table',
          currentPage: 1,
          itemsPerPage: 10,
          searchQuery: 'test query',
        },
      };
      assert.equal(selectSearchQuery(state), 'test query');
    });
  });
});
