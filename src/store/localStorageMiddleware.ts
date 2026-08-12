import { Middleware } from '@reduxjs/toolkit';
import cartReducer, {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from './cart/cartSlice';
import favoritesReducer, {
  addToFavorites,
  removeFromFavorites,
} from './favorites/favoritesSlice';

// Only the slices this middleware actually touches — deliberately not the
// full RootState, to avoid a circular type dependency with store.ts (this
// middleware is itself wired into configureStore there).
type PersistedState = {
  cart: ReturnType<typeof cartReducer>;
  favorites: ReturnType<typeof favoritesReducer>;
};

// Persisting to localStorage lives in one place instead of being copy-pasted
// into every reducer branch — the old context-based version forgot to persist
// on one of the cart branches because of that duplication.
const cartActionTypes = new Set<string>([
  addToCart.type,
  removeFromCart.type,
  updateQuantity.type,
  clearCart.type,
]);

const favoritesActionTypes = new Set<string>([
  addToFavorites.type,
  removeFromFavorites.type,
]);

export const localStorageMiddleware: Middleware =
  store => next => (action: unknown) => {
    const result = next(action);
    const state = store.getState() as PersistedState;
    const actionType = (action as { type: string }).type;

    if (cartActionTypes.has(actionType)) {
      localStorage.setItem('cart', JSON.stringify(state.cart.items));
    }

    if (favoritesActionTypes.has(actionType)) {
      localStorage.setItem('favorites', JSON.stringify(state.favorites.items));
    }

    return result;
  };
