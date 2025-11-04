// src/app/modules/events/ld-delete-event/service/ld-delete-event-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../models/event';

@Injectable({
  providedIn: 'root'
})
export class LdDeleteEventService {
  private apiUrl = 'http://localhost:8080/events';

  constructor(private http: HttpClient) {}

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  getRequestsByEventId(eventId: number): Observable<any[]> {
    // backend endpoint suggested: GET /events/{id}/requests
    return this.http.get<any[]>(`${this.apiUrl}/${eventId}/requests`);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
