import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../services/product.services';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, distinctUntilChanged, EMPTY, filter, map, Observable, switchMap } from 'rxjs';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-single-product',
  imports: [CommonModule, RouterModule],
  templateUrl: './single-product.html',
  styleUrl: './single-product.css',
})
export class SingleProduct {
  productsService = inject(ProductsService);
  cartService = inject(CartService);
  product$!: Observable<Product>;
  quantity = 1;
  addedToCart = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  increase() {
    this.quantity++;
  }

  decrease() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    this.product$.pipe(
      switchMap(product => {
        this.cartService.addToCart(product, this.quantity);
        this.addedToCart = true;
       
        setTimeout(() => {
          this.addedToCart = false;
        }, 2000);
        
        return EMPTY;
      })
    ).subscribe();
  }

  buyNow() {
    this.product$.pipe(
      switchMap(product => {
        this.cartService.addToCart(product, this.quantity);
        this.router.navigate(['/cart']);
        return EMPTY;
      })
    ).subscribe();
  }

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      filter(id => !isNaN(id)),
      distinctUntilChanged(),
      switchMap(id =>
        this.productsService.loadSingleProduct(id).pipe(
          catchError(() => EMPTY)
        )
      )
    );
  }

}

