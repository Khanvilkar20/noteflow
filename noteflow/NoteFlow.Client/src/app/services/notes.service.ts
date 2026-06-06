import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Note, NoteInput } from '../models/note';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/api/notes`;

  list(query?: string): Observable<Note[]> {
    let params = new HttpParams();
    if (query && query.trim()) params = params.set('q', query.trim());
    return this.http.get<Note[]>(this.base, { params });
  }

  create(input: NoteInput): Observable<Note> {
    return this.http.post<Note>(this.base, input);
  }

  update(id: string, input: NoteInput): Observable<Note> {
    return this.http.put<Note>(`${this.base}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
