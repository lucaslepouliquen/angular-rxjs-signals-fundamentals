import { computed, effect, Injectable, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})

export class CartService {
  cartItems = signal<CartItem[]>([]);
  cartCount = computed(() => this.cartItems()
  .reduce((acc, item) => acc + item.quantity, 0))

  subtotal = computed(() => this.cartItems()
  .reduce((acc,item) => acc + item.quantity*item.product.price, 0))

  deliveryFee = computed(() => this.subtotal() < 50 ? 5.99 : 0)

  tax = computed(() => Math.round(this.subtotal()*10.75)/100)

  totalPrice = computed(() => this.subtotal() + this.deliveryFee() + this.tax())

  eLength = effect(() => console.log('Cart array length:', this.cartItems().length));
  
  addToCart(product: Product): void {
    this.cartItems.update(items => [...items, {product, quantity: 1}])
  }

  removeItem(cartItem: CartItem): void {
    this.cartItems.update(items => items.filter(item => item.product.id !== cartItem.product.id))
  }

  updateQuantity(cartItem: CartItem, quantity:number) : void{
    this.cartItems.update(items => 
      items.map(item => item.product.id === cartItem.product.id ? {...item, quantity} : item))
  }
}
