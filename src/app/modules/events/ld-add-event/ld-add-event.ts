// src/app/modules/events/ld-add-event/ld-add-event.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { LdAddEventService } from '../../../service/addevent/ld-add-event';
import { addEvent } from '../../../models/add-event';
import { addRequestToEvent } from '../../../models/add-request-to-event';
import { EventCreationRequestDTO } from '../../../models/event-creation-request-dto';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-ld-add-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: './ld-add-event.html',
  styleUrl: './ld-add-event.css',
  providers: [LdAddEventService]
})
export class LdAddEvent implements OnInit, OnDestroy {
  newEvent: addEvent = {
    eventName: '',
    description: '',
    duration: 0,
    eventType: '',
    fundingSource: '',
    status: 'READY'
  };

  selectedRequests: addRequestToEvent[] = [];
  availableRequests: addRequestToEvent[] = [];
  requestSearchTerm: string = '';
  searchById: boolean = true;

  isLoading: boolean = false;
  submitError: string | null = null;
  searchError: string | null = null;

  private requestSearchTerms = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(
    private ldAddEventService: LdAddEventService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.requestSearchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(term => {
        if (term.trim() !== '') {
          this.searchRequests();
        } else {
          this.availableRequests = [];
        }
      })
    );
  }

  onSubmit(): void {
    this.isLoading = true;
    this.submitError = null;

    if (this.selectedRequests.length === 0) {
      this.submitError = 'Please select at least one request for the event.';
      this.isLoading = false;
      return;
    }

    // Map selected requests to an array of their IDs
    const selectedRequestIds = this.selectedRequests.map(req => req.requestId); // Still use requestId from addRequestToEvent model

    const eventCreationPayload: EventCreationRequestDTO = {
      newEvent: this.newEvent,
      requests: selectedRequestIds // <--- CHANGED THIS TO 'requests'
    };

    this.ldAddEventService.createEvent(eventCreationPayload).subscribe({
      next: (createdEvent: addEvent) => {
        console.log('Event created successfully:', createdEvent);
        this.isLoading = false;
        this.router.navigate(['/ld-events']);
      },
      error: (err: any) => {
        console.error('Error creating event:', err);
        this.submitError = 'Failed to create event. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onSearchTermChange(term: string): void {
    this.requestSearchTerms.next(term);
  }

  searchRequests(): void {
    const term = this.requestSearchTerm.trim();
    if (term === '') {
      this.availableRequests = [];
      this.searchError = null;
      return;
    }

    this.searchError = null;
    if (this.searchById) {
      const requestId = parseInt(term, 10);
      if (!isNaN(requestId)) {
        this.ldAddEventService.getRequestById(requestId).subscribe({
          next: (request: addRequestToEvent) => {
            this.availableRequests = request ? [request] : [];
            if (!request) {
              this.searchError = 'No request found with this ID.';
            }
          },
          error: (err: any) => {
            console.error('Error searching request by ID:', err);
            this.searchError = 'Error searching for request by ID.';
            this.availableRequests = [];
          }
        });
      } else {
        this.searchError = 'Please enter a valid number for Request ID.';
        this.availableRequests = [];
      }
    } else {
      this.ldAddEventService.getRequestByName(term).subscribe({
        next: (requests: addRequestToEvent[]) => {
          this.availableRequests = requests;
          if (requests.length === 0) {
            this.searchError = 'No requests found matching the name.';
          }
        },
        error: (err: any) => {
          console.error('Error searching requests by name:', err);
          this.searchError = 'Error searching for requests by name.';
          this.availableRequests = [];
        }
      });
    }
  }

  addRequestToSelection(request: addRequestToEvent): void {
    if (!this.selectedRequests.some(r => r.requestId === request.requestId)) {
      this.selectedRequests.push(request);
      this.availableRequests = this.availableRequests.filter(r => r.requestId !== request.requestId);
    }
  }

  removeRequestFromSelection(requestIdToRemove: number): void {
    this.selectedRequests = this.selectedRequests.filter(req => req.requestId !== requestIdToRemove);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
