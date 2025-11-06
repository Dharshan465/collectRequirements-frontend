import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewEventService } from '../../../service/viewEvents/view-event-service';
import { Request } from '../ld-view-event/ld-view-event';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ld-add-request-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">Available Requests - Complete Details</h2>
      
      <!-- Search Bar -->
      <div class="search-container" *ngIf="!loading">
        <div class="search-input-wrapper">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search by Request ID or Justification..." 
            [(ngModel)]="searchTerm"
            (input)="onSearchChange()"
            (keydown.escape)="clearSearch()">
          <div class="search-icon">🔍</div>
          <button 
            *ngIf="searchTerm" 
            class="clear-search-button" 
            (click)="clearSearch()"
            type="button">
            ✕
          </button>
        </div>
        <div class="search-results-info" *ngIf="searchTerm">
          Showing {{ filteredRequests.length }} of {{ allRequests.length }} requests
        </div>
      </div>
      
      <div *ngIf="loading" class="loading">Loading requests...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div class="requests-list" *ngIf="!loading && !error">
        <div *ngIf="filteredRequests.length === 0 && allRequests.length === 0" class="empty">No available requests found.</div>
        <div *ngIf="filteredRequests.length === 0 && allRequests.length > 0" class="empty">No requests match your search criteria.</div>

        <table *ngIf="filteredRequests.length > 0" class="requests-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>TAN Number</th>
              <th>Curriculum</th>
              <th>Group Request</th>
              <th>Justification</th>
              <th>Participants Count</th>
              <th>Request Date</th>
              <th>Request Status</th>
              <th>Department ID</th>
              <th>Requestor ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let request of filteredRequests">
              <td>{{ request.requestId }}</td>
              <td>{{ request.tanNumber || 'N/A' }}</td>
              <td>
                <a *ngIf="request.curriculumLink" 
                   [href]="request.curriculumLink" 
                   target="_blank" 
                   class="curriculum-link">
                  View Curriculum
                </a>
                <span *ngIf="!request.curriculumLink">N/A</span>
              </td>
              <td>{{ request.groupRequest ? 'Yes' : 'No' }}</td>
              <td class="justification-cell" [title]="request.justification || 'N/A'">{{ request.justification || 'N/A' }}</td>
              <td>{{ request.noOfAssociates }}</td>
              <td>{{ request.requestDate | date:'medium' }}</td>
              <td class="status-cell">{{ request.requestStatus }}</td>
              <td>{{ request.departmentId || 'N/A' }}</td>
              <td>{{ request.requestorId || 'N/A' }}</td>
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
      padding: 24px;
      width: 100%;
      max-width: 1400px;
      box-sizing: border-box;
      overflow: hidden;
    }

    .dialog-title {
      color: #1976d2;
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    /* Search Bar Styles */
    .search-container {
      margin-bottom: 1.5rem;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 45px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      color: #333;
      background-color: #f8f9fa;
      box-sizing: border-box;
      transition: border-color 0.3s ease, background-color 0.3s ease;
    }

    .search-input:focus {
      border-color: #1976d2;
      outline: 0;
      background-color: #ffffff;
      box-shadow: 0 0 0 0.2rem rgba(25, 118, 210, 0.25);
    }

    .search-input::placeholder {
      color: #6c757d;
      font-style: italic;
    }

    .search-icon {
      position: absolute;
      left: 15px;
      color: #6c757d;
      font-size: 16px;
      pointer-events: none;
    }

    .clear-search-button {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: #6c757d;
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .clear-search-button:hover {
      background-color: #e9ecef;
      color: #495057;
    }

    .search-results-info {
      margin-top: 8px;
      font-size: 0.875rem;
      color: #6c757d;
      font-style: italic;
    }

    .requests-list {
      width: 100%;
      margin: 0 auto;
      overflow: auto;
      max-height: 70vh;
    }

    .requests-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      table-layout: fixed;
      font-size: 0.85rem;
    }
    
    .requests-table th:nth-child(1),
    .requests-table td:nth-child(1) { width: 8%; }   /* Request ID */
    .requests-table th:nth-child(2),
    .requests-table td:nth-child(2) { width: 10%; }  /* TAN Number */
    .requests-table th:nth-child(3),
    .requests-table td:nth-child(3) { width: 12%; }  /* Curriculum */
    .requests-table th:nth-child(4),
    .requests-table td:nth-child(4) { width: 8%; }   /* Group Request */
    .requests-table th:nth-child(5),
    .requests-table td:nth-child(5) { width: 15%; }  /* Justification */
    .requests-table th:nth-child(6),
    .requests-table td:nth-child(6) { width: 8%; }   /* Participants Count */
    .requests-table th:nth-child(7),
    .requests-table td:nth-child(7) { width: 12%; }  /* Request Date */
    .requests-table th:nth-child(8),
    .requests-table td:nth-child(8) { width: 10%; }  /* Request Status */
    .requests-table th:nth-child(9),
    .requests-table td:nth-child(9) { width: 8%; }   /* Department ID */
    .requests-table th:nth-child(10),
    .requests-table td:nth-child(10) { width: 8%; }  /* Requestor ID */
    .requests-table th:nth-child(11),
    .requests-table td:nth-child(11) { width: 9%; }  /* Action */

    .requests-table th,
    .requests-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
      word-wrap: break-word;
      overflow: hidden;
    }

    .justification-cell {
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-cell {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.8rem;
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
    @media (max-width: 1200px) {
      .dialog-container {
        padding: 1rem;
      }

      .search-input {
        font-size: 14px;
        padding: 10px 14px 10px 40px;
      }

      .requests-table {
        font-size: 0.75rem;
      }

      .requests-table th,
      .requests-table td {
        padding: 0.5rem;
      }
    }

    @media (max-width: 768px) {
      .dialog-container {
        padding: 0.5rem;
      }

      .search-input {
        font-size: 12px;
        padding: 8px 12px 8px 35px;
      }

      .search-icon {
        left: 12px;
        font-size: 14px;
      }

      .clear-search-button {
        right: 8px;
        width: 20px;
        height: 20px;
        font-size: 14px;
      }

      .requests-table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        font-size: 0.7rem;
      }

      .requests-table th,
      .requests-table td {
        padding: 0.25rem;
      }

      .add-button {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
      }
    }
  `]
})
export class LdAddRequestDialogComponent implements OnInit {
  requests: Request[] = [];
  allRequests: Request[] = [];
  filteredRequests: Request[] = [];
  searchTerm: string = '';
  loading = false;
  error: string | null = null;
  loadingRequests: Set<number> = new Set();

  constructor(
    private readonly viewEventService: ViewEventService,
    @Inject(MAT_DIALOG_DATA) private readonly data: { eventId: number },
    private readonly dialogRef: MatDialogRef<LdAddRequestDialogComponent>
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
        console.log('Processing requests data:', requestsData);
        
        this.requests = requestsData.map((req: any) => {
          console.log('Processing individual request:', req);
          return {
            requestId: req.requestId || req.id || 0,
            requestorId: req.user?.userId || req.requestorId || req.requestor_id || 0,
            departmentId: req.department?.departmentId || req.departmentId || req.department_id || 0,
            departmentName: req.department?.departmentName || req.departmentName || req.department_name || '',
            eventId: req.eventId || req.event_id || 0,
            requestDate: req.requestDate || req.request_date || '',
            requestStatus: req.requestStatus || req.request_status || '',
            groupRequest: Boolean(req.groupRequest || req.group_request),
            justification: req.justification || '',
            noOfAssociates: req.noOfParticipants || req.no_of_participants || req.noOfAssociates || req.participants_count || 0,
            tanNumber: req.tan_Number || req.tanNumber || req.tan_number || '',
            curriculumLink: req.curriculamLink || req.curriculumLink || req.curriculum_link || req.curriculum || ''
          };
        });
        
        // Set up search arrays
        this.allRequests = [...this.requests];
        this.filteredRequests = [...this.requests];
        
        console.log('Mapped requests:', this.requests);
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
        // Remove from all arrays
        this.requests = this.requests.filter(r => r.requestId !== requestId);
        this.allRequests = this.allRequests.filter(r => r.requestId !== requestId);
        this.filteredRequests = this.filteredRequests.filter(r => r.requestId !== requestId);
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

  onSearchChange(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      // If search term is empty, show all requests
      this.filteredRequests = [...this.allRequests];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      
      // Filter requests based on request ID and justification
      this.filteredRequests = this.allRequests.filter(request => {
        const requestIdMatch = request.requestId.toString().toLowerCase().includes(searchTermLower);
        const justificationMatch = (request.justification || '').toLowerCase().includes(searchTermLower);
        
        return requestIdMatch || justificationMatch;
      });
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredRequests = [...this.allRequests];
  }

  close(): void {
    this.dialogRef.close();
  }
}