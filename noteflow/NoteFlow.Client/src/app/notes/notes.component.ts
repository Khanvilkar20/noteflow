import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, debounceTime, distinctUntilChanged, switchMap, BehaviorSubject } from 'rxjs';

import { NotesService } from '../services/notes.service';
import { Note, NoteInput } from '../models/note';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatToolbarModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatCardModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <mat-toolbar class="topbar">
      <div class="brand">
        <span class="brand-mark">N</span>
        <span class="brand-name">NoteFlow</span>
      </div>
      <span class="spacer"></span>
      <button mat-flat-button color="primary" (click)="openCreate()">
        <mat-icon>add</mat-icon>
        New note
      </button>
    </mat-toolbar>

    <main class="page">
      <mat-form-field appearance="outline" class="search">
        <mat-icon matPrefix>search</mat-icon>
        <mat-label>Search notes</mat-label>
        <input matInput [(ngModel)]="query" (ngModelChange)="onSearch($event)" autocomplete="off">
      </mat-form-field>

      <div class="state" *ngIf="loading">
        <mat-spinner diameter="32"></mat-spinner>
      </div>

      <div class="empty" *ngIf="!loading && notes.length === 0">
        <mat-icon>note_add</mat-icon>
        <h3>{{ query ? 'No matching notes' : 'Your notes will appear here' }}</h3>
        <p *ngIf="!query">Create your first note to get started.</p>
      </div>

      <div class="grid">
        <mat-card class="note-card" *ngFor="let n of notes; trackBy: trackById">
          <mat-card-header>
            <mat-card-title class="title">{{ n.title || 'Untitled' }}</mat-card-title>
            <mat-card-subtitle>{{ n.updatedAt | date:'MMM d, y, h:mm a' }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="body">{{ n.body }}</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-icon-button aria-label="Edit" (click)="openEdit(n)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button aria-label="Delete" (click)="confirmDelete(n)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </main>
  `,
  styles: [`
    .topbar {
      background: #ffffff;
      color: #111827;
      border-bottom: 1px solid #e5e7eb;
      position: sticky; top: 0; z-index: 10;
    }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-mark {
      display: inline-flex; align-items: center; justify-content: center;
      width: 30px; height: 30px; border-radius: 8px;
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      color: #fff; font-weight: 700;
    }
    .brand-name { font-weight: 600; letter-spacing: -0.01em; }
    .spacer { flex: 1; }
    .page { max-width: 1100px; margin: 0 auto; padding: 28px 20px 64px; }
    .search { width: 100%; max-width: 520px; display: block; margin-bottom: 24px; }
    .grid {
      display: grid; gap: 18px;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    }
    .note-card {
      border-radius: 14px !important;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.04) !important;
      transition: transform .15s ease, box-shadow .15s ease;
    }
    .note-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(15, 23, 42, 0.05), 0 10px 24px rgba(15, 23, 42, 0.08) !important;
    }
    .title { font-weight: 600; }
    .body {
      white-space: pre-wrap; color: #374151; margin: 4px 0 0;
      display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden;
    }
    .state { display: flex; justify-content: center; padding: 48px 0; }
    .empty {
      text-align: center; padding: 64px 16px; color: #6b7280;
    }
    .empty mat-icon { font-size: 40px; width: 40px; height: 40px; color: #9ca3af; }
    .empty h3 { margin: 12px 0 4px; color: #374151; }
  `]
})
export class NotesComponent implements OnInit {
  private api = inject(NotesService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  notes: Note[] = [];
  query = '';
  loading = false;
  private search$ = new BehaviorSubject<string>('');

  ngOnInit(): void {
    this.search$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(q => {
          this.loading = true;
          return this.api.list(q);
        })
      )
      .subscribe({
        next: notes => { this.notes = notes; this.loading = false; },
        error: () => { this.loading = false; this.snack.open('Could not load notes', 'Dismiss', { duration: 3000 }); }
      });
  }

  onSearch(value: string): void { this.search$.next(value); }
  refresh(): void { this.search$.next(this.query); }
  trackById(_: number, n: Note): string { return n.id; }

  openCreate(): void {
    const ref = this.dialog.open(NoteDialogComponent, { data: {}, autoFocus: false });
    ref.afterClosed().subscribe((input: NoteInput | undefined) => {
      if (!input) return;
      this.api.create(input).subscribe({
        next: () => { this.snack.open('Note created', '', { duration: 1500 }); this.refresh(); },
        error: () => this.snack.open('Create failed', 'Dismiss', { duration: 3000 })
      });
    });
  }

  openEdit(note: Note): void {
    const ref = this.dialog.open(NoteDialogComponent, { data: { note }, autoFocus: false });
    ref.afterClosed().subscribe((input: NoteInput | undefined) => {
      if (!input) return;
      this.api.update(note.id, input).subscribe({
        next: () => { this.snack.open('Note updated', '', { duration: 1500 }); this.refresh(); },
        error: () => this.snack.open('Update failed', 'Dismiss', { duration: 3000 })
      });
    });
  }

  confirmDelete(note: Note): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete this note?',
        message: 'This action cannot be undone.',
        confirmLabel: 'Delete'
      }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.api.delete(note.id).subscribe({
        next: () => { this.snack.open('Note deleted', '', { duration: 1500 }); this.refresh(); },
        error: () => this.snack.open('Delete failed', 'Dismiss', { duration: 3000 })
      });
    });
  }
}
