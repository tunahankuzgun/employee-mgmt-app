import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  viewMode: 'table',
  currentPage: 1,
  itemsPerPage: 10,
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
      state.itemsPerPage = action.payload === 'list' ? 4 : 10;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    resetPagination: (state) => {
      state.currentPage = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
  },
});

export const {
  setViewMode,
  setCurrentPage,
  setItemsPerPage,
  resetPagination,
  setSearchQuery,
} = uiSlice.actions;

export const selectViewMode = (state) => state.ui?.viewMode || 'table';
export const selectCurrentPage = (state) => state.ui?.currentPage || 1;
export const selectItemsPerPage = (state) => state.ui?.itemsPerPage || 10;
export const selectSearchQuery = (state) => state.ui?.searchQuery || '';

export default uiSlice.reducer;
