import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEventService } from '../../../service/viewEvents/view-event-service';
import { Request } from '../ld-view-event/ld-view-event';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ld-add-request-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">Available Requests</h2>
      
      <div *ngIf="loading" class="loading">Loading requests...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div class="requests-list" *ngIf="!loading && !error">
        <div *ngIf="requests.length === 0" class="empty">No available requests found.</div>

        <table *ngIf="requests.length > 0" class="requests-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Requestor</th>
              <th>Department</th>
              <th>Request Date</th>
              <th>Group</th>
              <th>Associates</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let request of requests">
              <td>{{ request.requestId }}</td>
              <td>{{ request.requestorId }}</td>
              <td>{{ request.departmentId }}</td>
              <td>{{ request.requestDate | date:'medium' }}</td>
              <td>{{ request.groupRequest ? 'Yes' : 'No' }}</td>
              <td>{{ request.noOfAssociates }}</td>
              <td>
                <button 
                  class="add-button" 
                  (click)="addRequest(request.requestId)"
                  [disabled]="isLoading(request.requestId)">
                  {{ isLoading(request.requestId) ? 'Adding...' : 'Add' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="dialog-actions">
        <button class="close-button" (click)="close()">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 1.5rem;
      max-width: 1000px;
    }

    .dialog-title {
      color: #1976d2;
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .requests-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .requests-table th,
    .requests-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .requests-table th {
      background-color: #f5f5f5;
      color: #495057;
      font-weight: 600;
    }

    .requests-table tr:hover {
      background-color: #f8f9fa;
    }

    .requests-table tr:last-child td {
      border-bottom: none;
    }

    .add-button {
      padding: 0.5rem 1rem;
      background-color: #2e7d32;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }

    .add-button:hover {
      background-color: #1b5e20;
    }

    .add-button:disabled {
      background-color: #9e9e9e;
      cursor: not-allowed;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;
      gap: 1rem;
    }

    .close-button {
      padding: 0.5rem 1.5rem;
      background-color: #f0f0f0;
      color: #333;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }

    .close-button:hover {
      background-color: #e0e0e0;
    }

    .error {
      color: #dc3545;
      background-color: #f8d7da;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #1976d2;
      font-size: 1.1rem;
    }

    .empty {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
      font-style: italic;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .dialog-container {
        padding: 1rem;
      }

      .requests-table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class LdAddRequestDialogComponent implements OnInit {
  requests: Request[] = [];
  loading = false;
  error: string | null = null;
  loadingRequests: Set<number> = new Set();

  constructor(
    private viewEventService: ViewEventService,
    @Inject(MAT_DIALOG_DATA) private data: { eventId: number },
    private dialogRef: MatDialogRef<LdAddRequestDialogComponent>
  ) {}

  ngOnInit(): void {
    this.fetchAvailableRequests();
  }

  private fetchAvailableRequests(): void {
    this.loading = true;
    this.error = null;

    this.viewEventService.getNewApprovedRequests().subscribe({
      next: (response: any) => {
        console.log('Received available requests:', response);
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
      },
      error: (error) => {
        console.error('Error loading available requests:', error);
        this.error = error.error?.message || 'Failed to load available requests. Please try again later.';
        this.loading = false;
      }
    });
  }

  addRequest(requestId: number): void {
    this.loadingRequests.add(requestId);
    
    this.viewEventService.addRequestToEvent(this.data.eventId, requestId).subscribe({
      next: () => {
        console.log('Request added successfully');
        this.loadingRequests.delete(requestId);
        this.requests = this.requests.filter(r => r.requestId !== requestId);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error adding request:', error);
        this.error = error.error?.message || 'Failed to add request. Please try again later.';
        this.loadingRequests.delete(requestId);
      }
    });
  }

  isLoading(requestId: number): boolean {
    return this.loadingRequests.has(requestId);
  }

  close(): void {
    this.dialogRef.close();
  }
}