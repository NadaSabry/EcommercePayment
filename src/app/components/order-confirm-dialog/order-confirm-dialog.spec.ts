import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmDialog } from './order-confirm-dialog';

describe('OrderConfirmDialog', () => {
  let component: OrderConfirmDialog;
  let fixture: ComponentFixture<OrderConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderConfirmDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
