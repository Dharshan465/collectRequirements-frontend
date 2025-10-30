// src/app/modules/events/ld-add-event/ld-add-event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventCreationRequestDTO } from '../../models/event-creation-request-dto';
import { addRequestToEvent } from '../../models/add-request-to-event'; // Updated import path and name
import { addEvent } from '../../models/add-event'; // Updated import path and name

@Injectable({
  providedIn: 'root'
})
export class LdAddEventService {
  private apiUrl = 'http://localhost:8080/events';

  constructor(private http: HttpClient) { }

  /**
   * Creates a new event by sending the event details and selected request IDs to the backend.
   * @param eventData The EventCreationRequestDTO containing new event details and request IDs.
   * @returns An Observable of the created addEvent.
   */
  createEvent(eventData: EventCreationRequestDTO): Observable<addEvent> { // Use addEvent
    return this.http.post<addEvent>(this.apiUrl, eventData); // Use addEvent
  }

  /**
   * Fetches all newly approved requests that are not yet assigned to any event.
   * @returns An Observable that emits a list of addRequestToEvent objects.
   */
  getAllNewApprovedRequestsNotAssignedToEvent(): Observable<addRequestToEvent[]> { // Use addRequestToEvent[]
    return this.http.get<addRequestToEvent[]>(`${this.apiUrl}/newApprovedRequestsNotAssignedToEvent`); // Use addRequestToEvent[]
  }

  /**
   * Searches for a request by its ID.
   * @param requestId The ID of the request to search for.
   * @returns An Observable that emits a single addRequestToEvent object.
   */
  getRequestById(requestId: number): Observable<addRequestToEvent> { // Use addRequestToEvent
    return this.http.get<addRequestToEvent>(`${this.apiUrl}/requestid/${requestId}`); // Use addRequestToEvent
  }

  /**
   * Searches for requests by name (justification).
   * @param requestName The name (justification) to search for.
   * @returns An Observable that emits a list of addRequestToEvent objects.
   */
  getRequestByName(requestName: string): Observable<addRequestToEvent[]> { // Use addRequestToEvent[]
    return this.http.get<addRequestToEvent[]>(`${this.apiUrl}/requestname/${requestName}`); // Use addRequestToEvent[]
  }
}
