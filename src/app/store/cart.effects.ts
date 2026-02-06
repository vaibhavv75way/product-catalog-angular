import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { CartState } from '../models/cart.model';
import { tap, map } from 'rxjs/operators';

const CART_STORAGE_KEY = 'app-cart';

@Injectable({ providedIn: 'root' })
export class CartEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<{ cart: CartState }>);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCartFromLocalStorage),
      map(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          try {
            const cart: CartState = JSON.parse(savedCart);
            return CartActions.loadCartFromLocalStorageSuccess({ cart });
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            return CartActions.loadCartFromLocalStorageSuccess({
              cart: { items: [] },
            });
          }
        }
        return CartActions.loadCartFromLocalStorageSuccess({
          cart: { items: [] },
        });
      })
    )
  );

  saveCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.addToCart,
          CartActions.removeFromCart,
          CartActions.updateQuantity,
          CartActions.clearCart
        ),
        tap(() => {
          this.store
            .select(state => state.cart)
            .pipe(
              tap(cart => {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
              })
            )
            .subscribe();
        })
      ),
    { dispatch: false }
  );
}

