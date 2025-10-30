// src/app/modules/events/ld-events/ld-events.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LdEventsService, EventFilter } from '../../../service/events/ld-events-service';
import { addEvent } from '../../../models/add-event'; // Updated import path and name
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-ld-events',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './ld-events.html',
  styleUrl: './ld-events.css',
  providers: [LdEventsService]
})
export class LdEvents implements OnInit, OnDestroy {
  events: addEvent[] = []; // Use addEvent[]
  isLoading: boolean = true;
  errorMessage: string | null = null;

  searchTerm: string = '';
  filterDescription: string = '';
  filterEventType: string = '';
  filterStatus: string = '';

  private searchTerms = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(private ldEventsService: LdEventsService, private router: Router) { }

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
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

    Object.keys(filters).forEach(key => {
      const filterKey = key as keyof EventFilter;
      if (!filters[filterKey]) {
        delete filters[filterKey];
      }
    });

    this.ldEventsService.getAllEvents(filters).subscribe({
      next: (data: addEvent[]) => { // Use addEvent[]
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
}
