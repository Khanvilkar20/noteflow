import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmData {
  title: string;
  message: string;
  confirmLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close(false)">Cancel</button>
      <button mat-flat-button color="warn" (click)="ref.close(true)">{{ data.confirmLabel || 'Delete' }}</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public ref: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmData
  ) {}
}
