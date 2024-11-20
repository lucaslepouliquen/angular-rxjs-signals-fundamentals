import { Component } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';
import { CartService } from '../cart.service';
import { inject } from '@angular/core';

@Component({
  selector: 'sw-cart-total',
  templateUrl: './cart-total.component.html',
  standalone: true,
  imports: [NgIf, CurrencyPipe]
})
export class CartTotalComponent {
  private cartService = inject(CartService);
  
  cartItems = this.cartService.cartItems
  subTotal = this.cartService.subtotal
  deliveryFee = this.cartService.deliveryFee
  tax = this.cartService.tax
  totalPrice = this.cartService.totalPrice

}

