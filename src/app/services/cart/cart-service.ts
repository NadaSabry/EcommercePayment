import { Injectable, signal } from '@angular/core';
import { ProductDto } from '../../models/productDto';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = signal<ProductDto[]>([]);
  totalAmount = signal<number>(0);

  addProduct(product: ProductDto) {
  const existingProduct = this.cart().find(p => p.id === product.id);
  if (existingProduct) {
    this.cart.update(currentCart =>
      currentCart.map(p =>
        p.id === product.id
          ? { ...p, quantity: (p.quantity || 0) + 1 }
          : p
      )
    );
  } else {
    this.cart.update(currentCart => [...currentCart, { ...product, quantity: product.quantity || 1 }]);
  }
  this.totalAmount.update(amount => amount + (product.price || 0));
}

 removeProduct(productId: number) {
  const existingProduct = this.cart().find(p => p.id === productId);
  const quantity = existingProduct?.quantity || 0;
  if (existingProduct && quantity > 1) {
    // Use update to decrement quantity
    this.cart.update(currentCart =>
      currentCart.map(p =>
        p.id === productId
          ? { ...p, quantity: (p.quantity || 0) - 1 }
          : p
      )
    );
  } else if (existingProduct) {
    // Remove product from cart
    this.cart.update(currentCart => currentCart.filter(p => p.id !== productId));
  }
  this.totalAmount.update(amount => amount - (existingProduct?.price || 0));
}
}
