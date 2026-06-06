import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Note, NoteInput } from '../../models/note';

export interface NoteDialogData {
  note?: Note;
}

@Component({
  selector: 'app-note-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.note ? 'Edit note' : 'New note' }}</h2>
    <mat-dialog-content class="dialog-content">
      <mat-form-field appearance="outline" class="full">
        <mat-label>Title</mat-label>
        <input matInput [(ngModel)]="title" maxlength="120" autocomplete="off" cdkFocusInitial>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full">
        <mat-label>Body</mat-label>
        <textarea matInput [(ngModel)]="body" rows="8"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="!canSave()" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content { display: flex; flex-direction: column; min-width: 420px; padding-top: 8px; }
    .full { width: 100%; }
    @media (max-width: 540px) { .dialog-content { min-width: 0; width: 80vw; } }
  `]
})
export class NoteDialogComponent {
  title = '';
  body = '';

  constructor(
    private ref: MatDialogRef<NoteDialogComponent, NoteInput | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: NoteDialogData
  ) {
    if (data.note) {
      this.title = data.note.title;
      this.body = data.note.body;
    }
  }

  canSave(): boolean {
    return this.title.trim().length > 0 || this.body.trim().length > 0;
  }

  save(): void {
    this.ref.close({ title: this.title.trim(), body: this.body.trim() });
  }

  cancel(): void { this.ref.close(); }
}
