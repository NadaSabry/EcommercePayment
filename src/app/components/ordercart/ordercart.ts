import { Component } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { CommonModule } from '@angular/common';
import { Ecommerce } from '../../services/ecommerce';
import { OrderItemDTO } from '../../models/initPaymentDto';
import { MatDialog } from '@angular/material/dialog';
import { OrderConfirmDialog } from '../order-confirm-dialog/order-confirm-dialog';
declare const FawryPay: any;
declare const KedaPay: any;

@Component({
  selector: 'app-ordercart',
  imports: [CommonModule],
  templateUrl: './ordercart.html',
  styleUrl: './ordercart.scss'
})
export class Ordercart {
  finalResult: any;
  orderId: string | null = null;
  constructor(private _catService: CartService, private _ecommerceService: Ecommerce,
    private dialog: MatDialog
  ) { }
  get cart() {
    return this._catService.cart();
  }
  get cartTotal() {
    return this._catService.totalAmount();
  }

  initFawryPayPayment() {
    const chargeRequest = {
      merchantCode: 'dJWmdV+lPIE=',
      merchantRefNum: '2312465464',
      customerMobile: '01xxxxxxxxx',
      customerEmail: 'email@domain.com',
      customerName: 'Customer Name',
      customerProfileId: '1212',
      paymentExpiry: '1631138400000',
      chargeItems: [
        {
          itemId: '6b5fdea340e31b3b0339d4d4ae5',
          description: 'Product Description',
          price: 50.00,
          quantity: 2,
          imageUrl: 'https://developer.fawrystaging.com/photos/45566.jpg',
        },
        {
          itemId: '97092dd9e9c07888c7eef36',
          description: 'Product Description',
          price: 75.25,
          quantity: 3,
          imageUrl: 'https://developer.fawrystaging.com/photos/639855.jpg',
        },
      ],
      returnUrl: 'https://developer.fawrystaging.com', //my app url #TODO
      authCaptureModePayment: false,
      signature: "2ca4c078ab0d4c50ba90e31b3b0339d4d4ae5b32f97092dd9e9c07888c7eef36"
    };
    let finalResult;
    const configuration = {
      locale: "en",  //default en
      mode: DISPLAY_MODE.POPUP,  //required, allowed values [POPUP, INSIDE_PAGE, SIDE_PAGE , SEPARATED]
      onFailure: function (res: any) {
        finalResult = res;
      },
      onSuccess: function (res: any) {
        finalResult = res;
      }
    };
    const accessToken = 'your-access-token';
    // استدعاء دالة checkout من SDK
    FawryPay.checkout(chargeRequest, configuration, accessToken);
  }


  intiPaymentRequest() {
    const orderItems = this.cart.map(item => ({
      productId: item.id,
      quantity: item.quantity || 1
    }));
    const initPaymentRequest = {
      customerName: 'Customer Name',
      orderItemDTOs: orderItems
    };
    this._ecommerceService.initPayment(initPaymentRequest).subscribe(
      response => {
        this.orderId = response;
        console.log('Payment initialized successfully:', response);
      },
      error => {
        console.error('Error initializing payment:', error);
      }
    );
  }


  initkedaPayPayment() {
    const products: OrderItemDTO[] = this.cart.map(item => ({
      productId: item.id,
      quantity: item.quantity || 1
    }));
    const chargeRequest = {
      customerName: 'Nada',
      orderItemDTOs: products,
      returnUrl: 'http://localhost:4200', // Replace with your actual return URL my app url #TODO
      authCaptureModePayment: false, // Set to true if you want to capture payment immediately
    }
    let finalResult;
    const configuration = {
      locale: "en",  //default en
      mode: DISPLAY_MODE.POPUP,  //required, allowed values [POPUP, INSIDE_PAGE, SIDE_PAGE , SEPARATED]
      onFailure: function (res: any) {
        finalResult = res;
      },
      onSuccess: (res: any) => {
        const dialogRef = this.dialog.open(OrderConfirmDialog, {
          data: { orderId: 3, products: this.cart, totalAmount: this.cartTotal }
        });
      }
    };
    const accessToken = 'my-future-access-token';
    KedaPay.checkout(chargeRequest, configuration, accessToken);
  }


  // onSuccessPayment() {
  //   console.log('Payment successful:', this.finalResult);
  //   // Handle successful payment logic here, e.g., redirect to order confirmation page
  //   const dialogRef = this.dialog.open(OrderConfirmDialog, {
  //     data: { orderId: 3, products: this.cart, totalAmount: this.cartTotal }
  //   });
  // }
}

const DISPLAY_MODE = {
  POPUP: 'POPUP',
  INSIDE_PAGE: 'INSIDE_PAGE',
  SIDE_PAGE: 'SIDE_PAGE',
  SEPARATED: 'SEPARATED',
}

