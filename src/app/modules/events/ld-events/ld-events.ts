import { Component, OnInit, OnDestroy } from '@angular/core';
import { LdEventsService, EventFilter } from '../../../service/events/ld-events-service';
import { addEvent } from '../../../models/add-event';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-ld-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ld-events.html',
  styleUrl: './ld-events.css',
  providers: [LdEventsService]
})
export class LdEvents implements OnInit, OnDestroy {
  events: addEvent[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  searchTerm: string = '';
  filterDescription: string = '';
  filterEventType: string = '';
  filterStatus: string = '';

  private readonly searchTerms = new Subject<string>();
  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly ldEventsService: LdEventsService, private readonly router: Router) { }

  ngOnInit(): void {
    this.fetchEvents();

    this.subscriptions.push(
      this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(() => {
        this.fetchEvents();
      })
    );
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  fetchEvents(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const filters: EventFilter = {
      searchTerm: this.searchTerm.trim(),
      description: this.filterDescription.trim(),
      eventType: this.filterEventType.trim(),
      status: this.filterStatus.trim(),
    };

    for (const key of Object.keys(filters)) {
      const filterKey = key as keyof EventFilter;
      if (!filters[filterKey]) {
        delete filters[filterKey];
      }
    }

    this.ldEventsService.getAllEvents(filters).subscribe({
      next: (data: addEvent[]) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching events:', err);
        this.errorMessage = 'Failed to load events. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onSearchTermChange(value: string): void {
    this.searchTerms.next(value);
  }

  applyFilters(): void {
    this.fetchEvents();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterDescription = '';
    this.filterEventType = '';
    this.filterStatus = '';
    this.fetchEvents();
  }

  navigateToAddEvent(): void {
    this.router.navigate(['/ld-add-event']);
  }

  navigateBackToDashboard(): void {
    this.router.navigate(['/dashboard/ld/21']);
  }

  navigateToViewEvent(eventId: number | undefined): void {
    if (eventId) {
      this.router.navigate(['/events/view', eventId]);
    } else {
      console.error('Event ID is required for viewing');
    }
  }

  navigateToEditEvent(eventId: number | undefined): void {
    if (eventId) {
      this.router.navigate(['/events/edit', eventId]);
    } else {
      console.error('Event ID is required for editing');
    }
  }

navigateToDeleteEvent(id: number | undefined): void {
  if (id == null) {
    console.warn('navigateToDeleteEvent called without an id');
    return;
  }
  this.router.navigate(['/events/delete', id]);
}



}
