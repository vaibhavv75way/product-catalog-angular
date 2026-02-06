import { createReducer, on } from '@ngrx/store';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCartFromLocalStorageSuccess,
} from './cart.actions';
import { CartState } from '../models/cart.model';

export const initialCartState: CartState = {
  items: [],
};

export const cartReducer = createReducer(
  initialCartState,

  on(loadCartFromLocalStorageSuccess, (state, { cart }) => {
    return cart;
  }),

  on(addToCart, (state, { product, quantity }) => {
    const existing = state.items.find(item => item.product.id === product.id);

    if (existing) {
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      };
    }

    return {
      ...state,
      items: [
        ...state.items,
        {
          product,
          quantity,
        },
      ],
    };
  }),

  on(removeFromCart, (state, { productId }) => {
    return {
      ...state,
      items: state.items.filter(item => item.product.id !== productId),
    };
  }),

  on(updateQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== productId),
      };
    }

    return {
      ...state,
      items: state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ),
    };
  }),

  on(clearCart, () => {
    return initialCartState;
  })
);
