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
  // Master list of all new, approved, unassigned requests fetched from the API
  private allNewApprovedRequests: addRequestToEvent[] = [];
  // The list currently displayed in the "Available Requests" table
  availableRequests: addRequestToEvent[] = [];

  requestSearchTerm: string = '';
  searchById: boolean = true; // True for ID search, false for Name search

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
    // 1. Load the initial master list of all eligible requests
    this.loadAllNewApprovedRequests();

    // 2. Subscribe to search term changes for filtering
    this.subscriptions.push(
      this.requestSearchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(() => {
        // Trigger the filtering logic whenever the search term changes (or is cleared)
        this.searchRequests();
      })
    );
  }

  // Fetches the initial master list of all new, approved, unassigned requests
  loadAllNewApprovedRequests(): void {
    this.isLoading = true;
    this.ldAddEventService.getAllNewApprovedRequestsNotAssignedToEvent().subscribe({
      next: (requests: addRequestToEvent[]) => {
        this.allNewApprovedRequests = requests;
        // After loading the master list, apply any existing search/selection filters
        this.searchRequests();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading initial requests:', err);
        this.searchError = 'Failed to load available requests.';
        this.isLoading = false;
      }
    });
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
    // Update the model to ensure it's in sync
    this.requestSearchTerm = term;
    // Push the new term to the Subject; the subscription will handle debouncing and filtering
    this.requestSearchTerms.next(term);
  }

  // Filters the master list (`allNewApprovedRequests`) to populate `availableRequests`
  searchRequests(): void {
    const term = this.requestSearchTerm.trim();
    this.searchError = null;

    // Start with all requests from the master list that are not yet selected
    let currentAvailableRequests = this.allNewApprovedRequests.filter(req =>
      !this.selectedRequests.some(sReq => sReq.requestId === req.requestId)
    );

    // If the search term is empty, display all currentAvailableRequests
    if (term === '') {
      this.availableRequests = currentAvailableRequests;
      return;
    }

    // Otherwise, apply further filtering based on the search term
    const lowerCaseTerm = term.toLowerCase();
    let filteredRequests: addRequestToEvent[] = [];

    if (this.searchById) {
      const requestId = parseInt(term, 10);
      if (!isNaN(requestId)) {
        filteredRequests = currentAvailableRequests.filter(req =>
          req.requestId === requestId
        );
        if (filteredRequests.length === 0) {
          this.searchError = 'No unassigned request found with this ID matching the search.';
        }
      } else {
        this.searchError = 'Please enter a valid number for Request ID.';
      }
    } else { // Search by name (e.g., requestor's name or justification)
      filteredRequests = currentAvailableRequests.filter(req =>
        (req.justification.toLowerCase().includes(lowerCaseTerm) ||
         (req.user?.firstName && req.user.firstName.toLowerCase().includes(lowerCaseTerm)) ||
         (req.user?.lastName && req.user.lastName.toLowerCase().includes(lowerCaseTerm)))
      );
      if (filteredRequests.length === 0) {
        this.searchError = 'No unassigned requests found matching the name.';
      }
    }
    this.availableRequests = filteredRequests;
  }

  addRequestToSelection(request: addRequestToEvent): void {
    if (!this.selectedRequests.some(r => r.requestId === request.requestId)) {
      this.selectedRequests.push(request);
      // Re-filter available requests after adding, to remove the selected item
      this.searchRequests();
    }
  }

  removeRequestFromSelection(requestIdToRemove: number): void {
    const removedRequest = this.selectedRequests.find(req => req.requestId === requestIdToRemove);
    this.selectedRequests = this.selectedRequests.filter(req => req.requestId !== requestIdToRemove);

    if (removedRequest) {
      // Add the request back to the master list if it was originally there
      if (!this.allNewApprovedRequests.some(r => r.requestId === removedRequest.requestId)) {
        this.allNewApprovedRequests.push(removedRequest);
      }
      // Re-filter available requests after removing, to potentially show the item again
      this.searchRequests();
    }
  }

  clearSearch(): void {
    this.requestSearchTerm = '';
    this.searchError = null;
    this.searchRequests(); // This will show all available requests
  }

  // Add this method to handle the back navigation
  navigateBackToEvents(): void {
    this.router.navigate(['/ld-events']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
