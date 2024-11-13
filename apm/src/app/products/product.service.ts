import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, of, map, switchMap, shareReplay, BehaviorSubject, filter } from 'rxjs';
import { Product } from './product';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);
  private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  readonly productSelected$ = this.productSelectedSubject.asObservable()

  readonly products$ = this.getProducts().pipe(
    catchError(err => this.handleError(err))
  );
  
  readonly product$ = this.productSelected$
  .pipe(
    filter(Boolean),
    switchMap( id => {
      const productUrl = `${this.productsUrl}/${id}`;
      return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        map(products => products.find(product => product.id === id)),
        switchMap(product => product ? this.getProductWithReviews(product) : of(undefined)),
        catchError(err => this.handleError(err))
      );
    })  
  );


  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
          tap(() => console.log('In http.get pipeline')),
          catchError(err => this.handleError(err))
      );
  }

  private getProductWithReviews(product: Product): Observable<Product>{
    if(product.hasReviews){
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
      .pipe(
        map(reviews => ({...product, reviews} as Product)),
      )
    } else {
      return of(product);
    }
  }

  productSelected(selectedProductId: number):void{
    this.productSelectedSubject.next(selectedProductId);
  } 

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    throw formattedMessage;
  }
}

