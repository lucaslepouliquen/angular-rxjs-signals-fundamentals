import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  private http = inject(HttpClient);

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(() => console.log('In http.get pipeline')),
        catchError(this.handleError)
      );
  }

  getProduct(id: number): Observable<Product>{
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url)
      .pipe(
        tap(() => console.log('In http.get pipeline')),
        catchError(this.handleError));
  }

  private handleError(err: any): Observable<never> {
    console.error(err);
    return throwError(() => new Error('An error occurred while fetching products.'));
  }
}

