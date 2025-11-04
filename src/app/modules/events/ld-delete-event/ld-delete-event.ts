// src/app/modules/events/ld-delete-event/ld-delete-event.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LdDeleteEventService } from '../../../service/deleteEvent/ld-delete-event-service';
import { Event } from '../../../models/event';
import { RequestDetails } from '../../../models/request-details'; // Ensure the path is correct
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ld-delete-event',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './ld-delete-event.html',
  styleUrls: ['./ld-delete-event.css'],
  providers: [LdDeleteEventService]
})
export class LdDeleteEvent implements OnInit {
  eventId!: number | null;
  event: Event | null = null;
  requests: RequestDetails[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // confirmation & deletion state
  showConfirm: boolean = false;
  deleting: boolean = false;
  deleteError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deleteService: LdDeleteEventService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage = 'No event id provided.';
      this.isLoading = false;
      return;
    }
    this.eventId = Number(idParam);
    this.loadEventAndRequests(this.eventId);
  }

  loadEventAndRequests(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.deleteService.getEventById(id).subscribe({
      next: (evt) => {
        this.event = evt;
        // after event, load requests
        this.deleteService.getRequestsByEventId(id).subscribe({
          next: (reqs) => {
            // Map backend response to RequestDetails shape expected by the UI
            this.requests = reqs.map((r: any) => ({
              requestId: r.requestId,
              requestorId: r.user?.userId ?? null,
              requestorName: r.user ? `${r.user.firstName} ${r.user.lastName}` : '',
              departmentId: r.department?.departmentId ?? null,
              departmentName: r.department?.departmentName ?? '',
              eventId: r.event?.eventId ?? null,
              eventName: r.event?.eventName ?? '',
              requestDate: r.requestDate,
              requestStatus: r.requestStatus,
              groupRequest: r.groupRequest,
              justification: r.justification,
              noOfParticipants: r.noOfParticipants,
              tanNumber: r.tan_Number ?? r.tanNumber ?? '',
              curriculumLink: r.curriculamLink ?? r.curriculumLink ?? ''
            } as RequestDetails));
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load requests', err);
            this.requests = [];
            this.isLoading = false;
            // keep event shown; continue
          }
        });
      },
      error: (err) => {
        console.error('Failed to load event', err);
        this.errorMessage = 'Failed to load event details.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/ld-events']);
  }

  onRequestDelete(): void {
    // show confirmation overlay
    this.showConfirm = true;
    this.deleteError = null;
  }

  cancelDelete(): void {
    this.showConfirm = false;
    this.deleteError = null;
  }

  confirmDelete(): void {
    if (!this.eventId) return;
    this.deleting = true;
    this.deleteService.deleteEvent(this.eventId).subscribe({
      next: () => {
        this.deleting = false;
        this.showConfirm = false;
        // navigate back to events dashboard after deletion
        this.router.navigate(['/ld-events']);
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.deleteError = 'Failed to delete event. Please try again.';
        this.deleting = false;
      }
    });
  }
}
