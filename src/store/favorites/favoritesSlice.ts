import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/Product';

function loadFavoritesFromStorage(): Product[] {
  try {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  } catch {
    return [];
  }
}

type FavoritesState = {
  items: Product[];
};

const initialState: FavoritesState = {
  items: loadFavoritesFromStorage(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites(state, action: PayloadAction<Product>) {
      const alreadyExists = state.items.some(
        item => item.id === action.payload.id,
      );

      if (!alreadyExists) {
        state.items.push(action.payload);
      }
    },

    removeFromFavorites(state, action: PayloadAction<string>) {
      // eslint-disable-next-line no-param-reassign
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
