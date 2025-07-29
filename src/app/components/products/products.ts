import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Ecommerce } from '../../services/ecommerce';
import { ProductDto } from '../../models/productDto';
import { CartService } from '../../services/cart/cart-service';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {

  constructor(private ecommerceService: Ecommerce, public _catService: CartService) { }
  products: ProductDto[] = [];

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.ecommerceService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  addToCart(product: ProductDto) {
    product.quantity = 1; // Default quantity if not specified
    this._catService.addProduct(product);
  }
  addQuant(product: ProductDto) {
    if (product.quantity) {
      product.quantity++;
      this._catService.addProduct(product);
    }
  }
  removeQuant(product: ProductDto) {
    if (product.quantity && product.quantity > 0) {
      product.quantity--;
      this._catService.removeProduct(product.id);
    }
  }

}
