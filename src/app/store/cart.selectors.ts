import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState, CartItem } from '../models/cart.model';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items
);

export const selectCartItemCount = createSelector(
  selectCartItems,
  (items: CartItem[]) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartTotal = createSelector(
  selectCartItems,
  (items: CartItem[]) =>
    items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
);

export const selectCartItemCount$ = createSelector(
  selectCartItems,
  (items: CartItem[]) => items.length
);

export const selectIsProductInCart = (productId: number) =>
  createSelector(
    selectCartItems,
    (items: CartItem[]) => items.some(item => item.product.id === productId)
  );

export const selectProductQuantity = (productId: number) =>
  createSelector(
    selectCartItems,
    (items: CartItem[]) =>
      items.find(item => item.product.id === productId)?.quantity ?? 0
  );
