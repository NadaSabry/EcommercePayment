export interface OrderDetailDTO {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  productImageUrl: string;
}

export interface OrderDTO {
  id: number;
  creationDate: string; // or `Date` if you parse it
  customerName: string;
  status: number;
  totalAmount: number;
  orderDetails: OrderDetailDTO[];
}