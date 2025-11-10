import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestCounts } from '../../../models/request-counts';
import { Request } from '../../../services/requests/request';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestDetails } from '../../../models/request-details';
import { EditRequest } from '../../../models/edit-request';

@Component({
  selector: 'app-ld-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './ld-dashboard.html',
  styleUrls: ['./ld-dashboard.css'],
})
export class LdDashboard implements OnInit {

 private readonly ldUserId: number = 21; 

   filterStatus: string = '';
   filterRequestorName: string = '';
    filterDepartmentName: string = '';
    filterEventName: string = '';
    filterFromDate: string = '';
    filterToDate: string = '';
  
  
    requestCounts: RequestCounts = {} as RequestCounts;
    requestDetails: RequestDetails[] = [];
    allRequestDetails: RequestDetails[] = []; // Store all requests for filter options

  availableStatuses: string[] = [];
  availableDepartments: string[] = [];
  availableEvents: string[] = [];
  availableRequestorNames: string[] = [];

  // Properties for delete confirmation
  showDeleteConfirmation: boolean = false;
  requestToDelete: number | null = null;
  isDeleting: boolean = false;


  constructor(private readonly requestService: Request, private readonly router: Router) { }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loadRequestCounts();
    this.loadRequests();
  }

  loadRequestCounts(): void {
    this.requestService.getAllRequestCounts(this.ldUserId).subscribe({
      next: (data) => this.requestCounts = data,
      error: (err) => console.error('Error fetching request counts', err)
    });
  }

  loadRequests(): void {
    console.log('Loading requests with filters:');
    this.requestService.getAllRequests(
      this.ldUserId,
      this.filterStatus,
      this.filterRequestorName,
      this.filterDepartmentName,
      this.filterEventName,
      this.filterFromDate,
      this.filterToDate
    ).subscribe({
              next: (data) => {
                // Sort data by requestDate in descending order (newest first)
                const sortedData = data.sort((a, b) => 
                  new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
                );

                // Store all requests for filter options
                this.allRequestDetails = sortedData;
                
                // Filter out rejected requests unless specifically searching for them
                if (!this.filterStatus || this.filterStatus.toUpperCase() !== 'REJECTED') {
                  this.requestDetails = sortedData.filter(request => 
                    request.requestStatus.toUpperCase() !== 'REJECTED'
                  );
                } else {
                  this.requestDetails = sortedData;
                }
                this.populateFilterOptions();
      },
      error: (err) => console.error('Error fetching request details', err)
    });
    console.log('Requests loaded for LnD User ID:', this.ldUserId);
    console.log('Current Filters - Status:', this.filterStatus, 'Requestor Name:', this.filterRequestorName, 'Department Name:', this.filterDepartmentName, 'Event Name:', this.filterEventName, 'From Date:', this.filterFromDate, 'To Date:', this.filterToDate);
    console.log('Request Details:', this.requestDetails);
  }


   populateFilterOptions(): void {
    this.availableStatuses = [];
    this.availableDepartments = [];
    this.availableEvents = [];
    this.availableRequestorNames = [];

    const statusSet = new Set<string>();
    const departmentSet = new Set<string>();
    const eventSet = new Set<string>();
    const requestorNameSet = new Set<string>();

    // Use all requests (including rejected) for filter options
    for (const detail of this.allRequestDetails) {
      if (detail.requestStatus) statusSet.add(detail.requestStatus);
      if (detail.departmentName) departmentSet.add(detail.departmentName);
      if (detail.eventName) eventSet.add(detail.eventName);
      if (detail.requestorName) requestorNameSet.add(detail.requestorName);
    }

    this.availableStatuses = Array.from(statusSet).sort((a, b) => a.localeCompare(b));
    this.availableDepartments = Array.from(departmentSet).sort((a, b) => a.localeCompare(b));
    this.availableEvents = Array.from(eventSet).sort((a, b) => a.localeCompare(b));
    this.availableRequestorNames = Array.from(requestorNameSet).sort((a, b) => a.localeCompare(b));

    console.log('Available Statuses:', this.availableStatuses);
    console.log('Available Departments:', this.availableDepartments);
    console.log('Available Events:', this.availableEvents);
    console.log('Available Requestor Names:', this.availableRequestorNames);
  }

  clear(): void {
    this.filterStatus = '';
    this.filterRequestorName = '';
    this.filterDepartmentName = '';
    this.filterEventName = '';
    this.filterFromDate = '';
    this.filterToDate = '';
    this.loadRequests(); 
  }

  navigateToNewRequirement(): void {
    this.router.navigate([`/dashboard/ld/${this.ldUserId}/create`]);
  }

  navigateToEvents(): void {
    this.router.navigate(['/ld-events']);
  }

  onEdit(requestId: number): void {
    console.log(`Edit clicked for Request ID: ${requestId}`);
    this.router.navigate(['/requests/edit', requestId]);
  }

  onView(requestId: number): void {
    console.log(`View clicked for Request ID: ${requestId}`);
    this.router.navigate(['/requests/view', requestId]);
  }

  onDelete(requestId: number): void {
    console.log(`Delete clicked for Request ID: ${requestId}`);
    this.requestToDelete = requestId;
    this.showDeleteConfirmation = true;
  }

  confirmDelete(): void {
    if (!this.requestToDelete) return;
    
    this.isDeleting = true;
    
    // Find the request to update its status
    const request = this.requestDetails.find(r => r.requestId === this.requestToDelete);
    if (!request) {
      this.isDeleting = false;
      this.cancelDelete();
      alert('Request not found');
      return;
    }

    // Create update payload to change status to REJECTED
    const updatePayload: EditRequest = {
      requestId: this.requestToDelete,
      requestorId: request.requestorId,
      approvedBy: this.ldUserId, // Current LnD user
      approvalNotes: request.approvalNotes || 'No Approval Notes',
      departmentId: request.departmentId,
      eventId: request.eventId || 0,
      requestDate: request.requestDate,
      requestStatus: 'REJECTED', // Change status to REJECTED for proper count tracking
      groupRequest: request.groupRequest,
      justification: request.justification,
      curriculamLink: request.curriculumLink || '',
      tan_Number: request.tanNumber,
      requestedParticipants: [] // Empty array since we're rejecting
    };

    // Call the edit API to update status to REJECTED
    this.requestService.editRequest(this.requestToDelete, updatePayload).subscribe({
      next: (response) => {
        console.log('Request status changed to REJECTED:', response);
        
        // Remove from current view (since rejected requests are hidden)
        this.requestDetails = this.requestDetails.filter(r => r.requestId !== this.requestToDelete);
        
        this.isDeleting = false;
        this.cancelDelete();
        alert('Request has been rejected and hidden from view');
        
        // Reload dashboard to update counts
        this.loadDashboard();
      },
      error: (error) => {
        console.error('Error rejecting request:', error);
        this.isDeleting = false;
        this.cancelDelete();
        alert('Failed to reject request. Please try again.');
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.requestToDelete = null;
  }

}
