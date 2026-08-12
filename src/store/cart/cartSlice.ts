import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartProducts } from '../../types/CartProduct';

function loadCartFromStorage(): CartProducts[] {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
}

type CartState = {
  items: CartProducts[];
};

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartProducts>) {
      const existing = state.items.find(item => item.id === action.payload.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    removeFromCart(state, action: PayloadAction<string>) {
      // Immer drafts allow reassigning a slice of state directly; the
      // shared eslint config doesn't know that, hence the disable.
      // eslint-disable-next-line no-param-reassign
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) {
      const item = state.items.find(i => i.id === action.payload.id);

      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    clearCart(state) {
      // eslint-disable-next-line no-param-reassign
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
