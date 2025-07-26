import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Products } from "./components/products/products";
import { Ordercart } from "./components/ordercart/ordercart";

@Component({
  selector: 'app-root',
  imports: [Ordercart, Products],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'EcommercePayment';
}
