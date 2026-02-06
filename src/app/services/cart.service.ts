import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CartState, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import * as CartActions from '../store/cart.actions';
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
} from '../store/cart.selectors';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items$: Observable<CartItem[]>;
  total$: Observable<number>;
  itemCount$: Observable<number>;

  constructor(private store: Store<{ cart: CartState }>) {
    this.items$ = this.store.select(selectCartItems);
    this.total$ = this.store.select(selectCartTotal);
    this.itemCount$ = this.store.select(selectCartItemCount);
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.store.dispatch(CartActions.addToCart({ product, quantity }));
  }

  removeFromCart(productId: number): void {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
  }

  updateQuantity(productId: number, quantity: number): void {
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }
}

