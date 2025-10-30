import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, Request } from '../../modules/events/ld-view-event/ld-view-event';

@Injectable({
  providedIn: 'root'
})
export class ViewEventService {
  private baseUrl = 'http://localhost:8080';  // Updated to include /api

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getEventById(id: number): Observable<Event> {
    const url = `${this.baseUrl}/events/${id}`;
    console.log('Fetching event from:', url);
    return this.http.get<Event>(url, this.httpOptions);
  }

  getEventRequests(id: number): Observable<Request[]> {
    const url = `${this.baseUrl}/events/${id}/requests`;
    console.log('Fetching requests from:', url);
    return this.http.get<Request[]>(url, this.httpOptions);
  }

  updateEvent(id: number, event: Event): Observable<void> {
    const url = `${this.baseUrl}/events/${id}`;
    return this.http.put<void>(url, event, this.httpOptions);
  }

  getNewApprovedRequests(): Observable<Request[]> {
    const url = `${this.baseUrl}/events/newApprovedRequestsNotAssignedToEvent`;
    console.log('Fetching approved requests from:', url);
    return this.http.get<Request[]>(url, this.httpOptions);
  }

  addRequestToEvent(eventId: number, requestId: number): Observable<void> {
    const url = `${this.baseUrl}/events/${eventId}/requests/${requestId}/add`;
    return this.http.put<void>(url, {}, this.httpOptions);
  }

  removeRequestFromEvent(eventId: number, requestId: number): Observable<void> {
    const url = `${this.baseUrl}/events/${eventId}/requests/${requestId}/remove`;
    return this.http.put<void>(url, {}, this.httpOptions);
  }
}
