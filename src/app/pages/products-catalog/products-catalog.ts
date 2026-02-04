import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Product } from '../../models/product-model';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/productServices';

@Component({
  selector: 'app-products-catalog',
  imports: [CommonModule],
  templateUrl: './products-catalog.html',
  styleUrl: './products-catalog.css',
})
export class ProductsCatalog {
  productsService = inject(ProductsService);

  ngOnInit() {
    
    this.productsService.loadProducts();
  }
}
