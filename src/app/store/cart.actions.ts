import { createAction, props } from '@ngrx/store';
import { Product } from '../models/product.model';
import { CartItem, CartState } from '../models/cart.model';

export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ product: Product; quantity: number }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ productId: number }>()
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: number; quantity: number }>()
);

export const clearCart = createAction(
  '[Cart] Clear Cart'
);

export const loadCartFromLocalStorage = createAction(
  '[Cart] Load From LocalStorage'
);

export const loadCartFromLocalStorageSuccess = createAction(
  '[Cart] Load From LocalStorage Success',
  props<{ cart: CartState }>()
);

export const saveCartToLocalStorage = createAction(
  '[Cart] Save To LocalStorage',
  props<{ cart: CartState }>()
);
