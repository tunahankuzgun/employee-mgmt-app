import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  viewMode: 'table',
  currentPage: 1,
  itemsPerPage: 10,
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
  },
});

export const {setViewMode, setCurrentPage, setItemsPerPage, resetPagination} =
  uiSlice.actions;

export const selectViewMode = (state) => state.ui?.viewMode || 'table';
export const selectCurrentPage = (state) => state.ui?.currentPage || 1;
export const selectItemsPerPage = (state) => state.ui?.itemsPerPage || 10;

export default uiSlice.reducer;
