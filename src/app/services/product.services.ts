import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { finalize, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'https://fakestoreapi.com/products';

  products = signal<Product[]>([]);
  product = signal<Product | null>(null);
  loading = signal(false);

  constructor(private http: HttpClient) { }

  loadProducts() {
    this.loading.set(true);

    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  loadSingleProduct(id: number): Observable<Product> {
    this.loading.set(true);

    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap(product => this.product.set(product)),
      finalize(() => this.loading.set(false))
    );
  }

}