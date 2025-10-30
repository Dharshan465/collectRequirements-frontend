import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ViewEventService } from '../../../service/viewEvents/view-event-service';
import { Event, Request } from '../ld-view-event/ld-view-event';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LdAddRequestDialogComponent } from '../ld-add-request-dialog/ld-add-request-dialog';

@Component({
  selector: 'app-ld-edit-event',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './ld-edit-event.html',
  styleUrls: ['./ld-edit-event.css']
})
export class LdEditEventComponent implements OnInit {
  event: Event | null = null;
  requests: Request[] = [];
  loading = false;
  error: string | null = null;
  removingRequests: Set<number> = new Set();

  constructor(
    private route: ActivatedRoute,
    private viewEventService: ViewEventService,
    private dialog: MatDialog
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
    
    this.viewEventService.getEventById(eventId).subscribe({
      next: (event: Event) => {
        this.event = event;
        this.fetchEventRequests(eventId);
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.error = 'Failed to load event details. Please try again later.';
        this.loading = false;
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
          requestorId: req.requestorId || 0,
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

  saveEvent(): void {
    if (this.event) {
      this.loading = true;
      this.error = null;
      
      this.viewEventService.updateEvent(this.event.eventId, this.event).subscribe({
        next: () => {
          console.log('Event updated successfully');
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error updating event:', error);
          this.error = 'Failed to update event. Please try again later.';
          this.loading = false;
        }
      });
    }
  }

  addRequest(): void {
    if (!this.event) return;

    console.log('Opening add request dialog for event:', this.event.eventId);
    const dialogRef = this.dialog.open(LdAddRequestDialogComponent, {
      width: '1000px',
      data: { eventId: this.event.eventId }
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result === true) {
        // Refresh the requests list if a request was added
        this.fetchEventRequests(this.event!.eventId);
      }
    });
  }

  removeRequest(requestId: number): void {
    if (!this.event || this.isRemovingRequest(requestId)) return;

    this.removingRequests.add(requestId);
    this.error = null;

    this.viewEventService.removeRequestFromEvent(this.event.eventId, requestId).subscribe({
      next: () => {
        console.log('Request removed successfully');
        this.removingRequests.delete(requestId);
        // Remove the request from the list
        this.requests = this.requests.filter(r => r.requestId !== requestId);
      },
      error: (error: any) => {
        console.error('Error removing request:', error);
        this.error = error.error?.message || 'Failed to remove request. Please try again later.';
        this.removingRequests.delete(requestId);
      }
    });
  }

  isRemovingRequest(requestId: number): boolean {
    return this.removingRequests.has(requestId);
  }
}
