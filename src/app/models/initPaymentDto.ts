export interface OrderItemDTO {
  productId: number;
  quantity: number;
}

export interface InitPaymentRequestDTO {
  customerName: string;
  orderItemDTOs: OrderItemDTO[];
}