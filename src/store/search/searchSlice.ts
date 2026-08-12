import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SearchState = {
  term: string;
};

const initialState: SearchState = {
  term: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      // eslint-disable-next-line no-param-reassign
      state.term = action.payload;
    },

    clearSearchTerm(state) {
      // eslint-disable-next-line no-param-reassign
      state.term = '';
    },
  },
});

export const { setSearchTerm, clearSearchTerm } = searchSlice.actions;

export default searchSlice.reducer;
