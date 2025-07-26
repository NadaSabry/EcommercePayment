import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-order-confirm-dialog',
  imports: [CurrencyPipe],
  templateUrl: './order-confirm-dialog.html',
  styleUrl: './order-confirm-dialog.scss'
})
export class OrderConfirmDialog {

  readonly data = inject<any>(MAT_DIALOG_DATA);
  constructor(private dialogRef: MatDialogRef<OrderConfirmDialog>) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
