import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewEventService } from '../../../service/viewEvents/view-event-service';

export interface Event {
  eventId: number;
  eventName: string;
  description: string;
  participantsCount: number;
  duration: string;
  eventType: string;
  fundingSource: string;
}

export interface Request {
  requestId: number;
  requestorId: number;
  departmentId: number;
  departmentName: string;
  eventId: number;
  requestDate: string;
  requestStatus: string;
  groupRequest: boolean;
  justification: string;
  noOfAssociates: number;
  tanNumber: string;
  curriculumLink: string;
}

@Component({
  selector: 'app-ld-view-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ld-view-event.html',
  styleUrls: ['./ld-view-event.css']
})
export class LdViewEventComponent implements OnInit {
  event: Event | null = null;
  requests: Request[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private viewEventService: ViewEventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.fetchEventData(parseInt(eventId, 10));
    }
  }

  private fetchEventData(eventId: number): void {
    this.loading = true;
    this.error = null;
    console.log('Fetching event data for ID:', eventId);
    
    this.viewEventService.getEventById(eventId).subscribe({
      next: (response: any) => {
        console.log('Received event data:', response);
        // Handle both direct event data and wrapped responses
        const eventData = response.data || response;
        
        this.event = {
          eventId: eventData.eventId || eventData.id || 0,
          eventName: eventData.eventName || eventData.name || '',
          description: eventData.description || '',
          participantsCount: eventData.participantsCount || 0,
          duration: eventData.duration || '',
          eventType: eventData.eventType || '',
          fundingSource: eventData.fundingSource || ''
        };
        
        this.fetchEventRequests(eventId);
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.error = error.error?.message || 'Failed to load event details. Please try again later.';
        this.loading = false;
        this.event = null;
      }
    });
  }

  private fetchEventRequests(eventId: number): void {
    console.log('Fetching requests for event ID:', eventId);
    
    this.viewEventService.getEventRequests(eventId).subscribe({
      next: (response: any) => {
        console.log('Received requests data:', response);
        // Handle both direct array and wrapped responses
        const requestsData = response.data || response || [];
        
        this.requests = requestsData.map((req: any) => ({
          requestId: req.requestId || req.id || 0,
          requestorId: req.user.userId || 0,
          departmentId: req.department.departmentId || 0,
          departmentName: req.departmentName || '',
          eventId: req.eventId || 0,
          requestDate: req.requestDate || '',
          requestStatus: req.requestStatus || '',
          groupRequest: Boolean(req.groupRequest),
          justification: req.justification || '',
          noOfAssociates: req.noOfParticipants || 0,
          tanNumber: req.tan_Number || '',
          curriculumLink: req.curriculamLink || ''
        }));
        
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.error = error.error?.message || 'Failed to load event requests. Please try again later.';
        this.loading = false;
        this.requests = [];
      }
    });
  }

  navigateToEditEvent(): void {
    const eventId = this.event?.eventId;
    if (eventId) {
      this.router.navigate([`/events/edit/${eventId}`]);
    }
  }
}