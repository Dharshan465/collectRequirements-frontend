// src/app/modules/events/ld-add-event/ld-add-event.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  // Store all requests that are initially available (approved, not assigned)
  private allNewApprovedRequests: addRequestToEvent[] = [];
  availableRequests: addRequestToEvent[] = []; // This will be the displayed list

  requestSearchTerm: string = '';
  searchById: boolean = true;

  isLoading: boolean = false;
  submitError: string | null = null;
  searchError: string | null = null;

  private readonly requestSearchTerms = new Subject<string>();
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly ldAddEventService: LdAddEventService,
    public router: Router
  ) { }

  ngOnInit(): void {
    // Fetch all new approved requests on component initialization
    this.loadAllNewApprovedRequests();

    this.subscriptions.push(
      this.requestSearchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(term => {
        if (term.trim() === '') {
          this.availableRequests = [];
          this.searchError = null;
        } else {
          this.searchRequests();
        }
      })
    );
  }

  loadAllNewApprovedRequests(): void {
    this.isLoading = true;
    this.ldAddEventService.getAllNewApprovedRequestsNotAssignedToEvent().subscribe({
      next: (requests: addRequestToEvent[]) => {
        // Filter out any requests that are already in selectedRequests
        this.allNewApprovedRequests = requests.filter(req =>
          !this.selectedRequests.some(sReq => sReq.requestId === req.requestId)
        );
        this.resetAvailableRequests(); // Display all initially available requests
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading initial requests:', err);
        this.searchError = 'Failed to load available requests.';
        this.isLoading = false;
      }
    });
  }

  resetAvailableRequests(): void {
    this.availableRequests = [...this.allNewApprovedRequests];
    this.searchError = null;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.submitError = null;

    if (this.selectedRequests.length === 0) {
      this.submitError = 'Please select at least one request for the event.';
      this.isLoading = false;
      return;
    }

    const selectedRequestIds = this.selectedRequests.map(req => req.requestId);

    const eventCreationPayload: EventCreationRequestDTO = {
      newEvent: this.newEvent,
      requests: selectedRequestIds
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
      this.resetAvailableRequests();
      return;
    }

    this.searchError = null;
    if (this.searchById) {
      const requestId = Number.parseInt(term, 10);
      if (Number.isNaN(requestId)) {
        this.searchError = 'Please enter a valid request ID.';
        this.availableRequests = [];
      } else {
        this.ldAddEventService.getRequestById(requestId).subscribe({
          next: (request: addRequestToEvent) => {
            // Only show if it's not already selected and is actually available
            if (request && !this.selectedRequests.some(sReq => sReq.requestId === request.requestId)) {
              this.availableRequests = [request];
            } else {
              this.availableRequests = [];
              this.searchError = 'No unassigned request found with this ID.';
            }
          },
          error: (err: any) => {
            console.error('Error searching request by ID:', err);
            this.searchError = 'Error searching for request by ID.';
            this.availableRequests = [];
          }
        });
      }
    } else { // Search by name
      this.ldAddEventService.getRequestByName(term).subscribe({
        next: (requests: addRequestToEvent[]) => {
          // Filter out selected requests from search results
          this.availableRequests = requests.filter(req =>
            !this.selectedRequests.some(sReq => sReq.requestId === req.requestId)
          );
          if (this.availableRequests.length === 0) {
            this.searchError = 'No unassigned requests found matching the name.';
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
      // Remove from the full list and the currently displayed list
      this.allNewApprovedRequests = this.allNewApprovedRequests.filter(r => r.requestId !== request.requestId);
      this.availableRequests = this.availableRequests.filter(r => r.requestId !== request.requestId);
    }
  }

  removeRequestFromSelection(requestIdToRemove: number): void {
    const removedRequest = this.selectedRequests.find(req => req.requestId === requestIdToRemove);
    this.selectedRequests = this.selectedRequests.filter(req => req.requestId !== requestIdToRemove);

    if (removedRequest) {
      // Add it back to the full list if it's not already there and if it meets the criteria
      // (e.g., ensure it's approved and unassigned - though the service should handle this)
      if (!this.allNewApprovedRequests.some(r => r.requestId === removedRequest.requestId)) {
        this.allNewApprovedRequests.push(removedRequest);
      }
      // Re-apply search/filter to availableRequests if there's a search term, otherwise just add it back
      if (this.requestSearchTerm.trim() === '') {
        this.availableRequests.push(removedRequest);
      } else {
        // If there's a search term, re-evaluate if the removed request matches it
        // For simplicity, we can re-run the search or just add it if it matches the current term
        // A more robust solution might re-filter `allNewApprovedRequests` into `availableRequests`
        this.onSearchTermChange(this.requestSearchTerm);
      }
    }
  }

  navigateBackToEvents(): void {
    this.router.navigate(['/ld-events']);
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
