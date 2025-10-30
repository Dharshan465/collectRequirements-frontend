// src/app/modules/events/ld-events/ld-events.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { addEvent } from '../../models/add-event'; // Updated import path and name

// Define an interface for the filter parameters
export interface EventFilter {
  searchTerm?: string;
  description?: string;
  eventType?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LdEventsService {
  private apiUrl = 'http://localhost:8080/events';

  constructor(private http: HttpClient) { }

  /**
   * Fetches all events from the backend API, with optional filters.
   * @param filters Optional object containing filter criteria.
   * @returns An Observable that emits an array of addEvent objects.
   */
  getAllEvents(filters?: EventFilter): Observable<addEvent[]> { // Use addEvent[]
    let params = new HttpParams();

    if (filters) {
      if (filters.searchTerm) {
        params = params.set('searchTerm', filters.searchTerm);
      }
      if (filters.description) {
        params = params.set('description', filters.description);
      }
      if (filters.eventType) {
        params = params.set('eventType', filters.eventType);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
    }

    return this.http.get<addEvent[]>(this.apiUrl, { params }); // Use addEvent[]
  }
}
