import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { CartService } from '../../services/cart.service';
import { selectUser, selectIsAuthenticated } from '../../store/auth.selectors';
import * as AuthActions from '../../store/auth.actions';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, MatToolbar, MatIcon, MatButtonModule, MatMenuModule, MatDividerModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  cartService = inject(CartService);
  store = inject(Store);
  router = inject(Router);
  
  itemCount$ = this.cartService.itemCount$;
  user$ = this.store.select(selectUser);
  isAuthenticated$ = this.store.select(selectIsAuthenticated);

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/']);
  }
}
