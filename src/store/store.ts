import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/cartSlice';
import favoritesReducer from './favorites/favoritesSlice';
import searchReducer from './search/searchSlice';
import { productsApi } from './products/productsApi';
import { localStorageMiddleware } from './localStorageMiddleware';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    search: searchReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      localStorageMiddleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
