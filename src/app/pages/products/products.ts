import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/product.services';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-products-catalog',
  imports: [CommonModule, RouterModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsCatalog {
  productsService = inject(ProductsService);
  loading = this.productsService.loading;
  ngOnInit() {
    this.productsService.loadProducts();
  }
}
