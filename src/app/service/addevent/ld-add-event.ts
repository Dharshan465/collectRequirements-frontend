import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventCreationRequestDTO } from '../../models/event-creation-request-dto';
import { addRequestToEvent } from '../../models/add-request-to-event'; 
import { addEvent } from '../../models/add-event'; 

@Injectable({
  providedIn: 'root'
})
export class LdAddEventService {
  private apiUrl = 'http://localhost:8080/events';

  constructor(private http: HttpClient) { }

  
  createEvent(eventData: EventCreationRequestDTO): Observable<addEvent> { 
    return this.http.post<addEvent>(this.apiUrl, eventData); 
  }

  
  getAllNewApprovedRequestsNotAssignedToEvent(): Observable<addRequestToEvent[]> { 
    return this.http.get<addRequestToEvent[]>(`${this.apiUrl}/newApprovedRequestsNotAssignedToEvent`); 
  }

 
  getRequestById(requestId: number): Observable<addRequestToEvent> { 
    return this.http.get<addRequestToEvent>(`${this.apiUrl}/requestid/${requestId}`); 
  }

  
  getRequestByName(requestName: string): Observable<addRequestToEvent[]> { 
    return this.http.get<addRequestToEvent[]>(`${this.apiUrl}/requestname/${requestName}`); 
  }
}
