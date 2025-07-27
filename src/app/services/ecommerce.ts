import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDto } from '../models/productDto';
import { InitPaymentRequestDTO } from '../models/initPaymentDto';

@Injectable({
  providedIn: 'root'
})
export class Ecommerce {
  constructor(private https:HttpClient) {}

  API_URL = '/api/proxy-product'//'http://sweete-commerce.somee.com/api';

  getProducts():Observable<ProductDto[]> { 
    return this.https.get<ProductDto[]>(`${this.API_URL}`);
  } 
  initPayment(products: InitPaymentRequestDTO): Observable<any> {
    return this.https.post(`${this.API_URL}`, { products });
  }
}
