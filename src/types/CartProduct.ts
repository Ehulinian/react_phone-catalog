import { Product } from './Product';

// A cart item is just a Product snapshot (price frozen at add-time) plus quantity.
// Extending Product instead of duplicating its fields keeps the two types in sync.
export type CartProducts = Product & {
  quantity: number;
};
